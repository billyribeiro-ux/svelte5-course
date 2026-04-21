<script lang="ts">
	// $inspect(x).with((type, value) => ...)
	//   type === 'init'   → first run, before any change
	//   type === 'update' → any subsequent change
	// Use the distinction to skip noisy first-render logs, or to mark
	// only transitions of interest (e.g. crossing a threshold upward).

	let count = $state(0);
	let previous: number | undefined;

	$inspect(count).with((type, value) => {
		if (type === 'init') {
			console.log('initial', value);
		} else {
			const direction = previous !== undefined && value > previous ? '↑' : '↓';
			console.log('update', direction, previous, '→', value);
		}
		previous = value;
	});
</script>

<button onclick={() => (count += 1)}>up</button>
<button onclick={() => (count -= 1)}>down</button>
<output>{count}</output>
