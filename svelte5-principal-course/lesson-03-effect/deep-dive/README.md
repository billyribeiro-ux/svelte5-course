# Lesson 03 — Deep dive

Three short reference files that extend the `$effect` lesson without changing it.

| File | What it teaches | Runes used |
|---|---|---|
| [`EffectRoot.svelte`](./EffectRoot.svelte) | `$effect.root()` — the escape hatch for effects that need to outlive the component that created them. Returns a manual `destroy()` function. Use for tickers, focus-trap managers, websocket bootstrap. | `$state` (L01) + `$effect` (L03) + `$effect.root` |
| [`EffectConditionalDeps.svelte`](./EffectConditionalDeps.svelte) | An effect's dependencies are whichever state it read on its *last run*. Conditional branches change the dep set. A run-counter shows that writes to a state value the effect did not read are ignored. | `$state` (L01) + `$effect` (L03) |
| [`EffectBatchedRuns.svelte`](./EffectBatchedRuns.svelte) | Effects are batched in a microtask. Multiple synchronous state changes coalesce into one effect run; the same writes spread across separate timeouts produce one run each. Click both buttons and compare. | `$state` (L01) + `$effect` (L03) |

## What's cumulative

The third file uses the same run-counter diagnostic shape introduced in the L02 deep-dive (`DerivedReturningObjects.svelte`). The pattern transfers: when you want to know "did this thing run, and how many times?", a `$state(0)` increment inside the body is the right answer.

## How to use these files

The `starter/` and `solution/` packages stay as they are (locked by `RESUME.md`). To run one of these deep-dive files:

1. Copy it into `starter/src/routes/deep-dive/+page.svelte` (or any other route).
2. `pnpm --filter @course/lesson-03-starter dev` and visit the route.

Nothing here is referenced by the existing pages, so `pnpm check` is unaffected.
