# Lesson 11 — `$props`

## The project you're building

**A small, typed chart library.** Four reusable components — `<Sparkline>`, `<BarChart>`, `<Metric>`, `<Legend>` — plus a `<Card>` wrapper that every chart sits inside. A single dashboard page composes them with different data, datasets, colours, and layouts. Every component is strictly typed, reads its inputs via `$props()`, uses default fallbacks, forwards a `class` prop so the parent can adjust styling, and composes cleanly.

What it does:
- `<Sparkline data={[...]} color?={...} width?={...} height?={...} />` — inline SVG line chart. Auto-fits to the provided width/height; draws a smooth polyline from an array of numbers; renders a subtle fill beneath.
- `<BarChart data={[{ label, value }]} max?={number} color?={string} />` — horizontal bars with labels and values. If `max` is omitted, computes it from the data.
- `<Metric label={...} value={...} delta?={number} format?={(n)=>string} />` — the "big number" card. Shows the formatted value, optional `+12%` delta chip coloured green/red based on sign.
- `<Legend items={[{ label, color }]} />` — a row of colour swatches + labels.
- `<Card class?={...} children={...}>…</Card>` — the wrapper with a consistent look. Forwards `class` via the array form and renders the children snippet.
- Dashboard mock page — 6 cards composed from the components above, with three sparklines at the top, a bar chart mid-page, two metrics with deltas, and a legend for the bar chart's categories.

Why this project: charts are the archetypal "reusable primitive" — three call sites for each component, different data each time. You experience why `$props` exists by actually calling the same component three ways. Typed props catch the "I passed `"5"` instead of `5`" bug at the seam where you'd otherwise spend 20 minutes debugging.

## What this lesson teaches

Seven patterns:

1. **`$props()` basic destructure.** `let { label, value } = $props();`
2. **Default / fallback values.** `let { size = 'md', color = 'var(--color-accent)' } = $props();`
3. **Renaming.** `let { class: className = '' } = $props();` — because `class` is a JS keyword.
4. **Rest spread.** `let { class: className, ...rest } = $props();` + `<div {...rest}>` — forward unknown props to the underlying element.
5. **Typed `Props` interface.** The recommended shape for anything beyond a one-off component.
6. **Generics.** `<script lang="ts" generics="T">` — for components that should preserve the caller's type (e.g., a typed `<List<T>>`). Covered in `reference/`.
7. **Mutate-props footguns.** Why reassigning is fine, mutating isn't, and when `$bindable` (Lesson 13) fixes it.

Compounds:
- **$state / $derived** — the dashboard's live "refresh" button mutates a `$state` dataset; components read it via props.
- **$effect** — only inside a component needing a DOM measurement.
- **$inspect** — watches the dashboard data.
- **Lessons 05–07** — click handler for the refresh button; no bindings this lesson.
- **Lesson 08** — `class` array forms on every wrapper.
- **Lesson 09** — each component has its own scoped `<style>`. Multi-component structure.
- **Lesson 10** — charts fade on data change via `{#key}` + `in:fade`.

## Concept

### The shape the docs push you toward

```svelte
<script lang="ts">
	interface Props {
		label: string;
		value: number;
		delta?: number;
		format?: (n: number) => string;
		class?: string;
	}

	let {
		label,
		value,
		delta,
		format = (n) => n.toLocaleString(),
		class: className = ''
	}: Props = $props();
</script>
```

- **Interface first.** Keep props shape as a named type so IDEs and consumers get autocomplete.
- **Defaults for every optional prop.** `delta`, `format`, `className`. Required props (`label`, `value`) have no default.
- **Rename `class`.** JS reserved word. `class: className` is the convention.
- **No rest spread for terminal components.** Only spread when you genuinely mean "forward every unknown prop to the underlying element." Adding `{...rest}` always is a common leak source.

### Forwarding `class` — the idiom

```svelte
<script lang="ts">
	let { class: className = '', ...rest }: { class?: string } = $props();
</script>

<div class={['card', className]} {...rest}>
	<!-- ... -->
</div>
```

- The array form of `class` (Lesson 08) composes the component's own `.card` with whatever the parent passes.
- `{...rest}` forwards any unknown DOM attributes (`id`, `title`, `data-*`, ARIA, etc.).
- Order matters for DOM attributes: put `{...rest}` **before** your own overrides so they take precedence — or put it after, if parent should be able to override you. The convention is rest-first: component defaults last, parent spread first, explicit overrides last.

