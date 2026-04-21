# Lesson 08 — `class:` and `style:`

## The project you're building

**A theme customizer.** Slide the accent color's OKLCH channels, pick a surface mode (light/dark), a corner-radius scale, and a font-size scale. A preview panel of mock UI — buttons, a card, an input, a pill row, a toast — re-styles live. At the bottom, a CSS export block shows the exact `:root { --accent: … }` you'd paste into a real design system. Four preset buttons (Red / Blue / Green / Violet) snap the accent to curated values.

What it does:
- **Accent editor** — three range inputs for OKLCH L (lightness %), C (chroma 0–0.4), H (hue 0–360). A live swatch shows the result.
- **Mode toggle** — two-state switch: light vs dark. Flips a class on the preview root; every preview component cascades off `var(--…)` tokens.
- **Radius scale** — select: `sharp` (0) / `soft` (`0.5rem`) / `pill` (`999px`). Drives `--radius`.
- **Font scale** — radio group: `compact` / `normal` / `large` / `xlarge`. Drives `--scale`, which the preview multiplies against its base font size.
- **Preview pane** — a small dashboard mock: title, two buttons, an input, a checkbox, a row of pills, a toast notification. Each uses `var(--accent)`, `var(--radius)`, etc.
- **Copy CSS** — a button that serialises the current tokens into a `:root { … }` block and writes it to the clipboard.
- **Presets** — four chips that snap the accent L/C/H to pre-baked values.
- **Reset** — one button, back to defaults.

Why this project: the `class:` directive and the `style:` directive are small on their own — a theme customizer is where they *combine*. The `style:` directive for CSS custom properties is the cleanest way to thread a token down through the style tree; once you've done it on a real design-system preview, writing `style="--accent: …;"` strings by hand will feel ridiculous. The `class:` and `class={{ … }}` patterns show up in every component you write — and this is the project where they stop being cargo-culted and start being deliberate.

## What this lesson teaches

Three small syntaxes and one slightly bigger idea:

1. **`class:x={cond}`** — the directive form. Adds class `x` iff `cond` is truthy.
2. **`class={{ x: cond, y: other }}`** — the object form. Keys are class names; truthy values include them. Since Svelte 5.16.
3. **`class={['base', cond && 'extra', props.class]}`** — the array form. Strings are included as-is; falsy values drop out; arrays flatten. Perfect for wrapping a parent `class` prop.
4. **`style:color={value}` and `style:--token={value}`** — per-property bindings. No string concatenation, no escape hatches. Supports `|important`, and (critically) works with CSS custom properties.

One *slightly bigger* idea: **the `style:` directive + CSS custom properties is how you build themeable primitives in Svelte.** Don't write per-component prop-plumbing for colours. Write styles that read from `var(--accent)`, and inject the value higher up via `style:--accent={...}`. Lift the knob once, not per component.

Compounds from earlier lessons:
- **$state** × 7 — the knob values.
- **$derived** — the computed accent colour string, the radius / scale rem values, the CSS export block.
- **$effect** — persists knob values to `localStorage`.
- **$inspect** — watches the theme in dev.
- **bind:value** — on every range / select / radio input (Lesson 07).
- **`{#each}` + `{#if}`** — preset chips, optional toast (Lesson 06).
- **`<svelte:window>`** — `/` focuses the first slider (Lesson 05).
- **Events** — `onclick` on presets / copy / reset with correct-reference semantics (Lesson 05).

## Concept

### Four ways to set a class, ranked

In modern Svelte, almost always reach for the **object** or **array** form of `class={…}`. The `class:x` directive existed before those landed in Svelte 5.16 and is now the older path.

```svelte
<!-- 1. Static string — no reactivity, simplest case -->
<div class="card">...</div>

<!-- 2. Expression — any truthy string -->
<div class={primary ? 'card primary' : 'card'}>...</div>

<!-- 3. Object form — toggles per key -->
<div class={{ card: true, primary, disabled }}>...</div>

<!-- 4. Array form — excellent for composing parent props -->
<div class={['card', primary && 'primary', $$props.class]}>...</div>

<!-- 5. Directive form — legacy, but still works -->
<div class="card" class:primary class:disabled>...</div>
```

The key reason to prefer the object/array form over the directive: it **composes** cleanly with an incoming `props.class` from a parent component. Directive-style can't accept an arbitrary class string from above — you'd need a spread.

### `style:` is boring and excellent

