# Lesson 04 — `$inspect` & `$inspect.trace`

> **What you'll learn:** How to debug reactive state without `console.log`-ing everywhere. `$inspect` is your read-only eye on state changes, and `$inspect.trace` tells you *which* dependency just re-ran your effect or derived.

## Concept

Here is the whole idea:

> `$inspect(value)` is `console.log(value)` that re-runs automatically whenever `value` changes — and, crucially, prints a stack trace so you can see what triggered the change.
>
> `$inspect.trace()` is the first statement inside a `$effect` or `$derived` function, and makes Svelte print which reactive dep caused the re-run.

Both are dev-only. In a production build they compile away to nothing. Zero runtime cost.

### Why this matters

You will spend hours in your career hunting down "why didn't the UI update?" or "why did this effect run again?" The naive approach is `console.log(everything)` and then search the output by hand. `$inspect` turns that into a surgical instrument:

- **One line** to watch a value.
- **Stack trace** on every change, so you see who did the assignment.
- **Custom handler** via `.with(...)` to filter, format, or even `debugger;` only on a specific transition.
- **`$inspect.trace`** answers "which dep triggered this re-run?" — the #1 question when an effect fires more often than you expect.

### The mental model — 5 rules

**Rule 1.** `$inspect(x)` logs `x` **once on init** (with `'init'` as the first arg if you use `.with`) and **again every time `x` changes**.

```ts
let count = $state(0);
$inspect(count); // logs 0 on init, then 1, 2, 3, ... as count changes
```

**Rule 2. Deep tracking.** If you `$inspect` a `$state` object, mutating a nested property re-fires the inspect. You don't have to drill in.

```ts
let user = $state({ name: 'Billy', addr: { city: 'SF' } });
$inspect(user); // fires when user.addr.city changes, too
```

**Rule 3.** You can inspect **many values in one call**: `$inspect(a, b, c)`. Each change to any of them fires the log with all three current values.

**Rule 4. `.with(cb)`** replaces the default `console.log` with your handler.
- First arg to your callback is `'init'` or `'update'`.
- Remaining args are the values you were watching.
- Return value is ignored.

```ts
$inspect(count).with((kind, value) => {
  if (kind === 'update' && value > 100) debugger;
});
```

**Rule 5. `$inspect.trace()`** must be the **first statement** of a `$effect` or `$derived` body. It labels the reactive function (optional string arg) and prints what dependency caused its last run.

```ts
$effect(() => {
  $inspect.trace('cart recompute');
  // ... effect body ...
});
```

### Things `$inspect` does NOT do

- It does **not** prevent the default logging unless you call `.with`. Default is `console.log`.
- It does **not** track plain JS variables — only `$state`, `$derived`, `$props`, and their nested reactive members.
- It is **not** part of a release build. Do not put load-bearing logic inside an inspect callback. Treat it like `assert` in C — a dev-only scalpel.
- It is **not** a substitute for tests. It tells you *what* and *when*, not *correct*.

## Worked examples

### 1 — Watch a primitive

```svelte
<script lang="ts">
  let count = $state(0);
  $inspect(count);
</script>

<button onclick={() => count++}>{count}</button>
```

Open the DevTools console. You see `0`, then `1`, `2`, ... each time with a stack trace expandable in the console.

### 2 — Watch an object (deep)

```svelte
<script lang="ts">
  let cart = $state({ items: [{ id: 1, qty: 1 }] });
  $inspect(cart);
</script>

<button onclick={() => cart.items[0].qty++}>qty++</button>
```

The inspect fires on `cart.items[0].qty` mutations because the whole object is reactively tracked.

### 3 — `.with()` for conditional breakpoints

```svelte
<script lang="ts">
  let temperature = $state(20);
  $inspect(temperature).with((kind, t) => {
    if (kind === 'update' && t > 100) {
      console.error('overheat!', t);
      debugger;
    }
  });
</script>
```

Now you only get noise when something actually goes wrong.

### 4 — `$inspect.trace` for "why did this re-run?"

```svelte
<script lang="ts">
  let a = $state(1);
  let b = $state(2);
  let c = $state(3);

  $effect(() => {
    $inspect.trace('sum effect');
    console.log('sum:', a + b + c);
  });
</script>
```

Click any one of `a`, `b`, `c` and the console shows:

```
sum effect
↳ a (updated from 1 to 2)
```

You now know exactly which dep triggered the rerun.

## Common mistakes

| Mistake | Why it bites | Fix |
|---|---|---|
| Expecting `$inspect` in production | It's a dev-only compile-time rune; strips in prod builds. | Leave it in; it's free. But don't rely on it for prod observability — use `console.error` or a real telemetry pipe. |
| `$inspect.trace()` not at the top of the function | Svelte requires it to be the first statement. | Move it to line 1 of the effect/derived body. |
| Inspecting a plain (non-$state) value expecting it to fire on change | Only reactive values are tracked. | Wrap in `$state()`, or inspect something that reads it. |
| Putting load-bearing logic inside `.with` | Disappears in prod — bug that only happens live. | Side-effectful logic belongs in `$effect`, not `$inspect`. |
| Inspecting a `$derived` and expecting a log on "input changed" | `$derived` is lazy; `$inspect` only fires when the derived is *read* AND its value changes. | Read it somewhere, or inspect the raw inputs. |

