<script lang="ts">
	// Lesson 04 build:
	//   Use $inspect(level).with(callback) so the callback only logs when
	//   the level crosses a threshold (>= 80 → warn, >= 95 → error,
	//   everything else → stay silent). `type` is 'init' on first run and
	//   'update' on subsequent runs — use that to distinguish the first log.

	let level = $state(50);

	// Lesson 04 build:
	// $inspect(level).with((type, value) => {
	//   if (value >= 95) console.error(type, 'critical', value);
	//   else if (value >= 80) console.warn(type, 'high', value);
	// });
</script>

<h1>02 — Filtered $inspect</h1>
<p>
	Drag the slider. Only values ≥ 80 should log (warn), and ≥ 95 should log as error. Values below 80
	should log <em>nothing</em> — silence is the point.
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
