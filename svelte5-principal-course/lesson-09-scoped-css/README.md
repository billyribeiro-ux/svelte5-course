# Lesson 09 — Scoped CSS + tokens

## The project you're building

**A component gallery.** A one-page design-system preview: buttons in every variant, card variants, form controls, badges, alerts. Split across five local components (`Button`, `Card`, `Input`, `Badge`, `Alert`), each self-contained in its own `.svelte` file with its own scoped `<style>`. A dark-mode toggle, a density toggle (comfortable / normal / compact), a "global styles on" switch, and a `:global()` breakout demo.

What it does:
- **Buttons** — primary, secondary, ghost, destructive; three sizes; disabled state; loading state.
- **Cards** — default, highlighted, muted, interactive (hover + focus styles).
- **Inputs** — text, select, checkbox, radio group, range. All using OKLCH tokens.
- **Badges / Pills** — info, success, warning, danger variants.
- **Alerts** — a compact inline banner plus a dismissable toast.
- **Theme toggle** — flips a class on the gallery root. Dark mode is a class selector, not a new set of tokens.
- **Density toggle** — writes `--density` via `style:`. Every component multiplies against it.
- **`:global()` demo** — a small `{@html}` island that shows how scoped styles do NOT reach injected HTML, and how `:global()` fixes it.

Why this project: scoped CSS is Svelte's single biggest CSS feature. It makes sloppy CSS safe — you can name a class `.primary` in three components and they won't collide, because Svelte hashes them per-file. A gallery page is where you *see* this: same class names, completely isolated styles, all sharing a single `@course/styles` token layer. And the moment you need to break out (style content from `{@html}`, a library's portal, a child component you don't own), `:global()` is right there.

## What this lesson teaches

Four ideas:

1. **Scoped-by-default CSS.** Svelte adds a hash class (e.g. `svelte-abc123`) to every element the component renders, and appends `.svelte-abc123` to every selector in its `<style>`. Result: components can re-use class names without collision. `.btn` in `Button.svelte` and `.btn` in `Card.svelte` are different rules.
2. **`:global(...)` — surgical breakout.** For a single selector: `:global(body)`, `:global(.ProseMirror h1)`. For a block: `:global { … }` or `.a :global { … }` (the `.a` stays scoped; everything inside is global).
3. **Logical properties.** `inline-size` / `block-size`, `padding-inline-*` / `padding-block-*`, `margin-inline-*`, `border-inline-start`, `inset-inline-start`. They flip automatically for RTL users and for writing-mode changes, and they're the right default in 2026.
4. **Token-driven styling.** All colours, spacing, radii, fonts come from `var(--…)` defined in `@course/styles`. Components don't hard-code colours. Dark mode is "change the values of the tokens", not "duplicate the stylesheet."

Compounds from earlier lessons:
- **$state** — `mode`, `density`, dismissable toast, form-control states.
- **$derived** — the class list applied to the gallery root.
- **$effect** — optional, persists theme to localStorage.
- **$inspect** — watches mode/density in dev.
- **Lesson 05** — event handlers on every button; `<svelte:window>` for a `D` shortcut that toggles dark mode.
- **Lesson 06** — `{#each}` over variant lists with stable keys; `{#if}` for the dismissable toast.
- **Lesson 07** — `bind:checked`, `bind:value`, `bind:group`.
- **Lesson 08** — array-form `class` inside components; `style:--density={…}` for the token boundary.

## Concept

### How scoped CSS actually works

```svelte
<!-- Button.svelte -->
<button class="btn primary">click</button>

<style>
	.btn {
		padding: var(--space-sm) var(--space-md);
	}

	.btn.primary {
		background: var(--color-accent);
	}
</style>
```

Compile output is roughly:

```html
<button class="btn primary svelte-abc123">click</button>

<style>
	.btn.svelte-abc123 {
		padding: var(--space-sm) var(--space-md);
	}

	.btn.svelte-abc123.primary {
		background: var(--color-accent);
	}
</style>
```

