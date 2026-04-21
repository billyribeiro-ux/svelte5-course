# Lesson 06 — Control flow blocks

## The project you're building

**A Kanban board.** Three columns — *To do*, *In progress*, *Done* — each holding a list of cards. Add a card by typing into the column's input and pressing Enter. Move cards left or right between columns. Reorder cards within a column. Set priority. Delete. Clear all *Done* cards at once. Reset the whole board to its seeded state.

What it does:
- 3 columns, each with a header (title + live card count).
- Each card has a title, a priority (`low` / `med` / `high`) shown as a coloured chip, and 5 action buttons (↑, ↓, ←, →, ×).
- Adding a card is a form submission: `Enter` on the input, or click *Add*. Empty inputs are rejected silently.
- Card actions:
  - `↑` / `↓` — reorder within the current column. Disabled at the ends.
  - `←` / `→` — move to the previous / next column. Disabled at the edges.
  - `×` — delete the card.
  - priority dropdown — updates the priority chip's colour.
- Empty columns display a "No cards yet." placeholder.
- A top bar shows the total card count. A "Clear done" button appears only if the *Done* column has at least one card.
- `/` pressed anywhere (not while typing) focuses the first column's input, Slack-style.

Why this project: a Kanban board is the smallest realistic UI that *requires* every control-flow block. Nested `{#each}` (columns → cards) needs keys to reorder cleanly. The `{:else}` clause on an each block is the empty state. `{#if}` gates the "clear done" button on a derived count. A `{#snippet}` renders one card's markup and is called from both within the list and (in the reference) from a count badge — reuse without creating a component. If you skip keys, drag-reorder will visibly break. If you forget `{:else}`, empty columns collapse. These are the pattern failures you'll see in real code.

## What this lesson teaches

The feature is **Svelte's control-flow blocks**: `{#if}`, `{#each}` (with key and `{:else}`), `{#snippet}` / `{@render}`, `{#key}`, and `{@const}`. The Kanban exercises all of them except `{#await}` (covered in Lesson 15 on async Svelte) and `{#key}` (covered in `reference/`, where it's not contrived).

Five muscle groups, each exercised in the board:

1. **`{#each}` with a key** — stable identity across reorder. `{#each items as item, i (item.id)}`. Use the key any time the array can reorder, shrink in the middle, or have items inserted elsewhere than the end.
2. **`{:else}` on `{#each}`** — the empty state. Renders when the collection has 0 items. Don't manually write `{#if items.length === 0}` next to the each; use the block's own else.
3. **`{#if}` / `{:else if}` / `{:else}`** — conditional rendering of a subtree. Expressions, not statements — you don't `return`.
4. **`{#snippet}` + `{@render}`** — the successor to Svelte 4 slots. A snippet is a named, local, parameterised chunk of markup. Use it to kill duplication *within a component* or to pass content *to* a component (Lesson 14 goes deeper on that).
5. **`{@const ...}`** — a local constant inside a block. Good for "I need to compute something once per iteration."

Compounds from earlier lessons:
- **Lesson 01 `$state`** — one reactive object-of-arrays holds the whole board.
- **Lesson 02 `$derived`** — total card count, per-column count, "has any done?".
- **Lesson 03 `$effect`** (light) — kept out of the core loop; not every lesson needs an effect.
- **Lesson 04 `$inspect`** — watches board mutations during dev.
- **Lesson 05 events + bindings** — `onsubmit` with `preventDefault`, `onclick` on action buttons, `bind:value` on the new-card input and the priority select, `<svelte:window>` for the `/` shortcut.

## Concept

### The mental model — 7 rules

**Rule 1. Blocks are markup, not statements.** `{#if}` does not `return` anything. You put markup inside. The markup is rendered when the condition is truthy, unmounted when it's not. Same for the each branches.

```svelte
{#if cards.length > 0}
	<ul>...</ul>
{:else}
	<p>empty</p>
{/if}
```

**Rule 2. `{:else}` is a branch, not a default.** `{#each items as item}...{:else}...{/each}` renders the else *only* when the collection is empty. It runs through an exit transition when the list becomes non-empty. There is no way to put it "inside" the list.

**Rule 3. Use a key *any time the list can change at the middle.*** Without a key, Svelte matches items by index — adding an item at the top shifts every item's DOM node down by one, which throws away focus, animation state, scroll position, and input-composition state. With `(item.id)`, Svelte tracks items by identity and moves them instead.

```svelte
{#each cards as card, i (card.id)}
	<Card {card} />
{/each}
```

The key must be stable across the item's lifetime and unique within the list. Array indices are *never* safe keys if the list can reorder.

**Rule 4. Snippets are values.** `{#snippet foo(x)}...{/snippet}` declares a snippet named `foo`. It behaves like a function — call with `{@render foo(arg)}`. Snippets can reference variables from their lexical scope (like closures). They can take any number of positional parameters but no rest params.

