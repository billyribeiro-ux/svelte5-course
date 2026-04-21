<script lang="ts">
	import { counter, increment, reset } from '$lib/counter-store.svelte';
</script>

<h1>04 — Module state</h1>
<p>
	Counter state lives in <code>$lib/counter-store.svelte.ts</code>. Multiple
	components could import and share it. This route just reads and writes.
</p>

<p class="count">count: {counter.count}</p>

<div class="actions">
	<button onclick={increment}>increment</button>
	<button onclick={reset}>reset</button>
</div>

<aside class="hint">
	Notice the state is wrapped in <code>$state({`{ count: 0 }`})</code> — an
	object. We mutate <code>counter.count</code>, never reassign <code>counter</code>
	itself. That's the rule for sharing reactive state across modules.
</aside>

<style>
	.count {
		font-size: var(--text-2xl);
		font-family: var(--font-mono);
		margin-block: var(--space-lg);
	}

	.actions {
		display: flex;
		gap: var(--space-sm);
	}

	button {
		padding: var(--space-xs) var(--space-md);
		border: 1px solid var(--color-border-strong);
		border-radius: var(--radius-md);
		background: var(--color-surface-raised);
	}

	button:hover {
		border-color: var(--color-accent);
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
