<script lang="ts">
	let subtotal = $state(100);
	let taxRate = $state(0.07);
	let shipping = $state(5);

	const total = $derived.by(() => {
		$inspect.trace('total-derived');
		return subtotal + subtotal * taxRate + shipping;
	});

	$effect(() => {
		$inspect.trace('total-effect');
		console.log('total is now', total);
	});
</script>

<h1>03 — $inspect.trace</h1>
<p>
	Open DevTools → Console. Each button mutates a different dependency. Expand the <em>trace</em>
	console group and Svelte tells you which signal caused the re-run.
</p>

<ul>
	<li>subtotal: {subtotal}</li>
	<li>taxRate: {taxRate}</li>
	<li>shipping: {shipping}</li>
	<li><strong>total: {total.toFixed(2)}</strong></li>
</ul>

<div class="buttons">
	<button type="button" onclick={() => (subtotal += 10)}>subtotal += 10</button>
	<button type="button" onclick={() => (taxRate += 0.01)}>taxRate += 0.01</button>
	<button type="button" onclick={() => (shipping += 1)}>shipping += 1</button>
</div>

<style>
	.buttons {
		display: flex;
		gap: var(--space-sm);
		flex-wrap: wrap;
		margin-block: var(--space-md);
	}

	ul {
		display: grid;
		gap: var(--space-2xs);
		padding-inline-start: var(--space-lg);
	}
</style>