**Rule 5. `{@render}` is how you *call* a snippet.** Use `{@render name(args)}`. For optional snippets, use `{@render name?.(args)}` or an `{#if}` with an `{:else}` fallback.

**Rule 6. `{#key expr}...{/key}` destroys and re-creates its contents when `expr` changes.** Useful for forcing a transition to replay, re-running initialization code inside a component, or resetting a form to its default after a save. Don't reach for it to "fix reactivity" — if you find yourself doing that, the underlying state model is probably wrong.

**Rule 7. `{@const}` defines a constant scoped to its enclosing block.** It's the correct place to compute something derived from the loop variable or the conditional branch. It runs on every re-execution of the block — do not put expensive work in it.

```svelte
{#each cards as card, i (card.id)}
	{@const isLast = i === cards.length - 1}
	<Card {card} {isLast} />
{/each}
```

### Deep reactivity and `$state` objects of arrays

The board is a single `$state` shape:

```ts
type Card = { id: string; title: string; priority: 'low' | 'med' | 'high' };
type Column = { id: 'todo' | 'in-progress' | 'done'; title: string; cards: Card[] };

const board = $state<Column[]>([
	{ id: 'todo', title: 'To do', cards: [...] },
	{ id: 'in-progress', title: 'In progress', cards: [...] },
	{ id: 'done', title: 'Done', cards: [...] }
]);
```

Deep tracking means `board[0].cards.push(newCard)` is reactive without any `board = [...board]` spread dance. `$state` proxies the mutation. `$derived(board.reduce((n, c) => n + c.cards.length, 0))` re-evaluates on any card push/pop in any column.

### Move vs reorder — two operations, one state

Moving a card to a neighbour column:

```ts
function moveCard(colId: ColumnId, cardId: string, direction: -1 | 1): void {
	const colIdx = board.findIndex((c) => c.id === colId);
	const nextIdx = colIdx + direction;
	const current = board[colIdx];
	const next = board[nextIdx];
	if (!current || !next) return;

	const cardIdx = current.cards.findIndex((c) => c.id === cardId);
	if (cardIdx < 0) return;

	const [card] = current.cards.splice(cardIdx, 1);
	if (card) next.cards.push(card);
}
```

Reordering within a column uses a second `splice` to insert at the new index. Keyed `{#each}` handles the DOM reshuffle; you just mutate the array.

## Common mistakes

| Mistake | Why it bites | Fix |
|---|---|---|
| `{#each items as item, i}` without a key | Svelte matches by index — inserts at the top shift every element's DOM, destroying focus/animation state. | Add `(item.id)`. |
| Using array index as the key | Still index-based matching, just more explicit. Doesn't help. | Use a stable unique id. |
| `{#if items.length === 0}` outside an each | Duplicates logic; not wrong but wastes the built-in `{:else}`. | `{#each items as ...}...{:else}empty{/each}`. |
| Reading a snippet before it's declared | Snippets are hoisted but only within their lexical scope. | Declare at the top of the component, or inside the correct block. |
| `{@render children()}` when `children` is optional | Throws if undefined. | `{@render children?.()}` or `{#if children}...{:else}fallback{/if}`. |
| `{#key obj}` to force remount | `obj` is a reference; mutating it doesn't change the reference. | Key on a primitive that actually changes, or on a counter. |
| `{@const}` at the top of the component | Only legal as an immediate child of a block or component. | Move it inside an `{#if}` / `{#each}` / `{#snippet}`, or use plain `let` / `$derived` in `<script>`. |
| Destructuring `card` in the each (e.g. `{#each cards as {title, id}}`) and expecting mutation to flow | You now hold primitive copies. Setting `title = 'x'` doesn't update the state. | Keep the card reference: `{#each cards as card}`, then write to `card.title`. |
| Keys change every render (e.g. `(Math.random())`) | Svelte throws out and re-creates every item on every render — worst-case perf, loses state. | The key must be stable for the item's lifetime. |

## The PE lens

**Snippets kill the "tiny component for one `<tr>`" pattern.** Before snippets, you'd either copy-paste the card markup in 3 places or extract a `<Card>` component. A component is overkill for 8 lines of JSX; a snippet is perfect. Use them as the default for *repeat-within-one-component*. Extract to a component when the markup needs its own state, lifecycle, or testing.

**Keys are the correctness bar, not a perf optimisation.** The conventional wisdom ("add a key to make it faster") undersells it. Keys are how you maintain DOM *identity* across re-renders. Without them, animations flicker, focused inputs lose cursor position, IME compositions break, and in-DOM transitions replay wrongly. Add the key *first*; profile later.

**`{#each}` with `{:else}` is the empty-state API.** A UI that doesn't draw its empty state is a UI that fails its first-time user. Make "what the screen looks like when the array is empty" a thing you design explicitly. The `{:else}` block is the place for it.

**`{@const}` vs `$derived` vs plain `let`.** Use `let` in `<script>` for truly-local non-reactive values. Use `$derived` in `<script>` for values that depend on reactive state and are read in multiple places. Use `{@const}` inside a block when the thing depends on the block's local variable (e.g., `card` inside `{#each}`). The three are not interchangeable — reach for the right one.

