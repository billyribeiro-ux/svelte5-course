<script lang="ts">
	import type { Snippet } from 'svelte';

	interface SlotArgs {
		close: () => void;
	}

	interface Props {
		variant?: 'info' | 'warning' | 'danger';
		children: Snippet<[SlotArgs]>;
		actions?: Snippet<[SlotArgs]>;
	}

	let { variant = 'info', children, actions }: Props = $props();

	let open = $state(true);
	function close(): void {
		open = false;
	}
</script>

{#if open}
	<aside class={['notice', variant]}>
		<div class="body">
			{@render children({ close })}
		</div>
		<div class="actions">
			{#if actions}
				{@render actions({ close })}
			{:else}
				<button type="button" onclick={close}>Dismiss</button>
			{/if}
		</div>
	</aside>
{/if}

<style>
	.notice {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		padding: 0.75rem 1rem;
		border-radius: 0.5rem;
		border: 1px solid var(--color-border);
		background: var(--color-surface-raised);
		font-size: 0.875rem;
	}
	.notice.info { border-inline-start: 3px solid var(--color-accent); }
	.notice.warning { border-inline-start: 3px solid var(--color-warning); }
	.notice.danger { border-inline-start: 3px solid var(--color-danger); }

	.actions { display: flex; gap: 0.5rem; }
	.actions button {
		padding: 0.25rem 0.75rem;
		background: transparent;
		border: 1px solid var(--color-border);
		border-radius: 0.25rem;
		cursor: pointer;
		font: inherit;
	}
</style>
