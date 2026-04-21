<script lang="ts">
	// $inspect and $inspect.trace are dev-only. The Svelte compiler
	// strips them out of production bundles — no console noise, no
	// cost. You can leave them checked in on a long-running debugging
	// branch without guarding them behind an if (import.meta.env.DEV).
	//
	// This file is purely illustrative; there is no runtime flag to flip.
	// Build with `vite build` and inspect the output to confirm.

	let count = $state(0);

	$inspect(count); // disappears in `vite build`
</script>

<button onclick={() => (count += 1)}>{count}</button>
