<script lang="ts">
	// The pass-by-value trap.
	//
	// When you pass a primitive $state to a function, the function receives
	// the CURRENT value — a snapshot. It has no way to observe later updates.
	// The fix: pass a GETTER (a thunk, `() => theState`), which the function
	// can call whenever it needs the live value.

	let a = $state(10);
	let b = $state(20);

	// Captures values at call time. Returns a plain number.
	function brokenAverage(x: number, y: number): number {
		return (x + y) / 2;
	}

	// Returns an object whose getter reads current values through the thunks.
	function liveAverage(getX: () => number, getY: () => number) {
		return {
			get value() {
				return (getX() + getY()) / 2;
			}
		};
	}

	// The live view — re-reads on every render
	const live = liveAverage(
		() => a,
		() => b
	);

	// The frozen view — explicit snapshot, captured on demand
	let frozen = $state<number | null>(null);

	function captureFrozen() {
		frozen = brokenAverage(a, b);
	}
</script>

<h2>Passing state into functions</h2>

<p>
	JavaScript is pass-by-value. To give a function live access to reactive
	state, pass a <em>getter</em> — not the value itself.
</p>

<div class="inputs">
	<label>a <input type="number" bind:value={a} /></label>
	<label>b <input type="number" bind:value={b} /></label>
</div>

<table>
	<thead>
		<tr><th scope="col">Approach</th><th scope="col">Value</th></tr>
	</thead>
	<tbody>
		<tr>
			<td><code>liveAverage(() => a, () => b).value</code></td>
			<td>{live.value} <em>(always current)</em></td>
		</tr>
		<tr>
			<td><code>brokenAverage(a, b)</code> <em>(captured)</em></td>
			<td>
				{frozen ?? '— nothing captured yet —'}
				<button onclick={captureFrozen}>capture now</button>
			</td>
		</tr>
	</tbody>
</table>

<p class="note">
	Change <code>a</code> or <code>b</code>. The live row tracks. The frozen row
	stays put until you click <em>capture now</em>. That's the difference between
	a getter and a value.
</p>

<style>
	.inputs {
		display: flex;
		gap: 1rem;
		margin-block: 1rem;
	}
	label {
		display: inline-flex;
		gap: 0.5rem;
		align-items: center;
	}
	input {
		inline-size: 6rem;
	}
	table {
		border-collapse: collapse;
		margin-block: 1rem;
	}
	th,
	td {
		padding: 0.5rem 0.75rem;
		border: 1px solid rgb(0 0 0 / 0.15);
		text-align: start;
	}
	td button {
		margin-inline-start: 0.5rem;
		padding: 0.25rem 0.5rem;
		border: 1px solid currentColor;
		border-radius: 0.25rem;
	}
	code {
		padding: 0.1em 0.3em;
		background: rgb(0 0 0 / 0.06);
		border-radius: 0.25rem;
	}
	.note {
		font-size: 0.9em;
		color: rgb(0 0 0 / 0.7);
	}
	em {
		color: rgb(0 0 0 / 0.55);
	}
</style>
