# Lesson 05 — Markup, attributes, events

> **Format shift.** From Lesson 05 on, every lesson is one real project instead of four isolated mini-challenges. You'll still learn the concept in depth, but you'll exercise it inside something you'd plausibly ship.

## The project you're building

**A command palette.** The `⌘K` / `Ctrl+K` overlay that every serious app has — Linear, GitHub, VS Code, Notion, Raycast. A single keystroke opens a searchable list of actions; you type to filter, arrow keys to navigate, Enter to run. Close with Escape.

What it does:
- Listens globally for `⌘K` (macOS) and `Ctrl+K` (everywhere else) to open the palette.
- Listens for `Escape` to close. Clicks on the backdrop also close.
- Auto-focuses the search input when the palette opens.
- Filters a static list of commands by substring as you type (case-insensitive).
- Shows the number of matches and an empty state when nothing matches.
- Highlights one result at a time; `↑` / `↓` move the highlight, wrapping at ends.
- `Enter` runs the highlighted command; clicks also run.
- Commands have icons (emoji), a label, a hint (the action description), and an optional keyboard shortcut badge.
- A live "Last action" banner shows what was last run, so you can see the feedback loop work without leaving the page.

Why this project: it combines *every* template-level concept — events on elements, keyboard event handling on `<svelte:window>`, attribute expressions (`aria-selected`, `data-index`, boolean attributes), spread attributes, text expressions, `{#each}` with keys, `{#if}` for empty state, `bind:value` on the input, `bind:this` to focus the input imperatively. And it reinforces every rune from Part 1 in the places they naturally belong.

## What this lesson teaches

The feature is **Svelte's template syntax**: how the thing between `<script>` and `</style>` works. You already wrote templates in Lessons 01–04 at a surface level. Now we go deep.

Five muscle groups, each exercised in the palette:

1. **Element attributes** — static, expression, shorthand, boolean, nullish elision, spread.
2. **Events** — `on*` attributes, event handlers as functions, reading `event.key` / `event.metaKey`, `preventDefault()`, the difference between window-level and element-level events.
3. **Text expressions** — `{expr}`, escaping, coercion rules, regex-literal wrapping.
4. **`bind:`** — two-way data flow. `bind:value` for the search input, `bind:this` for imperative DOM access.
5. **`<svelte:window>`** — listening to global events (keydown) without manual `addEventListener` / cleanup. The Svelte way to do `⌘K`.

Compounds from Part 1:
- `$state` for UI state (`isOpen`, `query`, `activeIndex`, `lastAction`).
- `$derived` for the filtered command list and the match count.
- `$effect` to refocus the input when the palette opens, and to clamp `activeIndex` when the filter changes.
- `$inspect` (commented in starter, live in reference) to watch state transitions during development.

## Concept

### The mental model — 6 rules

**Rule 1. The template is HTML with expression slots.** Curly braces `{ ... }` hold a single JavaScript expression, evaluated at render time and re-evaluated whenever its reactive deps change. Everything outside braces is plain HTML.

```svelte
<p>Type a command ({total} available)</p>
```

`total` is re-read. The literal text "Type a command (" is not.

**Rule 2. Attributes are expressions, too.** `attr="value"` is a string literal; `attr={expr}` evaluates `expr`. Boolean attributes (`disabled`, `hidden`, `readonly`, `required`) follow HTML semantics — included when truthy, omitted when falsy. All other attributes are omitted if `null` or `undefined`.

```svelte
<button disabled={!clickable}>go</button>   <!-- present iff !clickable is truthy -->
<div title={maybeTitle}>...</div>            <!-- attribute omitted if undefined -->
```

**Rule 3. `{name}` is shorthand for `name={name}`.** Use it. It's not just terser — it makes refactors safer because there's only one name to rename.

```svelte
<input {value} {onchange} {disabled} />
<!-- equivalent to -->
<input value={value} onchange={onchange} disabled={disabled} />
```

**Rule 4. `{...obj}` spreads object entries as attributes/props.** Order matters — later attributes win over spread entries at the same key.

```svelte
<button {...defaults} class="override" />
```

**Rule 5. Events are attributes.** `onclick={handler}`. That's it — no `on:click`, no modifiers like `|preventDefault`. Case matters: `onclick` listens to `click`, `onClick` listens to `Click`, which is different. You call `event.preventDefault()` / `event.stopPropagation()` inside the handler yourself.

```svelte
<form onsubmit={(e) => { e.preventDefault(); submit(); }}>...</form>
```

**Rule 6. `<svelte:window>` handles global events.** For keyboard shortcuts that work regardless of focus (`⌘K`, `Esc`), attach the listener to `<svelte:window>`. Svelte removes it on unmount automatically. No `onMount` / `onDestroy` boilerplate.

