<!--
	$props.id() for `<label for>` ↔ `<input id>` pairs.

	Same rune, same pattern: generate a uid, suffix it per input.
	Using the rune here means the label/input relationship survives SSR
	and never collides with another instance of this component on the
	same page.
-->
<script lang="ts">
	const uid = $props.id();

	let first = $state('');
	let last = $state('');
</script>

<fieldset>
	<legend>Name</legend>
	<label for="{uid}-first">First</label>
	<input id="{uid}-first" type="text" bind:value={first} />

	<label for="{uid}-last">Last</label>
	<input id="{uid}-last" type="text" bind:value={last} />
</fieldset>

<p>
	Rendered — inspect the DOM to see <code>{uid}-first</code> and <code>{uid}-last</code>.
</p>

<style>
	fieldset {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0.5rem;
		padding: 1rem;
		border: 1px solid #ccc;
		border-radius: 0.5rem;
	}

	label {
		align-self: center;
	}
</style>
