# Lesson 01 — Deep dive

These three files extend the lesson without changing it. Read them after you have completed all four challenges (`/01-counter` through `/04-module`). Each is a standalone `.svelte` you can paste into a route to play with.

| File | What it teaches |
|---|---|
| [`SvelteSetAndMap.svelte`](./SvelteSetAndMap.svelte) | Why `$state(new Set())` does NOT make a Set reactive, and how `SvelteSet` / `SvelteMap` from `svelte/reactivity` fix it. |
| [`StateRunesInClasses.svelte`](./StateRunesInClasses.svelte) | Three rules for `$state` inside a class: opt-in proxification, arrow-field methods for stable `this`, and getters as "computed views" over reactive fields. |
| [`module-counter.svelte.ts`](./module-counter.svelte.ts) + [`ModuleStatePatterns.svelte`](./ModuleStatePatterns.svelte) | Two ways to share `$state` across files: export an object and mutate its props (Pattern A) vs export getter/setter functions (Pattern B). Side-by-side comparison. |

## The single thread connecting all three

Every file in this folder uses **only `$state`** — the rune you already know. The deepening is about *where* and *how* you reach for it: collections, classes, modules. No new runes are introduced; we are not in Lesson 02 yet.

## How to use these files

The lesson packages (`starter/` and `solution/`) are pinned by the lock in `RESUME.md` and stay as they are. To run a deep-dive file:

1. Copy one of these `.svelte` files into `starter/src/routes/deep-dive/+page.svelte` (or any route you want).
2. If you copied `ModuleStatePatterns.svelte`, also copy `module-counter.svelte.ts` next to it.
3. `pnpm --filter @course/lesson-01-starter dev` and visit the route.

Nothing in this folder is referenced by the existing pages, so it does not affect `pnpm check`.
