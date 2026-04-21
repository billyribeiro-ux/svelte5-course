<!--
	Deriveds can depend on other deriveds. Svelte builds the graph for you.

	Change `price` or `qty`:
	  subtotal (derived) recomputes
	    → tax (derived of subtotal) recomputes
	    → total (derived of subtotal + tax) recomputes
	    → DOM updates

	This is a dependency graph, not a chain of callbacks. Each node is pulled
	lazily when read, and identical-value short-circuits apply at every node.
-->
<script lang="ts">
	let price = $state(100);
	let qty = $state(3);
	let taxRate = $state(0.0725);

	let subtotal = $derived(price * qty);
	let tax = $derived(subtotal * taxRate);
	let total = $derived(subtotal + tax);
</script>

<label>price <input type="number" min="0" bind:value={price} /></label>
<label>qty <input type="number" min="0" bind:value={qty} /></label>
<label>
	tax rate
	<input type="number" min="0" max="1" step="0.0025" bind:value={taxRate} />
</label>

<dl>
	<dt>subtotal</dt><dd>${subtotal.toFixed(2)}</dd>
	<dt>tax</dt><dd>${tax.toFixed(2)}</dd>
	<dt>total</dt><dd><strong>${total.toFixed(2)}</strong></dd>
</dl>

<style>
	label {
		display: inline-flex;
		flex-direction: column;
		gap: 0.25em;
		margin-inline-end: 1em;
	}

	dl {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0.25em 1em;
		margin-block-start: 1em;
		max-inline-size: 20rem;
	}
</style>
