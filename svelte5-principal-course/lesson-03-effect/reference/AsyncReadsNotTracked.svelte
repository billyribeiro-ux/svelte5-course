<!--
	Dependencies are whatever you read SYNCHRONOUSLY inside the effect body.
	Reads inside setTimeout, Promise.then, await, or any async callback are NOT tracked.

	Below: only `a` is a dep of the effect, because `b` is only read inside the setTimeout.
	Increment `a` → effect re-runs. Increment `b` → effect does NOT re-run.

	The fix is to cache the async-read value in a local SYNC read first.
-->
<script lang="ts">
	let a = $state(0);
	let b = $state(0);
	let logs = $state<string[]>([]);

	$effect(() => {
		// sync read — tracked
		const aNow = a;

		setTimeout(() => {
			// async read — NOT tracked
			logs.push(`a=${aNow} b=${b}`);
		}, 0);
	});
</script>

<button onclick={() => a++}>a++ ({a})</button>
<button onclick={() => b++}>b++ ({b})</button>

<ul>
	{#each logs as entry, i (i)}
		<li>{entry}</li>
	{/each}
</ul>

<p class="tip">
	Click "a++" a few times — new log lines appear. Click "b++" a few times — no new lines.
	The effect only re-runs when tracked deps change, and <code>b</code> was read async,
	so it was never tracked.
</p>

<style>
	.tip {
		color: oklch(60% 0.02 250);
		font-size: 0.9em;
		max-inline-size: 40rem;
	}

	ul {
		list-style: none;
		padding: 0;
		font-family: ui-monospace, monospace;
	}
</style>
