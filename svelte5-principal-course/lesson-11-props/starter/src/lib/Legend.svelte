<script lang="ts">
	export type LegendItem = { label: string; color: string };

	// Lesson 11 build:
	//   interface Props { items: LegendItem[]; class?: string; }
	//   let { items, class: className = '' }: Props = $props();
	interface Props {
		items: LegendItem[];
		class?: string;
	}

	let { items, class: className = '' }: Props = $props();
</script>

<ul class={['legend', className]}>
	{#each items as item (item.label)}
		<li>
			<span class="swatch" style:background={item.color}></span>
			<span class="label">{item.label}</span>
		</li>
	{/each}
</ul>

<style>
	.legend {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-sm) var(--space-md);
		font-size: var(--text-sm);
	}

	.legend li {
		display: inline-flex;
		align-items: center;
		gap: var(--space-xs);
	}

	.swatch {
		inline-size: 0.625rem;
		block-size: 0.625rem;
		border-radius: 2px;
	}

	.label {
		color: var(--color-text-muted);
	}
</style>
