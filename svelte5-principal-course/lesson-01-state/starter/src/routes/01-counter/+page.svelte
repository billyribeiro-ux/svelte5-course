<script lang="ts">
	// Lesson 01 build:
	// - Declare `count` as a $state primitive starting at 0
	// - Wire the button's onclick to increment it
	// - Swap the literal 0 in the label with your reactive variable
	//
	// See README Worked example 1 if stuck.
</script>

<h1>01 — Counter</h1>
<p>Make this button update the count in its label.</p>

<button class="counter" onclick={() => {}}>clicks: 0</button>

<style>
	.counter {
		padding: var(--space-sm) var(--space-lg);
		background: var(--color-accent);
		color: var(--color-accent-text);
		border-radius: var(--radius-md);
		font-size: var(--text-lg);
		margin-block-start: var(--space-md);
	}

	.counter:hover {
		background: var(--color-accent-hover);
	}
</style>
