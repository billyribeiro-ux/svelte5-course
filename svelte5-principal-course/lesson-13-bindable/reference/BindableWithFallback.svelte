<!--
	$bindable with a fallback: `value = $bindable('hi')`. Parents can omit
	the prop; the fallback stands in. But the fallback is NOT a state proxy,
	so mutating it does nothing — reassigning works.

	Also shows: if the parent DOES bind, the parent's value takes precedence
	on the initial render.
-->
<script lang="ts">
	let { value = $bindable('default') } = $props();
</script>

<p>Current: <code>{value}</code></p>
<button type="button" onclick={() => (value = value + '!')}>Append !</button>

<style>
	code { background: #eee; padding: 0.1em 0.3em; border-radius: 3px; }
</style>
