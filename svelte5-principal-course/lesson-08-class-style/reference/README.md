# Lesson 08 reference — edge cases

Four standalone components demonstrating the `class={...}` / `style:` patterns that matter most in production.

These are not wired into the lesson's SvelteKit app. Drop any of them into the [Svelte Playground](https://svelte.dev/playground) to run.

| File | What it shows | Why it matters |
|---|---|---|
| `ClassObjectForm.svelte` | `class={{ btn: true, primary, disabled, loading }}` | The idiomatic multi-class toggle. Reads like a data structure; Svelte stringifies via clsx. |
| `ClassArrayWithProps.svelte` | `class={['btn', primary && 'primary', props.class]}` | Array form composes cleanly with a parent-forwarded `class` prop. The pattern every design-system Button uses. |
| `StyleCustomProperty.svelte` | `style:--accent={value}` read by children via `var(--accent)` | How theming actually works in Svelte. No prop drilling; one wrapper sets the token, every descendant reads it. |
| `StyleImportant.svelte` | `style:color\|important={value}` | Beats a stylesheet `!important`. Rarely needed; when it is, this is the syntax. |
