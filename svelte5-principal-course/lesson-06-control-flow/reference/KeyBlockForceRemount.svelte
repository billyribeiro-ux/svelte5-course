<!--
	{#key expr}...{/key} destroys and re-creates its contents when `expr`
	changes. The textbook use case: force a transition to replay.

	Secondary use: reset internal state of a subtree after a save, by
	incrementing a version counter. Pick a primitive (number, string) that
	actually changes — mutating an object in place does nothing because the
	reference is the same.

	DO NOT use this to "fix" reactivity bugs. If {#key} is the fix, the root
	cause is almost always upstream state that should be $state but isn't.
-->
<script lang="ts">
	let formVersion = $state(0);
	let draft = $state('');

	function reset(): void {
		formVersion += 1; // remounts the form below, which resets `draft` via its own default binding.
	}
</script>

<p>Type something then click "Reset form" — the key block tears down and
rebuilds the form, clearing the input without us touching `draft` directly.</p>

<button type="button" onclick={reset}>Reset form</button>

{#key formVersion}
	<label>
		Draft:
		<input bind:value={draft} />
	</label>
	<p>Current: <code>{draft}</code></p>
{/key}

<style>
	label {
		display: flex;
		gap: 0.5rem;
		margin-block: 0.5rem;
	}
</style>
