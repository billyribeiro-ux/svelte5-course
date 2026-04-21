# Lesson 02 — `$derived`

> **What you'll learn:** How to make values that automatically update when their inputs change — the thing a spreadsheet does for free, and what `$derived` does in Svelte.

## Concept

Here is the whole idea:

> A **derived value** is a value you do not set directly. You declare how to compute it, and Svelte keeps it in sync with its inputs forever.

The spreadsheet analogy is the right one. When you type `=A1+B1` into cell C1, you never think about "when A1 changes I have to update C1." The spreadsheet does that. That's what `$derived` is.

Think of `count` and `price` as the "source" cells and `subtotal = $derived(count * price)` as the formula cell. You never manually recompute. Svelte does it for you, and only when someone is actually looking.

### The mental model — 7 rules

**Rule 1.** `$derived(expr)` takes a single expression. No braces, no `return`.

```ts
let count = $state(0);
let doubled = $derived(count * 2); // reads as: "doubled is always count × 2"
```

**Rule 2.** For anything bigger than one expression, use `$derived.by(() => { ... })`. It accepts a function.

```ts
let numbers = $state([1, 2, 3]);
let total = $derived.by(() => {
  let sum = 0;
  for (const n of numbers) sum += n;
  return sum;
});
```

That's it. `$derived(x)` is just sugar for `$derived.by(() => x)`.

**Rule 3.** Derived expressions must be **pure**. No side effects, no mutations, no network calls.

```ts
// ❌ Svelte will yell
let bad = $derived((count++, count * 2));

// ❌ don't do this either — you're mutating state inside a derivation
let worse = $derived.by(() => {
  items.push(newItem); // don't mutate!
  return items.length;
});
```

If you find yourself wanting to do side effects here, you want `$effect`, not `$derived`. That's the next lesson.

**Rule 4.** **Dependencies are whatever state you read.** Svelte watches your expression, sees which state you touch, and tracks that. Read it once → it's a dependency forever. Don't read it → it's not tracked.

```ts
let a = $state(1);
let b = $state(2);
let useA = $state(true);

// If useA is true, only `a` (and `useA`) are tracked.
// If useA is false, only `b` (and `useA`) are tracked.
let value = $derived(useA ? a : b);
```

**Rule 5. Push-pull reactivity.** When a dependency changes, Svelte marks the derived "dirty" (the push). It only re-runs the calculation when someone actually **reads** the derived (the pull). A derived nobody reads costs nothing.

**Rule 6. Referential equality short-circuits updates.** If a derived recalculates and the new value is `===` to the old value, downstream reactivity stops.

```ts
let count = $state(0);
let large = $derived(count > 10);

// large goes from false → false → ... → false → true at 11 → true → ...
// The DOM only re-renders when `large` actually flips, not on every count++.
```

This is why `$derived` on a boolean "threshold" is cheap even if `count` updates 1000×.

**Rule 7. You can override a derived.** (Svelte 5.25+) Reassign it for optimistic UI — the override is temporary; the next time a dependency changes, Svelte recalculates and blows your override away.

```ts
let likes = $derived(post.likes);

async function onclick() {
  likes += 1; // show the user instant feedback
  try {
    await api.like();
  } catch {
    likes -= 1; // failed — roll back
  }
}
```

### Destructuring a derived

If you destructure, every field stays reactive.

```ts
let { valid, errors } = $derived(validate(form));
// valid and errors both update when `form` does
```

Roughly equivalent to:

```ts
let _v = $derived(validate(form));
let valid  = $derived(_v.valid);
let errors = $derived(_v.errors);
```

## Worked examples

### 1 — Derived primitive

```svelte
<script lang="ts">
  let count = $state(0);
  let doubled = $derived(count * 2);
</script>

<button onclick={() => count++}>{count} × 2 = {doubled}</button>
```

### 2 — Derived from an array (`$derived.by`)

```svelte
<script lang="ts">
  let nums = $state([1, 2, 3]);
  let total = $derived.by(() => {
    let sum = 0;
    for (const n of nums) sum += n;
    return sum;
  });
</script>

<button onclick={() => nums.push(nums.length + 1)}>
  {nums.join(' + ')} = {total}
</button>
```

### 3 — Chained deriveds (graph of computations)

```svelte
<script lang="ts">
  let price = $state(100);
  let qty = $state(3);
  let subtotal = $derived(price * qty);
  let tax = $derived(subtotal * 0.0725);
  let total = $derived(subtotal + tax);
</script>

<p>${total.toFixed(2)}</p>
```

Svelte builds the dependency graph for you. Change `price`, everything downstream invalidates.

### 4 — Destructured derived for form validation

```svelte
<script lang="ts">
  let email = $state('');
  let password = $state('');

  let { valid, errors } = $derived.by(() => {
    const errs: string[] = [];
    if (!email.includes('@')) errs.push('Email looks wrong');
    if (password.length < 8) errs.push('Password must be 8+ chars');
    return { valid: errs.length === 0, errors: errs };
  });
</script>

<input bind:value={email} />
<input type="password" bind:value={password} />
<button disabled={!valid}>Sign up</button>
{#each errors as err}<p class="err">{err}</p>{/each}
```

## Common mistakes

