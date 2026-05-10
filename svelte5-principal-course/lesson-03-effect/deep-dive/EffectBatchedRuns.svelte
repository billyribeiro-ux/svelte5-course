<!--
	Lesson 03 deep-dive — effects are batched.

	When multiple $state values change in the same synchronous block, the
	effect that depends on all of them runs ONCE — not once per change.
	Svelte schedules effects in a microtask and merges all pending dirty
	signals before running.

	This matters more than it sounds. Without batching, the naive code

	  count++;
	  size = 10;
	  color = '#red';

	would fire the canvas redraw effect three times — once after each line.
	With batching, the effect fires once, after the synchronous block is
	done. Big perf wins, fewer flicker bugs.

	Below: an effect depends on a, b, c. A "change all three" button assigns
	to all three synchronously. The runs counter goes up by ONE, not three.
	A "change one at a time" button does the same writes inside three
	setTimeout(..., 0) callbacks — those are SEPARATE microtask turns, so
	the effect runs three times.

	Cumulative-syntax callout: $state (L01), $effect (L03). The counter
	pattern is the same diagnostic shape used in the L02 deep-dive.
-->
<script lang="ts">
	let a = $state(0);
	let b = $state(0);
	let c = $state(0);
	let runs = $state(0);

	$effect(() => {
		// register all three deps
		void a;
		void b;
		void c;
		runs += 1;
	});

	function changeAllSynchronously(): void {
		a += 1;
		b += 1;
		c += 1;
	}

	function changeOneAtATime(): void {
		setTimeout(() => (a += 1), 0);
		setTimeout(() => (b += 1), 0);
		setTimeout(() => (c += 1), 0);
	}

	function resetRuns(): void {
		runs = 0;
	}
</script>

<h2>Effects are batched</h2>

<dl>
	<dt>a · b · c</dt>
	<dd>{a} · {b} · {c}</dd>
	<dt>runs</dt>
	<dd><strong>{runs}</strong></dd>
</dl>

<div class="actions">
	<button type="button" onclick={changeAllSynchronously}>change all three (sync) → +1 run</button>
	<button type="button" onclick={changeOneAtATime}>change one-at-a-time (3 timeouts) → +3 runs</button>
	<button type="button" onclick={resetRuns}>reset runs</button>
</div>

<p class="tip">
	The first button writes <code>a</code>, <code>b</code>, and <code>c</code> in the same
	synchronous block. The effect schedules once and merges all three pending changes — runs += 1.
	The second button writes them in three separate <code>setTimeout</code> callbacks; each is its
	own microtask cycle, so the effect runs three times. The takeaway: batching is automatic when
	the writes share a synchronous block — you do not need to wrap anything.
</p>

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
	.tip {
		margin-block-start: 1rem;
		font-size: 0.9em;
		color: rgb(0 0 0 / 0.55);
		max-inline-size: 44rem;
	}
	code {
		padding: 0.1em 0.3em;
		background: rgb(0 0 0 / 0.06);
		border-radius: 0.2rem;
	}
</style>
