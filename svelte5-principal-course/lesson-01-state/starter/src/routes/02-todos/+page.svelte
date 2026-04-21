<script lang="ts">
	// Lesson 01 build — todo list
	//
	// Type:    type Todo = { id: number; text: string; done: boolean };
	// State:   a reactive Todo[] and a reactive draft string for the input
	// Actions: add (push a new todo made from draft, then clear draft)
	//          toggle (flip one todo's `done` by id)
	//          remove (drop a todo by id)
	// Template: a form with input + add button, then a keyed {#each} list
	//           showing checkbox + text + delete button.
	//
	// Use a keyed each block — the key lets Svelte keep DOM nodes stable
	// across reorders, which matters in later lessons on transitions.
	//
	// See README Worked example 2.
</script>

<h1>02 — Todos</h1>
<p class="pending">Build me. See the README for the spec.</p>

<style>
	.pending {
		padding: var(--space-md);
		border: 1px dashed var(--color-border-strong);
		border-radius: var(--radius-md);
		color: var(--color-text-muted);
		margin-block-start: var(--space-md);
	}
</style>
