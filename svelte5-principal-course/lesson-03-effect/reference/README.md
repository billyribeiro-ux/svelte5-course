# Lesson 03 — reference

Standalone `.svelte` files you read, not run. Each one isolates an edge case you will hit eventually. Skim them after finishing the build challenges.

| File | What it shows |
|---|---|
| `EffectVsDerivedAntipattern.svelte` | The wrong-vs-right way to compute a value. Do not use `$effect` to sync state. |
| `AsyncReadsNotTracked.svelte` | Reads inside `setTimeout` / `await` are not tracked. Cache synchronously first. |
| `ObjectIdentityTracking.svelte` | Effect on `obj` vs `obj.value` — identity vs property. |
| `EffectPreVsEffectTiming.svelte` | `$effect.pre` runs before DOM update; `$effect` after. |
