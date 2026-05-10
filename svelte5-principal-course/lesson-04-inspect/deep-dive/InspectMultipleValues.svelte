<!--
	Lesson 04 deep-dive — $inspect on multiple values.

	`$inspect(a, b, c)` watches all three. Every time ANY of them changes,
	the callback (or default console.log) fires with the CURRENT values of
	ALL of them.

	That correlation matters for "why did this thing happen?" debugging.
	Example: you suspect a bug only when `mode === 'edit'` AND `dirty`.
	One $inspect that watches both lets you see both values at every change.

	Below: three independent state values. The .with handler prints the
	transition kind plus all three values in a compact table-like row.

	Cumulative-syntax callout: $state (L01), $inspect (L04).
-->
<script lang="ts">
	let mode = $state<'view' | 'edit'>('view');
	let dirty = $state(false);
	let savedAt = $state<number | null>(null);

	$inspect(mode, dirty, savedAt).with((type, m, d, s) => {
		const stamp = s === null ? '—' : new Date(s).toLocaleTimeString();
		console.log(`[${type}] mode=${m} dirty=${d} savedAt=${stamp}`);
	});

	function toggleMode(): void {
		mode = mode === 'view' ? 'edit' : 'view';
	}

	function makeDirty(): void {
		dirty = true;
	}

	function save(): void {
		savedAt = Date.now();
		dirty = false;
	}
</script>

<h2><code>$inspect</code> on multiple values</h2>

<p>Open DevTools → Console. Every action below fires ONE log line showing all three values, so you can correlate them on the fly.</p>

<dl>
	<dt>mode</dt><dd>{mode}</dd>
	<dt>dirty</dt><dd>{dirty}</dd>
	<dt>savedAt</dt><dd>{savedAt === null ? '—' : new Date(savedAt).toLocaleTimeString()}</dd>
</dl>

<div class="actions">
	<button type="button" onclick={toggleMode}>toggle mode</button>
	<button type="button" onclick={makeDirty} disabled={dirty}>make dirty</button>
	<button type="button" onclick={save} disabled={!dirty}>save</button>
</div>

<p class="tip">
	Replace three separate <code>$inspect</code> calls with one. The .with handler receives
	all values in order; you can format them however helps you see the bug. This is the right
	tool when the bug is about a <em>combination</em>, not a single variable.
</p>

<style>
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
	.actions {
		display: flex;
		gap: 0.5rem;
		margin-block-start: 1rem;
	}
	button {
		padding: 0.25rem 0.75rem;
		border: 1px solid rgb(0 0 0 / 0.2);
		border-radius: 0.25rem;
		background: transparent;
		cursor: pointer;
	}
	button:disabled {
		opacity: 0.5;
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
