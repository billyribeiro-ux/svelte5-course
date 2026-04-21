<script lang="ts">
	import Table from '$lib/Table.svelte';

	type User = {
		id: string;
		name: string;
		role: 'admin' | 'member' | 'billing';
		usage: number; // 0–100
	};

	let showEmpty = $state(false);

	const users: User[] = [
		{ id: '1', name: 'Billy Ribeiro', role: 'admin', usage: 92 },
		{ id: '2', name: 'Ana Silva', role: 'member', usage: 48 },
		{ id: '3', name: 'Kwame Opoku', role: 'billing', usage: 76 },
		{ id: '4', name: 'Hannah Lee', role: 'member', usage: 22 },
		{ id: '5', name: 'Rafael Costa', role: 'admin', usage: 61 }
	];

	const data = $derived(showEmpty ? [] : users);
</script>

<header class="top">
	<h1>Users</h1>
	<label class="inline">
		<input type="checkbox" bind:checked={showEmpty} />
		<span>Show empty state</span>
	</label>
</header>

<Table {data} columns={['Name', 'Role', 'Usage']}>
	{#snippet header()}
		Team members — {data.length} total
	{/snippet}

	{#snippet row(user: User)}
		<td><strong>{user.name}</strong></td>
		<td>
			<span class={['badge', user.role]}>{user.role}</span>
		</td>
		<td>
			<div class="usage">
				<div class="bar" style:inline-size="{user.usage}%" style:background={user.usage > 80 ? 'var(--color-danger)' : user.usage > 50 ? 'var(--color-warning)' : 'var(--color-success)'}></div>
				<span>{user.usage}%</span>
			</div>
		</td>
	{/snippet}

	{#snippet empty()}
		<strong>No members yet.</strong><br />
		Invite your first teammate to see them here.
	{/snippet}
</Table>

<style>
	.top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-block-end: var(--space-md);
	}
	.top h1 { margin: 0; }
	.inline {
		display: inline-flex;
		align-items: center;
		gap: var(--space-xs);
		font-size: var(--text-sm);
	}

	.badge {
		display: inline-block;
		padding: 0.1em 0.6em;
		font-size: var(--text-xs);
		border-radius: 999px;
		border: 1px solid transparent;
		text-transform: capitalize;
	}

	.badge.admin {
		background: oklch(from var(--color-accent) l c h / 0.15);
		color: var(--color-accent);
		border-color: oklch(from var(--color-accent) l c h / 0.35);
	}

	.badge.member {
		background: var(--color-surface-sunken);
		color: var(--color-text-muted);
		border-color: var(--color-border);
	}

	.badge.billing {
		background: oklch(from var(--color-warning) l c h / 0.15);
		color: var(--color-warning);
		border-color: oklch(from var(--color-warning) l c h / 0.35);
	}

	.usage {
		display: grid;
		grid-template-columns: 1fr 3rem;
		gap: var(--space-sm);
		align-items: center;
	}

	.bar {
		block-size: 0.5rem;
		border-radius: 999px;
		transition: inline-size var(--duration-normal) var(--ease-out);
	}

	.usage span {
		color: var(--color-text-muted);
		font-size: var(--text-xs);
		text-align: end;
		font-variant-numeric: tabular-nums;
	}
</style>
