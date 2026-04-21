<script lang="ts">
	type Mode = 'light' | 'dark';
	type Radius = 'sharp' | 'soft' | 'pill';
	type Scale = 'compact' | 'normal' | 'large' | 'xlarge';

	type Preset = { id: string; label: string; l: number; c: number; h: number };

	const presets: Preset[] = [
		{ id: 'red', label: 'Red', l: 60, c: 0.2, h: 24 },
		{ id: 'blue', label: 'Blue', l: 60, c: 0.18, h: 250 },
		{ id: 'green', label: 'Green', l: 62, c: 0.16, h: 150 },
		{ id: 'violet', label: 'Violet', l: 58, c: 0.2, h: 300 }
	];

	const DEFAULT_L = 60;
	const DEFAULT_C = 0.2;
	const DEFAULT_H = 24;

	let l = $state(DEFAULT_L);
	let c = $state(DEFAULT_C);
	let h = $state(DEFAULT_H);
	let mode = $state<Mode>('light');
	let radius = $state<Radius>('soft');
	let scale = $state<Scale>('normal');
	let buttonShadow = $state(true);
	let accentBold = $state(false);
	let showToast = $state(true);
	let copied = $state(false);

	const accent = $derived(`oklch(${l}% ${c} ${h})`);

	const radiusValue = $derived(
		radius === 'sharp' ? '0' : radius === 'pill' ? '999px' : '0.5rem'
	);

	const scaleValue = $derived(
		scale === 'compact' ? '0.9' : scale === 'large' ? '1.1' : scale === 'xlarge' ? '1.2' : '1'
	);

	const cssExport = $derived(
		[
			':root {',
			`	--accent: ${accent};`,
			`	--radius: ${radiusValue};`,
			`	--scale: ${scaleValue};`,
			`	color-scheme: ${mode};`,
			'}'
		].join('\n')
	);

	$inspect('theme', { l, c, h, mode, radius, scale });

	function applyPreset(p: Preset): void {
		l = p.l;
		c = p.c;
		h = p.h;
	}

	function resetAll(): void {
		l = DEFAULT_L;
		c = DEFAULT_C;
		h = DEFAULT_H;
		mode = 'light';
		radius = 'soft';
		scale = 'normal';
		buttonShadow = true;
		accentBold = false;
		showToast = true;
	}

	async function copyCss(): Promise<void> {
		try {
			await navigator.clipboard.writeText(cssExport);
			copied = true;
			setTimeout(() => (copied = false), 1500);
		} catch {
			copied = false;
		}
	}

	function handleWindowKeydown(event: KeyboardEvent): void {
		if (event.key !== '/') return;
		const target = event.target;
		if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) return;
		event.preventDefault();
		const first = document.querySelector<HTMLInputElement>('[data-first-input]');
		first?.focus();
	}
</script>

<svelte:window onkeydown={handleWindowKeydown} />

<header class="top">
	<div>
		<h1>Theme customizer</h1>
		<p class="muted">Drag the sliders — the preview re-styles live. Press <kbd>/</kbd> to focus the first input.</p>
	</div>
	<button type="button" class="ghost" onclick={resetAll}>Reset</button>
</header>

