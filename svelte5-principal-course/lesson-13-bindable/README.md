# Lesson 13 — `$bindable`

## The project you're building

**A multi-step signup wizard.** The parent page owns `step: number` as `$state`. A `<Stepper>` child component renders the breadcrumb + Prev / Next buttons, and lets the user change the step. The parent uses `<Stepper bind:step />` so the child can mutate the value back; a `$inspect` in the parent confirms every change flows through.

Four steps — Email, Password, Profile, Summary — swapped with a fade transition via `{#key step}`. Next is disabled when the current step's field is empty; Back is disabled on step 0. A small form field lives in each step, bound via `bind:value` to a `form` object in the parent.

## What this lesson teaches

One small idea:

**`$bindable()` opts a prop in to being writable from inside the component.** Without it, children can only *read* props; with it, they can reassign (and if the prop is a state proxy, mutate). Parents opt in with the `bind:prop={local}` directive.

- Without `$bindable`: `prop = 5` inside the child errors at runtime (read-only).
- With `$bindable`: child can `prop = 5`, and if the parent used `bind:`, the parent's `local` updates too.

```svelte
<!-- Child.svelte -->
<script>
	let { step = $bindable(0) } = $props();
</script>

<button onclick={() => step++}>Next</button>

<!-- Parent.svelte -->
<script>
	let current = $state(0);
</script>

<Child bind:step={current} />
```

The default (`0`) is the fallback when no `bind:` is provided. If the parent *does* bind but the initial value is `undefined`, Svelte throws at runtime — `$bindable` with a fallback + an explicit `undefined` bound value is the one hard-to-debug configuration. Always pass a real initial value.

## Common mistakes

| Mistake | Why it bites | Fix |
|---|---|---|
| Making every prop `$bindable()` | Data flow becomes bidirectional everywhere; hard to reason about. | Only bindable for props the parent genuinely wants child-owned. |
| `$bindable` + parent passing `undefined` | Runtime error. | Initialise the parent's `$state` to a real value. |
| Binding to a parent's `$derived` | Derived is read-only. | Bind to a raw `$state`. |
| Using `$bindable` to sneak "events" back | Events should be callback props (`onChange(next)`). | `$bindable` is for **state**; callbacks are for **events**. |

## Build challenge

The `starter/` ships the wizard layout with all four step screens and a functional form. The `Stepper` component markup is wired but its `step` prop isn't bindable yet. Two stubs:

1. **`Stepper.svelte` → `let { step = $bindable(0), ... } = $props();`** — promote `step` to bindable.
2. **`+page.svelte` → `<Stepper bind:step total={4} />`** — bind the parent's state.

Everything else already works — the button handlers in `Stepper` reassign `step`, which requires `$bindable` to propagate back.

### Success

```sh
pnpm --filter @course/lesson-13-starter dev      # wizard advances; parent's $inspect logs each step
pnpm --filter @course/lesson-13-starter check    # 0 / 0
pnpm --filter @course/lesson-13-solution check   # 0 / 0
```

## Self-check

<details>
<summary>1. You remove <code>bind:</code> from the parent's <code>&lt;Stepper&gt;</code>. What happens when the child reassigns <code>step</code>?</summary>

The child's local `step` updates; the parent's `current` does not. `$bindable` allows the child to write, but only `bind:` wires that write back to the parent. Without `bind:`, the child is working with a one-way ephemeral copy.

Useful sometimes — "here's a controlled component, but feel free to override internally" — but not what a wizard needs.
</details>

<details>
<summary>2. Why is <code>$bindable</code> rarer than callback props in practice?</summary>

Because events are more common than two-way state. "User clicked save", "item was selected", "form submitted" — those are callbacks, one-shot signals. `$bindable` is for *ongoing* state ownership: "the parent owns the current tab, but I let you change it here."

Overusing `$bindable` turns a component tree into implicit global state. You lose the mental contract that "only the parent writes." Reach for it when you genuinely need to; use callbacks otherwise.
</details>

<details>
<summary>3. Your bindable prop has a fallback. Does the fallback create a reactive state proxy?</summary>

No. Fallback values for any prop (bindable or not) are **not** wrapped in `$state`. They're a plain initial value. Mutation of the fallback object does nothing.

If you want mutations to be reactive within the component, initialise your own `$state` from the prop value:

```ts
let { value = $bindable() } = $props();
let localCopy = $state(value);
```

Or simply require the parent to always pass a bound value.
</details>

## Links

- [Svelte docs — `$bindable`](https://svelte.dev/docs/svelte/$bindable)

Next: [Lesson 14 — Snippets](../lesson-14-snippets/README.md). A data table where the parent provides per-cell snippets.
