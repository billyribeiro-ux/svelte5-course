# Lesson 01 — reference examples

Four standalone `.svelte` files. Each is a self-contained demonstration of one edge case or pattern that the main lesson touches but doesn't drill in.

Copy any of them into the `starter/` project's `src/routes/` folder (rename to `+page.svelte` inside a new route folder, e.g. `starter/src/routes/ref-raw/+page.svelte`) to run them live.

## Files

| File | What it shows |
|---|---|
| `StateRawPerformance.svelte` | `$state.raw` — skips the proxy, requires full reassignment, worthwhile for large collections. |
| `StateSnapshot.svelte` | `$state.snapshot(...)` and how it interacts with `structuredClone`, `JSON.stringify`, and `console.log`. |
| `PassingStateToFunctions.svelte` | Why you can't pass a `$state` primitive to a function and expect live updates — and the getter-thunk pattern that fixes it. |
| `DestructuringGotcha.svelte` | Destructuring reactive objects produces frozen locals. Read through the proxy instead. |

All four are autofixer-clean against Svelte 5.55.4.
