# Lesson 02 — Deep dive

Three short reference files that extend the `$derived` lesson without changing it.

| File | What it teaches | Runes used |
|---|---|---|
| [`DerivedLaziness.svelte`](./DerivedLaziness.svelte) | A derived value is not computed when its deps change — it's computed when something READS it. Proven with a "runs" counter that only ticks when the value is on screen. | `$state` (L01) + `$derived` (L02) |
| [`DerivedOverrideOptimistic.svelte`](./DerivedOverrideOptimistic.svelte) | Since 5.25, a `let`-declared `$derived` can be reassigned. That's the cleanest shape for optimistic UI: same variable for both the server truth and the optimistic override, with automatic rollback when the truth catches up. | `$state` (L01) + `$derived` (L02) |
| [`DerivedReturningObjects.svelte`](./DerivedReturningObjects.svelte) | The most common performance footgun in $derived: returning a fresh `{...}` literal makes the equality short-circuit fail, so every downstream consumer re-runs. Demonstrated with two parallel deriveds you can click. | `$state` (L01) + `$derived` (L02) + `$effect` (L03 — purely as an observer to count re-runs) |

## What's cumulative

The third file reaches forward into `$effect` only as a *measurement tool* — to observe how often a downstream consumer fires. The "real" pattern (a derived returning a primitive) needs only `$state` and `$derived`. We will switch the observation tool to `$inspect` after Lesson 04, which is the more idiomatic debug instrument.

## How to use these files

The `starter/` and `solution/` packages stay as they are (locked by `RESUME.md`). To run one of these deep-dive files:

1. Copy it into `starter/src/routes/deep-dive/+page.svelte` (or any other route).
2. `pnpm --filter @course/lesson-02-starter dev` and visit the route.

Nothing here is referenced by the existing pages, so `pnpm check` is unaffected.
