<script lang="ts">
	let canvas = $state<HTMLCanvasElement | undefined>(undefined);
	let size = $state(140);
	let radius = $state(20);
	let color = $state('#ff3e00');

	$effect(() => {
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const w = canvas.width;
		const h = canvas.height;
		ctx.clearRect(0, 0, w, h);

		const cx = (w - size) / 2;
		const cy = (h - size) / 2;
		const r = Math.min(radius, size / 2);

		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.moveTo(cx + r, cy);
		ctx.lineTo(cx + size - r, cy);
		ctx.quadraticCurveTo(cx + size, cy, cx + size, cy + r);
		ctx.lineTo(cx + size, cy + size - r);
		ctx.quadraticCurveTo(cx + size, cy + size, cx + size - r, cy + size);
		ctx.lineTo(cx + r, cy + size);
		ctx.quadraticCurveTo(cx, cy + size, cx, cy + size - r);
		ctx.lineTo(cx, cy + r);
		ctx.quadraticCurveTo(cx, cy, cx + r, cy);
		ctx.closePath();
		ctx.fill();
	});
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
