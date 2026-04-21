<script lang="ts">
	let seconds = $state(0);
	let ms = $state(1000);
	let paused = $state(false);

	$effect(() => {
		if (paused) return;
		const interval = ms;
		const id = setInterval(() => {
			seconds += 1;
		}, interval);
		return () => clearInterval(id);
	});

	function reset(): void {
		seconds = 0;
	}
</script>

<h1>02 — Adjustable interval</h1>

<p class="display" aria-live="polite">{seconds}s</p>
<p class="meta">tick every {ms}ms {paused ? '(paused)' : ''}</p>

<div class="buttons">
	<button type="button" onclick={() => (ms = Math.max(50, ms / 2))}>faster</button>
	<button type="button" onclick={() => (ms = Math.min(10000, ms * 2))}>slower</button>
	<button type="button" onclick={() => (paused = !paused)}>{paused ? 'resume' : 'pause'}</button>
	<button type="button" onclick={reset}>reset</button>
</div>

<style>
	.display {
		font-size: var(--text-3xl);
		font-variant-numeric: tabular-nums;
		margin-block: var(--space-lg) 0;
	}

	.meta {
		color: var(--color-text-muted);
		font-size: var(--text-sm);
	}

	.buttons {
		display: flex;
		gap: var(--space-sm);
		flex-wrap: wrap;
		margin-block-start: var(--space-md);
	}
</style>
