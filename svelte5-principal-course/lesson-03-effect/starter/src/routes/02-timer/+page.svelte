<script lang="ts">
	// Lesson 03 build:
	//   Write a $effect that:
	//     - when `paused` is false, starts a setInterval that increments `seconds` every `ms` ms
	//     - when `paused` is true, does NOT start an interval
	//     - returns a teardown that clears the interval
	//
	//   Clicking faster/slower must change `ms` and the interval must restart with the new value.
	//   Clicking pause/resume must stop / restart the interval WITHOUT losing `seconds`.
	//   Reset sets `seconds` back to 0.

	let seconds = $state(0);
	let ms = $state(1000);
	let paused = $state(false);

	// Lesson 03 build: $effect with teardown

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
