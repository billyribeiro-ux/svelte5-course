# Lesson 12 — `$props.id()`

## The project you're building

**A nested accordion.** Top-level sections (Profile, Billing, Notifications), each expandable. Inside each section, a sub-accordion of FAQ items. Every `<AccordionItem>` generates its own pair of stable IDs at mount and uses them to wire `aria-controls` / `aria-labelledby` between the button and the panel. Because the same `<AccordionItem>` is used 3 + 9 = 12 times, the IDs *must* be distinct or screen readers get confused.

What it does:
- `<Accordion>` — a container that renders its children (the items) and lets only one item be open at a time (optional "single" mode) or all (default "multi" mode).
- `<AccordionItem>` — button + collapsible panel. Uses `$props.id()` to generate one ID per instance.
- 3 outer sections, each wrapping a nested accordion of ~3 FAQ items. 12 total items, each with its own `aria-controls` / `aria-labelledby` pair.
- Smooth height transition using `transition:slide` on the panel.
- Keyboard: `Enter` or `Space` toggles the focused item. `Home` / `End` jump to first/last item within an accordion.
- A "hydration test" panel at the bottom: shows the current IDs. On SSR, the server-generated IDs match the client's — no hydration mismatch warnings.

Why this project: `$props.id()` is the only way to safely generate per-instance unique IDs in Svelte 5, especially under SSR. Using `Math.random()` breaks on hydration (server ≠ client). Hardcoded IDs break when the component renders more than once. This is exactly the problem ARIA forces you to solve on every accordion, combobox, tabs, and dialog in existence. Once you've done it once, the pattern is memorised.

## What this lesson teaches

Three ideas, all small:

1. **`$props.id()` returns a stable unique string per component instance.** Same value across SSR → client hydration. Different value per mounted instance. Never collides.
2. **ARIA relationship attributes need real unique IDs.** `aria-controls="panel-1"` only works if that panel has `id="panel-1"`. Hardcoded IDs collide when the component renders twice.
3. **Prefix IDs to scope.** `${uid}-button` and `${uid}-panel` give you two related IDs from one base. Common pattern for accordions, combobox (listbox + option), dialogs (title + description).

Compounds from earlier lessons:
- **$state** — which items are open.
- **$derived** — whether the accordion is in "single" or "multi" mode drives which open-set interaction applies.
- **`$inspect`** — watches the open set in dev.
- **Lesson 05** — `<svelte:window>` — *not* used here; focus management is local to the accordion.
- **Lesson 06** — `{#each}` keyed over items; `{#if}` around the panel.
- **Lesson 10** — `transition:slide` on the panel.
- **Lesson 11** — typed `Props` interface, `class` forwarding.

## Concept

### The rune in one picture

```svelte
<script lang="ts">
	const uid = $props.id();
</script>

<button id="{uid}-trigger" aria-controls="{uid}-panel" aria-expanded={open}>
	{title}
</button>

{#if open}
	<div id="{uid}-panel" role="region" aria-labelledby="{uid}-trigger">
		{@render children()}
	</div>
{/if}
```

- `$props.id()` is called once, at component init. The returned string is stable for that instance.
- Two related elements get two derived IDs by string-suffixing the base.
- No imports needed.
- Svelte 5.20.0+ only. Matches SSR — no hydration mismatch.

### Why not `crypto.randomUUID()` or `Math.random()`?

Both break SSR. On the server, a UUID is generated; the HTML is sent with that UUID. On the client, a *different* UUID is generated during hydration. The IDs in the HTML don't match the IDs the client-side component just created. ARIA relationships break; hydration diffs fire. Bad.

`$props.id()` is deterministic per position in the component tree, so server and client agree.

### Single-open vs multi-open

```ts
type Mode = 'single' | 'multi';
let mode = $state<Mode>('multi');
let openSet = $state<Set<string>>(new Set());

function toggle(id: string): void {
	if (mode === 'single') {
		openSet = openSet.has(id) ? new Set() : new Set([id]);
	} else {
		const next = new Set(openSet);
		next.has(id) ? next.delete(id) : next.add(id);
		openSet = next;
	}
}
```

Each accordion instance owns its own `openSet`. The nested accordions (inside each section) are independent.

## Common mistakes

