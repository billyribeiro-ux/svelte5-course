<script lang="ts">
	type Priority = 'low' | 'med' | 'high';
	type ColumnId = 'todo' | 'in-progress' | 'done';

	type Card = {
		id: string;
		title: string;
		priority: Priority;
	};

	type Column = {
		id: ColumnId;
		title: string;
		cards: Card[];
	};

	const seed: Column[] = [
		{
			id: 'todo',
			title: 'To do',
			cards: [
				{ id: 'c1', title: 'Draft spec for billing v2', priority: 'high' },
				{ id: 'c2', title: 'Write migration script', priority: 'med' },
				{ id: 'c3', title: 'Add logging to webhook handler', priority: 'low' }
			]
		},
		{
			id: 'in-progress',
			title: 'In progress',
			cards: [{ id: 'c4', title: 'Port auth to the new service', priority: 'high' }]
		},
		{
			id: 'done',
			title: 'Done',
			cards: [{ id: 'c5', title: 'Set up monorepo tooling', priority: 'med' }]
		}
	];

	let board = $state(structuredClone(seed));
	let drafts = $state<Record<ColumnId, string>>({ todo: '', 'in-progress': '', done: '' });

	let idCounter = 0;
	function nextId(): string {
		idCounter += 1;
		return `c-${Date.now()}-${idCounter}`;
	}

	const total = $derived(board.reduce((n, col) => n + col.cards.length, 0));
	const doneCount = $derived(board.find((c) => c.id === 'done')?.cards.length ?? 0);

	$inspect('board', board);

	function priorityColor(p: Priority): string {
		if (p === 'high') return 'var(--color-danger)';
		if (p === 'med') return 'var(--color-warning)';
		return 'var(--color-success)';
	}

	function addCard(colId: ColumnId): void {
		const title = drafts[colId].trim();
		if (!title) return;
		const col = board.find((c) => c.id === colId);
		if (!col) return;
		col.cards.push({ id: nextId(), title, priority: 'med' });
		drafts[colId] = '';
	}

	function deleteCard(colId: ColumnId, cardId: string): void {
		const col = board.find((c) => c.id === colId);
		if (!col) return;
		col.cards = col.cards.filter((c) => c.id !== cardId);
	}

	function moveCard(colId: ColumnId, cardId: string, direction: -1 | 1): void {
		const colIdx = board.findIndex((c) => c.id === colId);
		const nextIdx = colIdx + direction;
		const current = board[colIdx];
		const next = board[nextIdx];
		if (!current || !next) return;

		const cardIdx = current.cards.findIndex((c) => c.id === cardId);
		if (cardIdx < 0) return;

		const [card] = current.cards.splice(cardIdx, 1);
		if (card) next.cards.push(card);
	}

	function reorder(colId: ColumnId, cardId: string, direction: -1 | 1): void {
		const col = board.find((c) => c.id === colId);
		if (!col) return;
		const idx = col.cards.findIndex((c) => c.id === cardId);
		const newIdx = idx + direction;
		if (idx < 0 || newIdx < 0 || newIdx >= col.cards.length) return;
		const card = col.cards[idx];
		if (!card) return;
		col.cards.splice(idx, 1);
		col.cards.splice(newIdx, 0, card);
	}

	function clearDone(): void {
		const done = board.find((c) => c.id === 'done');
		if (done) done.cards = [];
	}

	function resetBoard(): void {
		board = structuredClone(seed);
		drafts = { todo: '', 'in-progress': '', done: '' };
	}

	function handleSubmit(event: SubmitEvent, colId: ColumnId): void {
		event.preventDefault();
		addCard(colId);
	}

	function handleWindowKeydown(event: KeyboardEvent): void {
		if (event.key !== '/') return;
		// Don't hijack "/" if the user is typing into an input/textarea.
		const target = event.target;
		if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) return;

		event.preventDefault();
		const first = document.querySelector<HTMLInputElement>('[data-col-input="todo"]');
		first?.focus();
	}
</script>

<svelte:window onkeydown={handleWindowKeydown} />

