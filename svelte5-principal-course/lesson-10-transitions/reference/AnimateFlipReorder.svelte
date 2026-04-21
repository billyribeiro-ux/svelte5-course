<!--
	`animate:flip` runs when an item's INDEX inside a keyed `{#each}` changes.
	Not on add / remove — those are `transition:` or `in:` / `out:`.

	FLIP (First, Last, Invert, Play) measures the element's old and new
	positions, applies an inverse transform, then animates the transform
	away. Visual result: the element smoothly slides from its old slot to
	its new one.

	Must be on an IMMEDIATE child of the `{#each}` block.
-->
<script lang="ts">
	import { flip } from 'svelte/animate';

	let items = $state(['alpha', 'bravo', 'charlie', 'delta', 'echo']);

	function shuffle(): void {
		items = items.slice().sort(() => Math.random() - 0.5);
	}

	function sort(): void {
		items = items.slice().sort();
	}

	function reverse(): void {
		items = items.slice().reverse();
	}
</script>

<div class="buttons">
	<button type="button" onclick={shuffle}>Shuffle</button>
	<button type="button" onclick={sort}>A → Z</button>
	<button type="button" onclick={reverse}>Reverse</button>
</div>

<ul>
	{#each items as item (item)}
		<li animate:flip={{ duration: 300 }}>{item}</li>
	{/each}
</ul>

<style>
	.buttons {
		display: flex;
		gap: 0.5rem;
		margin-block-end: 0.5rem;
	}

	ul {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	li {
		padding: 0.5rem;
		background: oklch(95% 0.02 250);
		border: 1px solid oklch(80% 0.03 250);
		border-radius: 0.25rem;
		font-family: var(--font-mono, monospace);
	}
</style>
