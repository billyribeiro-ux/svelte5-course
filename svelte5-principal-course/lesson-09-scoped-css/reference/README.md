# Lesson 09 reference — edge cases

Three standalone components that isolate the less-obvious parts of Svelte's CSS scoping.

These are not wired into the lesson's SvelteKit app. Drop any of them into the [Svelte Playground](https://svelte.dev/playground) to run.

| File | What it shows | Why it matters |
|---|---|---|
| `ScopedIdenticalClasses.svelte` | Two elements sharing a `.card` class; styles apply only to this component | Demonstrates per-file hashing. The fundamental reason Svelte's CSS model works. |
| `GlobalBreakout.svelte` | `.prose :global(h1)` styling content from `{@html}` | The textbook scoped-outer, global-inner pattern. Confine `:global` to a parent you own. |
| `LogicalProperties.svelte` | RTL flip with `padding-inline-*`, `border-inline-*` | A real reason to use logical properties. One checkbox, zero rewrites. |