## The PE lens

**Use `$inspect.trace` FIRST when an effect misbehaves.** The most frequent staff-engineer debugging win on a reactive codebase is "this effect is firing too often" or "not often enough." Trace tells you which dep fired. That one rune eliminates 80% of the guesswork.

**Leave inspects in development code.** They cost zero in production. Sprinkle them in during development of a complex reducer, state machine, or effect graph. Pull them when the feature is stable — not for cost, just for noise.

**`.with(debugger)` is faster than setting breakpoints by hand.** In a deeply-conditional reactive graph, you want the debugger to trip on *a specific value transition*, not every call. `$inspect(x).with((k, v) => { if (v.bad) debugger; })` is the pattern.

**Do not commit `debugger` statements.** Lint for them. CI should block them.

## Build challenge

Four pages. Each pushes on a different muscle.

### 1 — `/01-basic` — Observe state changes

- A form with three inputs (name, age, favorite color).
- A single `$inspect(form)` on the whole object.
- Click-count buttons (+age, reset).
- Open DevTools console and watch the logs fire. Confirm that mutating a single field still triggers the inspect.

### 2 — `/02-filtered` — `.with` for filtered logs

- A numeric slider 0–100.
- `$inspect(value).with(...)` that:
  - logs `'init'` with a banner
  - logs only when value crosses 75 going up, OR returns below 25 going down
  - calls `console.warn` past 90

### 3 — `/03-trace` — `$inspect.trace` for "which dep?"

- Three independent state values: `tax`, `subtotal`, `shipping`.
- A `$derived` `total` that sums them.
- An `$effect` that logs `total` when it changes.
- Both the derived and the effect use `$inspect.trace(label)` as their first statement.
- User clicks buttons to change each input. They must be able to identify from the trace output which dep ran.

### 4 — `/04-debug` — Debug a broken reactive chain

- A small app with a deliberately planted bug: a field is destructured (losing reactivity), and the UI doesn't update.
- Three `$inspect` calls already written but commented out in the starter.
- Task: uncomment them, read the console, find the bug, fix it.

### Success looks like

```sh
pnpm --filter @course/lesson-04-starter dev
# open DevTools console while using each page

pnpm --filter @course/lesson-04-starter check
# 0 errors, 0 warnings
```

## Self-check

<details>
<summary>1. Why does <code>$inspect</code> get stripped out of production builds?</summary>

Because it's a debugging tool, not a runtime feature. Keeping it in production would waste cycles on logging + stack-trace building for every state change. Svelte's compiler recognizes the rune at build time and emits nothing in production mode. This is why you must never put load-bearing code inside an inspect call — it's like `console.assert` in release-vs-debug C: gone.
</details>

<details>
<summary>2. You have <code>$effect(() =&gt; { $inspect.trace(); doWork(); })</code>. The effect runs but trace prints nothing. What's wrong?</summary>

Three possibilities. (a) The code is running in production — trace is dev-only. (b) The effect was triggered by `untrack`-ed code, which has no tracked dep to report. (c) `$inspect.trace()` is not the first statement of the function body; Svelte requires that. Put trace on line 1 (or line 2 only if line 1 is a comment).
</details>

<details>
<summary>3. You inspect a <code>$derived</code> and expect a log every time its inputs change. You see nothing. Why?</summary>

`$derived` is lazy. It only recomputes when someone reads it. If the derived is not read anywhere in the template or another effect, it never runs, so its value never "changes," so `$inspect` never fires. Either read it somewhere (force the pull), or inspect the raw inputs instead.
</details>

## Links

- [Svelte docs — `$inspect`](https://svelte.dev/docs/svelte/$inspect)
- [Svelte docs — `$inspect.trace`](https://svelte.dev/docs/svelte/$inspect#$inspect.trace(...))
- [Svelte docs — `{@debug ...}` tag](https://svelte.dev/docs/svelte/@debug)

## Going further

After the four challenges, open [`deep-dive/`](./deep-dive/). Three short reference files extend what you just learned:

- **`InspectVsDebugTag.svelte`** — `$inspect(value)` in script vs `{@debug value}` in markup. The first logs every change; the second pauses execution when DevTools is open. Two tools for two intents: *log* vs *stop*.
- **`InspectMultipleValues.svelte`** — `$inspect(a, b, c).with((type, a, b, c) => ...)` watches a *group* of values together. When the bug is about a combination (e.g. "only when `mode === 'edit'` AND `dirty`"), one inspect with a custom handler beats three separate ones.
- **`InspectTraceWithLabel.svelte`** — `$inspect.trace('label')` labels a traced function so a console full of trace groups stays diagnostic instead of becoming noise. This file is also the **Part-1 grand finale**: `$state` + `$derived` + `$effect` + `$inspect.trace` exercised together in one realistic shopping calc.

If you can read the third file fluently, you've earned Part 1.

Next: [Lesson 05 — Markup, attributes, events](../lesson-05-markup/README.md). From Lesson 05 on, each lesson is one real project instead of four mini-challenges.