| Mistake | Why it bites | Fix |
|---|---|---|
| `$derived(() => count * 2)` (as an expression) | You just derived a *function*, not a number. Template prints `() => count * 2`. | Either `$derived(count * 2)` or `$derived.by(() => count * 2)`. |
| Assigning inside a derived | Svelte throws `state_unsafe_mutation`. Derived must be pure. | Move the mutation to an event handler or `$effect`. |
| Reading non-reactive values | `Date.now()` is not reactive — it won't re-run on wall-clock change. | If you need "now," use an `$effect` with `setInterval` to update a `$state`. |
| Treating `$derived` like `useMemo` | `useMemo` caches based on declared deps. `$derived` tracks by reading. The tracking is automatic. Don't pass dep arrays. | Just read the state. |
| Using `$effect` to assign one piece of state from another | Creates stale-value footguns and loops. | If the rule is "Y is a function of X," use `$derived`. Always. |

## The PE lens

**Why this rune is the most important one.** Most bugs in reactive UI come from *desync*: two pieces of state that should agree but don't because someone forgot to update one when the other changed. `$derived` eliminates that class of bug by making the "always true" relationship declarative.

**When to prefer `$derived.by` over `$derived(expr)`.** If the body is longer than one line, use `.by`. If it has a loop, conditional, or early return, use `.by`. Readability wins; there is no runtime difference.

**Push-pull in production.** In a list of 10,000 rows, one row gets `$derived(item.price * item.qty)`. You mutate 50 of them. Only those 50 rows re-render. The other 9,950 deriveds are marked dirty, never read (because their DOM already matches), and never recalculated. This is why Svelte scales.

**The override rule.** Overriding a `$derived` is for optimistic UI only. The moment a dependency changes, your override is gone. If you find yourself overriding a derived to "save" a computed value, you wanted `$state`, not `$derived`.

**`$effect` is not a derived substitute.** There is a very common anti-pattern in React land: `useEffect(() => setTotal(price * qty), [price, qty])`. **Don't do that here.** Use `$derived(price * qty)`. If you reach for `$effect` to compute a value, stop and use `$derived` instead.

## Build challenge

Build four pages. Each starter has the scaffolding; you fill in the reactive logic.

### 1 — `/01-cart` — Shopping cart subtotal / tax / total

Given an array of line items with `price` and `qty`:
- Derive `subtotal` (sum of `price * qty`).
- Derive `tax` (subtotal × configurable `taxRate` state — start at 0.0725).
- Derive `total` (subtotal + tax).
- User can add a line, remove a line, change qty, change tax rate.
- All three derived values update automatically.

### 2 — `/02-filter` — Live-filtered list

Given a static list of ~20 fruits:
- Keep a `query` state bound to a search input.
- Derive `matches` — filtered list (case-insensitive substring match).
- Derive `count` — matches.length.
- Derive `empty` — whether there are zero matches AND the query is non-empty.
- Show the count, show the list, show an empty state when applicable.

### 3 — `/03-optimistic` — Optimistic likes counter

Simulate a post with a `likes` count. Use an async function with a 600ms delay that 20% of the time "fails."
- Declare `likes` as a derived of `post.likes`.
- On click, override `likes += 1`, call the async API, on failure roll back.
- Disable the button while the request is in flight.

### 4 — `/04-destructure` — Form validation via destructured derived

Email + password form:
- Destructure a derived `{ valid, errors }` from a validator function.
- Disable the submit button when `!valid`.
- Show each error as a `<p>`.
- Bonus: add a "confirm password" field. The derived must check match.

### Success looks like

```sh
pnpm --filter @course/lesson-02-starter dev
# navigate all four pages, exercise them, see values update instantly

pnpm --filter @course/lesson-02-starter check
# 0 errors, 0 warnings
```

## Self-check

Before opening the `<details>` tags, answer each question out loud.

<details>
<summary>1. Why is <code>$derived(count * 2)</code> correct but <code>$derived(() => count * 2)</code> is a bug?</summary>

Because `$derived(expr)` evaluates `expr` and tracks the state read inside it. If you pass a function, `expr` is the function itself, not the result of calling it. You've derived a function value, which never changes. Use `$derived.by(() => count * 2)` if you want a function body.
</details>

<details>
<summary>2. You see <code>$effect(() => { total = price * qty; })</code> in a PR. What's wrong with it?</summary>

It reinvents `$derived` the hard way. You lose push-pull laziness, you open the door to feedback loops (what if something assigns to `price` inside another effect?), and you have two writers to `total` which is how desync bugs start. Replace with `let total = $derived(price * qty)`. The rule is: if Y is always a function of X, `$derived`. If Y needs to *do something* when X changes (fetch, log, mutate DOM), `$effect`.
</details>

<details>
<summary>3. You derive <code>isOver = $derived(count &gt; threshold)</code>. You increment count from 0 to 50. How many times does the DOM text node showing <code>isOver</code> re-render?</summary>

Twice, if `threshold` is 10: once when `isOver` flips from `false` → `true` at `count = 11`. (Once for the initial render, once at the flip.) Svelte short-circuits identical values — `false === false` skips the update. This is the referential-equality short-circuit.
</details>

## Links

- [Svelte docs — `$derived`](https://svelte.dev/docs/svelte/$derived)
- [Svelte docs — `$derived.by` section](https://svelte.dev/docs/svelte/$derived#$derived.by)
- [Svelte docs — Push-pull reactivity](https://svelte.dev/docs/svelte/$derived#Update-propagation)

Next: [Lesson 03 — `$effect`](../lesson-03-effect/README.md). Effects are how you *do* things when state changes. `$derived` is for computing, `$effect` is for doing.
