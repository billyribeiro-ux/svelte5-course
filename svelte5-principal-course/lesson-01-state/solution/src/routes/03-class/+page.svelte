<script lang="ts">
	import { Todo } from '$lib/todo.svelte';

	let todos = $state<Todo[]>([]);
	let draft = $state('');

	function submit(e: SubmitEvent) {
		e.preventDefault();
		const text = draft.trim();
		if (!text) return;
		todos.push(new Todo(text));
		draft = '';
	}

	function remove(todo: Todo) {
		const i = todos.indexOf(todo);
		if (i !== -1) todos.splice(i, 1);
	}
</script>

<h1>03 — Class state</h1>
<p>
	Same UI as /02-todos, but each row is a <code>Todo</code> class instance.
	<code>toggle</code> is an arrow field on the class, so it stays bound when
	passed to <code>onchange</code>.
</p>

<form onsubmit={submit}>
	<input bind:value={draft} placeholder="add a todo" />
	<button disabled={draft.trim() === ''}>add</button>
</form>

{#if todos.length === 0}
	<p class="empty">No todos yet.</p>
{:else}
	<ul>
		{#each todos as todo (todo)}
			<li class:done={todo.done}>
				<label>
					<input type="checkbox" checked={todo.done} onchange={todo.toggle} />
					<span>{todo.text}</span>
				</label>
				<button onclick={() => remove(todo)} aria-label="delete todo">×</button>
			</li>
		{/each}
	</ul>
{/if}

<style>
	form {
		display: flex;
		gap: var(--space-xs);
		margin-block-start: var(--space-md);
	}

	form input {
		flex: 1;
		padding: var(--space-xs) var(--space-sm);
		border: 1px solid var(--color-border-strong);
		border-radius: var(--radius-sm);
		background: var(--color-surface);
	}

	form button {
		padding: var(--space-xs) var(--space-md);
		background: var(--color-accent);
		color: var(--color-accent-text);
		border-radius: var(--radius-sm);
	}

	form button:disabled {
		background: var(--color-border-strong);
		cursor: not-allowed;
	}

	ul {
		list-style: none;
		padding: 0;
		margin-block-start: var(--space-md);
		display: flex;
		flex-direction: column;
		gap: var(--space-2xs);
	}

	li {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--space-xs) var(--space-sm);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		background: var(--color-surface-raised);
	}

	li label {
		display: flex;
		align-items: center;
		gap: var(--space-xs);
		flex: 1;
	}

	li.done span {
		text-decoration: line-through;
		color: var(--color-text-subtle);
	}

	li button {
		font-size: var(--text-xl);
		color: var(--color-text-subtle);
		line-height: 1;
	}

	li button:hover {
		color: var(--color-danger);
	}

	.empty {
		margin-block-start: var(--space-md);
		color: var(--color-text-muted);
		font-style: italic;
	}

	code {
		padding: 0.1em 0.3em;
		background: var(--color-surface-sunken);
		border-radius: var(--radius-sm);
	}
</style>