```svelte
<svelte:window onkeydown={handleKey} />
```

### `bind:value` and `bind:this` — the two you'll use daily

- **`bind:value={query}`** — two-way binding to the input's value. Typing in the box mutates `query`; programmatically setting `query` updates the box.
- **`bind:this={inputEl}`** — assigns the DOM node to `inputEl` after mount. Use it when you need imperative access: `inputEl.focus()`, `inputEl.select()`. Before mount (during init), the value is `undefined` — read it inside a `$effect` or event handler, never in top-level script.

```svelte
<script lang="ts">
	let query = $state('');
	let inputEl: HTMLInputElement | undefined = $state();

	$effect(() => {
		if (isOpen) inputEl?.focus();
	});
</script>

<input bind:value={query} bind:this={inputEl} />
```

### Keyboard event mechanics

`KeyboardEvent.key` is the canonical field — use it over `keyCode` (deprecated) and `which` (deprecated). For `⌘K`:

```ts
function handleKey(event: KeyboardEvent): void {
	const isModK = (event.metaKey || event.ctrlKey) && event.key === 'k';
	if (isModK) {
		event.preventDefault();  // stop the browser's built-in search bar focus
		isOpen = !isOpen;
	}
}
```

- `metaKey` — the `⌘` key on macOS, the `⊞` (Windows) key on Windows. Checking *both* `metaKey || ctrlKey` gives cross-platform behavior.
- `preventDefault()` is *required* — many browsers bind `⌘K` / `Ctrl+K` to the location bar. Without `preventDefault`, the browser eats the shortcut.
- Case of `event.key`: matches the character produced. `'k'` with Shift is `'K'`. For shortcuts, lowercase is usually what you want — `⌘K`, not `⌘⇧K`.

### Event delegation — the one surprising thing

For performance, Svelte attaches `click`, `keydown`, `input`, `change`, and ~20 other events at the **app root** rather than on each element. Event handlers still run in the right order; you'll never notice in normal use. The one gotcha:

- If you manually dispatch an event expecting a delegated listener to catch it, pass `{ bubbles: true }` — otherwise the event never reaches the root.
- Calling `addEventListener` directly and then `stopPropagation()` can prevent delegated listeners from running. Prefer the `on` function from `svelte/events` if you need to add handlers imperatively.

This rarely matters for app code. It matters when you're building a test harness or a third-party widget.

## Common mistakes

| Mistake | Why it bites | Fix |
|---|---|---|
| `on:click={...}` (Svelte 4 syntax) | Removed in Svelte 5 runes mode. | `onclick={...}`. |
| Forgetting `event.preventDefault()` on `⌘K` | Browser's built-in search bar steals focus, your palette doesn't open. | `preventDefault()` unconditionally when you match the shortcut. |
| Checking only `event.metaKey` | Windows users have no `⌘`. | `(event.metaKey \|\| event.ctrlKey)`. |
| Reading `inputEl` in top-level script | Value is `undefined` until mount. | Read inside `$effect` or an event handler. |
| Adding `onkeydown` to `<body>` via plain DOM | You own the listener and the cleanup. Easy to leak. | Use `<svelte:window onkeydown={...} />`. |
| `<button onclick={handler()}>` | Calls `handler()` at render time and passes its *return value* as the event listener. | `<button onclick={handler}>`. Without parens. |
| Destructuring `$state` into locals, then binding | Destructuring breaks reactivity — the bind is on a dead reference. | Bind directly to the state object property: `bind:value={form.query}`. |
| Boolean-attribute footgun: `disabled={'false'}` | The string `'false'` is truthy, so `disabled` is present. | Use the actual boolean: `disabled={isBusy}`. |

## The PE lens

**Keyboard shortcuts belong on `<svelte:window>`, not on a hidden input that steals focus.** The naive hack — "put an `onkeydown` on the palette's input and focus it invisibly" — is fragile. It breaks when other modals open, when IME composition is active, when the user tabs away. `<svelte:window>` is the right level.

**Arrow-key navigation in a result list is a solved problem; steal the pattern.** `activeIndex` is a `$state` number. `↑` decrements, `↓` increments, both clamped/wrapped. Render with `aria-selected={i === activeIndex}`. When `query` changes, clamp `activeIndex` back to 0 via `$effect`. This is the same pattern in every combobox in the world — Reach UI, Radix, shadcn. Learn it once.

**`bind:value` and a `$derived` filter are faster than a debounced `oninput`.** Svelte's reactivity is push-based; the filter runs once per keystroke with no scheduling overhead for a list of hundreds. Debouncing is only worth the complexity when you're hitting the network, not when you're filtering in memory.

**Delegated events are a feature. The rare miss case is when you build infrastructure (test harnesses, widget frameworks, iframes).** For app code, write `onclick={handler}` and move on.

