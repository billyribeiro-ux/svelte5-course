# Lesson 02 — reference

Standalone `.svelte` files you read, not run. Each one isolates an edge case you will hit eventually. Skim them after finishing the build challenges.

| File | What it shows |
|---|---|
| `DerivedByVsExpression.svelte` | The two forms of `$derived` side-by-side. |
| `DerivedDependencies.svelte` | Conditional reads change which deps are tracked. |
| `PushPullReferentialEquality.svelte` | Why `$derived(count > 10)` re-renders only at the threshold flip. |
| `DerivedFromDerived.svelte` | Chaining deriveds — a little dependency graph. |
