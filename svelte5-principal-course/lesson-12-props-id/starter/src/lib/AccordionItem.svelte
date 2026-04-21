<script lang="ts">
	import { slide } from 'svelte/transition';
	import { prefersReducedMotion } from 'svelte/motion';
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		open?: boolean;
		children: Snippet;
		class?: string;
	}

	let { title, open = false, children, class: className = '' }: Props = $props();

	// Lesson 12 build: call $props.id() once, store the result in `uid`.
	// Then use `{uid}-trigger` on the button and `{uid}-panel` on the panel,
	// plus aria-controls / aria-labelledby that reference them.
	const uid = '';

	const duration = $derived(prefersReducedMotion.current ? 0 : 200);

	// svelte-ignore state_referenced_locally
	let isOpen = $state(open);

	function toggle(): void {
		isOpen = !isOpen;
	}
</script>

<div class={['item', className]}>
	<h3 class="heading">
		<!--
			Lesson 12 build: add
			  id="{uid}-trigger"
			  aria-controls="{uid}-panel"
			  aria-expanded={isOpen}
			to this button.
		-->
		<button type="button" class="trigger" onclick={toggle}>
			<span class="chevron" aria-hidden="true" data-open={isOpen || undefined}>▸</span>
			<span>{title}</span>
		</button>
	</h3>

	{#if isOpen}
		<!--
			Lesson 12 build: add
			  id="{uid}-panel"
			  aria-labelledby="{uid}-trigger"
			to this panel.
		-->
		<div role="region" class="panel" transition:slide={{ duration }}>
			{@render children()}
		</div>
	{/if}
</div>

<style>
	.item {
		border-block-end: 1px solid var(--color-border);
	}

	.heading {
		margin: 0;
		font-size: var(--text-md);
	}

	.trigger {
		inline-size: 100%;
		display: flex;
		align-items: center;
		gap: var(--space-xs);
		padding: var(--space-sm) 0;
		background: transparent;
		border: 0;
		text-align: start;
		font: inherit;
		font-weight: 600;
		color: var(--color-text);
		cursor: pointer;
	}

	.trigger:hover {
		color: var(--color-accent);
	}

	.trigger:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 2px;
		border-radius: var(--radius-sm);
	}

	.chevron {
		display: inline-block;
		transition: transform var(--duration-fast) var(--ease-out);
		color: var(--color-text-muted);
	}

	.chevron[data-open] {
		transform: rotate(90deg);
		color: var(--color-accent);
	}

	.panel {
		padding-block-end: var(--space-sm);
		color: var(--color-text-muted);
		font-size: var(--text-sm);
		line-height: var(--leading-normal);
	}
</style>
