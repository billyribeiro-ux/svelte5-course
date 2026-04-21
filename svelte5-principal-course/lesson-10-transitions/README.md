# Lesson 10 — Transitions

## The project you're building

**An image carousel.** A five-slide hero rotator with crossfading slides, an animated caption that re-enters on each change, a dismissable hint banner that slides closed, prev/next buttons, clickable dot indicators, and a thumbnail strip that highlights the active slide. Autoplay every 4 seconds with pause-on-hover; keyboard arrow navigation; full respect for `prefers-reduced-motion` (when the user has it on, every transition collapses to zero duration).

What it does:
- **Hero slide.** A full-width colored panel showing the current slide — gradient background driven by a per-slide token, emoji icon, title, subtitle. Crossfades to the next slide with `in:` / `out:` fade + scale on each change (via `{#key index}`).
- **Animated caption.** Re-enters with `in:fly={{ y: 24, duration }}` every time the slide changes, thanks to the `{#key}` wrapper.
- **Controls.** Prev / Next buttons, dot indicators below the slide. Clicking a dot jumps to that slide; the active dot grows via `style:transform`.
- **Thumbnail strip.** `{#each slides as slide (slide.id)}` — the active thumbnail gets a highlight class (`class={...}`), border accent, and scales slightly.
- **Autoplay.** `$effect` sets a `setInterval` when `autoplay && !paused`. Mouse enter sets `paused = true`; leave resets. Interval cleaned up on teardown.
- **Progress bar.** A thin bar under the slide fills to 100% over the autoplay interval, resetting on each advance. Backed by a `Tween` from `svelte/motion` for smooth progression.
- **Keyboard.** `←` / `→` advance; `Space` toggles autoplay.
- **Dismissable hint.** A top banner explains the keyboard shortcuts. `transition:slide` animates its removal when dismissed.
- **Reduced motion.** `prefersReducedMotion.current` gates every transition's `duration`. With it on, the carousel still works — just without motion.

Why this project: a carousel is the archetypal transition demo. You need crossfades between content, you need a replayable entry (the caption), you need a dismissable-element transition (the hint), you need an animated indicator, and you need the hard part — respecting user preferences. If you can build this carousel one way, you can build every "toast", "modal enter/exit", "slide-out panel" your career throws at you.

## What this lesson teaches

Five patterns:

1. **`transition:` — bidirectional.** Plays forward on mount, reverses smoothly if the element is removed mid-play. Default for "this element appears and disappears."
2. **`in:` and `out:` — independent.** Non-reversible. If an element is removed while still playing its `in:`, the `out:` queues up and plays after. Use for crossfades, two-stage entries, or any case where the enter and exit animations aren't mirror images of each other.
3. **`{#key expr}` + `in:` / `out:`** — the canonical "replay this animation on every value change" pattern. The block unmounts and remounts when `expr` changes, triggering the transitions.
4. **`animate:flip`** — FLIP (First, Last, Invert, Play) for smooth reordering inside a keyed `{#each}`. Not used in the main carousel; covered in `reference/`.
5. **`prefersReducedMotion`** — the browser's motion-preference media query, exposed as a Svelte reactive. Use it to gate `duration` (pass `0`) or to swap transitions entirely.

Compounds from earlier lessons:
- **$state** × 5 — index, autoplay, paused, hintOpen, hover tracking.
- **$derived** — current slide, reduced-motion-aware duration, progress bar fraction.
- **$effect** — autoplay interval, progress bar reset on slide change.
- **$inspect** — watches `{ index, autoplay }` in dev.
- **Lesson 05** — `<svelte:window onkeydown>` for arrow keys and space.
- **Lesson 06** — `{#each slides as slide (slide.id)}`, `{#if hintOpen}`, `{#key index}`.
- **Lesson 07** — `bind:checked` on the autoplay toggle.
- **Lesson 08** — `class={[...]}` on thumbs, `style:--bg={current.bg}` on the hero.
- **Lesson 09** — the gallery uses scoped CSS across `src/lib/` sub-components.

## Concept

### `transition:` vs `in:` / `out:`

```svelte
<script>
	import { fade, fly } from 'svelte/transition';
</script>

{#if visible}
	<!-- Bidirectional — reverses cleanly if toggled mid-play -->
	<div transition:fade>toggle-friendly</div>

	<!-- Independent — enter with fly, exit with fade -->
	<div in:fly={{ y: 20 }} out:fade>lopsided entry/exit</div>
{/if}
```

**Rule of thumb.** Single-property (fade, scale, slide) → `transition:`. Different entry vs exit → `in:` / `out:`. Crossfade-adjacent (two elements swapping position) → the `crossfade` helper (in `reference/`) or `{#key}` + `in:` / `out:` for the lighter version.

### `{#key}` as the "replay" escape hatch

