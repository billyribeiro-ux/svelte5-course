<!--
	Function bindings = { get, set } pair. Use them for NORMALIZATION, not
	for validation.

	Good uses:
	  - trim whitespace
	  - clamp to a range
	  - uppercase / slugify
	  - coerce type

	Bad uses:
	  - is-this-email-valid
	  - is-this-password-strong
	  - "save" on every keystroke

	The setter runs on every keystroke / change. Anything expensive or
	keystroke-hostile belongs on blur or submit, not inside the binding.
-->
<script lang="ts">
	let n = $state(50);
</script>

<label>
	Clamped 0–100 (try typing 999):
	<input
		type="number"
		bind:value={() => n, (v: number) => (n = Math.max(0, Math.min(100, v ?? 0)))}
	/>
</label>

<p>Current: <strong>{n}</strong></p>

<style>
	label {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}
</style>
