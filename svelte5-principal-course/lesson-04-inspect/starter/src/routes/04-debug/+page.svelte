<script lang="ts">
	// Lesson 04 build:
	//   This reactive chain looks correct but something is "not updating."
	//   Your job: uncomment the $inspect / $inspect.trace calls, observe which
	//   link in the chain is silent, then FIX the silent link.
	//
	//   Hints:
	//   - A function call on the right-hand side of $derived is fine.
	//   - An array push is not.
	//   - $inspect only fires when the tracked expression *changes*.

	type Order = { id: number; amount: number };

	const orders = $state<Order[]>([
		{ id: 1, amount: 10 },
		{ id: 2, amount: 20 }
	]);

	let nextId = $state(3);

	const count = $derived(orders.length);
	const total = $derived(orders.reduce((sum, o) => sum + o.amount, 0));

	function addBroken(): void {
		// Bug: mutating .length won't reassign the reference Svelte tracks on push,
		//      but for this starter the REAL bug is in `addReset` below.
		orders.push({ id: nextId, amount: Math.round(Math.random() * 50) });
		nextId += 1;
	}

	function addReset(): void {
		// Bug: we reassigned a local shadow, not the $state array.
		const fresh: Order[] = [];
		// orders = fresh; // <- would error: orders is const
		// The student should realize: to reset in-place, use orders.length = 0
		// and then push. Leave it broken so the $inspect log makes it obvious.
		fresh.push({ id: nextId, amount: 0 });
		nextId += 1;
	}

	// Lesson 04 build — uncomment these ONE AT A TIME to isolate the silent link:
	// $inspect(orders);
	// $inspect(count);
	// $inspect(total);
	// $inspect.trace('total-derived');
</script>

<h1>04 — Debug the broken chain</h1>
<p>
	Click <code>add</code> a few times — the list and total update. Click <code>reset</code> — nothing
	visibly changes, and no <code>$inspect</code> fires. Use the inspects above (uncomment one at a
	time) to narrow down which link is silent, then fix <code>addReset</code> so it actually resets
	the state.
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
	<button type="button" onclick={addBroken}>add</button>
	<button type="button" onclick={addReset}>reset</button>
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
