<script lang="ts">
	type LineItem = { id: number; name: string; price: number; qty: number };

	let nextId = $state(4);
	let items: LineItem[] = $state([
		{ id: 1, name: 'Coffee beans (1lb)', price: 18, qty: 2 },
		{ id: 2, name: 'Burr grinder', price: 120, qty: 1 },
		{ id: 3, name: 'Filter papers', price: 8, qty: 3 }
	]);
	let taxRate = $state(0.0725);

	let subtotal = $derived.by(() => {
		let sum = 0;
		for (const item of items) sum += item.price * item.qty;
		return sum;
	});
	let tax = $derived(subtotal * taxRate);
	let total = $derived(subtotal + tax);

	function addLine(): void {
		items.push({ id: nextId++, name: 'New item', price: 0, qty: 1 });
	}

	function removeLine(id: number): void {
		const i = items.findIndex((x) => x.id === id);
		if (i !== -1) items.splice(i, 1);
	}
</script>

<h1>01 — Cart totals</h1>

<table>
	<thead>
		<tr>
			<th>Item</th>
			<th>Price</th>
			<th>Qty</th>
			<th>Line total</th>
			<th aria-label="remove"></th>
		</tr>
	</thead>
	<tbody>
		{#each items as item (item.id)}
			<tr>
				<td><input bind:value={item.name} /></td>
				<td><input type="number" min="0" step="0.01" bind:value={item.price} /></td>
				<td><input type="number" min="0" bind:value={item.qty} /></td>
				<td>${(item.price * item.qty).toFixed(2)}</td>
				<td><button type="button" onclick={() => removeLine(item.id)}>×</button></td>
			</tr>
		{/each}
	</tbody>
</table>

<button type="button" onclick={addLine}>+ Add line</button>

<dl class="totals">
	<dt>Subtotal</dt>
	<dd>${subtotal.toFixed(2)}</dd>
	<dt>
		Tax (<input type="number" min="0" max="1" step="0.0025" bind:value={taxRate} />
		= {(taxRate * 100).toFixed(2)}%)
	</dt>
	<dd>${tax.toFixed(2)}</dd>
	<dt>Total</dt>
	<dd><strong>${total.toFixed(2)}</strong></dd>
</dl>

<style>
	table {
		inline-size: 100%;
		border-collapse: collapse;
		margin-block: var(--space-lg);
	}

	th,
	td {
		padding: var(--space-2xs) var(--space-xs);
		border-block-end: 1px solid var(--color-border);
		text-align: start;
	}

	input {
		inline-size: 100%;
	}

	td input[type='number'] {
		inline-size: 6rem;
	}

	.totals {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: var(--space-2xs) var(--space-md);
		margin-block-start: var(--space-lg);
	}

	.totals dt input[type='number'] {
		inline-size: 5rem;
	}
</style>
