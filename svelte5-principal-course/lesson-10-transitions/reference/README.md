# Lesson 10 reference — edge cases

Four standalone components that isolate the trickier transition patterns.

These are not wired into the lesson's SvelteKit app. Drop any of them into the [Svelte Playground](https://svelte.dev/playground) to run.

| File | What it shows | Why it matters |
|---|---|---|
| `InOutSeparate.svelte` | `in:fly` + `out:fade` — asymmetric enter and exit | The cleanest case for splitting `transition:` into `in:` / `out:`. |
| `CrossfadeHelper.svelte` | `crossfade({ duration })` → `send` / `receive` directives between two lists | Items appear to fly from one list to the other. Shared-element transitions without a router. |
| `AnimateFlipReorder.svelte` | `animate:flip` inside a keyed `{#each}` | Smooth reorder animations. Zero motion on add/remove — only when the index changes. |
| `ReducedMotion.svelte` | `prefersReducedMotion.current` → `duration = 0` | The accessibility line everyone forgets. One `$derived` covers it for every transition. |
