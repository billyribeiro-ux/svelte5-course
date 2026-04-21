<script lang="ts">
	import { fade, fly, slide } from 'svelte/transition';
	import { prefersReducedMotion, Tween } from 'svelte/motion';
	import { linear } from 'svelte/easing';

	type Slide = { id: string; emoji: string; title: string; subtitle: string; bg: string };

	const slides: Slide[] = [
		{
			id: 'ocean',
			emoji: '🌊',
			title: 'Ocean',
			subtitle: 'A gradient standing in for something larger',
			bg: 'linear-gradient(135deg, oklch(55% 0.15 230), oklch(40% 0.12 260))'
		},
		{
			id: 'forest',
			emoji: '🌲',
			title: 'Forest',
			subtitle: 'Dark greens bleed into the warmer bark',
			bg: 'linear-gradient(135deg, oklch(45% 0.14 145), oklch(30% 0.09 100))'
		},
		{
			id: 'desert',
			emoji: '🏜️',
			title: 'Desert',
			subtitle: 'Orange through sand through a plum horizon',
			bg: 'linear-gradient(135deg, oklch(65% 0.18 55), oklch(45% 0.16 25))'
		},
		{
			id: 'aurora',
			emoji: '✨',
			title: 'Aurora',
			subtitle: 'Cold magenta cascading into cyan',
			bg: 'linear-gradient(135deg, oklch(55% 0.2 300), oklch(60% 0.15 200))'
		},
		{
			id: 'coral',
			emoji: '🐠',
			title: 'Coral',
			subtitle: 'Reef pinks, with a slice of sun',
			bg: 'linear-gradient(135deg, oklch(70% 0.18 20), oklch(58% 0.22 350))'
		}
	];

	const INTERVAL = 4000;

	let index = $state(0);
	let autoplay = $state(true);
	let paused = $state(false);
	let hintOpen = $state(true);

	const current = $derived(slides[index] ?? slides[0]!);

	// Lesson 10 build: derive a `duration` (ms) that is 0 when
	// `prefersReducedMotion.current` is true, and 400 otherwise. Every
	// transition below reads from this derived value.
	const duration = $derived(400);

	const progress = new Tween(0, { duration: INTERVAL, easing: linear });

	// Lesson 10 build: an $effect that (1) early-returns when autoplay is
	// off or paused, resetting progress to 0; (2) otherwise, resets progress
	// to 0 and sets target to 1 (animates the bar), and schedules a
	// setInterval that advances `index` every INTERVAL ms. Clean up the
	// interval from the effect's return.

	// Lesson 10 build: a second $effect that — whenever `index` changes —
	// resets progress to 0 and re-targets 1 (only if autoplay && !paused).
	// This covers manual advances via clicks / keyboard.

	// Optional while developing:
	// $inspect('carousel', { index, autoplay, paused });

	function next(): void {
		index = (index + 1) % slides.length;
	}

	function prev(): void {
		index = (index - 1 + slides.length) % slides.length;
	}

	function goTo(i: number): void {
		index = i;
	}

	function handleWindowKeydown(event: KeyboardEvent): void {
		const target = event.target;
		if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) return;

		if (event.key === 'ArrowRight') {
			event.preventDefault();
			next();
			return;
		}
		if (event.key === 'ArrowLeft') {
			event.preventDefault();
			prev();
			return;
		}
		if (event.key === ' ' || event.code === 'Space') {
			event.preventDefault();
			autoplay = !autoplay;
		}
	}
</script>

<svelte:window onkeydown={handleWindowKeydown} />

