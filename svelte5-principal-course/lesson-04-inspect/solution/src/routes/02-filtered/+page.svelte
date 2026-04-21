<script lang="ts">
	let level = $state(50);

	$inspect(level).with((type, value) => {
		if (value >= 95) console.error(type, 'critical', value);
		else if (value >= 80) console.warn(type, 'high', value);
	});
</script>

<h1>02 — Filtered $inspect</h1>
<p>
	Drag the slider. Only values ≥ 80 log (warn); ≥ 95 logs as error. The <code>type</code>
	argument is <code>'init'</code> on the first run and <code>'update'</code> afterwards, so you can
	tell the first render apart from subsequent changes.
</p>

<label>
	Level: {level}
	<input type="range" min="0" max="100" bind:value={level} />
</label>

<div class="buttons">
	<button type="button" onclick={() => (level = 0)}>0</button>
	<button type="button" onclick={() => (level = 75)}>75</button>
	<button type="button" onclick={() => (level = 85)}>85</button>
	<button type="button" onclick={() => (level = 99)}>99</button>
</div>

<style>
	label {
		display: flex;
		flex-direction: column;
		gap: var(--space-2xs);
		margin-block: var(--space-md);
	}

	input[type='range'] {
		inline-size: 100%;
	}

	.buttons {
		display: flex;
		gap: var(--space-sm);
		flex-wrap: wrap;
	}
</style>
