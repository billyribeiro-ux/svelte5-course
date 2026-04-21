<script lang="ts">
	type Order = { id: number; amount: number };

	const orders = $state<Order[]>([
		{ id: 1, amount: 10 },
		{ id: 2, amount: 20 }
	]);

	let nextId = $state(3);

	const count = $derived(orders.length);
	const total = $derived(orders.reduce((sum, o) => sum + o.amount, 0));

	function add(): void {
		orders.push({ id: nextId, amount: Math.round(Math.random() * 50) });
		nextId += 1;
	}

	function reset(): void {
		orders.length = 0;
		orders.push({ id: nextId, amount: 0 });
		nextId += 1;
	}

	$inspect(orders);
	$inspect(count);
	$inspect(total);
</script>

<h1>04 — Debug the broken chain (fixed)</h1>
<p>
	The starter version of <code>reset</code> built a new local array and pushed into it — the $state
	proxy was never touched, so <code>count</code> and <code>total</code> stayed silent. The fix:
	mutate the proxy in place (<code>orders.length = 0</code>, then push). The three
	<code>$inspect</code>s above are how you isolate which link in a chain is silent — uncomment them
	one at a time in the starter to see the signal stop propagating.
</p>

<ul>
	{#each orders as order (order.id)}
		<li>#{order.id} — ${order.amount}</li>
	{/each}
</ul>

<p>
	count: {count} · total: ${total}
</p>

<div class="buttons">
	<button type="button" onclick={add}>add</button>
	<button type="button" onclick={reset}>reset</button>
</div>

<style>
	ul {
		padding-inline-start: var(--space-lg);
		display: grid;
		gap: var(--space-2xs);
	}

	.buttons {
		display: flex;
		gap: var(--space-sm);
		margin-block: var(--space-md);
	}
</style>
