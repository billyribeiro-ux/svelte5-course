<!--
	The two forms of `$derived`.

	`$derived(expr)` is sugar for `$derived.by(() => expr)`.

	Rule of thumb:
	  - One-line expression, no conditional, no loop → `$derived(expr)`.
	  - Anything else → `$derived.by(() => { ... })`.

	There is no runtime difference. Pick the one that reads best.
-->
<script lang="ts">
	let nums = $state([1, 2, 3, 4, 5]);

	// Form 1 — single expression. Reads as "the total IS the reduced sum."
	let totalA = $derived(nums.reduce((s, n) => s + n, 0));

	// Form 2 — function body. Use this when you want to give intermediate values a name,
	// use a loop, or early-return.
	let totalB = $derived.by(() => {
		let sum = 0;
		for (const n of nums) sum += n;
		return sum;
	});

	// Identical at runtime. Prove it.
	let same = $derived(totalA === totalB);
</script>

<p>{nums.join(' + ')} = {totalA} (also {totalB}) — same: {same}</p>
<button onclick={() => nums.push(nums.length + 1)}>push</button>