{#snippet cardRow(card: Card, colIdx: number, cardIdx: number, col: Column)}
	{@const accent = priorityColor(card.priority)}
	<li class="card" style:--accent={accent}>
		<div class="card-body">
			<span class="title">{card.title}</span>
			<label class="priority">
				<span class="sr-only">Priority for {card.title}</span>
				<select bind:value={card.priority}>
					<option value="low">low</option>
					<option value="med">med</option>
					<option value="high">high</option>
				</select>
			</label>
		</div>
		<div class="actions">
			<button
				type="button"
				aria-label="Move up"
				onclick={() => reorder(col.id, card.id, -1)}
				disabled={cardIdx === 0}
			>↑</button>
			<button
				type="button"
				aria-label="Move down"
				onclick={() => reorder(col.id, card.id, 1)}
				disabled={cardIdx === col.cards.length - 1}
			>↓</button>
			<button
				type="button"
				aria-label="Move to previous column"
				onclick={() => moveCard(col.id, card.id, -1)}
				disabled={colIdx === 0}
			>←</button>
			<button
				type="button"
				aria-label="Move to next column"
				onclick={() => moveCard(col.id, card.id, 1)}
				disabled={colIdx === board.length - 1}
			>→</button>
			<button
				type="button"
				class="delete"
				aria-label="Delete"
				onclick={() => deleteCard(col.id, card.id)}
			>×</button>
		</div>
	</li>
{/snippet}

<header class="top">
	<div>
		<h1>Kanban</h1>
		<p class="muted">{total} {total === 1 ? 'card' : 'cards'} total · press <kbd>/</kbd> to focus the first column</p>
	</div>
	<div class="top-actions">
		{#if doneCount > 0}
			<button type="button" onclick={clearDone}>Clear done ({doneCount})</button>
		{/if}
		<button type="button" class="ghost" onclick={resetBoard}>Reset board</button>
	</div>
</header>

<div class="board">
	{#each board as col, colIdx (col.id)}
		<section class="column">
			<header class="column-head">
				<h2>{col.title}</h2>
				<span class="count" aria-label="{col.cards.length} cards">{col.cards.length}</span>
			</header>

			<ul class="cards">
				{#each col.cards as card, cardIdx (card.id)}
					{@render cardRow(card, colIdx, cardIdx, col)}
				{:else}
					<li class="empty">No cards yet.</li>
				{/each}
			</ul>

			<form class="add" onsubmit={(event) => handleSubmit(event, col.id)}>
				<input
					bind:value={drafts[col.id]}
					data-col-input={col.id}
					type="text"
					placeholder="New card…"
					aria-label="New card title for {col.title}"
					autocomplete="off"
				/>
				<button type="submit">Add</button>
			</form>
		</section>
	{/each}
</div>

<style>
	.sr-only {
		position: absolute;
		inline-size: 1px;
		block-size: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	.top {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-md);
		align-items: end;
		justify-content: space-between;
		margin-block-end: var(--space-lg);
	}

	.top h1 {
		margin: 0;
	}

	.muted {
		margin: 0;
		color: var(--color-text-muted);
		font-size: var(--text-sm);
	}

	kbd {
		display: inline-block;
		padding: 0.1em 0.4em;
		background: var(--color-surface-sunken);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		font-size: var(--text-xs);
		line-height: 1;
	}

	.top-actions {
		display: flex;
		gap: var(--space-sm);
	}

	.top-actions button,
	.add button {
		padding: var(--space-xs) var(--space-md);
		background: var(--color-accent);
		color: var(--color-accent-text);
		border: 1px solid var(--color-accent);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		cursor: pointer;
	}

	.top-actions button.ghost {
		background: transparent;
		color: var(--color-text);
		border-color: var(--color-border);
	}

	.top-actions button:hover,
	.add button:hover {
		background: var(--color-accent-hover);
		color: var(--color-accent-text);
		border-color: var(--color-accent-hover);
	}

	.top-actions button.ghost:hover {
		background: var(--color-surface-raised);
		color: var(--color-text);
		border-color: var(--color-border-strong);
	}

	.board {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-md);
	}

	@media (max-width: 48rem) {
		.board {
			grid-template-columns: 1fr;
		}
	}

	.column {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
		padding: var(--space-md);
		background: var(--color-surface-raised);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
	}

	.column-head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
	}

	.column-head h2 {
		margin: 0;
		font-size: var(--text-lg);
	}

	.count {
		min-inline-size: 1.75rem;
		text-align: center;
		padding: 0.125rem 0.5rem;
		background: var(--color-surface-sunken);
		border-radius: var(--radius-full);
		font-size: var(--text-xs);
		color: var(--color-text-muted);
		font-variant-numeric: tabular-nums;
	}

	.cards {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
		min-block-size: 3rem;
	}

	.card {
		--accent: var(--color-text-subtle);
		padding: var(--space-sm);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-inline-start: 3px solid var(--accent);
		border-radius: var(--radius-md);
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}

	.card-body {
		display: flex;
		align-items: start;
		justify-content: space-between;
		gap: var(--space-xs);
	}

	.title {
		font-size: var(--text-sm);
		line-height: var(--leading-normal);
	}

	.priority select {
		font-size: var(--text-xs);
		padding: 0.125rem 0.25rem;
		background: transparent;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		color: var(--color-text-muted);
	}

	.actions {
		display: flex;
		gap: 0.25rem;
		justify-content: flex-end;
	}

	.actions button {
		inline-size: 1.75rem;
		block-size: 1.75rem;
		padding: 0;
		background: transparent;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		font-size: var(--text-sm);
		cursor: pointer;
		color: var(--color-text-muted);
	}

	.actions button:hover:not(:disabled) {
		background: var(--color-surface-raised);
		border-color: var(--color-border-strong);
		color: var(--color-text);
	}

	.actions button:disabled {
		opacity: 0.35;
		cursor: not-allowed;
	}

	.actions .delete:hover:not(:disabled) {
		color: var(--color-danger);
		border-color: var(--color-danger);
	}

	.empty {
		padding: var(--space-sm);
		color: var(--color-text-subtle);
		font-size: var(--text-sm);
		text-align: center;
		border: 1px dashed var(--color-border);
		border-radius: var(--radius-md);
	}

	.add {
		display: flex;
		gap: var(--space-xs);
		margin-block-start: auto;
	}

	.add input {
		flex: 1;
		padding: var(--space-xs) var(--space-sm);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		font-size: var(--text-sm);
		color: var(--color-text);
	}

	.add input:focus {
		outline: 2px solid var(--color-accent);
		outline-offset: 1px;
	}
</style>