Every CSS property is a binding slot. Multiple `style:` directives on one element merge. CSS custom properties are supported directly.

```svelte
<div
	style:color={fg}
	style:background-color={bg}
	style:--accent={accent}
	style:--radius={radius}
>
	...
</div>
```

Three things to know:

1. **`style:` beats `style="…"`.** If you mix both, the directive wins. Even over `!important` in the string.
2. **`|important` modifier.** `style:color|important={value}` — rarely needed, but when you do need it (overriding a third-party stylesheet), it's there.
3. **Shorthand when identifiers match.** `style:color` ≡ `style:color={color}`. Works for custom properties too: `style:--accent` ≡ `style:--accent={accent}` only if the JS identifier is exactly `--accent`, which it can't be — so custom properties always use the explicit form.

### The theming pattern

The preview panel carries the tokens as custom properties. Its children read via `var(--…)`. Knobs change `$state`; `style:` injects the new value; the browser repaints.

```svelte
<script lang="ts">
	let l = $state(60);
	let c = $state(0.2);
	let h = $state(24);
	const accent = $derived(`oklch(${l}% ${c} ${h})`);
</script>

<div style:--accent={accent}>
	<button class="btn">Click</button>
</div>

<style>
	.btn {
		background: var(--accent);
	}
</style>
```

No plumbing. The button doesn't know the accent is reactive. The `<div>` is the *token boundary*.

## Common mistakes

| Mistake | Why it bites | Fix |
|---|---|---|
| `style="color: {color};"` instead of `style:color={color}` | String concatenation, easy to break with user input, no merge semantics. | Use `style:color={color}`. |
| `class={isActive}` (boolean expression) | Renders `class="true"` or `class="false"` as a literal string. | `class={{ active: isActive }}` or `class:active={isActive}`. |
| `class:{{ a, b }}` (bad syntax) | The directive only takes a single class name: `class:a={…}`. | Use `class={{ a, b }}` (object form), no directive. |
| Custom property shorthand like `style:--accent` without an expression | There is no JS identifier `--accent`; shorthand fails. | Always spell it out: `style:--accent={accent}`. |
| Overriding with `style="…"` alongside `style:color={…}` | The directive wins. Surprising if you didn't know. | Pick one. Directives for reactive values, `style="…"` for static. |
| Class toggled on every render regardless of condition | Directive writes a class iff condition is truthy — but a string literal `"active"` is always present. | Use `class:active={cond}` or the object form. |
| Composing a parent's `class` prop with `class:x={…}` | The directive doesn't allow inline composition with a string. | Use the array form: `class={['base', conditional && 'on', props.class]}`. |
| Binding `class` to a computed value that flips identity on every render | If the array is reconstructed every pass, Svelte still diffs the *string* result and only touches the DOM when it changes. Usually fine. Don't over-think. | Leave it. Svelte handles it. |

## The PE lens

**The `style:` directive is the safe default; `style="…"` is the exception.** The directive merges cleanly when the same property appears twice (e.g. from a `{...spread}` and an explicit override), it escapes values correctly (no CSS injection from user input), and it plays nicely with runtime reactivity. String `style=""` does none of those. Only use the string form for a literal, static style you'd equally happily put in a `<style>` block.

**Token boundaries are components' business.** A `<ThemeProvider>` that sets `style:--accent`, `style:--surface`, `style:--radius` on its root is the natural shape. Child components read `var(--…)` and never learn the word *theme*. You'll see this pattern in shadcn, Radix, and most mature design systems. When you ship it, delete every `theme` prop that reads a colour.

**Don't cargo-cult `class:`.** It was the recommended Svelte 3/4 idiom. In Svelte 5, `class={...}` with an object or array is more powerful and composes with parent props. Use `class:` for a single-class toggle if you find it clearer, but know it's the older shape.

**`|important` is a smell 99% of the time.** When you reach for it, pause: you're usually patching a CSS specificity bug or a leaky global style. Fix the bug. The 1% case is overriding `!important` in a third-party stylesheet you don't control — `style:color|important={...}` is the correct answer there.

**OKLCH beats HSL / RGB for editable palettes.** Perceptually uniform — bumping `L` by 5% looks 5% lighter regardless of hue. The course's own token system uses OKLCH for this reason. The theme customiser is a good place to see *why*.

## Build challenge

The `starter/` ships the shell: the entire preview pane, the layout, the knob inputs, the preset buttons, the handlers. What's stubbed is **every `class:` / `class={…}` and `style:` you'd need**. Eight stubs.

