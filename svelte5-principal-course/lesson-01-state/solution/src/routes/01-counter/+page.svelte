<script lang="ts">
	let count = $state(0);
</script>

<h1>01 — Counter</h1>
<p>Click to increment.</p>

<button class="counter" onclick={() => count++}>clicks: {count}</button>

<aside class="hint">
	The whole thing is 5 lines. <code>$state(0)</code> makes <code>count</code> reactive;
	the template re-renders automatically when <code>count</code> changes.
</aside>

<style>
	.counter {
		padding: var(--space-sm) var(--space-lg);
		background: var(--color-accent);
		color: var(--color-accent-text);
		border-radius: var(--radius-md);
		font-size: var(--text-lg);
		margin-block-start: var(--space-md);
	}

	.counter:hover {
		background: var(--color-accent-hover);
	}

	.hint {
		margin-block-start: var(--space-xl);
		padding: var(--space-md);
		background: var(--color-surface-raised);
		border-inline-start: 3px solid var(--color-accent);
		border-radius: var(--radius-sm);
		font-size: var(--text-sm);
		color: var(--color-text-muted);
	}

	code {
		padding: 0.1em 0.3em;
		background: var(--color-surface-sunken);
		border-radius: var(--radius-sm);
	}
</style>