Implications:
- Same class name in another component gets a different hash → no collision.
- Scoping adds **+0-1-0 specificity** to every selector. A `p` selector in a component wins over a `p` selector in a global stylesheet loaded later.
- Unused selectors (class names that don't appear in the template) are flagged as warnings. This is how svelte-check catches stale CSS.

### `:global()` — the three forms

```svelte
<style>
	/* 1. Single selector, inline modifier */
	:global(body) {
		margin: 0;
	}

	/* 2. Block form — everything inside is global */
	:global {
		body, html {
			block-size: 100%;
		}

		.ProseMirror h1 {
			font-weight: 700;
		}
	}

	/* 3. Scoped-outer, global-inner — the most common shape */
	.editor :global(h1) {
		/* applies to `h1` elements anywhere under `.editor` in THIS component,
		   including descendants from {@html} or imported components */
		font-size: var(--text-2xl);
	}
</style>
```

Form 3 is what you reach for 90% of the time. You own the wrapper class; you need to style content you don't own inside it. Classic use: rich-text output, third-party widgets, child components whose internals you can't annotate.

### Logical properties, briefly

Every directional property has a logical equivalent:

| Physical | Logical |
|---|---|
| `width` | `inline-size` |
| `height` | `block-size` |
| `padding-left` | `padding-inline-start` |
| `padding-right` | `padding-inline-end` |
| `padding-top` | `padding-block-start` |
| `margin-bottom` | `margin-block-end` |
| `left` | `inset-inline-start` |
| `border-left` | `border-inline-start` |

In LTR, logical maps to physical one-to-one. In RTL, `inline-start` swaps to the right. For a Chinese `writing-mode: vertical-rl` layout, `inline` becomes the vertical axis. Same CSS, correct behaviour.

The course's shared `@course/styles` package uses logical properties exclusively. Follow that convention in components. There's essentially no downside; modern browser support is universal.

### Tokens: one source of truth

Every widget in this gallery reads from `var(--color-*)`, `var(--space-*)`, `var(--radius-*)`, `var(--text-*)`. When dark mode flips, the gallery root just gets an `.dark` class; the token values in `@course/styles` redefine themselves via a `@media (prefers-color-scheme: dark)` rule, or (for manual toggles) we override them in the dark-mode scope.

No component knows whether it's in dark mode. That's the point.

## Common mistakes

| Mistake | Why it bites | Fix |
|---|---|---|
| Expecting a scoped `.foo` rule to style `{@html markup}` | Injected HTML has no hash class. Scoped rules skip it. | Use `.parent :global(.foo)` to target the injected content. |
| Writing `:global(.foo)` at top level and applying it app-wide by accident | Bare `:global(…)` is genuinely global. | Wrap with a scoped parent: `.parent :global(.foo)`. |
| Hard-coding `#ff3e00` instead of `var(--color-accent)` | Theme toggles, A/B colour tests, and design-system upgrades break one component at a time. | Always use a token. If none fits, add one to `@course/styles`. |
| Using `width` / `height` / `margin-left` | Bad for RTL users and vertical-writing-mode layouts. | `inline-size` / `block-size` / `margin-inline-start`. |
| Writing "dark mode" colours in a `@media` block inside the component | Now every component has its own dark-mode logic. Fragile. | Dark mode lives in `@course/styles` at the token layer. Components read tokens. |
| `@keyframes` collide with another component | Not actually — Svelte scopes keyframe names per component. If it happens, it's because you wrote `@keyframes -global-…` deliberately. | Drop the `-global-` unless you really want it globally accessible. |
| Multiple top-level `<style>` tags | Svelte errors — only one is allowed. | Consolidate. Nested `<style>` inside markup is allowed but is inserted as-is, **without scoping**. |
| An unused CSS selector warning for styles you *will* use | Most often: the class is set only conditionally and the condition is always false in the template. | Use the class somewhere statically (or apply `{#if true}` carefully), or wrap with `:global(…)`. |
| `:global()` inside a component you intend to be tree-shakable | Each instance re-declares the global rules → repeated insertions; some tooling deduplicates, some doesn't. | For truly app-global rules, put them in `@course/styles` / `app.css`. |

## The PE lens

**Scoped CSS is the single biggest reason to not reach for Tailwind.** When class-name collisions are physically impossible, utility classes are no longer the only sane answer. You can write `.card`, `.header`, `.row` in every component freely. Your styles read like the markup, not like a prop dump.

**Tokens > theme props.** A `<Card theme="dark">` prop threads a concern through every component in the tree. A `var(--color-surface)` reading inside `Card` inherits from whatever ancestor set it. Flip the value at one root and every Card in the subtree updates. That's the cleaner shape. The theme customizer in Lesson 08 builds on this — Lesson 09 *uses* it.

**`:global()` is the scope boundary for "content I don't own."** Rich-text output, CMS HTML, portaled modals, iframed widgets. Limit it to a scoped parent selector (`.editor :global(h1)`), never top-level. Top-level `:global()` is indistinguishable from a global stylesheet — and then the hash-scoping buys you nothing.

**Logical properties unlock RTL without a rewrite.** Every Arabic, Hebrew, Persian, Urdu user quietly thanks you. Total cost: one `padding-inline-start` instead of `padding-left`. Total benefit: an app that works correctly for ~500 million readers you might otherwise accidentally break.

**Unused-selector warnings are a feature.** They catch the staple refactor bug where you renamed a class in the template but forgot to update the CSS (or vice versa). Keep the 0-warnings bar; don't silence the linter with `:global()`.

## Build challenge

The `starter/` ships every sub-component (`Button`, `Card`, `Input`, `Badge`, `Alert`) with their markup and structural CSS, plus the gallery page that imports them, plus the theme and density toggles. Five focused stubs, each tagged `// Lesson 09 build:`.

### Acceptance criteria

1. **Dark mode class.** Clicking the toggle adds/removes `.dark` on the gallery root. Every sub-component responds via tokens.
2. **Density custom property.** The root has `style:--density={densityValue}`. Sub-components multiply paddings / radii by `var(--density)` in their CSS.
3. **`:global()` breakout.** There's a small `{@html}` island. Its content is styled by a `.prose :global(...)` rule in the gallery page.
4. **`D` shortcut.** Pressing `D` anywhere (when not in an input) toggles dark mode via `<svelte:window>`.
5. **Unused-selector hygiene.** Run `pnpm --filter @course/lesson-09-starter check` — zero unused-selector warnings. Every class in a `<style>` block matches something in the template.

### Success looks like

```sh
pnpm --filter @course/lesson-09-starter dev
# toggle light/dark, change density, watch every widget respond

pnpm --filter @course/lesson-09-starter check
# 0 errors, 0 warnings

pnpm --filter @course/lesson-09-solution check
# 0 errors, 0 warnings
```

## Self-check

<details>
<summary>1. <code>Button.svelte</code> defines <code>.primary { background: red; }</code>. <code>Card.svelte</code> also defines <code>.primary { background: blue; }</code>. In a page that renders both, what colour is the <code>&lt;button class="primary"&gt;</code> inside <code>Card.svelte</code>?</summary>

Red from `Button.svelte`? No. **Blue from `Card.svelte`.** Because the `<button>` element is rendered by `Card.svelte`, Svelte's compiler tagged it with `Card.svelte`'s hash class. Only `Card.svelte`'s `.primary` selector matches. The `Button.svelte` `.primary` selector has a different hash class that this element doesn't carry.

This is the point of scoped CSS: two components can re-use the same class name without thinking about each other.
</details>

<details>
<summary>2. You want to style <code>h1</code> elements rendered inside an <code>{@html markdown}</code> block. The obvious <code>h1 { ... }</code> in <code>&lt;style&gt;</code> does nothing. Why, and what's the fix?</summary>

Injected HTML (`{@html}`) has no hash class — it's raw strings the browser parses, not nodes Svelte emits. Scoped selectors require the hash to match. So `h1 { … }` only targets `h1` elements that *this* component emits directly.

Fix: wrap with `:global()`, confined to a scoped parent so you don't accidentally style every `h1` in the app:

```svelte
<div class="prose">
	{@html markdown}
</div>

<style>
	.prose :global(h1) {
		font-size: var(--text-3xl);
	}
</style>
```

The `.prose` selector stays scoped (hashed). The `h1` selector is global but limited to descendants of `.prose`. Textbook `:global()` usage.
</details>

<details>
<summary>3. You see <code>svelte-check</code> flag a selector as unused, but you <em>know</em> the class is applied — just only conditionally via <code>class:active={isActive}</code> or <code>class={{ active }}</code>. Is the warning wrong?</summary>

Usually not. `svelte-check` walks the template and sees `class="active"` or `class:active` or `class={{ active }}` literally — then cross-references against the selectors in your `<style>`. If a `class:active={isActive}` appears anywhere in the template, `.active` is considered used.

If you still get the warning, three possibilities:
- The class is applied only via a spread (`{...props}`) that the compiler can't statically see. Fix: apply the class explicitly.
- The selector is compound in a way the linter doesn't see (e.g., `.parent > .active` with `.parent` missing from the template).
- It's actually a stale selector you forgot to delete. Trust the linter — check the template one more time.
</details>

## Links

- [Svelte docs — Scoped styles](https://svelte.dev/docs/svelte/scoped-styles)
- [Svelte docs — Global styles](https://svelte.dev/docs/svelte/global-styles)
- [MDN — CSS Logical Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values)

Next: [Lesson 10 — Transitions](../lesson-10-transitions/README.md). You'll build an image carousel with route crossfades and respect for `prefers-reduced-motion`.
