<!--
	Lesson 04 deep-dive — $inspect.trace with labels.

	By default $inspect.trace() reports the calling function as "anonymous"
	or with whatever the engine guesses. Pass a string label as the first
	argument to make multiple traced functions distinguishable in the
	console output:

	  $inspect.trace('total');
	  $inspect.trace('tax');

	Side effect: when you scroll through DevTools console after a change,
	the labels group your trace lines cleanly. When you have 4-6 deriveds
	and 2-3 effects all firing on a state change, labels are the difference
	between "noise" and "diagnostic."

	Below: three deriveds + one effect, all using $inspect.trace with
	descriptive labels. Click a button and watch the console. Each trace
	prints a labeled group with the dep that caused the re-run.

	Cumulative-syntax callout: $state (L01), $derived (L02), $effect (L03),
	$inspect.trace (L04). This is the full Part 1 syntax exercised together.
-->
<script lang="ts">
	let price = $state(100);
	let qty = $state(2);
	let discount = $state(0.1);

	const subtotal = $derived.by(() => {
		$inspect.trace('subtotal');
		return price * qty;
	});

	const saved = $derived.by(() => {
		$inspect.trace('saved');
		return subtotal * discount;
	});

	const total = $derived.by(() => {
		$inspect.trace('total');
		return subtotal - saved;
	});

	$effect(() => {
		$inspect.trace('total-changed-effect');
		console.log(`Total is now $${total.toFixed(2)}`);
	});
</script>

<h2><code>$inspect.trace</code> with labels</h2>

<p>
	Open DevTools → Console. Each button below changes one input. Watch the labeled trace groups
	appear: <code>subtotal</code>, <code>saved</code>, <code>total</code>, then
	<code>total-changed-effect</code>. The label is the first hint of <em>which</em> reactive
	function ran and <em>which</em> dep caused it.
</p>

<dl>
	<dt>price</dt><dd>{price}</dd>
	<dt>qty</dt><dd>{qty}</dd>
	<dt>discount</dt><dd>{(discount * 100).toFixed(0)}%</dd>
	<dt>subtotal</dt><dd>${subtotal.toFixed(2)}</dd>
	<dt>saved</dt><dd>${saved.toFixed(2)}</dd>
	<dt>total</dt><dd><strong>${total.toFixed(2)}</strong></dd>
</dl>

<div class="actions">
	<button type="button" onclick={() => (price += 10)}>price += 10</button>
	<button type="button" onclick={() => qty++}>qty++</button>
	<button type="button" onclick={() => (discount = Math.min(0.5, discount + 0.05))}>discount += 5%</button>
</div>

<style>
	dl {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0.25rem 1rem;
		margin-block-end: 1rem;
	}
	dt {
		font-family: ui-monospace, monospace;
		font-size: 0.9em;
		color: rgb(0 0 0 / 0.6);
	}
	.actions {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}
	button {
		padding: 0.25rem 0.75rem;
		border: 1px solid rgb(0 0 0 / 0.2);
		border-radius: 0.25rem;
		background: transparent;
		cursor: pointer;
	}
	code {
		padding: 0.1em 0.3em;
		background: rgb(0 0 0 / 0.06);
		border-radius: 0.2rem;
	}
</style>
