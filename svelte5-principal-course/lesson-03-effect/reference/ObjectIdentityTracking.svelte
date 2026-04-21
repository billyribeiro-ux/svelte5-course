<!--
	Effects track what you read. Reading the object reference is different from
	reading a property inside it.

	`obj` never gets reassigned, so reading `obj` alone makes the effect run once and never again.
	`obj.value` is a property read, which IS tracked, so that effect re-runs on every change.

	Takeaway: when you want to react to property changes, read the property.
-->
<script lang="ts">
	let obj = $state({ value: 0 });
	let counts = $state({ identity: 0, property: 0 });

	$effect(() => {
		obj;
		counts.identity += 1;
	});

	$effect(() => {
		obj.value;
		counts.property += 1;
	});
</script>

<button onclick={() => obj.value++}>mutate obj.value ({obj.value})</button>

<p>identity-read effect ran: {counts.identity} times</p>
<p>property-read effect ran: {counts.property} times</p>

<p class="tip">
	The identity-read effect ran once (on mount) and never again.
	The property-read effect runs every time <code>obj.value</code> changes.
</p>

<style>
	.tip {
		color: oklch(60% 0.02 250);
		font-size: 0.9em;
		max-inline-size: 40rem;
	}
</style>
