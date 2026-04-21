<script lang="ts">
	interface Props {
		label: string;
		value: number;
		delta?: number;
		format?: (n: number) => string;
		class?: string;
	}

	let {
		label,
		value,
		delta,
		format = (n: number) => n.toLocaleString(),
		class: className = ''
	}: Props = $props();
</script>

<div class={['metric', className]}>
	<span class="label">{label}</span>
	<span class="value">{format(value)}</span>
	{#if delta !== undefined}
		<span class={['delta', delta > 0 && 'up', delta < 0 && 'down']}>
			{delta > 0 ? '+' : ''}{delta.toFixed(1)}%
		</span>
	{/if}
</div>

<style>
	.metric {
		display: flex;
		flex-direction: column;
		gap: var(--space-2xs);
	}

	.label {
		color: var(--color-text-muted);
		font-size: var(--text-xs);
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.value {
		font-size: var(--text-3xl);
		font-weight: 600;
		line-height: var(--leading-tight);
		font-variant-numeric: tabular-nums;
	}

	.delta {
		align-self: flex-start;
		padding: 0.1em 0.5em;
		font-size: var(--text-xs);
		border-radius: 999px;
		background: var(--color-surface-sunken);
		color: var(--color-text-muted);
	}

	.delta.up {
		background: oklch(from var(--color-success) l c h / 0.15);
		color: var(--color-success);
	}

	.delta.down {
		background: oklch(from var(--color-danger) l c h / 0.15);
		color: var(--color-danger);
	}
</style>
