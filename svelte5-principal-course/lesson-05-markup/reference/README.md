# Lesson 05 — Reference

Three small `.svelte` files that isolate the trickier corners of the lesson. None are referenced from the project's pages; copy any of them into a route and `pnpm --filter @course/lesson-05-starter dev` to play with it.

| File | What it isolates |
|---|---|
| [`BooleanAttributes.svelte`](./BooleanAttributes.svelte) | How Svelte handles boolean attributes (`disabled`, `hidden`, `open`) — they become *present or absent*, not `="true"`/`="false"`. Plus the `aria-current={expr ?? undefined}` idiom for "set or omit." |
| [`SvelteWindowKeydown.svelte`](./SvelteWindowKeydown.svelte) | A minimal `<svelte:window onkeydown={...}>` global key recorder. Shows `e.key`, `e.metaKey`, `e.ctrlKey`, etc. Also shows the auto-cleanup contract: no manual `removeEventListener` needed. |
| [`EventSyntaxMigration.svelte`](./EventSyntaxMigration.svelte) | The Svelte 4 → 5 event migration: `on:click` becomes `onclick`, and `|preventDefault` becomes `e.preventDefault()` inside the handler. Demonstrated with a real form. |

## Cumulative-syntax thread

These files use only `$state` (Lesson 01). The point is to isolate **markup and event syntax** without the noise of derived/effect/inspect. The Command Palette in the lesson layers all four Part-1 runes on top of these primitives.