<!-- Lesson 10 build: wrap this hint in transition:slide={{ duration }} on the inner <div>. -->
{#if hintOpen}
	<div class="hint">
		<div>
			<strong>Keyboard:</strong>
			<kbd>←</kbd> <kbd>→</kbd> to navigate · <kbd>Space</kbd> to toggle autoplay
		</div>
		<button type="button" class="close" aria-label="Dismiss hint" onclick={() => (hintOpen = false)}>×</button>
	</div>
{/if}

<header class="top">
	<h1>Image carousel</h1>
	<label class="autoplay">
		<input type="checkbox" bind:checked={autoplay} />
		<span>Autoplay</span>
	</label>
</header>

<!--
	Lesson 10 build:
	  1. Add onmouseenter={() => paused = true} and onmouseleave={() => paused = false}
	     to this div so hovering pauses the autoplay.
	  2. Wrap the inner <section class="slide"> in {#key index}…{/key} so it
	     unmounts and remounts on every slide change.
	  3. Give the slide both in:fade={{ duration }} and out:fade={{ duration }}
	     so old + new crossfade.
	  4. Give the <p> (subtitle) its own in:fly={{ y: 24, duration }}.
-->
<div
	class="stage"
	role="region"
	aria-label="Carousel slide"
>
	<section class="slide" style:background={current.bg}>
		<span class="emoji" aria-hidden="true">{current.emoji}</span>
		<h2>{current.title}</h2>
		<p>{current.subtitle}</p>
	</section>

	<div class="progress" role="presentation">
		<div class="fill" style:inline-size="{progress.current * 100}%"></div>
	</div>
</div>

<nav class="controls" aria-label="Slide controls">
	<button type="button" class="nav" aria-label="Previous slide" onclick={prev}>←</button>
	<div class="dots">
		{#each slides as slide, i (slide.id)}
			<button
				type="button"
				class={['dot', i === index && 'active']}
				aria-label="Go to slide {i + 1}"
				aria-current={i === index ? 'true' : undefined}
				onclick={() => goTo(i)}
			></button>
		{/each}
	</div>
	<button type="button" class="nav" aria-label="Next slide" onclick={next}>→</button>
</nav>

<ul class="thumbs">
	{#each slides as slide, i (slide.id)}
		<li class={['thumb', i === index && 'active']} style:background={slide.bg}>
			<button type="button" aria-label="Go to slide {i + 1}" onclick={() => goTo(i)}>
				<span>{slide.emoji}</span>
			</button>
		</li>
	{/each}
</ul>

<style>
	.hint {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-sm);
		padding: var(--space-sm) var(--space-md);
		margin-block-end: var(--space-md);
		background: oklch(from var(--color-accent) l c h / 0.1);
		border: 1px solid oklch(from var(--color-accent) l c h / 0.3);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
	}

	kbd {
		display: inline-block;
		padding: 0.1em 0.4em;
		background: var(--color-surface-sunken);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		font-size: var(--text-xs);
	}

	.close {
		padding: 0;
		inline-size: 1.75rem;
		block-size: 1.75rem;
		background: transparent;
		border: 0;
		color: inherit;
		opacity: 0.6;
		cursor: pointer;
		font-size: var(--text-md);
	}

	.close:hover {
		opacity: 1;
	}

	.top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-block-end: var(--space-md);
	}

	.top h1 {
		margin: 0;
	}

	.autoplay {
		display: inline-flex;
		align-items: center;
		gap: var(--space-xs);
		font-size: var(--text-sm);
	}

	.stage {
		position: relative;
		aspect-ratio: 16 / 9;
		border-radius: var(--radius-lg);
		overflow: hidden;
		box-shadow: var(--shadow-md);
	}

	.slide {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: var(--space-xs);
		padding: var(--space-xl);
		color: white;
		text-shadow: 0 1px 8px oklch(0% 0 0 / 0.35);
	}

	.emoji {
		font-size: clamp(3rem, 10vw, 6rem);
		line-height: 1;
	}

	.slide h2 {
		margin: 0;
		font-size: var(--text-3xl);
		line-height: var(--leading-tight);
	}

	.slide p {
		margin: 0;
		font-size: var(--text-lg);
		opacity: 0.9;
		text-align: center;
		max-inline-size: 36ch;
	}

	.progress {
		position: absolute;
		inset-inline: 0;
		inset-block-end: 0;
		block-size: 3px;
		background: oklch(100% 0 0 / 0.2);
	}

	.fill {
		block-size: 100%;
		background: oklch(100% 0 0 / 0.9);
	}

	.controls {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-md);
		margin-block: var(--space-md);
	}

	.nav {
		inline-size: 2.25rem;
		block-size: 2.25rem;
		border: 1px solid var(--color-border);
		background: var(--color-surface-raised);
		border-radius: 999px;
		cursor: pointer;
		font-size: var(--text-md);
		color: var(--color-text);
	}

	.nav:hover {
		background: var(--color-surface-sunken);
		border-color: var(--color-border-strong);
	}

	.dots {
		display: flex;
		gap: var(--space-xs);
	}

	.dot {
		inline-size: 0.625rem;
		block-size: 0.625rem;
		padding: 0;
		background: var(--color-border-strong);
		border: 0;
		border-radius: 999px;
		cursor: pointer;
		transition: transform var(--duration-fast) var(--ease-out), background var(--duration-fast) var(--ease-out);
	}

	.dot.active {
		background: var(--color-accent);
		transform: scale(1.4);
	}

	.thumbs {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: var(--space-xs);
	}

	.thumb {
		aspect-ratio: 16 / 9;
		border-radius: var(--radius-md);
		overflow: hidden;
		opacity: 0.55;
		transition: opacity var(--duration-fast) var(--ease-out), transform var(--duration-fast) var(--ease-out);
	}

	.thumb.active {
		opacity: 1;
		transform: scale(1.04);
		outline: 2px solid var(--color-accent);
		outline-offset: 2px;
	}

	.thumb button {
		inline-size: 100%;
		block-size: 100%;
		padding: 0;
		background: transparent;
		border: 0;
		cursor: pointer;
		color: white;
		font-size: var(--text-xl);
		text-shadow: 0 1px 4px oklch(0% 0 0 / 0.35);
	}
</style>
