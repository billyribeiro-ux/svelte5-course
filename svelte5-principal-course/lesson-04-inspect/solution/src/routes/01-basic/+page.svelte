<script lang="ts">
	const form = $state({ name: '', age: 30, color: '#ff3e00' });

	function bumpAge(): void {
		form.age += 1;
	}

	function reset(): void {
		form.name = '';
		form.age = 30;
		form.color = '#ff3e00';
	}

	$inspect(form);
</script>

<h1>01 — Basic $inspect</h1>
<p>Open DevTools → Console. Edit the fields and click the buttons. Every change logs.</p>

<form>
	<label>Name <input bind:value={form.name} /></label>
	<label>Age <input type="number" bind:value={form.age} /></label>
	<label>Favorite color <input type="color" bind:value={form.color} /></label>
</form>

<div class="buttons">
	<button type="button" onclick={bumpAge}>age++</button>
	<button type="button" onclick={reset}>reset</button>
</div>

<pre>{JSON.stringify(form, null, 2)}</pre>

<style>
	form {
		display: grid;
		gap: var(--space-sm);
		margin-block: var(--space-md);
		max-inline-size: 24rem;
	}

	label {
		display: flex;
		flex-direction: column;
		gap: var(--space-2xs);
	}

	.buttons {
		display: flex;
		gap: var(--space-sm);
		margin-block-end: var(--space-md);
	}

	pre {
		background: var(--color-surface-sunken);
		padding: var(--space-md);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
	}
</style>
