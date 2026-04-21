<script lang="ts">
	// Lesson 01 build — rebuild /02-todos using the Todo class from $lib.
	//
	// 1. Open src/lib/todo.svelte.ts and make the class reactive
	//    (convert fields to $state, add arrow-function `toggle` and `remove`).
	// 2. Back here: import Todo, hold an array of Todo instances in $state,
	//    and render them. Use todo.toggle and todo.remove directly as event
	//    handlers — that's why they need to be arrow fields, not methods.
	//
	// See README Worked example 3.
</script>

<h1>03 — Class state</h1>
<p class="pending">
	Build me. Start by editing <code>$lib/todo.svelte.ts</code>, then render a
	list of Todo instances here.
</p>

<style>
	.pending {
		padding: var(--space-md);
		border: 1px dashed var(--color-border-strong);
		border-radius: var(--radius-md);
		color: var(--color-text-muted);
		margin-block-start: var(--space-md);
	}

	code {
		padding: 0.1em 0.3em;
		background: var(--color-surface-sunken);
		border-radius: var(--radius-sm);
	}
</style>
