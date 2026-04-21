# Lesson 13 reference — edge cases

| File | What it shows | Why it matters |
|---|---|---|
| `BindableWithFallback.svelte` | `$bindable('default')` — optional bind with a fallback | Parents can omit the `bind:` and get the fallback; the component still works standalone. |
