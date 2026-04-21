<!--
	`prefersReducedMotion.current` is a reactive boolean. When the user has
	the OS-level "Reduce motion" preference on, it's `true`.

	Gate your duration on it — passing `0` keeps the `{#if}` toggle working
	but skips the animation. This is the one line that separates a demo
	from a product that respects its users.

	Test it on macOS: System Settings → Accessibility → Display →
	"Reduce motion".
-->
<script lang="ts">
	import { fly } from 'svelte/transition';
	import { prefersReducedMotion } from 'svelte/motion';

	let visible = $state(false);
	const duration = $derived(prefersReducedMotion.current ? 0 : 400);
</script>

<p>
	User preference: <strong>{prefersReducedMotion.current ? 'reduced motion' : 'full motion'}</strong>
</p>

<label>
	<input type="checkbox" bind:checked={visible} />
	visible
</label>

{#if visible}
	<div class="box" transition:fly={{ y: 20, duration }}>
		Flies in over {duration}ms.
	</div>
{/if}

<style>
	.box {
		margin-block-start: 1rem;
		padding: 1rem;
		background: oklch(88% 0.08 250);
		color: oklch(25% 0.06 250);
		border-radius: 0.5rem;
	}
</style>
