# Lesson 14 — Snippets

## The project you're building

**A typed data table.** A `<Table>` component takes an array of records and a list of column definitions, then renders rows — but delegates every cell's markup to a snippet the parent provides. Three columns, three different snippets: one plain text, one styled badge, one small sparkline-ish bar. The parent also provides an optional `header` snippet (styled section title) and an optional `empty` snippet (what to render when `data` is `[]`).

Lesson 06 already introduced snippets for local reuse. Lesson 14 is about **snippets as props** — passing them across the component boundary.

## What this lesson teaches

Three shapes for passing snippets:

### 1. The `children` snippet (implicit)

Any non-snippet content between `<Component>…</Component>` tags is collected into an implicit `children` snippet.

```svelte
<!-- parent -->
<Button>Click me</Button>

<!-- Button.svelte -->
<script>
	let { children } = $props();
</script>
<button>{@render children()}</button>
```

### 2. Named snippet props, implicit

Snippets declared *inside* a component's tag become implicit props matching their name.

```svelte
<!-- parent -->
<Table {data}>
	{#snippet header()}<h2>Users</h2>{/snippet}
	{#snippet row(user)}<td>{user.name}</td><td>{user.email}</td>{/snippet}
</Table>

<!-- Table.svelte — `header` and `row` arrive as props -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	let { data, header, row }: { data: User[]; header?: Snippet; row: Snippet<[User]> } = $props();
</script>

{#if header}{@render header()}{/if}
{#each data as user}{@render row(user)}{/each}
```

### 3. Explicit snippet props (like any other prop)

Snippets can be declared at the top of a component and passed as regular props.

```svelte
<script>
	import Table from './Table.svelte';
</script>

{#snippet row(user)}<td>{user.name}</td>{/snippet}

<Table {data} {row} />
```

### Typing with `Snippet<[T]>`

```ts
import type { Snippet } from 'svelte';

interface Props<T> {
	data: T[];
	row: Snippet<[T]>;           // single positional arg typed as T
	header?: Snippet;             // no args
	empty?: Snippet;              // no args
}
```

`Snippet` without a generic = no parameters. `Snippet<[User]>` = one positional param of type `User`. `Snippet<[User, number]>` = user + index. Tuples. No rest parameters in snippets.

## Common mistakes

| Mistake | Why it bites | Fix |
|---|---|---|
| Using both `children` content and a `children` prop | The content becomes the prop; yours is overwritten. | Rename your prop. |
| `Snippet` type without a generic when passing args | Caller's arg types are unchecked. | `Snippet<[ArgType]>`. |
| Calling an optional snippet without `?.()` | `undefined` is not callable — throws. | `{@render row?.(user)}` or guard with `{#if row}`. |
| Passing a snippet that closes over stale state | Snippets are lexically captured; reactivity tracks the reads at call time, not capture time. Usually fine. | Understand that reads inside the snippet body run in the child's context. |
| Extracting a "component" for a 3-line slot | Overkill. | Use a snippet. Reserve components for things with state, lifecycle, or testing boundaries. |

## Build challenge

`starter/` ships `<Table>` partially. The `data`, `columns`, and `row` snippet prop are wired; `header`, `empty`, and typing are stubbed. The parent page defines three columns with three different snippets — all already there.

### Acceptance criteria

1. `Table` accepts `data: T[]`, `row: Snippet<[T]>`, `header?: Snippet`, `empty?: Snippet`.
2. When `data` is empty, the `empty` snippet renders (or "No records." as fallback).
3. The parent provides a `header` snippet that becomes the `<caption>` of the table.
4. Each row renders the parent's `row(record)` snippet, typed against `User`.

## Self-check

<details>
<summary>1. What's the difference between an implicit and an explicit snippet prop?</summary>

**Implicit** — declared inside the component's tag: `<Table>{#snippet row(user)}…{/snippet}</Table>`. Becomes a prop whose name matches the snippet's name.

**Explicit** — declared outside the tag, passed like a regular prop: `{#snippet row(user)}…{/snippet}<Table {row} />`.

Same component-side contract; different author ergonomics. Implicit is cleaner when the snippet is only used for that one component instance.
</details>

<details>
<summary>2. Why does <code>Snippet</code> take a tuple type parameter?</summary>

Because snippets can take multiple positional arguments, and TypeScript's function-type syntax for positional args is a tuple: `(args: [string, number]) => void`.

`Snippet<[User, number]>` means the snippet takes `(user: User, index: number)`. Mirrors the arguments you pass in `{@render snippet(user, i)}`.
</details>

<details>
<summary>3. When would you use a <code>&lt;Component&gt;</code> instead of a snippet?</summary>

When the thing has:
- Its own `$state`.
- A lifecycle (mount, teardown, effects).
- Testing or documentation needs.
- Reuse across multiple components.

Snippets are for markup reuse within a parent-child contract. Components are for encapsulated units with identity. A `<Card>` with its own styles: component. A `<TableRow>` that just renders cells: snippet.
</details>

## Links

- [Svelte docs — `{#snippet}`](https://svelte.dev/docs/svelte/snippet)
- [Svelte docs — `{@render}`](https://svelte.dev/docs/svelte/@render)
- [Svelte docs — Typing snippets](https://svelte.dev/docs/svelte/snippet#Typing-snippets)

Next: [Lesson 15 — Slots → snippets migration](../lesson-15-slots-snippets/README.md).
