<script lang="ts">
	// Lesson 11 build:
	//   interface Props { data: number[]; color?: string; width?: number;
	//                     height?: number; class?: string; }
	//   let { data, color = 'var(--color-accent)', width = 120, height = 32,
	//         class: className = '' }: Props = $props();
	interface Props {
		data: number[];
		color?: string;
		width?: number;
		height?: number;
		class?: string;
	}

	let {
		data,
		color = 'var(--color-accent)',
		width = 120,
		height = 32,
		class: className = ''
	}: Props = $props();

	const points = $derived.by(() => {
		if (data.length === 0) return '';
		const min = Math.min(...data);
		const max = Math.max(...data);
		const range = max - min || 1;
		const step = width / Math.max(1, data.length - 1);
		return data
			.map((v, i) => {
				const x = i * step;
				const y = height - ((v - min) / range) * height;
				return `${x.toFixed(1)},${y.toFixed(1)}`;
			})
			.join(' ');
	});

	const areaPath = $derived.by(() => {
		if (!points) return '';
		return `M 0,${height} L ${points} L ${width},${height} Z`;
	});
</script>

<svg
	class={['sparkline', className]}
	{width}
	{height}
	viewBox="0 0 {width} {height}"
	aria-hidden="true"
>
	<path d={areaPath} fill={color} opacity="0.15" />
	<polyline {points} fill="none" stroke={color} stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round" />
</svg>

<style>
	.sparkline {
		display: block;
	}
</style>
