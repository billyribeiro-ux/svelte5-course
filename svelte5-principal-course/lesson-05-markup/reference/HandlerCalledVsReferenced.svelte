<!--
	The #1 event-handler bug in every Svelte codebase.

	`onclick={handler}`   → pass the function, fires on click.
	`onclick={handler()}` → CALL the function at render, pass its RETURN VALUE.

	If `handler()` returns undefined, the button has no listener.
	If it returns a function, that function becomes the listener (occasionally
	useful, often accidental).
-->
<script lang="ts">
	let count = $state(0);

	function increment(): void {
		count += 1;
	}

	// Lab: swap between the two buttons below and watch the count.
	// `onclick={increment}`   — correct, fires on click.
	// `onclick={increment()}` — calls increment() immediately at render time,
	//                           so `count` jumps to 1 before any click happens.
	//                           Clicking then does nothing.
</script>

<p>Count: {count}</p>

<button type="button" onclick={increment}>Correct: onclick=&lbrace;increment&rbrace;</button>
<button type="button" onclick={() => increment()}>Also correct: arrow wrapper</button>

<!-- Uncomment to see the bug:
<button type="button" onclick={increment()}>Wrong: onclick=&lbrace;increment()&rbrace;</button>
-->

<style>
	button {
		display: block;
		margin-block: 0.5rem;
	}
</style>