Transitions only play on mount/unmount. If you want an animation to run every time a *value* changes while the same element stays mounted, wrap it in `{#key}`:

```svelte
{#key slideIndex}
	<h2 in:fly={{ y: 20 }}>{slides[slideIndex].title}</h2>
{/key}
```

Every time `slideIndex` changes, the `<h2>` is destroyed and re-created. The `in:fly` fires fresh each time. This is how the carousel's caption re-slides on each advance.

The cost: DOM churn. Each transition tears down and recreates the nodes. For heavy subtrees (hundreds of elements), this gets expensive; profile before using it on large blocks.

### `prefersReducedMotion` — the one line that separates junior from senior work

```svelte
<script>
	import { prefersReducedMotion } from 'svelte/motion';
	import { fade } from 'svelte/transition';
</script>

{#if visible}
	<div transition:fade={{ duration: prefersReducedMotion.current ? 0 : 300 }}>
		respects the OS-level motion preference
	</div>
{/if}
```

`prefersReducedMotion.current` is a reactive boolean. When the user has "Reduce motion" on in System Settings / OS preferences, it flips to `true`. You gate the `duration` — passing `0` disables the animation entirely while preserving the `{#if}` toggle semantics.

**Do not skip this.** Motion-sensitive users get nauseous from animations; for some, a spinning loading indicator is a medical issue. Respecting the preference is table stakes.

### Autoplay with `$effect`

```ts
$effect(() => {
	if (!autoplay || paused) return;

	const id = setInterval(() => {
		index = (index + 1) % slides.length;
	}, 4000);

	return () => clearInterval(id);
});
```

- `$effect` re-runs when any tracked value changes. Reads `autoplay`, `paused`, implicitly `slides.length` (via the closure).
- The `return () => clearInterval(id)` cleans up on teardown — when `autoplay` flips off, when `paused` flips on, when the component unmounts.
- No more `setInterval`-survived-the-unmount bugs.

### The `Tween` class for the progress bar

`Tween` from `svelte/motion` smoothly interpolates a value to a target. Given:

```ts
import { Tween } from 'svelte/motion';

const progress = new Tween(0, { duration: 4000, easing: linear });
```

`progress.current` is a reactive fraction between 0 and 1. Setting `progress.target = 1` causes `.current` to animate to 1 over 4 seconds. We use this for the autoplay progress bar: reset to 0 on each slide advance, set target to 1, and let the tween do the work.

## Common mistakes

| Mistake | Why it bites | Fix |
|---|---|---|
| Using `transition:` when you want a crossfade | `transition:` is bidirectional on the same element. Crossfading is two elements. | Use `{#key expr}` + `in:fade` / `out:fade`, or the `crossfade` helper. |
| Expecting transitions to play on value change (not mount/unmount) | They don't. Only mount and unmount trigger. | Wrap in `{#key}` so the value change causes unmount + remount. |
| `setInterval` inside an `$effect` without cleanup | Interval survives unmount; you leak. | `return () => clearInterval(id)` inside the effect. |
| Forgetting `prefersReducedMotion` | Users with motion sensitivity get a bad experience (or worse, nausea). | Gate every transition's `duration` on `prefersReducedMotion.current`. |
| `animate:flip` on the wrong element | Must be an *immediate* child of a keyed `{#each}`. | Move the `animate:flip` onto the top-level `<li>` / `<div>` of the each body. |
| Custom transition's `tick` doing heavy work | `tick` runs on every frame, on the main thread. | Prefer `css` — runs on the compositor, no main-thread cost. |
| `{#key}` wrapped around a huge subtree | Every change tears down and rebuilds everything inside. | Narrow the key block to the smallest element that needs to replay. |
| Transitions fired at SSR hydration | On hydrate, the DOM already exists — but Svelte still plays the `in:` by default. | Use `transition:fade|global` carefully, or design your UI so the first render is stable. |
| `transition:fade` on a block that already has an `opacity` rule | Conflict — Svelte's animation fights your CSS. | Don't set opacity on the element separately; let the transition own it. |
| `crossfade` without unique keys on both sides | Needs a matching key on `send` and `receive` to pair the elements. | Both directives take `{ key }` as the identifier. |

## The PE lens

**Animate the transition between states, not individual values.** The common junior mistake: try to animate everything with `style:transition` and component-local spinners. The senior pattern: identify the *state change* (slide changed, card deleted, route transitioned), wrap its rendering in `{#key}` or `{#if}`, and let Svelte's transition directives do the work.

**`prefersReducedMotion` is the difference between a demo and a product.** Design systems that don't respect it feel cheap and exclude a measurable slice of users. Make it the default pattern in every new animation you add. One line, zero cost.

**Autoplay is almost always a mistake.** Users skim. Autoplaying content they didn't ask for competes for attention against their actual task. If you must ship it (marketing demanded it), default to paused, offer a toggle, and respect pointer-idle state (this carousel's "pause on hover" is the bare minimum).

