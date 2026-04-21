# Lesson 06 reference — edge cases

Four tiny standalone components. Each isolates one subtle thing about the control-flow blocks that matters in real code.

These are not wired into the lesson's SvelteKit app. Drop any of them into the [Svelte Playground](https://svelte.dev/playground) to run.

| File | What it shows | Why it matters |
|---|---|---|
| `KeyedVsUnkeyedEach.svelte` | Focus / cursor drift in unkeyed each, preserved in keyed | The single concrete reason to always key your each blocks. |
| `EachElse.svelte` | `{:else}` on `{#each}` for empty state | Kills the duplicate-logic pattern of a separate `{#if items.length === 0}`. |
| `SnippetRecursion.svelte` | A snippet rendering itself to walk a tree | Folders, comment threads, menus — all tree-shaped UIs fit this pattern. |
| `KeyBlockForceRemount.svelte` | `{#key counter}` to reset a subtree | Legit uses: replay transitions, reset a form after save. Not for fixing reactivity. |
