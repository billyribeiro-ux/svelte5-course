<!--
	`style:color|important={value}` adds `!important` to the declaration.

	Use this when you need to override a third-party stylesheet's own
	`!important` declarations (rare, but it happens). Inside your own code,
	the presence of `|important` is almost always a smell — audit the
	specificity of the rule you're fighting instead.
-->
<script lang="ts">
	let c = $state('green');
</script>

<p>
	Color: <input type="text" bind:value={c} placeholder="any CSS color" />
</p>

<!-- The class defines `color: red !important`. The directive still wins. -->
<p class="force-red" style:color|important={c}>
	This paragraph — note the CSS declares <code>color: red !important</code>,
	but the directive overrides it to <strong>{c}</strong>.
</p>

<style>
	.force-red {
		color: red !important;
	}
</style>