### Acceptance criteria

1. **Accent OKLCH.** The three range inputs write to `l`, `c`, `h`. The `.swatch` element reads `background` from `style:background={accent}`.
2. **Mode class.** The preview root gets `class={{ dark: mode === 'dark' }}` — object form. The dark-mode CSS in the preview takes over when the class is present.
3. **Radius + scale custom properties.** The preview root has `style:--radius={radiusValue}` and `style:--scale={scaleValue}`. Components inside read via `var(--radius)` / `var(--scale)`.
4. **Class composition on the primary button.** The button uses `class={['btn', buttonShadow && 'btn-shadow', accentBold && 'btn-bold']}` — array form, with two conditional classes that toggle.
5. **Toast conditional.** The toast shows only when the `"Show toast"` checkbox is on, via `{#if}`.
6. **Preset click handlers.** Clicking a preset updates `l`/`c`/`h` in one go.
7. **Copy CSS.** Build the CSS export string from the state, then `navigator.clipboard.writeText(...)`.
8. **Reset.** Restores every knob to its default.

### Success looks like

```sh
pnpm --filter @course/lesson-08-starter dev
# drag the sliders, toggle modes, click presets, copy the CSS

pnpm --filter @course/lesson-08-starter check
# 0 errors, 0 warnings

pnpm --filter @course/lesson-08-solution check
# 0 errors, 0 warnings
```

## Self-check

<details>
<summary>1. Which of these renders <code>class="card primary"</code> iff <code>primary</code> is truthy, and why is the third form preferred in a component meant to be composed?</summary>

```svelte
<!-- A -->
<div class="card" class:primary={primary}>...</div>

<!-- B -->
<div class={primary ? 'card primary' : 'card'}>...</div>

<!-- C -->
<div class={['card', primary && 'primary']}>...</div>
```

All three render the same output. **C wins for composition** because you can extend it with a parent prop:

```svelte
<div class={['card', primary && 'primary', props.class]}>...</div>
```

A (directive form) cannot absorb an arbitrary `class` string from above without a spread. B requires manual concatenation and is one typo away from `"cardprimary"`.
</details>

<details>
<summary>2. You have <code>style:--accent={accent}</code> on a <code>&lt;div&gt;</code>. A child component uses <code>background: var(--accent);</code> in its scoped CSS. The child doesn't pick up the colour. Why?</summary>

Most likely: the child component has an outer `<div>` wrapper — the one CSS-scoped selectors target — but the custom property is set *outside* that wrapper, on the parent div. CSS custom properties cascade through the DOM: they *do* reach the child's wrapper. So the cascade works.

If it's genuinely not working:
- The `--accent` token was spelled differently somewhere (`--accent-color` vs `--accent`).
- The child's scoped CSS has higher specificity and overrides with its own value.
- The child is rendered in a portal (e.g. `document.body`) that's outside the parent div.

`$inspect('accent', accent)` to confirm the JS value is correct, then inspect the element in DevTools and check the "Computed" panel — you'll see whether `--accent` propagates.
</details>

<details>
<summary>3. <code>class:active={isActive}</code> and <code>class={{ active: isActive }}</code> — what's the *practical* difference?</summary>

In isolation, none. Both toggle the class on the truthy value of `isActive`.

The difference shows up when you need to **merge** classes. The directive form can only toggle *single* classes, one per directive. The object form accepts multiple keys in one expression, and can compose with arrays, strings, and parent-prop `class` values via the array form. So directive form is fine for one-offs; object/array form scales.

Prefer directive form if you like the readability of `class:primary class:disabled class:large`. Prefer object form for anything that might compose. Both are idiomatic Svelte 5.
</details>

## Links

- [Svelte docs — `class`](https://svelte.dev/docs/svelte/class)
- [Svelte docs — `style:`](https://svelte.dev/docs/svelte/style)
- [Svelte docs — Custom properties](https://svelte.dev/docs/svelte/custom-properties)
- [clsx](https://github.com/lukeed/clsx) — the library Svelte uses to stringify `class={…}`
- [OKLCH Color Picker](https://oklch.com) — visualise OKLCH if the numbers feel abstract

Next: [Lesson 09 — Scoped CSS + tokens](../lesson-09-scoped-css/README.md). You'll build a small component gallery — buttons, cards, inputs — all driven by the token system.
