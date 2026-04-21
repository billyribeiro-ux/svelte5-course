<!--
	`style:--token={value}` is the canonical way to pass theming values
	through a component tree without prop drilling.

	The wrapper sets the token. Any child — same file, nested snippet,
	imported component — reads it via `var(--token)` in its own CSS.
-->
<script lang="ts">
	let accent = $state('oklch(60% 0.18 200)');

	const colors = [
		'oklch(60% 0.2 24)',
		'oklch(62% 0.16 150)',
		'oklch(60% 0.18 250)',
		'oklch(58% 0.2 300)'
	];
</script>

<p>Click a chip to change the accent. The children below read it via <code>var(--accent)</code>.</p>

<div class="swatches">
	{#each colors as color (color)}
		<button
			class="swatch"
			aria-label="Set accent to {color}"
			style:background={color}
			onclick={() => (accent = color)}
		></button>
	{/each}
</div>

<div class="wrapper" style:--accent={accent}>
	<button class="card-btn">I read var(--accent)</button>
	<span class="pill">So do I</span>
</div>

<style>
	.swatches {
		display: flex;
		gap: 0.5rem;
		margin-block: 0.5rem;
	}

	.swatch {
		inline-size: 2rem;
		block-size: 2rem;
		border: 1px solid #888;
		border-radius: 999px;
		cursor: pointer;
	}

	.wrapper {
		display: flex;
		gap: 0.5rem;
		padding: 1rem;
		border: 1px dashed #bbb;
		border-radius: 0.25rem;
	}

	.card-btn {
		padding: 0.5rem 1rem;
		background: var(--accent);
		color: white;
		border: 0;
		border-radius: 0.25rem;
	}

	.pill {
		padding: 0.25rem 0.75rem;
		border: 1px solid var(--accent);
		color: var(--accent);
		border-radius: 999px;
		font-size: 0.875rem;
	}
</style>