| Mistake | Why it bites | Fix |
|---|---|---|
| Hardcoding IDs: `id="panel"` | Collides when rendered twice. Screen readers resolve only the first match. | `$props.id()` + suffix. |
| `crypto.randomUUID()` for IDs | SSR/client mismatch → hydration warning + broken ARIA. | `$props.id()` is designed for this. |
| Generating the ID inside a `$derived` | Recomputes on every reactive read; potentially a new ID each time. | Call `$props.id()` once at top of `<script>`. |
| `aria-controls` pointing at a panel that isn't in the DOM | When the panel is `{#if open}`-gated, the reference is invalid while collapsed. | Keep the panel in the DOM; toggle via `aria-hidden` or `hidden` instead. (The solution uses `{#if}` because it's simpler; for highest-fidelity a11y, ship both states.) |
| Forgetting `aria-expanded` on the button | Screen readers can't announce open/closed state. | `aria-expanded={open}` — always. |
| Reusing one `uid` across unrelated elements | Ambiguity in the a11y tree. | Suffix per role: `${uid}-trigger`, `${uid}-panel`, `${uid}-label`. |

## The PE lens

**`$props.id()` is ubiquitous.** Anywhere you wire two elements together via ARIA, you need it. Accordions, combobox, tabs, form fields (`<label for>` ↔ `<input id>`), modals (`<dialog aria-labelledby>` ↔ `<h2 id>`), tooltips (`<button aria-describedby>` ↔ `<div id>`). Learn it once; use it forever.

**Don't ship hand-rolled IDs.** `id-${Math.random()}` works in pure-client apps and breaks on SSR. Any app that might become SSR-ed later (= every serious app) should start with `$props.id()` from day one. Cost is zero; benefit is future-proof hydration.

**Composable a11y needs real elements.** ARIA is a layer on top of semantics, not a replacement. A `<div onclick>` is not a button, even with `role="button"`. The accordion here uses real `<button>` elements, real `<h3>` for the headings, real relationship attributes. Don't skip the HTML layer.

## Build challenge

The `starter/` ships the nested-accordion content, the `Accordion` container's state management, and the `AccordionItem`'s button + panel markup. What's stubbed: the `$props.id()` call and the string-suffixed IDs on the button, panel, and aria-* attributes.

### Acceptance criteria

1. `AccordionItem` calls `$props.id()` once at the top of its `<script>`.
2. The button gets `id="{uid}-trigger"` and `aria-controls="{uid}-panel"`.
3. The panel gets `id="{uid}-panel"` and `aria-labelledby="{uid}-trigger"`.
4. Every `AccordionItem` instance on the page has distinct IDs — inspect the DOM with DevTools to verify. 12 items → 24 unique IDs (12 `-trigger`, 12 `-panel`).
5. Server-rendered HTML IDs match client-hydrated IDs (no console warnings about hydration mismatch).

### Success looks like

```sh
pnpm --filter @course/lesson-12-starter dev
# expand and collapse items; use Tab + Enter; open DevTools and inspect IDs

pnpm --filter @course/lesson-12-starter check
# 0 errors, 0 warnings

pnpm --filter @course/lesson-12-solution check
# 0 errors, 0 warnings
```

## Self-check

<details>
<summary>1. You use <code>crypto.randomUUID()</code> for IDs and ship the page with SSR. What breaks, and when?</summary>

The server generates a UUID at render time and embeds it in the HTML. When the client hydrates, it runs the component script fresh and generates a *different* UUID. The HTML's `aria-controls="abc"` now points at a panel with `id="xyz"` — the relationship breaks at hydration. You'll also see hydration-mismatch warnings in the console.

`$props.id()` is deterministic based on the component's position in the tree, so server and client agree.
</details>

<details>
<summary>2. <code>$props.id()</code> is stable per instance. What is an "instance"?</summary>

One mount of the component. If you render `<AccordionItem>` three times in a template, each render gets its own `uid`. If you unmount and remount an instance (e.g., via `{#key}`), the new mount gets a fresh `uid`.

"Per render" is NOT the same as "per instance." Reactivity re-runs scripts but the same `$props.id()` returns the same string. That's the "stable" part.
</details>

<details>
<summary>3. Your accordion works fine on the client, but screen readers announce wrong titles for some panels. Why?</summary>

Likely: two items share the same ID. Multiple elements with `id="panel-1"` in the DOM is *invalid HTML* but browsers let it go; ARIA, however, resolves `aria-labelledby="panel-1"` to whichever element it finds first. Screen readers announce the wrong title.

`$props.id()` solves this by guaranteeing per-instance uniqueness. If you're still seeing it: you probably hardcoded a suffix somewhere without including the `uid` base.
</details>

## Links

- [Svelte docs — `$props.id()`](https://svelte.dev/docs/svelte/$props#%24props.id%28%29)
- [WAI-ARIA Authoring Practices — Accordion Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/)

Next: [Lesson 13 — `$bindable`](../lesson-13-bindable/README.md). A stepper component where the parent owns the current step but the child gets to mutate via `bind:step`.
