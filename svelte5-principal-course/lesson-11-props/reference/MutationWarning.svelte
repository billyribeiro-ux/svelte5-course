<!--
	What happens when a child mutates a prop it doesn't own.

	Case A: parent passed a plain object — the mutation has no effect.
	Case B: parent passed a $state proxy — mutation WORKS but emits
	        `ownership_invalid_mutation` in the browser console.

	Open DevTools before clicking "Add item" to see the warning.

	The correct shape: pass a callback (onAdd) from the parent, or promote
	the prop to $bindable (Lesson 13) if the child truly owns it.
-->
<script lang="ts">
	let sharedState = $state({ items: ['alpha', 'bravo'] });

	function addViaMutation(): void {
		sharedState.items.push('charlie');
	}

	function addViaReassignment(): void {
		sharedState = { items: [...sharedState.items, 'charlie'] };
	}
</script>

<h3>Outer state</h3>
<p>Items: <code>{sharedState.items.join(', ')}</code></p>

<div class="row">
	<button type="button" onclick={addViaMutation}>Mutate (warns)</button>
	<button type="button" onclick={addViaReassignment}>Reassign (clean)</button>
</div>

<p class="hint">
	Open DevTools console before clicking "Mutate (warns)". You'll see an
	<code>ownership_invalid_mutation</code> log because the mutation crosses
	a boundary that only <code>$bindable</code> should cross.
</p>

<style>
	.row {
		display: flex;
		gap: 0.5rem;
		margin-block: 0.5rem;
	}

	.hint {
		font-size: 0.875rem;
		color: #666;
	}
</style>
