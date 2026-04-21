<script lang="ts">
	export type BarDatum = { label: string; value: number };

	interface Props {
		data: BarDatum[];
		max?: number;
		color?: string;
		class?: string;
	}

	let {
		data,
		max,
		color = 'var(--color-accent)',
		class: className = ''
	}: Props = $props();

	const effectiveMax = $derived(max ?? Math.max(1, ...data.map((d) => d.value)));
</script>

<ul class={['bars', className]}>
	{#each data as d (d.label)}
		<li>
			<span class="label">{d.label}</span>
			<div class="track">
				<div
					class="fill"
					style:inline-size="{(d.value / effectiveMax) * 100}%"
					style:background={color}
				></div>
			</div>
			<span class="value">{d.value.toLocaleString()}</span>
		</li>
	{/each}
</ul>

<style>
	.bars {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}

	.bars li {
		display: grid;
		grid-template-columns: 8rem 1fr 4rem;
		gap: var(--space-sm);
		align-items: center;
		font-size: var(--text-sm);
	}

	.label {
		color: var(--color-text);
	}

	.track {
		block-size: 0.75rem;
		background: var(--color-surface-sunken);
		border-radius: var(--radius-full);
		overflow: hidden;
	}

	.fill {
		block-size: 100%;
		border-radius: inherit;
		transition: inline-size var(--duration-normal) var(--ease-out);
	}

	.value {
		color: var(--color-text-muted);
		font-variant-numeric: tabular-nums;
		text-align: end;
	}
</style>
