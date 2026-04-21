# Lesson 04 — reference

Standalone `.svelte` files you read, not run. Each isolates one $inspect edge case you will hit in real debugging. Skim after finishing the build challenges.

| File | What it shows |
|---|---|
| `InspectIsDeep.svelte` | `$inspect(obj)` fires on nested-property mutation — you do not need to inspect every field. |
| `InspectWithType.svelte` | The `type` argument in `.with((type, value) => ...)`: `'init'` vs `'update'`. |
| `InspectStripsInProd.svelte` | `$inspect` / `$inspect.trace` are dev-only. Production builds remove them entirely — safe to leave in. |
| `InspectDoesNotFireOnSameValue.svelte` | Assigning the same primitive value does not re-fire `$inspect` — referential equality short-circuit. |
