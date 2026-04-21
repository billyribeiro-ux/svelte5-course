<script lang="ts">
	// Lesson 03 build:
	//   Write a $effect that:
	//     1) gets the 2d context from `canvas` (bail if not yet mounted)
	//     2) clears the canvas
	//     3) fills a rounded rectangle of the current size/radius/color
	//   The effect should re-run whenever size, radius, or color changes.
	//
	// Hint: `canvas` is bound via `bind:this`. It starts undefined and fills in
	// after mount — your effect's first read should check for that.

	let canvas = $state<HTMLCanvasElement | undefined>(undefined);
	let size = $state(140);
	let radius = $state(20);
	let color = $state('#ff3e00');

	// Lesson 03 build: $effect(() => { ... })
</script>

<h1>01 — Canvas redraw</h1>

<div class="stage">
	<canvas bind:this={canvas} width="220" height="220" aria-label="drawing"></canvas>
</div>

<div class="controls">
	<label>
		Size ({size}px)
		<input type="range" min="20" max="220" bind:value={size} />
	</label>
	<label>
		Corner radius ({radius}px)
		<input type="range" min="0" max="110" bind:value={radius} />
	</label>
	<label>
		Color
		<input type="color" bind:value={color} />
	</label>
</div>

<style>
	.stage {
		display: grid;
		place-items: center;
		padding: var(--space-lg);
		background: var(--color-surface-sunken);
		border-radius: var(--radius-md);
		margin-block: var(--space-lg);
	}

	canvas {
		background: var(--color-surface);
		border-radius: var(--radius-sm);
	}

	.controls {
		display: grid;
		gap: var(--space-sm);
	}

	.controls label {
		display: grid;
		gap: var(--space-2xs);
	}
</style>