**Never destroy state to force a re-render.** `{#key}` is a tool for replaying transitions or resetting a component after a save, not a tool to fix a bug. If you need `{#key}` to make something update, go back and understand why the tracked value isn't tracking. Usually: a let that should be `$state`, a destructured value that broke the proxy, or a cached reference from outside the reactive graph.

## Build challenge

The `starter/` ships the shell: the routes, layout, the `board` initial data, the CSS, and the handler functions already wired for events. What's stubbed is the *markup layer* — the control-flow blocks themselves. Six stubbed pieces, marked `// Lesson 06 build:`.

### Acceptance criteria

1. **Columns render in order.** `{#each board as col (col.id)}` — keyed on `col.id`. Each column shows its title and a live count.
2. **Cards render inside each column, keyed.** `{#each col.cards as card, i (card.id)}`. Adding, deleting, moving, or reordering must not flicker the other cards (inspect the DOM — focused inputs in other cards must stay focused if present).
3. **Empty state.** When a column has 0 cards, show "No cards yet." via `{:else}`.
4. **Card markup via snippet.** Declare `{#snippet cardRow(card, colIdx, cardIdx, col)}` once at the top of the component. Render it with `{@render cardRow(card, colIdx, cardIdx, col)}` inside the cards each.
5. **Conditional top-bar button.** "Clear done" shows only when the *Done* column has ≥ 1 card. Use `{#if}`.
6. **Per-card priority.** `{@const accent = priorityColor(card.priority)}` inside the snippet; use it to set a `--accent` custom property via `style:`.

### Success looks like

```sh
pnpm --filter @course/lesson-06-starter dev
# visit, add cards, reorder, move between columns, delete, clear done, reset

pnpm --filter @course/lesson-06-starter check
# 0 errors, 0 warnings

pnpm --filter @course/lesson-06-solution check
# 0 errors, 0 warnings
```

## Self-check

<details>
<summary>1. You render 50 cards in a keyed each with <code>(card.id)</code>. Reordering works. Then a developer "refactors" to <code>(i)</code>. Cards stop animating cleanly and focused inputs jump. Why?</summary>

`i` is the index, which is tied to the *position* in the array. If card A at index 0 moves to index 3, Svelte's diff sees: "position 0 now has a different-keyed element, re-create it." So it destroys the DOM node at position 0 (which was A) and creates a fresh one with A's new content, and does the same for every other shifted card.

With `card.id`, Svelte sees A's key move from position 0 to position 3 and *moves* the existing DOM node — preserving focus, animation state, IME composition, scroll position.

Rule of thumb: if the list can reorder, add to its middle, or be removed from its middle, never key on index. Key on a stable id that survives reordering.
</details>

<details>
<summary>2. You declare <code>{#snippet row(card)}</code> at the top of the component, then try <code>{@render row(card)}</code> inside a child component you imported. Svelte errors that <code>row</code> is undefined. Why?</summary>

Snippets are scoped to the file where they're declared. Passing a snippet to a child component requires either (a) declaring the snippet inside the child's tag — where it becomes an implicit prop — or (b) passing it as an explicit prop like any other value. A reference to `row` inside `<Child>` doesn't see the parent's `row` declaration.

The fix:

```svelte
<Child>
	{#snippet row(card)}...{/snippet}
</Child>
```

Lesson 14 goes deeper on this — passing snippets across component boundaries.
</details>

<details>
<summary>3. You wrap <code>{#key counter}<Form /></code> and expect clicking "reset" (which does <code>counter++</code>) to clear the form. Nothing happens. Why?</summary>

Almost certainly one of two things:

- `counter` is a plain `let`, not `$state`. The `counter++` runs but Svelte's reactivity graph never notices. Wrap it: `let counter = $state(0)`.
- `counter` is a `$state`, but the `counter++` line runs *outside* a reactive context (e.g. in a callback that's been destructured into a local reference, or in a module-scope function that closed over an old value).

Add `$inspect(counter)` and click reset. If the log fires, the state is updating and the `{#key}` should be destroying the contents. If the log doesn't fire, your state assignment isn't reaching the proxy.
</details>

## Links

- [Svelte docs — `{#if}`](https://svelte.dev/docs/svelte/if)
- [Svelte docs — `{#each}`](https://svelte.dev/docs/svelte/each)
- [Svelte docs — `{#snippet}`](https://svelte.dev/docs/svelte/snippet)
- [Svelte docs — `{@render}`](https://svelte.dev/docs/svelte/@render)
- [Svelte docs — `{#key}`](https://svelte.dev/docs/svelte/key)
- [Svelte docs — `{@const}`](https://svelte.dev/docs/svelte/@const)

Next: [Lesson 07 — `bind:` directives](../lesson-07-bind/README.md). You'll build a settings editor — every form control bound both ways, including radio groups, checkbox groups, select multiple, file input, and function bindings.
