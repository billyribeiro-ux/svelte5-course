<script lang="ts">
	import type { Snippet } from 'svelte';

	// Lesson 11 build: declare a Props interface with:
	//   class?:    string
	//   children:  Snippet (imported from 'svelte')
	//   [key]: unknown  // to accept arbitrary forwarded attributes
	// Destructure via:
	//   let { class: className = '', children, ...rest }: Props = $props();
	interface Props {
		class?: string;
		children: Snippet;
		[key: string]: unknown;
	}

	let { class: className = '', children, ...rest }: Props = $props();
</script>

<div class={['card', className]} {...rest}>
	{@render children()}
</div>

<style>
	.card {
		padding: var(--space-md);
		background: var(--color-surface-raised);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
	}
</style>
