<!--
	Lesson 02 deep-dive — $derived is LAZY (pull, not push).

	A derived value does not compute when its dependencies change. It marks
	itself "dirty" and waits. It only computes when SOMEONE READS IT.

	If nobody reads it, the cost is zero. This is the magic that lets you
	wrap an expensive function in `$derived.by` without worrying about it
	firing every keystroke when the value is offscreen.

	Below: a derived `expensive` deliberately bumps a `runs` counter every
	time its body executes. We track:
	  - `count` (a $state from Lesson 01) — drives dependencies
	  - `runs`  (a $state — counts how many times the derived body ran)
	  - `showResult` (a $state — toggles whether the template reads the derived)

	Click `count++` while `show` is OFF: `count` changes, but `runs` does not.
	Click `count++` while `show` is ON:  `count` changes and `runs` increments.

	Cumulative-syntax callout: we are using $state (L01) plus $derived (L02).
	No other runes are needed to prove laziness.
-->
<script lang="ts">
	let count = $state(0);
	let runs = $state(0);
	let showResult = $state(true);

	const expensive = $derived.by(() => {
		// SIDE EFFECT for teaching: count how many times the derived BODY runs.
		// In production code, do not put side effects in $derived bodies —
		// only do this when proving laziness for educational reasons.
		runs += 1;
		// Pretend this is a heavy computation:
		let acc = 0;
		for (let i = 0; i < count + 1; i++) acc += i;
		return acc;
	});
</script>

<h2>$derived is lazy</h2>

<div class="controls">
	<label>
		<input type="checkbox" bind:checked={showResult} />
		show the derived value
	</label>
	<button type="button" onclick={() => count++}>count++</button>
	<button type="button" onclick={() => (runs = 0)}>reset runs</button>
</div>

<dl>
	<dt>count (dep)</dt>
	<dd>{count}</dd>
	<dt>runs (how many times the derived body ran)</dt>
	<dd><strong>{runs}</strong></dd>
	{#if showResult}
		<dt>expensive (derived)</dt>
		<dd>{expensive}</dd>
	{/if}
</dl>

<p class="tip">
	Toggle <em>show</em> OFF. Click <code>count++</code> a few times. <strong>runs stays put</strong>
	— nobody reads <code>expensive</code>, so the body never executes. Toggle <em>show</em> ON and
	notice runs immediately catches up by one (the value was dirty and is now being pulled).
</p>

<style>
	.controls {
		display: flex;
		gap: 1rem;
		align-items: center;
		margin-block-end: 1rem;
	}
	label {
		display: inline-flex;
		gap: 0.5rem;
		align-items: center;
	}
	dl {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0.25rem 1rem;
	}
	dt {
		font-family: ui-monospace, monospace;
		font-size: 0.9em;
		color: rgb(0 0 0 / 0.6);
	}
	.tip {
		margin-block-start: 1rem;
		font-size: 0.9em;
		color: rgb(0 0 0 / 0.55);
		max-inline-size: 40rem;
	}
	code {
		padding: 0.1em 0.3em;
		background: rgb(0 0 0 / 0.06);
		border-radius: 0.2rem;
	}
	button {
		padding: 0.25rem 0.75rem;
		border: 1px solid rgb(0 0 0 / 0.2);
		border-radius: 0.25rem;
		background: transparent;
		cursor: pointer;
	}
</style>
