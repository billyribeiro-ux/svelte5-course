# Lesson 05 reference — edge cases

Four tiny standalone components. Each isolates one subtle thing about markup / attributes / events that bit someone on a real codebase at 3 a.m.

These are not wired into the lesson's SvelteKit app. They live here as annotated reading material. Drop any of them into the [Svelte Playground](https://svelte.dev/playground) to run.

| File | What it shows | Why it matters |
|---|---|---|
| `HandlerCalledVsReferenced.svelte` | `onclick={fn}` vs `onclick={fn()}` | The #1 event-handler bug. The parens call the function at render time. |
| `SpreadAttributeOrder.svelte` | Explicit attribute wins over spread if declared later | Same rule as JS object spread. Critical for component override patterns. |
| `BooleanAttributeFootgun.svelte` | `disabled={'false'}` renders a *disabled* button | HTML booleans follow truthy/falsy; strings are always truthy. |
| `CrossPlatformShortcut.svelte` | `⌘S` on macOS, `Ctrl+S` on Windows/Linux via `metaKey \|\| ctrlKey` | Single-key-family cross-platform shortcut handling. Don't forget `preventDefault()`. |