### Mutating props: don't

```svelte
<!-- Child.svelte -->
<script>
	let { list } = $props();
</script>

<button onclick={() => list.push('x')}>add</button>
<!-- Two cases:
     1. Parent passed a plain object: push has NO effect (stale reference).
     2. Parent passed a $state proxy: push WORKS but triggers an
        `ownership_invalid_mutation` warning.
-->
```

You have three correct options:
1. **Pass a callback.** `onAdd={() => list.push('x')}` in parent; child calls `onAdd()`.
2. **Emit an event-shaped callback.** Same pattern, more verbose — `onChange={(next) => list = next}`.
3. **Use `$bindable`.** Lesson 13. When the parent *wants* the child to mutate and take ownership.

Most of the time, option 1 is correct. The "cannot mutate" rule pushes you toward cleaner data flow than React's wild west of direct state mutation.

### Generics — the typed list pattern

```svelte
<!-- List.svelte -->
<script lang="ts" generics="T">
	import type { Snippet } from 'svelte';

	let { items, row }: { items: T[]; row: Snippet<[T]> } = $props();
</script>

<ul>
	{#each items as item}
		<li>{@render row(item)}</li>
	{/each}
</ul>

<!-- App.svelte -->
<List items={users} row={userRow} />
<!-- `T` is inferred as `User`; `row` gets a typed `user: User` parameter -->
```

`generics="T"` on the `<script>` tag lets the component's prop types be parametrised. Reach for it any time a prop's shape matches the caller's data shape — typed tables, typed lists, typed dropdowns. You'll use it more than you expect once you're comfortable.

## Common mistakes

| Mistake | Why it bites | Fix |
|---|---|---|
| Top-level `let { class }` | JS reserved word — SyntaxError. | `let { class: className }` — renamed. |
| Mutating a plain-object prop | Silent no-op; parent never sees the change. | Call a callback passed from parent, or use `$bindable`. |
| `{...rest}` with NO filtered-out props | Every unknown key bleeds to the DOM, including TypeScript-only ones. | Destructure what you own, spread only the remainder. |
| Defaults that are `$state`-like objects | Fallback values are NOT reactive; mutating them does nothing. | Either make the default static or explicitly wrap in `$state` inside an effect. |
| Missing `Props` interface | No autocomplete, no red squigglies at call sites. | One `interface Props { ... }` per component. |
| Using `children` as both a snippet and a prop name | Collision — any inner content auto-fills `children`. | If you also accept a `children` prop, rename it. The docs warn against this. |
| `generics="T"` inside a component that doesn't actually parametrise | Adds complexity with no benefit. | Only add it when at least one prop type references `T`. |
| Components that "accept any props" via `{ ...props } = $props()` | Can't discover which props exist. TypeScript can't help. | Destructure explicitly. Rest spread for *forwarding*, not for prop soup. |

## The PE lens

**Every shared component has a typed `Props` interface.** Not optional. The cost is one `interface` declaration; the benefit is autocomplete, misuse detection at compile time, and a single source of truth for consumers. If your team isn't doing this, propose a lint rule.

**Default values live at the destructure site.** `let { size = 'md' } = $props()`. Not inside a `$effect`, not via a null-check in every usage. Destructure defaults are inlined by the compiler and cost nothing.

**Forwarded `class` is a design-system signal.** When a component accepts and forwards a `class` prop, it's signalling "I'm a primitive you can compose." When it doesn't, it's signalling "I'm terminal — style me from above via tokens only." Pick one deliberately. The chart library picks composable.

**Mutation warnings are ownership signals.** `ownership_invalid_mutation` isn't a bug; it's the runtime telling you "whoever owns this state isn't the one mutating it — that's a data-flow smell." Pass callbacks up (most cases), or use `$bindable` (Lesson 13) if the child truly owns that piece.

**Generics > overloads.** You don't need union types like `List | UserList | OrderList` when one `List<T>` suffices. If the components feel too abstract, revisit — but a well-typed generic component is the senior shape.

## Build challenge

The `starter/` ships every component's markup and CSS. Each component's `<script>` block is stubbed: you'll destructure props, add defaults, add types. The dashboard page composes them.

