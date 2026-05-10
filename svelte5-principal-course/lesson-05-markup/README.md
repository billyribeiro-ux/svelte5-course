# Lesson 05 — Markup, attributes, events

> **Verified against:** Svelte 5.55.4, SvelteKit 2.57.1, on 2026-05-10.
> Official docs: <https://svelte.dev/docs/svelte/basic-markup> · <https://svelte.dev/docs/svelte/svelte-window>

## The project you're building

A **keyboard-driven command palette** — the ⌘K / Ctrl+K overlay you've used in VS Code, GitHub, Linear, Notion. Tap a shortcut, a centred dialog appears, you type to filter a list of actions ("Go to dashboard", "Toggle theme", "Sign out"), arrow keys move a selection, Enter runs it, Escape closes.

It's a small UI by line count and a *huge* UI for what it teaches: element attributes, every category of event handler, modifier keys, focus management, keyboard navigation, click-outside dismiss, conditional rendering, keyed lists. You will write this thing for real at a job, probably within your first six months.

**Features**:

- ⌘K (Mac) / Ctrl+K (other) toggles the palette open and closed.
- Escape closes it. Clicking outside the panel closes it.
- The input is auto-focused the moment the palette opens.
- Typing filters the command list (case-insensitive substring match).
- ↑ / ↓ move the highlighted row. The highlight wraps at the ends.
- Enter runs the highlighted command. Click on a row also runs it.
- Recently used commands rise to the top of the list (most-recent first).
- `recent` is persisted to `localStorage` and survives a reload.
- A traced derived in the filter pipeline so you can see *which* dependency caused the recompute in DevTools.

## What this lesson teaches

This is the first lesson in Part 2 ("Template mastery"). You already know how Svelte's reactivity works (`$state`, `$derived`, `$effect`, `$inspect` — Lessons 01–04). What you don't yet know is how to wire that reactivity to *the user*: HTML markup, attributes, and DOM events.

**The five things you take away from this lesson**, framed around how the palette uses them:

1. **Element attributes accept JavaScript expressions** in `{...}` braces. The palette uses this for `disabled={!command}`, `aria-current={i === selectedIndex}`, and the curly-brace shorthand `{open}` for `open={open}`. The same syntax for both — attributes are just expressions.
2. **Event handlers are attributes** that start with `on`. `onclick`, `onkeydown`, `oninput` — no special `on:` prefix the way Svelte 4 did. You can pass a function reference (`onclick={runCommand}`) or an arrow (`onclick={() => runCommand(cmd)}`). The shorthand `{onclick}` works just like for any other attribute.
3. **Modifier keys live on the event object**, not in the markup. `e.metaKey`, `e.ctrlKey`, `e.shiftKey`, `e.key`. No more `on:keydown|preventDefault|stopPropagation` chains from Svelte 4 — call `e.preventDefault()` in the handler body.
4. **`<svelte:window>` adds global listeners** that clean up automatically when the component unmounts. The palette uses this for the ⌘K shortcut, since that listener has to fire even when nothing is focused.
5. **Focus management is one short `$effect`**. When `open` flips to `true`, focus the input. When it flips back to `false`, focus the trigger button. The cleanup function returns the focus correctly.

Every rune from Part 1 reappears: `$state` for the eleven (yes, eleven) pieces of state, `$derived` for two filter steps, `$effect` for focus + scroll-into-view + localStorage persist, `$inspect.trace` to make the derived's recomputations legible.

## Concept

### Mental model

> **In Svelte 5, everything visible in the template is either a tag, an attribute, an expression, or a special block.** Event handlers are attributes whose name happens to start with `on`. There's no other category to learn.

That sentence, internalised, makes 90% of Svelte template work feel obvious. The remaining 10% is conventions around accessibility (aria-*, role, tabindex) and a handful of Svelte-specific blocks like `{#if}`, `{#each}`, `{@render}`.

### The five rules

**Rule 1 — Attributes accept any expression in `{...}`.**

```svelte
<button disabled={!command}>Run</button>
<div aria-current={i === selectedIndex ? 'true' : undefined}>...</div>
<a href="/{slug}">link</a>     <!-- string interpolation -->
<input value={query} />        <!-- expression -->
```

Boolean attributes (`disabled`, `hidden`, `open`) become present-or-absent based on truthiness. All other attributes drop off the element when the value is `null` or `undefined`. That's why `aria-current={i === selectedIndex ? 'true' : undefined}` is the idiom for "set the attribute or omit it entirely."

**Rule 2 — Event handlers are attributes that start with `on`.**

```svelte
<button onclick={runCommand}>Run</button>
<button onclick={() => runCommand(cmd)}>Run {cmd.title}</button>
<input oninput={(e) => (query = (e.target as HTMLInputElement).value)} />
```

The value is the function to call. Inline arrow when you need to close over local state; named function reference when you don't. Both work. Same shorthand applies: `<button {onclick}>` is the same as `<button onclick={onclick}>`.