**ARIA attributes are just attributes.** `role="listbox"`, `aria-activedescendant={...}`, `aria-selected={...}` — all expression-enabled, all follow the nullish-elision rule (`null` / `undefined` drop the attribute). No special syntax. Your palette should be a listbox with an active descendant.

## Build challenge

The `starter/` ships the shell: the routes, layout, the static command catalog, the CSS, the pretend "dashboard" behind the palette. Your job is to make the palette *work*. Six stubbed pieces, marked `// Lesson 05 build:`.

### Acceptance criteria

1. **Toggle.** `⌘K` (or `Ctrl+K`) opens the palette from anywhere on the page. Same shortcut while open closes it. `Escape` closes it. Clicking the backdrop closes it. The main dashboard button also opens it. All four paths work.

2. **Auto-focus.** When the palette opens, the search input is focused within the same tick — no user action required.

3. **Filter.** Typing in the search input narrows the visible commands by case-insensitive substring match against the label. The header shows "*N of total* commands" live.

4. **Empty state.** If nothing matches, the list is replaced with "No commands match `<query>`."

5. **Arrow navigation.** `↑` and `↓` move `activeIndex` between visible results. `↑` at index 0 wraps to last; `↓` at last wraps to 0. The active item has visually obvious highlight (via `aria-selected={true}` styling) and `aria-selected={true}` in the DOM.

6. **Execute.** `Enter` runs the command at `activeIndex`. Click on a row also runs. "Run" means: set `lastAction` to a human-readable string describing it, and close the palette. The "Last action" banner updates.

7. **Reset on close or query change.** Closing the palette clears the `query` and resets `activeIndex` to 0. Changing `query` resets `activeIndex` to 0 (otherwise the highlight could point at nothing).

### Success looks like

```sh
pnpm --filter @course/lesson-05-starter dev
# visit the URL, press ⌘K / Ctrl+K, type "the", arrow down, Enter

pnpm --filter @course/lesson-05-starter check
# 0 errors, 0 warnings

pnpm --filter @course/lesson-05-solution check
# 0 errors, 0 warnings
```

## Self-check

<details>
<summary>1. Why does <code>⌘K</code> need <code>event.preventDefault()</code> but <code>Escape</code> doesn't?</summary>

Browsers bind `⌘K` / `Ctrl+K` to "focus the location bar" (Chrome, Firefox, Safari). Without `preventDefault()`, your handler still runs, but the browser also steals focus, so your palette opens and then immediately loses focus. `Escape` has no default browser binding in this context, so no `preventDefault` is needed.

General rule: `preventDefault()` for any shortcut that competes with a browser default. When in doubt, call it — the cost is zero and it prevents the "works on my machine but not in Firefox" class of bug.
</details>

<details>
<summary>2. You write <code>&lt;button onclick={runCommand(cmd)}&gt;</code> and the command runs immediately on render, not on click. Why?</summary>

You called the function. `onclick={runCommand(cmd)}` evaluates `runCommand(cmd)` at render time and assigns its *return value* as the click handler. If `runCommand` returns `undefined`, the button has no handler at all. The fix is to pass a function:

```svelte
<button onclick={() => runCommand(cmd)}>...</button>
```

Or, if the handler takes the event itself and no extra args, use the shorthand:

```svelte
<button {onclick}>...</button>
```

The tell in a review: parentheses right after the function name inside a handler attribute. Almost always a bug.
</details>

<details>
<summary>3. You <code>bind:this={inputEl}</code> on the input and try to call <code>inputEl.focus()</code> in the top-level script. <code>inputEl</code> is <code>undefined</code>. Why?</summary>

`bind:this` assigns the element *after mount*. Top-level script runs *during* component initialization — before the DOM exists. Anything that reads `inputEl` at that moment gets `undefined`.

The fix is to read it in a context that runs after mount: an `$effect`, an event handler, or `$effect.pre` (if you need it before paint). In this lesson, `$effect(() => { if (isOpen) inputEl?.focus(); })` is the pattern — it runs when `isOpen` flips to true, and by that time the input is mounted.
</details>

## Links

- [Svelte docs — Basic markup](https://svelte.dev/docs/svelte/basic-markup)
- [Svelte docs — `bind:`](https://svelte.dev/docs/svelte/bind)
- [Svelte docs — `<svelte:window>`](https://svelte.dev/docs/svelte/svelte-window)
- [Svelte docs — `{#each}`](https://svelte.dev/docs/svelte/each)
- [Svelte docs — `{#if}`](https://svelte.dev/docs/svelte/if)

Next: [Lesson 06 — Control flow blocks](../lesson-06-control-flow/README.md). You'll build a Kanban board — `{#each}` keyed reordering, `{#if}` empty states, `{#snippet}` cards.