**Prefer `css` over `tick` in custom transitions.** Web animations run on the compositor thread; `tick` callbacks run on the main thread at 60 Hz and become jank on slower devices. The only legitimate reason to use `tick` is when you need to write to non-CSS properties (e.g., typing effect modifying `textContent`).

**Transitions are user-facing documentation.** A fade tells the user "this is a new thing, unrelated to what was here." A crossfade says "this element is the same, just moved." A slide says "this is adjacent content from that direction." If your transitions don't match this mental model, they confuse more than they delight.

## Build challenge

The `starter/` ships the carousel structure — slides data, handlers, CSS, layout, thumbnails, dot indicators, progress bar element, the hint banner markup. Eight transition stubs, each `// Lesson 10 build:`.

### Acceptance criteria

1. **Slide crossfade.** `{#key index}` wraps the hero panel. Inside, the panel has `in:fade` and `out:fade` with a shared duration that respects `prefersReducedMotion`.
2. **Caption re-entry.** The subtitle inside the hero has its own `in:fly={{ y: 24, duration }}` on each key change.
3. **Hint banner dismiss.** When the hint banner is dismissed, `transition:slide` animates its collapse.
4. **Autoplay interval.** An `$effect` starts a `setInterval` iff `autoplay && !paused`, advances the index, and cleans up on teardown.
5. **Progress bar.** A `Tween` drives a fraction from 0→1 over the autoplay interval. On every slide advance, reset to 0 and re-target 1.
6. **Pause on hover.** The hero panel's `onmouseenter` / `onmouseleave` toggle `paused`.
7. **Keyboard.** `←` / `→` advance; `Space` toggles autoplay. All via `<svelte:window onkeydown>`.
8. **Reduced motion.** All `duration` values are gated: `const duration = $derived(prefersReducedMotion.current ? 0 : 400);`.

### Success looks like

```sh
pnpm --filter @course/lesson-10-starter dev
# flip between slides, watch captions re-fly, dismiss the hint, try it with "Reduce motion" on

pnpm --filter @course/lesson-10-starter check
# 0 errors, 0 warnings

pnpm --filter @course/lesson-10-solution check
# 0 errors, 0 warnings
```

## Self-check

<details>
<summary>1. You have <code>{#if visible}&lt;div transition:fade&gt;…&lt;/div&gt;{/if}</code>. You expect the fade to replay every time a <code>slide</code> variable changes. It doesn't. Why?</summary>

Because transitions only trigger on **mount** and **unmount**. The `{#if}` evaluates once — the div stays mounted, and `slide` changes don't remount it. The transition plays only the first time `visible` flips true.

To replay on `slide` change, wrap in `{#key slide}…{/key}`. Each change to `slide` destroys and recreates the div, firing the fade anew.
</details>

<details>
<summary>2. You write <code>transition:fade={{ duration: prefersReducedMotion ? 0 : 300 }}</code> and nothing changes when the user enables "Reduce motion". Why?</summary>

Because `prefersReducedMotion` is the imported reactive *object*, not its current value. You need `.current`:

```svelte
<div transition:fade={{ duration: prefersReducedMotion.current ? 0 : 300 }}>…</div>
```

The object itself is always truthy, so the ternary always picks the `0` branch. The user sees no animation either way — which happens to be fine for the reduced-motion case but wrong the rest of the time.
</details>

<details>
<summary>3. Your autoplay interval runs even after the user toggles autoplay off. Why?</summary>

Almost certainly: you created the `setInterval` inside an event handler or outside an `$effect`. Svelte has no way to know the interval exists, so it never cleans up.

The correct shape is:

```ts
$effect(() => {
	if (!autoplay) return;
	const id = setInterval(() => { index = (index + 1) % slides.length; }, 4000);
	return () => clearInterval(id);
});
```

The effect re-runs when `autoplay` flips. The teardown clears the interval. When `autoplay` is false, the effect returns early without starting a new one.

The other likely bug: you return `() => clearInterval(id)` outside the effect, or forget the `return` keyword. Those are the two classic misfires.
</details>

## Links

- [Svelte docs — `transition:`](https://svelte.dev/docs/svelte/transition)
- [Svelte docs — `in:` and `out:`](https://svelte.dev/docs/svelte/in-and-out)
- [Svelte docs — `animate:`](https://svelte.dev/docs/svelte/animate)
- [Svelte docs — `svelte/transition`](https://svelte.dev/docs/svelte/svelte-transition)
- [Svelte docs — `svelte/motion` (`Tween`, `Spring`, `prefersReducedMotion`)](https://svelte.dev/docs/svelte/svelte-motion)
- [WCAG — Animation from interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)

Next: [Lesson 11 — `$props`](../lesson-11-props/README.md). You'll build a small chart library — typed, composable, reusable.
