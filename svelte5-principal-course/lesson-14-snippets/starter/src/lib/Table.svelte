<script lang="ts" generics="T">
	import type { Snippet } from 'svelte';

	interface Props<T> {
		data: T[];
		columns: string[];
		header?: Snippet;
		row: Snippet<[T]>;
		empty?: Snippet;
		class?: string;
	}

	let {
		data,
		columns,
		header,
		row,
		empty,
		class: className = ''
	}: Props<T> = $props();
</script>

<div class={['wrap', className]}>
	<table>
		{#if header}
			<caption>{@render header()}</caption>
		{/if}
		<thead>
			<tr>
				{#each columns as col (col)}
					<th>{col}</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#if data.length === 0}
				<tr>
					<td colspan={columns.length} class="empty-cell">
						{#if empty}
							{@render empty()}
						{:else}
							No records.
						{/if}
					</td>
				</tr>
			{:else}
				{#each data as record (record)}
					<tr>{@render row(record)}</tr>
				{/each}
			{/if}
		</tbody>
	</table>
</div>

<style>
	.wrap {
		background: var(--color-surface-raised);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		overflow: hidden;
	}

	table {
		inline-size: 100%;
		border-collapse: collapse;
		font-size: var(--text-sm);
	}

	caption {
		padding: var(--space-md);
		text-align: start;
		background: var(--color-surface-sunken);
		font-weight: 600;
		color: var(--color-text);
		border-block-end: 1px solid var(--color-border);
	}

	thead {
		background: var(--color-surface-sunken);
	}

	th {
		text-align: start;
		padding: var(--space-xs) var(--space-md);
		color: var(--color-text-muted);
		font-size: var(--text-xs);
		text-transform: uppercase;
		letter-spacing: 0.04em;
		font-weight: 600;
	}

	tbody :global(td) {
		padding: var(--space-sm) var(--space-md);
		border-block-start: 1px solid var(--color-border);
	}

	.empty-cell {
		text-align: center;
		color: var(--color-text-subtle);
		padding-block: var(--space-lg);
	}
</style>
