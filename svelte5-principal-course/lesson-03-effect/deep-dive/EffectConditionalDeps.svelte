<!--
	Lesson 03 deep-dive — effects re-track on every run.

	An $effect's dependencies are NOT declared up front. They are whichever
	pieces of reactive state the effect reads SYNCHRONOUSLY during its last
	run. Each re-run re-tracks from scratch.

	This makes conditional code interesting:

	  $effect(() => {
	    if (mode === 'a') doSomethingWith(a);
	    else                doSomethingWith(b);
	  });

	When `mode === 'a'`, the effect depends on `mode` AND `a` — but not `b`.
	Flip `mode` to 'b'. Now it depends on `mode` AND `b` — but not `a`.

	Below: a run-counter proves which branch was taken. Toggle `useA`:
	  - useA = true:  clicking `a++` re-runs; clicking `b++` does not.
	  - useA = false: clicking `b++` re-runs; clicking `a++` does not.

	Cumulative-syntax callout: $state (L01), $effect (L03). We use a
	run-counter — exactly the diagnostic shape from reference/ObjectIdentityTracking.
-->
<script lang="ts">
	let a = $state(0);
	let b = $state(0);
	let useA = $state(true);
	let runs = $state(0);

	$effect(() => {
		// Re-tracking: whichever branch executes determines this run's deps.
		if (useA) {
			void a;
		} else {
			void b;
		}
		runs += 1;
	});
</script>

<h2>Effects re-track on every run</h2>

<label>
	<input type="checkbox" bind:checked={useA} />
	use A (otherwise: B)
</label>

<div class="actions">
	<button type="button" onclick={() => a++}>a++ (now {a})</button>
	<button type="button" onclick={() => b++}>b++ (now {b})</button>
	<button type="button" onclick={() => (runs = 0)}>reset runs</button>
</div>

<p class="display">runs: <strong>{runs}</strong></p>

<p class="tip">
	With <em>useA</em> checked, clicking <code>a++</code> ticks the runs counter; clicking <code>b++</code>
	does not. Uncheck <em>useA</em>: the relationship inverts. The effect did not subscribe to
	<code>b</code> in its last run, so writes to <code>b</code> do nothing. Re-tracking on every run
	is what makes effects feel "smart" about conditional code.
</p>

<style>
	label {
		display: inline-flex;
		gap: 0.5rem;
		align-items: center;
		margin-block-end: 0.75rem;
	}
	.actions {
		display: flex;
		gap: 0.5rem;
		margin-block-end: 1rem;
	}
	button {
		padding: 0.25rem 0.75rem;
		border: 1px solid rgb(0 0 0 / 0.2);
		border-radius: 0.25rem;
		background: transparent;
		cursor: pointer;
	}
	.display {
		font-family: ui-monospace, monospace;
	}
	.tip {
		margin-block-start: 1rem;
		font-size: 0.9em;
		color: rgb(0 0 0 / 0.55);
		max-inline-size: 42rem;
	}
	code {
		padding: 0.1em 0.3em;
		background: rgb(0 0 0 / 0.06);
		border-radius: 0.2rem;
	}
</style>
