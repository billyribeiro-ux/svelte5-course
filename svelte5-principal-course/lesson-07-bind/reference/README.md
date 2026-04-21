# Lesson 07 reference — edge cases

Four standalone components demonstrating the trickier `bind:` patterns in isolation.

These are not wired into the lesson's SvelteKit app. Drop any of them into the [Svelte Playground](https://svelte.dev/playground) to run.

| File | What it shows | Why it matters |
|---|---|---|
| `FunctionBindingClamp.svelte` | `bind:value={get, set}` with clamping | Function bindings are for NORMALIZATION (trim, clamp, uppercase), not validation. Setter runs every keystroke. |
| `IndeterminateParent.svelte` | Parent/child checkbox with `bind:indeterminate` | `indeterminate` is a plain attribute driven by `$derived`. The parent's `checked` uses a function binding to write all-or-nothing. |
| `DimensionBinding.svelte` | `bind:clientWidth` / `bind:clientHeight` on a resizable textarea | Readonly bindings backed by a `ResizeObserver`. Zero boilerplate vs writing one by hand. |
| `FileInputBasics.svelte` | `bind:files` + clearing + iterating a `FileList` | `FileList` is not an array. Clear via `new DataTransfer().files`. Iterate via `Array.from(files)`. |
