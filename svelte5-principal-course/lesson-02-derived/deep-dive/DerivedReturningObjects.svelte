<!--
	Lesson 02 deep-dive — the "fresh object" equality trap.

	Push-pull reactivity short-circuits when a derived's NEW value is `===`
	to its old value. Primitives compare by value, so `$derived(count > 10)`
	stays the same `true`/`false` and downstream code does not re-run.

	Objects and arrays compare by REFERENCE. If you return a fresh `{...}`
	or `[...]` from a derived every time, that's a brand-new reference, so
	the short-circuit never engages, and everything downstream re-runs even
	when the contents are identical.

	Below: two state values — `name` and `tick`. Both deriveds read both
	`name` AND `tick`, so a tick++ marks them dirty. But:
	  - `goodGreeting` returns a string. "Hello, Billy!" === "Hello, Billy!"
	    so downstream short-circuits.
	  - `badGreeting`  returns a fresh `{ text: ... }` object. Each new
	    object is a new reference, so downstream re-runs.

	A $effect counts how often each downstream observer fires. tick++ a few
	times without changing `name`:
	  - good count stays put.
	  - bad count climbs.

	Fix: return a primitive when the contents are the same, OR hoist the
	object out of the derived, OR carry the object as $state and mutate
	properties.

	Cumulative-syntax: $state (L01), $derived (L02), $effect (L03 — used
	here to OBSERVE downstream re-runs, exactly the debug pattern L03
	teaches). Lesson 04 will let us replace this $effect with $inspect.
-->
<script lang="ts">
	let name = $state('Billy');
	let tick = $state(0);

	// ❌ Returns a fresh object every run. Reference changes every time.
	const badGreeting = $derived({ text: `Hello, ${name}!`, tick });

	// ✅ Returns a primitive. Identical strings compare === so downstream
	//    consumers skip work when `name` is the same.
	const goodGreeting = $derived(`Hello, ${name}!`);

	let badRuns = $state(0);
	let goodRuns = $state(0);

	$effect(() => {
		void badGreeting; // register dep
		badRuns += 1;
	});

	$effect(() => {
		void goodGreeting; // register dep
		goodRuns += 1;
	});
</script>

<h2>Returning fresh objects breaks short-circuiting</h2>

<label>
	name
	<input bind:value={name} />
</label>

<div class="actions">
	<button type="button" onclick={() => (tick += 1)}>tick++ ({tick})</button>
	<button
		type="button"
		onclick={() => {
			badRuns = 0;
			goodRuns = 0;
		}}>reset counts</button
	>
</div>

<dl>
	<dt>bad effect runs (fresh object derived)</dt>
	<dd><strong>{badRuns}</strong></dd>
	<dt>good effect runs (primitive derived)</dt>
	<dd><strong>{goodRuns}</strong></dd>
</dl>

<p class="tip">
	Click <em>tick++</em> several times without editing <em>name</em>. The <strong>bad</strong>
	counter climbs each click — its derived re-runs, returns a brand-new <code>{`{ text, tick }`}</code>
	object, and the downstream effect fires. The <strong>good</strong> counter only climbs when
	<em>name</em> actually changes — the string is the same, so the equality short-circuit blocks
	the downstream re-run.
</p>

<style>
	label {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		max-inline-size: 18rem;
		margin-block-end: 0.75rem;
	}
	input {
		padding: 0.25rem 0.5rem;
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
		max-inline-size: 42rem;
	}
	code {
		padding: 0.1em 0.3em;
		background: rgb(0 0 0 / 0.06);
		border-radius: 0.2rem;
	}
</style>
