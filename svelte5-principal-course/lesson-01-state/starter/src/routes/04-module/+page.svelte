<script lang="ts">
	import { counter, increment, reset } from '$lib/counter-store.svelte';

	// Lesson 01 build:
	// Open $lib/counter-store.svelte.ts and make the store reactive.
	// You need to change ONE line to wrap the state in $state(...).
	// Once you do, these buttons will update the count below without any
	// further changes to this file.
	//
	// See README Worked example 4 — this is the "export const + mutate
	// properties" pattern.
</script>

<h1>04 — Module state</h1>
<p>The handlers are wired. The store is not reactive yet. Fix that in <code>$lib/counter-store.svelte.ts</code>.</p>

<p class="count">count: {counter.count}</p>

<div class="actions">
	<button onclick={increment}>increment</button>
	<button onclick={reset}>reset</button>
</div>

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

	code {
		padding: 0.1em 0.3em;
		background: var(--color-surface-sunken);
		border-radius: var(--radius-sm);
	}
</style>
