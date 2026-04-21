<!--
	Push-pull reactivity + referential equality short-circuit.

	`count` updates every click. `large` is derived: `count > 10`.
	  - When count < 10 and ticks up from 3 → 4, `large` recomputes to `false`.
	  - `false === false` — identical — so downstream reactivity stops here.
	  - The DOM text for `large` is NOT touched.

	Only when count crosses 10 → 11 does `large` flip `false → true` and
	actually re-render the "threshold" text.

	Cost: incrementing count 1000× does NOT cost 1000 DOM updates for `large`.
-->
<script lang="ts">
	let count = $state(0);
	let large = $derived(count > 10);
</script>

<button onclick={() => count++}>count++</button>

<p>count = {count}</p>
<p class="threshold">large = {large}</p>

<p class="tip">
	Increment count past 10. The <code>large</code> text node only mutates at the flip point.
	This is why deriving a boolean threshold from a rapidly-changing number is cheap.
</p>

<style>
	.threshold {
		font-family: ui-monospace, monospace;
	}

	.tip {
		color: oklch(60% 0.02 250);
		font-size: 0.9em;
	}
</style>
