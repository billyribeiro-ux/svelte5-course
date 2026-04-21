<script lang="ts">
	type Todo = { id: number; text: string; done: boolean };

	let todos = $state<Todo[]>([]);
	let draft = $state('');
	let nextId = 1;

	function add() {
		const text = draft.trim();
		if (!text) return;
		todos.push({ id: nextId++, text, done: false });
		draft = '';
	}

	function toggle(id: number) {
		const todo = todos.find((t) => t.id === id);
		if (todo) todo.done = !todo.done;
	}

	function remove(id: number) {
		const idx = todos.findIndex((t) => t.id === id);
		if (idx !== -1) todos.splice(idx, 1);
	}

	function submit(e: SubmitEvent) {
		e.preventDefault();
		add();
	}
</script>

<h1>02 — Todos</h1>

<form onsubmit={submit}>
	<input bind:value={draft} placeholder="add a todo" />
	<button disabled={draft.trim() === ''}>add</button>
</form>

{#if todos.length === 0}
	<p class="empty">No todos yet. Type one above.</p>
{:else}
	<ul>
		{#each todos as todo (todo.id)}
			<li class:done={todo.done}>
				<label>
					<input type="checkbox" checked={todo.done} onchange={() => toggle(todo.id)} />
					<span>{todo.text}</span>
				</label>
				<button onclick={() => remove(todo.id)} aria-label="delete todo">×</button>
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
</style>