<div class="grid">
	<section class="controls">
		<fieldset>
			<legend>Accent (OKLCH)</legend>

			<label>
				<span>Lightness <strong>{l}%</strong></span>
				<input data-first-input type="range" min="20" max="90" bind:value={l} />
			</label>

			<label>
				<span>Chroma <strong>{c.toFixed(2)}</strong></span>
				<input type="range" min="0" max="0.4" step="0.01" bind:value={c} />
			</label>

			<label>
				<span>Hue <strong>{h}°</strong></span>
				<input type="range" min="0" max="360" bind:value={h} />
			</label>

			<div class="swatch" style:background={accent}></div>

			<div class="presets">
				{#each presets as p (p.id)}
					<button
						type="button"
						class="chip"
						style:--chip-color="oklch({p.l}% {p.c} {p.h})"
						onclick={() => applyPreset(p)}
					>
						<span class="dot" style:background="oklch({p.l}% {p.c} {p.h})"></span>
						{p.label}
					</button>
				{/each}
			</div>
		</fieldset>

		<fieldset>
			<legend>Surface</legend>
			<div class="radios">
				{#each ['light', 'dark'] as m (m)}
					<label class="inline">
						<input type="radio" name="mode" value={m} bind:group={mode} />
						<span>{m}</span>
					</label>
				{/each}
			</div>
		</fieldset>

		<fieldset>
			<legend>Radius</legend>
			<label>
				<span>Corners</span>
				<select bind:value={radius}>
					<option value="sharp">sharp (0)</option>
					<option value="soft">soft (0.5rem)</option>
					<option value="pill">pill (999px)</option>
				</select>
			</label>
		</fieldset>

		<fieldset>
			<legend>Font scale</legend>
			<div class="radios">
				{#each ['compact', 'normal', 'large', 'xlarge'] as s (s)}
					<label class="inline">
						<input type="radio" name="scale" value={s} bind:group={scale} />
						<span>{s}</span>
					</label>
				{/each}
			</div>
		</fieldset>

		<fieldset>
			<legend>Button modifiers</legend>
			<label class="inline">
				<input type="checkbox" bind:checked={buttonShadow} />
				<span>Shadow</span>
			</label>
			<label class="inline">
				<input type="checkbox" bind:checked={accentBold} />
				<span>Bold fill</span>
			</label>
			<label class="inline">
				<input type="checkbox" bind:checked={showToast} />
				<span>Show toast</span>
			</label>
		</fieldset>
	</section>

	<section
		class={{ preview: true, dark: mode === 'dark' }}
		style:--accent={accent}
		style:--radius={radiusValue}
		style:--scale={scaleValue}
	>
		<h2 class="preview-title">Dashboard</h2>

		<div class="preview-card">
			<h3>Welcome back, Billy</h3>
			<p>You have 3 unread notifications and 1 pending review.</p>

			<div class="row">
				<button
					type="button"
					class={['btn', buttonShadow && 'btn-shadow', accentBold && 'btn-bold']}
				>
					Primary
				</button>
				<button type="button" class={['btn', 'btn-ghost']}>Secondary</button>
			</div>

			<label class="preview-label">
				<span>Search</span>
				<input type="text" placeholder="Try anything…" />
			</label>

			<label class="preview-check">
				<input type="checkbox" />
				<span>Subscribe to product updates</span>
			</label>

			<div class="pills">
				{#each ['shipping', 'billing', 'analytics', 'security'] as tag (tag)}
					<span class="pill">{tag}</span>
				{/each}
			</div>
		</div>

		{#if showToast}
			<div class="toast" role="status">
				<strong>Saved.</strong> Your preferences will sync across devices.
			</div>
		{/if}
	</section>
</div>

<section class="export">
	<div class="export-head">
		<h2>CSS export</h2>
		<button type="button" class="ghost" onclick={copyCss}>
			{copied ? 'Copied!' : 'Copy to clipboard'}
		</button>
	</div>
	<pre>{cssExport}</pre>
</section>

<style>
	.top {
		display: flex;
		justify-content: space-between;
		align-items: end;
		gap: var(--space-md);
		margin-block-end: var(--space-lg);
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

	.ghost {
		padding: var(--space-xs) var(--space-md);
		background: transparent;
		color: var(--color-text);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		cursor: pointer;
	}

	.ghost:hover {
		background: var(--color-surface-raised);
		border-color: var(--color-border-strong);
	}

	.grid {
		display: grid;
		grid-template-columns: 22rem 1fr;
		gap: var(--space-md);
	}

	@media (max-width: 60rem) {
		.grid {
			grid-template-columns: 1fr;
		}
	}

	.controls {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
	}

	fieldset {
		padding: var(--space-md);
		background: var(--color-surface-raised);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}

	legend {
		padding: 0 var(--space-xs);
		font-weight: 600;
	}

	label {
		display: flex;
		flex-direction: column;
		gap: var(--space-2xs);
		font-size: var(--text-sm);
	}

	label > span:first-of-type {
		color: var(--color-text-muted);
		font-size: var(--text-xs);
		text-transform: uppercase;
		letter-spacing: 0.04em;
		display: flex;
		justify-content: space-between;
	}

	label > span strong {
		color: var(--color-text);
		font-variant-numeric: tabular-nums;
	}

	label.inline {
		flex-direction: row;
		align-items: center;
		gap: var(--space-xs);
	}

	label.inline > span {
		color: var(--color-text);
		font-size: var(--text-sm);
		text-transform: none;
		letter-spacing: normal;
	}

	input[type='range'] {
		accent-color: var(--color-accent);
	}

	select {
		padding: var(--space-xs) var(--space-sm);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		color: var(--color-text);
		font: inherit;
	}

	.radios {
		display: flex;
		gap: var(--space-md);
		flex-wrap: wrap;
	}

	.swatch {
		block-size: 2.5rem;
		border-radius: var(--radius-md);
		border: 1px solid var(--color-border);
	}

	.presets {
		display: flex;
		gap: var(--space-xs);
		flex-wrap: wrap;
	}

	.chip {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2xs);
		padding: var(--space-2xs) var(--space-sm);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-full);
		font-size: var(--text-xs);
		cursor: pointer;
		color: inherit;
	}

	.chip:hover {
		border-color: var(--chip-color);
	}

	.dot {
		inline-size: 0.75rem;
		block-size: 0.75rem;
		border-radius: 999px;
	}

	.preview {
		padding: var(--space-lg);
		background: oklch(98% 0.004 260);
		color: oklch(18% 0.014 260);
		border: 1px solid oklch(85% 0.012 260);
		border-radius: var(--radius-lg);
		font-size: calc(1rem * var(--scale, 1));
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
	}

	.preview.dark {
		background: oklch(16% 0.014 260);
		color: oklch(94% 0.004 260);
		border-color: oklch(35% 0.018 260);
	}

	.preview-title {
		margin: 0;
	}

	.preview-card {
		padding: var(--space-md);
		background: oklch(from currentColor l c h / 0.04);
		border: 1px solid oklch(from currentColor l c h / 0.12);
		border-radius: var(--radius);
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}

	.preview-card h3 {
		margin: 0;
	}

	.preview-card p {
		margin: 0;
		opacity: 0.8;
	}

	.row {
		display: flex;
		gap: var(--space-xs);
	}

	.btn {
		padding: 0.5em 1em;
		background: var(--accent);
		color: white;
		border: 1px solid var(--accent);
		border-radius: var(--radius);
		font: inherit;
		cursor: pointer;
	}

	.btn-shadow {
		box-shadow: 0 4px 10px -3px oklch(from var(--accent) l c h / 0.45);
	}

	.btn-bold {
		font-weight: 700;
		letter-spacing: 0.02em;
	}

	.btn-ghost {
		background: transparent;
		color: var(--accent);
		border-color: oklch(from var(--accent) l c h / 0.35);
	}

	.preview-label {
		gap: var(--space-2xs);
	}

	.preview-label input {
		padding: 0.4em 0.6em;
		border: 1px solid oklch(from currentColor l c h / 0.2);
		border-radius: var(--radius);
		background: transparent;
		color: inherit;
		font: inherit;
	}

	.preview-label input:focus {
		outline: 2px solid var(--accent);
		outline-offset: 1px;
	}

	.preview-check {
		flex-direction: row;
		align-items: center;
		gap: var(--space-xs);
	}

	.preview-check input {
		accent-color: var(--accent);
	}

	.pills {
		display: flex;
		gap: var(--space-xs);
		flex-wrap: wrap;
	}

	.pill {
		padding: 0.15em 0.75em;
		font-size: 0.75em;
		background: oklch(from var(--accent) l c h / 0.15);
		color: var(--accent);
		border: 1px solid oklch(from var(--accent) l c h / 0.3);
		border-radius: 999px;
	}

	.toast {
		padding: var(--space-sm) var(--space-md);
		background: var(--accent);
		color: white;
		border-radius: var(--radius);
		font-size: 0.875em;
		align-self: start;
	}

	.export {
		margin-block-start: var(--space-xl);
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}

	.export-head {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.export h2 {
		margin: 0;
		font-size: var(--text-lg);
	}

	pre {
		margin: 0;
		padding: var(--space-md);
		background: var(--color-surface-sunken);
		border-radius: var(--radius-md);
		font-size: var(--text-xs);
		overflow-x: auto;
	}
</style>
