<!--
	Anti-pattern: using $effect to derive one value from another.

	Wrong:  two writers, microtask lag, eager recompute even when nobody reads.
	Right:  $derived — lazy, single-source, no lag.
-->
<script lang="ts">
	let count = $state(0);

	// ❌ DO NOT DO THIS. Shown for illustration only.
	let doubledBad = $state(0);
	$effect(() => {
		doubledBad = count * 2;
	});

	// ✅ This is the correct form.
	let doubledGood = $derived(count * 2);
</script>

<button onclick={() => count++}>count = {count}</button>

<p>wrong (effect): {doubledBad}</p>
<p>right (derived): {doubledGood}</p>

<p class="tip">
	Both show the same value eventually. But the $effect version:
	(1) runs even if nobody reads <code>doubledBad</code>;
	(2) is one microtask behind on the very first render;
	(3) creates two writers on <code>doubledBad</code> — anyone else assigning it fights the effect.
</p>

<style>
	.tip {
		color: oklch(60% 0.02 250);
		font-size: 0.9em;
		max-inline-size: 40rem;
	}
</style>