**Rule 3 — There are no event modifiers.** No `|preventDefault`, no `|stopPropagation`. Do the work in the handler body. This is more verbose but type-safe and easier to debug.

```svelte
<form onsubmit={(e) => {
  e.preventDefault();
  submit();
}}>...</form>
```

**Rule 4 — Modifier keys come from the event.**

```svelte
<svelte:window onkeydown={(e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    open = !open;
  }
}} />
```

`e.metaKey` is Cmd on macOS. `e.ctrlKey` is Ctrl on other platforms. Test both — that's the cross-platform shortcut idiom. `e.key` is the key value as a string (`'k'`, `'ArrowDown'`, `'Escape'`, `'Enter'`).

**Rule 5 — `<svelte:window>` and `<svelte:document>` are for global listeners only.** Anything that needs to fire regardless of focus (keyboard shortcuts, scroll position, online/offline) goes here. Anything tied to a specific element goes on the element. Don't reach for `<svelte:window>` when an `onkeydown` on a focused input would do.

### Worked example — the ⌘K shortcut

```svelte
<script lang="ts">
  let open = $state(false);
</script>

<svelte:window onkeydown={(e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    open = !open;
  }
  if (e.key === 'Escape' && open) {
    open = false;
  }
}} />

{#if open}
  <div role="dialog">...</div>
{/if}
```

Two things to notice. (a) The listener is on `<svelte:window>` because the user can be focused anywhere on the page. (b) `e.preventDefault()` stops the browser's default ⌘K behaviour (browser address bar focus in some setups).

### Worked example — focus management as an `$effect`

```svelte
<script lang="ts">
  let open = $state(false);
  let inputRef = $state<HTMLInputElement | undefined>(undefined);

  $effect(() => {
    if (open && inputRef) {
      inputRef.focus();
    }
  });
</script>

<svelte:window onkeydown={toggle} />

{#if open}
  <input bind:this={inputRef} />
{/if}
```

The effect re-runs whenever `open` or `inputRef` changes. When `open` flips to true, `inputRef` is briefly `undefined` (the input is not yet mounted), then the `{#if}` mounts it, the binding fires, the effect re-runs with `inputRef` defined, and `inputRef.focus()` runs.

### Worked example — keyed `{#each}` with selected highlight

```svelte
<ul role="listbox">
  {#each visibleCommands as cmd, i (cmd.id)}
    <li
      role="option"
      aria-selected={i === selectedIndex}
      class:selected={i === selectedIndex}
      onmousemove={() => (selectedIndex = i)}
      onclick={() => run(cmd)}
    >
      {cmd.title}
    </li>
  {/each}
</ul>
```

The `(cmd.id)` key tells Svelte to preserve DOM nodes by command identity. That's what makes the highlight feel "sticky" when commands re-order — without the key, Svelte would re-render rows in place and your selection would drift.

`onmousemove` (not `onmouseenter`) is the palette idiom: even if the user is just gliding the cursor across the list, the highlight should follow. `aria-selected` makes it accessible.

## Common mistakes

| Mistake | Why it bites | Fix |
|---|---|---|
| Using Svelte 4 syntax: `on:click={handler}` | Errors in Svelte 5 | Use `onclick={handler}`. No colon. |
| `onclick={() => runCommand}` (no call parens) | Returns the function reference, then throws it away. Nothing runs. | Either `onclick={runCommand}` or `onclick={() => runCommand()}`. |
| Adding `<svelte:window>` for an event that only matters inside the palette | The listener fires globally, including when the palette is closed. Wasteful and can collide. | Put the listener on the element that should own it. |
| Forgetting `e.preventDefault()` on the ⌘K shortcut | Some browsers / setups still focus the address bar | Call it explicitly inside the handler. |
| Forgetting the `(cmd.id)` key on `{#each}` | The selection highlight drifts when commands re-order. Animations get weird. | Always key your each block when items can re-order. |
| Auto-focusing without an `$effect` | Auto-focus on mount works once; re-opening the same component doesn't re-focus. | Run the focus in an `$effect` that depends on `open`. |
| Calling `inputRef.focus()` before the mount | `inputRef` is `undefined` until the binding fires. Throws. | The `$effect` is the right place — it runs after the DOM is mounted. The `{#if open}` block delays mount, so the binding pattern is automatic. |

## PE lens — how a staff engineer would think about this

**The whole palette is one component, not five.** A common mistake is to extract `Trigger`, `Dialog`, `Backdrop`, `Input`, and `List` before the feature is even working. Don't. The hard parts (focus management, keyboard nav, recent-rank) are *cross-cutting*. They want to share state. Extract a `CommandList` only when you have a second use of it — never before.

**Use `<svelte:window>` ruthlessly for ⌘K and Escape**, and *never* for anything else in this lesson. The palette is the canonical example of "global shortcut" — anything narrower belongs on the element. If you find yourself reaching for `<svelte:window>` to bind some innerWidth, it's a smell that you might want a `ResizeObserver` (a Lesson 26 attachment).

