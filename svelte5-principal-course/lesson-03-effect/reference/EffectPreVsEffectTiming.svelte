<!--
	$effect runs AFTER the DOM has been updated.
	$effect.pre runs BEFORE the DOM has been updated.

	The paragraph below shows the current value of `count` in its textContent.
	When you click the button:
	  - $effect.pre reads textContent and sees the OLD value (pre-update DOM)
	  - $effect reads textContent and sees the NEW value (post-update DOM)
-->
<script lang="ts">
	let count = $state(0);
	let paraRef = $state<HTMLParagraphElement | undefined>(undefined);
	let preLog = $state<string[]>([]);
	let postLog = $state<string[]>([]);

	$effect.pre(() => {
		count; // track
		if (!paraRef) return;
		preLog.push(`pre sees textContent="${paraRef.textContent}"`);
	});

	$effect(() => {
		count; // track
		if (!paraRef) return;
		postLog.push(`post sees textContent="${paraRef.textContent}"`);
	});
</script>

<button onclick={() => count++}>count++ (now {count})</button>

<p bind:this={paraRef}>{count}</p>

<h3>$effect.pre log</h3>
<ul>{#each preLog as line, i (i)}<li>{line}</li>{/each}</ul>

<h3>$effect log</h3>
<ul>{#each postLog as line, i (i)}<li>{line}</li>{/each}</ul>

<p class="tip">
	Use <code>$effect.pre</code> when you need to read or measure the DOM
	as-it-was-before-this-state-change (autoscroll, caret preservation, animating
	layout shifts). Default to plain <code>$effect</code> otherwise.
</p>

<style>
	.tip { color: oklch(60% 0.02 250); font-size: 0.9em; max-inline-size: 40rem; }
	ul { list-style: none; padding: 0; font-family: ui-monospace, monospace; font-size: 0.85em; }
</style>
