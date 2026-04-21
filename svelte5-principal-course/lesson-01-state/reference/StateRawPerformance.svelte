<script lang="ts">
	// $state.raw skips the proxy. Mutations to the underlying value DO NOT
	// trigger re-renders — you have to REASSIGN the whole value. That is the
	// trade-off: you give up deep reactivity in exchange for zero proxy
	// overhead, which matters for large collections (thousands of items).
	//
	// Rule of thumb: default to $state. Reach for $state.raw only when you
	// profile a real perf problem, or when you know you'll only ever replace
	// the value wholesale.

	let dataset = $state.raw<number[]>([]);
	let size = $state(1000);

	function generate() {
		// reassignment — works: the UI updates because the binding sees a new value
		dataset = Array.from({ length: size }, (_, i) => i);
	}

	function tryMutate() {
		// mutation on a raw $state — does NOT trigger an update
		dataset.push(999);
		console.warn('Pushed, but the UI did not update. That is the point of $state.raw.');
	}
</script>

<h2><code>$state.raw</code> — performance mode</h2>

<p>Faster for large collections. The deal: you can't mutate — you have to replace.</p>

<label>
	size:
	<input type="number" bind:value={size} min={100} max={100000} step={100} />
</label>

<div class="actions">
	<button onclick={generate}>generate</button>
	<button onclick={tryMutate}>try to mutate (no update)</button>
</div>

<p>Length: <strong>{dataset.length}</strong></p>
<p>First 10: <code>[{dataset.slice(0, 10).join(', ')}]</code></p>

<style>
	label {
		display: inline-flex;
		gap: 0.5rem;
		align-items: center;
	}
	.actions {
		display: flex;
		gap: 0.5rem;
		margin-block: 1rem;
	}
	button {
		padding: 0.5rem 1rem;
		border: 1px solid currentColor;
		border-radius: 0.25rem;
	}
	code {
		padding: 0.1em 0.3em;
		background: rgb(0 0 0 / 0.06);
		border-radius: 0.25rem;
	}
</style>
