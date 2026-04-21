<script lang="ts">
	import Buttons from '$lib/Buttons.svelte';
	import Cards from '$lib/Cards.svelte';
	import Forms from '$lib/Forms.svelte';

	type Density = 'comfortable' | 'normal' | 'compact';

	let mode = $state<'light' | 'dark'>('light');
	let density = $state<Density>('normal');
	let toastOpen = $state(true);

	const densityValue = $derived(
		density === 'compact' ? '0.8' : density === 'comfortable' ? '1.15' : '1'
	);

	$inspect('gallery', { mode, density });

	// A tiny snippet of HTML to demonstrate :global() scoping below. Normally
	// this would come from a Markdown pipeline, a CMS, or a rich-text editor.
	const html = `
		<h1>Rich text</h1>
		<p>This content is injected via <code>{@html}</code>. Scoped selectors do not reach it — look at the style block for the <code>:global</code> fix.</p>
		<ul>
			<li>Rendered from a string</li>
			<li>Same tokens apply</li>
			<li>Logical properties still respected</li>
		</ul>
	`;

	function toggleMode(): void {
		mode = mode === 'light' ? 'dark' : 'light';
	}

	function handleWindowKeydown(event: KeyboardEvent): void {
		if (event.key.toLowerCase() !== 'd') return;
		const target = event.target;
		if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) return;
		event.preventDefault();
		toggleMode();
	}
</script>

<svelte:window onkeydown={handleWindowKeydown} />

<div
	class={{ gallery: true, dark: mode === 'dark' }}
	style:--density={densityValue}
>
	<header class="top">
		<div>
			<h1>Component gallery</h1>
			<p class="muted">Press <kbd>D</kbd> to toggle dark mode.</p>
		</div>

		<div class="controls">
			<button type="button" class="toggle" onclick={toggleMode}>
				{mode === 'dark' ? 'Light' : 'Dark'} mode
			</button>

			<label class="select">
				<span>Density</span>
				<select bind:value={density}>
					<option value="compact">compact</option>
					<option value="normal">normal</option>
					<option value="comfortable">comfortable</option>
				</select>
			</label>
		</div>
	</header>

	<section class="section">
		<Buttons />
	</section>

	<section class="section">
		<Cards />
	</section>

	<section class="section">
		<Forms />
	</section>

	<section class="section">
		<h3>Badges & alerts</h3>
		<div class="row">
			{#each ['info', 'success', 'warning', 'danger'] as variant (variant)}
				<span class={['badge', variant]}>{variant}</span>
			{/each}
		</div>

		<div class="alerts">
			<div class="alert info" role="status">
				<strong>Heads up.</strong> This is an inline info banner.
			</div>
			{#if toastOpen}
				<div class="alert warning" role="status">
					<strong>Scheduled maintenance</strong> begins at 22:00 UTC.
					<button type="button" class="close" aria-label="Dismiss" onclick={() => (toastOpen = false)}>×</button>
				</div>
			{/if}
		</div>
	</section>

	<section class="section">
		<h3>`:global()` breakout</h3>
		<div class="prose">
			{@html html}
		</div>
	</section>
</div>

<style>
	.gallery {
		display: flex;
		flex-direction: column;
		gap: var(--space-xl);
	}

	.top {
		display: flex;
		justify-content: space-between;
		align-items: end;
		gap: var(--space-md);
	}

	.top h1 {
		margin: 0;
	}

	.muted {
		margin: 0;
		color: var(--color-text-muted);
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

	.controls {
		display: flex;
		align-items: end;
		gap: var(--space-sm);
	}

	.toggle {
		padding: var(--space-xs) var(--space-md);
		background: transparent;
		color: var(--color-text);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		cursor: pointer;
		font-size: var(--text-sm);
	}

	.toggle:hover {
		background: var(--color-surface-raised);
	}

	.select {
		display: flex;
		flex-direction: column;
		gap: var(--space-2xs);
		font-size: var(--text-sm);
	}

	.select > span {
		color: var(--color-text-muted);
		font-size: var(--text-xs);
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.select select {
		padding: var(--space-2xs) var(--space-sm);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		color: var(--color-text);
		font: inherit;
	}

	.section {
		padding: var(--space-lg);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
	}

	h3 {
		margin: 0 0 var(--space-sm);
		font-size: var(--text-md);
		color: var(--color-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.row {
		display: flex;
		gap: var(--space-xs);
		flex-wrap: wrap;
	}

	.badge {
		padding: 0.15em 0.75em;
		font-size: var(--text-xs);
		border-radius: 999px;
		border: 1px solid transparent;
	}

	.badge.info {
		background: oklch(from var(--color-accent) l c h / 0.15);
		color: var(--color-accent);
		border-color: oklch(from var(--color-accent) l c h / 0.3);
	}

	.badge.success {
		background: oklch(from var(--color-success) l c h / 0.15);
		color: var(--color-success);
		border-color: oklch(from var(--color-success) l c h / 0.3);
	}

	.badge.warning {
		background: oklch(from var(--color-warning) l c h / 0.15);
		color: var(--color-warning);
		border-color: oklch(from var(--color-warning) l c h / 0.3);
	}

	.badge.danger {
		background: oklch(from var(--color-danger) l c h / 0.15);
		color: var(--color-danger);
		border-color: oklch(from var(--color-danger) l c h / 0.3);
	}

	.alerts {
		margin-block-start: var(--space-sm);
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}

	.alert {
		padding: var(--space-sm) var(--space-md);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		display: flex;
		align-items: center;
		gap: var(--space-xs);
	}

	.alert.info {
		background: oklch(from var(--color-accent) l c h / 0.1);
		border-inline-start: 3px solid var(--color-accent);
	}

	.alert.warning {
		background: oklch(from var(--color-warning) l c h / 0.12);
		border-inline-start: 3px solid var(--color-warning);
	}

	.close {
		margin-inline-start: auto;
		inline-size: 1.5rem;
		block-size: 1.5rem;
		padding: 0;
		border: 0;
		background: transparent;
		cursor: pointer;
		font-size: var(--text-md);
		color: inherit;
		opacity: 0.6;
	}

	.close:hover {
		opacity: 1;
	}

	/* :global() scoped to .prose — style the content coming from {@html}. */
	.prose {
		padding: var(--space-md);
		background: var(--color-surface-raised);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
	}

	.prose :global(h1) {
		margin: 0 0 var(--space-sm);
		font-size: var(--text-xl);
		line-height: var(--leading-tight);
	}

	.prose :global(p) {
		margin: 0 0 var(--space-sm);
		color: var(--color-text);
		font-size: var(--text-sm);
		line-height: var(--leading-normal);
	}

	.prose :global(ul) {
		margin: 0;
		padding-inline-start: var(--space-lg);
		font-size: var(--text-sm);
		color: var(--color-text-muted);
	}

	.prose :global(code) {
		padding: 0.1em 0.3em;
		background: var(--color-surface-sunken);
		border-radius: var(--radius-sm);
		font-size: 0.9em;
	}

	/* Dark mode — overrides token values for descendants. */
	.gallery.dark {
		--color-surface: oklch(10% 0.008 260);
		--color-surface-raised: oklch(18% 0.014 260);
		--color-surface-sunken: oklch(6% 0.006 260);
		--color-border: oklch(38% 0.018 260);
		--color-border-strong: oklch(58% 0.02 260);
		--color-text: oklch(95% 0.004 260);
		--color-text-muted: oklch(80% 0.012 260);
		--color-text-subtle: oklch(60% 0.02 260);
		color: var(--color-text);
	}
</style>
