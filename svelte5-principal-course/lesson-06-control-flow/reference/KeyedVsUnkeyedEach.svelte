<!--
	The single concrete demonstration of why keyed each matters.

	Each row owns a focused-state "cursor" (the cursor position in the input).
	The "shuffle" button reorders the list. Watch what happens to the cursor
	position in each variant.

	Unkeyed: Svelte matches by index, so after shuffling, whichever row now
	sits at the focused index keeps the cursor — even though it's a different
	card. The DOM nodes stayed put; their content changed. Wrong.

	Keyed on `item.id`: Svelte moves the existing DOM node to the new index.
	The cursor stays with the card you were editing. Correct.
-->
<script lang="ts">
	type Item = { id: string; text: string };

	let items = $state<Item[]>([
		{ id: 'a', text: 'alpha' },
		{ id: 'b', text: 'bravo' },
		{ id: 'c', text: 'charlie' },
		{ id: 'd', text: 'delta' }
	]);

	function shuffle(): void {
		items = items.slice().reverse();
	}
</script>

<button type="button" onclick={shuffle}>Shuffle</button>

<h3>Unkeyed (bad)</h3>
<!--
	The each block below deliberately omits a key so you can see the
	unkeyed-identity bug. Svelte's linter will flag it as missing a key —
	that's the whole point. Copy the keyed version above when writing
	real code.
-->
<ul>
	{#each items as item}
		<li><input value={item.text} /></li>
	{/each}
</ul>

<h3>Keyed on id (good)</h3>
<ul>
	{#each items as item (item.id)}
		<li><input value={item.text} /></li>
	{/each}
</ul>

<style>
	h3 {
		font-size: 1rem;
		margin-block: 1rem 0.25rem;
	}
	ul {
		list-style: none;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}
	input {
		padding: 0.25rem;
	}
</style>