**Mouse selection via `onmousemove`, not `onmouseenter`.** Linear, Raycast, and VS Code all do this. Mouseenter has a quirk where if the cursor enters a row that's *already* under it (e.g. after a list re-order), no event fires. Mousemove fires continuously, so the highlight tracks even on weird re-renders.

**Keep keyboard nav inside the input's `onkeydown`, not on the listbox.** The input is focused; the listbox is not. If you put the handler on the `<ul>`, you need to also focus it on every state change, which is annoying. Handle keys in the input handler and let it mutate `selectedIndex`.

**Persist `recent`, not the whole state.** Resist the urge to persist `open`, `query`, `selectedIndex` — those are session-only. Only `recent` (the IDs the user has actually run) deserves `localStorage`. This is the L03 `04-persist` pattern, refined: persist the *outcome*, not the *UI*.

## Build challenge

The `starter/` ships the full shell:

- The palette is invisible until you press ⌘K.
- The trigger button is wired.
- The command list, command type, and Run handler are written.
- CSS is done — including the highlighted row state.

What's **stubbed for you**:

1. The ⌘K and Escape global shortcut on `<svelte:window>`.
2. Focus the input on open, return focus to the trigger on close.
3. Click-outside dismiss.
4. Arrow-key keyboard nav (↑ / ↓ with wrap, Enter to run).
5. The `recent` ranking — recently used IDs to the top.
6. The `localStorage` persistence (read on mount via `untrack`, write on every change).
7. A `$inspect.trace('rankedCommands')` in the ranking derived.

The work is concentrated in `src/routes/+page.svelte`. Search for `// Lesson 05 build:` comments — each one is a numbered step.

### Success looks like

```sh
pnpm --filter @course/lesson-05-starter dev
```

Then in the browser:

- ⌘K (or Ctrl+K) opens the palette.
- The search input is focused.
- Typing filters the list.
- ↑ / ↓ moves the highlight, wrapping at the ends.
- Enter runs the highlighted command (it just `console.log`s — that is fine).
- Click outside or press Escape closes.
- After running a command, re-open the palette: that command is at the top.
- Reload the page: the recent order survives.
- DevTools console: when you type, the `rankedCommands` trace tells you which dep changed.

```sh
pnpm --filter @course/lesson-05-starter check
pnpm --filter @course/lesson-05-solution check
# both: 0 errors, 0 warnings
```

## Self-check

<details>
<summary>1. Why is the ⌘K shortcut on <code>&lt;svelte:window&gt;</code> and not on the trigger button?</summary>

The user can press ⌘K from anywhere on the page — they're not necessarily focused on a button. A handler on the button only fires when the button is focused, which is unusable. `<svelte:window>` registers the listener on the `window` object so it fires regardless of focus, and Svelte handles cleanup automatically when the component unmounts. That's the entire reason `<svelte:window>` exists: things that have to listen globally without the boilerplate of a manual `addEventListener` + `removeEventListener` in mount/cleanup.
</details>

<details>
<summary>2. Why do you key the each block with <code>(cmd.id)</code>?</summary>

When `rankedCommands` reorders (e.g. you just ran "Toggle theme" and it jumps to the top), Svelte needs to know *which* row is which. Without a key, Svelte assumes positional identity — it keeps the DOM nodes in place and just updates their text. That's fast but visually confusing: the highlight stays on the row in the same position even though the underlying command changed. With `(cmd.id)`, Svelte moves the DOM nodes to match the new order, and the highlight tracks the *command* — exactly what the user expects.
</details>

<details>
<summary>3. The focus effect runs every time <code>open</code> changes. Why does it not infinitely re-fire?</summary>

The effect reads `open` and `inputRef`. Calling `inputRef.focus()` is a DOM side effect — it does not mutate any `$state` value, so it doesn't dirty any dependency, so the effect doesn't re-schedule. The dependency graph is `open` → `effect` → `DOM`. There's no loop back to `open`, so the effect runs once per state change and stops.
</details>

## Links

- [Svelte docs — Basic markup](https://svelte.dev/docs/svelte/basic-markup)
- [Svelte docs — `<svelte:window>`](https://svelte.dev/docs/svelte/svelte-window)
- [Svelte docs — `{#if}`](https://svelte.dev/docs/svelte/if)
- [Svelte docs — `{#each}`](https://svelte.dev/docs/svelte/each)
- [Svelte docs — `bind:`](https://svelte.dev/docs/svelte/bind)
- [Svelte 5 migration guide — event handlers](https://svelte.dev/docs/svelte/v5-migration-guide#Event-changes)

Next: [Lesson 06 — Control flow blocks](../lesson-06-control-flow/README.md). The Kanban board project — `{#each}` keyed reordering, `{#if}` empty states, `{#snippet}` cards.
