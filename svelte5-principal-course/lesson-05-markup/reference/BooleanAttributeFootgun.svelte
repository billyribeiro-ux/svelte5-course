<!--
	HTML boolean attributes are present-or-absent, not truthy-or-falsy at the
	JS level. Svelte follows the HTML rule: truthy → present, falsy → absent.

	The trap is strings. `disabled={'false'}` → the attribute is PRESENT because
	the string 'false' is truthy. Rendered HTML: <button disabled>. Bug.

	Always use actual booleans.
-->
<script lang="ts">
	let busy = $state(false);

	// These three look similar. Only one is correct.
	const stringFalse = 'false'; // truthy — do NOT use
	const booleanFalse = false; // correct
</script>

<label>
	<input type="checkbox" bind:checked={busy} />
	Busy
</label>

<h3>Correct — boolean expression</h3>
<button type="button" disabled={busy}>Disabled only when busy is true</button>

<h3>Correct — boolean literal</h3>
<button type="button" disabled={booleanFalse}>Always enabled</button>

<h3>Wrong — string 'false' is truthy</h3>
<button type="button" disabled={stringFalse}>
	Always disabled. Inspect the element — the attribute is present.
</button>

<style>
	h3 {
		font-size: 1rem;
		margin-block: 1rem 0.25rem;
	}
</style>
