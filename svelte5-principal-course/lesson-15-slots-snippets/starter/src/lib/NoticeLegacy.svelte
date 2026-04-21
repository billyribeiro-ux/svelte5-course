<!--
	SVELTE 4 STYLE — kept alive via `<svelte:options runes={false}>`.

	This is the "before" component. Its API:
	  - default slot for body content
	  - named slot "actions" for buttons
	  - exported prop `variant`
	  - slot prop `close` passed down via let:close
-->
<svelte:options runes={false} />

<script>
	export let variant = 'info';

	let open = true;
	function close() {
		open = false;
	}
</script>

{#if open}
	<aside class="notice {variant}">
		<div class="body">
			<slot {close} />
		</div>
		<div class="actions">
			<slot name="actions" {close}>
				<button on:click={close}>Dismiss</button>
			</slot>
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
