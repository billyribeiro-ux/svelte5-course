<!--
	`in:` and `out:` let you use different entry and exit animations.

	If you toggle quickly, a `transition:` would reverse mid-play; `in:` and
	`out:` run independently — the in keeps going forward while the out
	plays in parallel. Useful when enter and exit are asymmetric (fly-in
	but fade-out, for example).
-->
<script lang="ts">
	import { fly, fade } from 'svelte/transition';

	let visible = $state(false);
</script>

<label>
	<input type="checkbox" bind:checked={visible} />
	visible
</label>

{#if visible}
	<div class="box" in:fly={{ y: 40, duration: 400 }} out:fade={{ duration: 300 }}>
		Flies in. Fades out.
	</div>
{/if}

<style>
	.box {
		margin-block-start: 1rem;
		padding: 1rem;
		background: oklch(85% 0.1 230);
		color: oklch(20% 0.05 230);
		border-radius: 0.5rem;
	}
</style>
