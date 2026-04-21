<!--
	Dependencies are whatever state is read synchronously inside the derived.
	That means a conditional branch changes the dependency set.

	Toggle `useA`:
	  - true:  `chosen` depends on `a` (and `useA`). Changing `b` does NOT recompute.
	  - false: `chosen` depends on `b` (and `useA`). Changing `a` does NOT recompute.

	Svelte re-tracks on each evaluation. You do not need to declare deps.
-->
<script lang="ts">
	let a = $state(10);
	let b = $state(20);
	let useA = $state(true);

	let chosen = $derived(useA ? a : b);
</script>

<p>chosen = {chosen}</p>

<label>
	<input type="checkbox" bind:checked={useA} />
	use A
</label>

<fieldset>
	<legend>change a</legend>
	<button onclick={() => a++}>a++ ({a})</button>
</fieldset>

<fieldset>
	<legend>change b</legend>
	<button onclick={() => b++}>b++ ({b})</button>
</fieldset>

<p class="tip">Open DevTools and watch: when <code>useA</code> is true, clicking <code>b++</code> updates <code>b</code> in memory but does not re-render the <code>chosen</code> text node.</p>

<style>
	.tip {
		color: oklch(60% 0.02 250);
		font-size: 0.9em;
	}
</style>