### Acceptance criteria

1. **`Sparkline` props.** Destructure `data: number[]`, `color = 'var(--color-accent)'`, `width = 120`, `height = 32`, `class: className = ''`. Computes the SVG polyline from `data`.
2. **`BarChart` props.** Destructure `data: BarDatum[]`, `max` (default: `Math.max(...data.map(d => d.value))`), `color = 'var(--color-accent)'`. Render one `<div>` per datum with `style:inline-size="{percentage}%"`.
3. **`Metric` props.** Destructure `label: string`, `value: number`, `delta?: number`, `format = (n) => n.toLocaleString()`, `class: className = ''`. Delta chip is green when positive, red when negative.
4. **`Legend` props.** Destructure `items: LegendItem[]`, `class: className = ''`.
5. **`Card` wrapper.** Destructure `class: className = ''`, `children` (Snippet), `...rest`. Forwards `className` via the array form and `{...rest}` onto the outer `<div>`.
6. **Dashboard.** The page renders 3 Sparklines, 1 BarChart, 2 Metrics, 1 Legend — all inside Cards. The "Refresh" button mutates a `$state` dataset; every chart updates via its props.

### Success looks like

```sh
pnpm --filter @course/lesson-11-starter dev
# click Refresh — every chart updates, sparklines animate between states

pnpm --filter @course/lesson-11-starter check
# 0 errors, 0 warnings

pnpm --filter @course/lesson-11-solution check
# 0 errors, 0 warnings
```

## Self-check

<details>
<summary>1. Why must we rename <code>class</code> to <code>className</code> when destructuring <code>$props()</code>?</summary>

`class` is a reserved word in JavaScript (ES2015+ introduced the class keyword). You can have an object key named `class`, but you can't have a *local variable* named `class`. Destructuring declares a local variable. The rename syntax `{ class: className }` pulls the `.class` property into a local binding named `className`.

Two ways to access it:
```ts
// Renamed
let { class: className } = $props();
// or access without destructuring
let props = $props();
props.class; // fine — as a property access
```

The convention in this course (and most Svelte codebases) is `class: className`.
</details>

<details>
<summary>2. You pass <code>data={[1, 2, 3]}</code> to a child. Inside the child, you <code>data.push(4)</code>. What happens?</summary>

Depends on what the parent sent.

- If the parent passed a **plain array literal** like `<Child data={[1,2,3]} />`, the push happens on a detached array — no re-render, no update, no warning. Silent no-op.
- If the parent passed **a `$state` proxy** like `let arr = $state([1,2,3]); <Child data={arr} />`, the push DOES mutate the parent's state — but triggers an `ownership_invalid_mutation` runtime warning, because the child shouldn't mutate state it doesn't own.

The correct shapes:
- Child emits a callback: `let { data, onAdd } = $props(); onAdd(4);`
- Or child uses `$bindable` (Lesson 13) if the parent intends for the child to mutate.

Never plain mutation from a child. It either silently fails or triggers the warning.
</details>

<details>
<summary>3. When is <code>generics="T"</code> worth it?</summary>

When the component has at least one prop whose type depends on a caller-chosen shape. Typical: a `<List>` whose `items` is an array, and whose `row` snippet receives one of those items. The generic lets `row` be typed against the exact shape of the list, not `unknown` or `any`.

Examples where `generics` shines:
- Typed lists, tables, combobox dropdowns, data grids.
- Any "container that ingests a user-provided data shape and calls a user-provided snippet with one element."

When you don't need it:
- Fixed-shape components (`<Button>`, `<Card>`, `<Icon>`, `<Avatar>`).
- When all the props have concrete types (numbers, strings, known object shapes).

Rule of thumb: reach for generics when your type would otherwise say `any[]` or `unknown[]`.
</details>

## Links

- [Svelte docs — `$props`](https://svelte.dev/docs/svelte/$props)
- [Svelte docs — `$bindable`](https://svelte.dev/docs/svelte/$bindable) — for when children need to mutate
- [Svelte docs — Typing wrapper components](https://svelte.dev/docs/svelte/typescript#Typing-wrapper-components)

Next: [Lesson 12 — `$props.id()`](../lesson-12-props-id/README.md). An accordion with stable IDs for `aria-controls` / `aria-labelledby`.
