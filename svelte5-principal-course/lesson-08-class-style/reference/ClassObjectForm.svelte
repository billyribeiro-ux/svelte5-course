<!--
	The object form of `class={...}`. Each key is a class name; truthy
	values include it, falsy values drop it. Multiple keys in one expression.

	Equivalent to chaining multiple `class:` directives — but reads more like
	a data structure and composes cleanly inside an array with parent props.
-->
<script lang="ts">
	let primary = $state(true);
	let disabled = $state(false);
	let loading = $state(false);
</script>

<label><input type="checkbox" bind:checked={primary} /> primary</label>
<label><input type="checkbox" bind:checked={disabled} /> disabled</label>
<label><input type="checkbox" bind:checked={loading} /> loading</label>

<button class={{ btn: true, primary, disabled, loading }}>
	Inspect my <code>class</code> attribute
</button>

<style>
	label {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		margin-inline-end: 1rem;
	}

	.btn {
		padding: 0.5rem 1rem;
		border: 1px solid #888;
		background: #fff;
		border-radius: 0.25rem;
		cursor: pointer;
	}

	.btn.primary {
		background: oklch(60% 0.2 24);
		color: white;
		border-color: oklch(60% 0.2 24);
	}

	.btn.disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn.loading::after {
		content: ' …';
	}
</style>
