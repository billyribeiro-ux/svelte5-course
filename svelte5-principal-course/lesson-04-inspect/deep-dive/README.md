# Lesson 04 — Deep dive

Three short reference files that extend the `$inspect` lesson without changing it.

| File | What it teaches | Runes / features used |
|---|---|---|
| [`InspectVsDebugTag.svelte`](./InspectVsDebugTag.svelte) | The pair: `$inspect(value)` in `<script>` logs every change; `{@debug value}` in markup *pauses* on every change when DevTools is open. Side by side on the same state — two tools, two intents. | `$state` (L01) + `$inspect` (L04) + `{@debug}` |
| [`InspectMultipleValues.svelte`](./InspectMultipleValues.svelte) | `$inspect(a, b, c).with((type, a, b, c) => ...)` watches all three at once and gives you all values in the callback. The right tool for bugs about *combinations* of state, not single variables. | `$state` (L01) + `$inspect` (L04) |
| [`InspectTraceWithLabel.svelte`](./InspectTraceWithLabel.svelte) | `$inspect.trace('label')` labels traced functions in the console. Three deriveds + one effect, each with their own label, against a shared price/qty/discount calc — the canonical Part-1 grand finale. | `$state` (L01) + `$derived` (L02) + `$effect` (L03) + `$inspect.trace` (L04) |

## What's cumulative

The third file deliberately uses **all four runes from Part 1 together**: a shopping calc derived from price × qty, with a discount, a chained derived (`saved`, `total`), and an effect that logs when the total changes — each labeled with `$inspect.trace`. That's the entire surface area of Part 1 in one file. If you can read it cold, you've earned Part 1.

## How to use these files

The `starter/` and `solution/` packages stay as they are (locked by `RESUME.md`). To run one of these deep-dive files:

1. Copy it into `starter/src/routes/deep-dive/+page.svelte` (or any other route).
2. `pnpm --filter @course/lesson-04-starter dev` and visit the route.

Nothing here is referenced by the existing pages, so `pnpm check` is unaffected.
