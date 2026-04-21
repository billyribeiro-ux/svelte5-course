<script lang="ts">
	// Reactive state uses a referential-equality short-circuit:
	// assigning the same primitive value to state does NOT trigger
	// updates, and therefore does NOT fire $inspect.
	//
	// If you suspect $inspect is "not working," first check that the
	// value is genuinely changing. Clicking "same" below logs nothing.

	let n = $state(0);
	let label = $state('hello');

	$inspect(n, label);
</script>

<button onclick={() => (n = 0)}>assign 0 (same) — silent</button>
<button onclick={() => (n = n + 1)}>increment — logs</button>
<button onclick={() => (label = 'hello')}>assign 'hello' (same) — silent</button>
<button onclick={() => (label = label + '!')}>append — logs</button>
<p>n = {n}, label = {label}</p>
