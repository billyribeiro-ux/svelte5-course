<!--
	Lesson 05 reference — Svelte 4 to 5 event syntax migration.

	Three things changed:

	1. `on:click` → `onclick`. Event handlers are plain attributes starting
	   with `on`. No more colon prefix.

	2. No more `|preventDefault` / `|stopPropagation` event modifiers. Call
	   the method on the event object inside the handler.

	   Svelte 4:  <form on:submit|preventDefault={save}>
	   Svelte 5:  <form onsubmit={(e) => { e.preventDefault(); save(); }}>

	3. Attribute shorthand still works: `<button {onclick}>` is the same as
	   `<button onclick={onclick}>`.

	Below: a form that captures Enter via the standard submit event,
	prevents the page reload, and updates state. A demo of (1) and (2)
	together.
-->
<script lang="ts">
	let name = $state('');
	let submitted = $state<string | null>(null);

	function save(e: SubmitEvent): void {
		// (2) preventDefault is a method call now, not a modifier.
		e.preventDefault();
		submitted = name;
	}

	// (1) onclick handler. Could also use the shorthand `{handler}`.
	function clear(): void {
		name = '';
		submitted = null;
	}
</script>

<h2>Svelte 5 event syntax</h2>

<form onsubmit={save}>
	<label>
		Name
		<input bind:value={name} placeholder="Type and press Enter" />
	</label>
	<div class="actions">
		<button type="submit" disabled={name.trim() === ''}>Save</button>
		<button type="button" onclick={clear}>Clear</button>
	</div>
</form>

{#if submitted !== null}
	<p>Last saved: <strong>{submitted}</strong></p>
{/if}

<p class="tip">
	The form's <code>onsubmit</code> fires on Enter inside the input AND on the Save button.
	Inside the handler we call <code>e.preventDefault()</code> to stop the browser's default
	reload — that's the Svelte 5 idiom in place of the old <code>|preventDefault</code> modifier.
</p>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-block: 1rem;
		max-inline-size: 24rem;
	}
	label {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}
	input {
		padding: 0.25rem 0.5rem;
	}
	.actions {
		display: flex;
		gap: 0.5rem;
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
		cursor: not-allowed;
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
