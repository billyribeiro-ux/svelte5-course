<script lang="ts">
	import { fade } from 'svelte/transition';
	import { prefersReducedMotion } from 'svelte/motion';
	import Card from '$lib/Card.svelte';
	import Sparkline from '$lib/Sparkline.svelte';
	import BarChart, { type BarDatum } from '$lib/BarChart.svelte';
	import Metric from '$lib/Metric.svelte';
	import Legend, { type LegendItem } from '$lib/Legend.svelte';

	type Dataset = {
		visits: number[];
		signups: number[];
		revenue: number[];
		campaigns: BarDatum[];
		mrr: { value: number; delta: number };
		users: { value: number; delta: number };
	};

	function sample(base: number, variance: number, n = 24): number[] {
		return Array.from({ length: n }, () =>
			Math.max(0, Math.round(base + (Math.random() - 0.5) * variance))
		);
	}

	function generate(): Dataset {
		return {
			visits: sample(220, 120),
			signups: sample(40, 30),
			revenue: sample(3200, 1400),
			campaigns: [
				{ label: 'Search ads', value: Math.round(1000 + Math.random() * 2500) },
				{ label: 'Organic', value: Math.round(1500 + Math.random() * 2000) },
				{ label: 'Email', value: Math.round(500 + Math.random() * 1500) },
				{ label: 'Referral', value: Math.round(200 + Math.random() * 1200) },
				{ label: 'Paid social', value: Math.round(300 + Math.random() * 1800) }
			],
			mrr: { value: 48200 + Math.round(Math.random() * 4000), delta: (Math.random() - 0.3) * 20 },
			users: { value: 12800 + Math.round(Math.random() * 2000), delta: (Math.random() - 0.2) * 12 }
		};
	}

	let data = $state(generate());
	let refreshedAt = $state(new Date().toLocaleTimeString());
	let refreshCount = $state(0);

	const duration = $derived(prefersReducedMotion.current ? 0 : 250);

	const legend: LegendItem[] = [
		{ label: 'Search ads', color: 'oklch(60% 0.2 24)' },
		{ label: 'Organic', color: 'oklch(62% 0.16 150)' },
		{ label: 'Email', color: 'oklch(60% 0.18 250)' },
		{ label: 'Referral', color: 'oklch(58% 0.2 300)' },
		{ label: 'Paid social', color: 'oklch(70% 0.18 50)' }
	];

	$inspect('dashboard', { refreshCount, refreshedAt });

	function refresh(): void {
		data = generate();
		refreshedAt = new Date().toLocaleTimeString();
		refreshCount += 1;
	}

	function formatMoney(n: number): string {
		return `$${n.toLocaleString()}`;
	}
</script>

<header class="top">
	<div>
		<h1>Dashboard</h1>
		<p class="muted">Refreshed at {refreshedAt}</p>
	</div>
	<button type="button" class="btn" onclick={refresh}>Refresh ({refreshCount})</button>
</header>

<div class="grid">
	<Card class="metric-card">
		<Metric label="Visits (7d)" value={data.visits.reduce((a, b) => a + b, 0)} />
		{#key refreshCount}
			<div in:fade={{ duration }}>
				<Sparkline data={data.visits} color="oklch(60% 0.18 200)" width={200} height={40} />
			</div>
		{/key}
	</Card>

	<Card class="metric-card">
		<Metric label="Signups (7d)" value={data.signups.reduce((a, b) => a + b, 0)} />
		{#key refreshCount}
			<div in:fade={{ duration }}>
				<Sparkline data={data.signups} color="oklch(62% 0.16 150)" width={200} height={40} />
			</div>
		{/key}
	</Card>

	<Card class="metric-card">
		<Metric
			label="Revenue (7d)"
			value={data.revenue.reduce((a, b) => a + b, 0)}
			format={formatMoney}
		/>
		{#key refreshCount}
			<div in:fade={{ duration }}>
				<Sparkline data={data.revenue} color="oklch(60% 0.2 24)" width={200} height={40} />
			</div>
		{/key}
	</Card>

	<Card class="metric-card">
		<Metric label="MRR" value={data.mrr.value} delta={data.mrr.delta} format={formatMoney} />
	</Card>

	<Card class="metric-card">
		<Metric label="Active users" value={data.users.value} delta={data.users.delta} />
	</Card>

	<Card class="wide">
		<h3>Campaign attribution</h3>
		{#key refreshCount}
			<div in:fade={{ duration }}>
				<BarChart data={data.campaigns} />
			</div>
		{/key}
		<Legend items={legend} />
	</Card>
</div>

<style>
	.top {
		display: flex;
		justify-content: space-between;
		align-items: end;
		gap: var(--space-md);
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

	.btn {
		padding: var(--space-xs) var(--space-md);
		background: var(--color-accent);
		color: var(--color-accent-text);
		border: 1px solid var(--color-accent);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		cursor: pointer;
	}

	.btn:hover {
		background: var(--color-accent-hover);
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
		gap: var(--space-md);
	}

	:global(.metric-card) {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
	}

	:global(.wide) {
		grid-column: 1 / -1;
	}

	:global(.wide h3) {
		margin: 0 0 var(--space-md);
		font-size: var(--text-lg);
	}
</style>
