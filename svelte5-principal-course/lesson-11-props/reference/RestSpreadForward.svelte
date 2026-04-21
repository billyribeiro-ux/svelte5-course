<!--
	Rest spread for attribute forwarding. Destructure what the component
	OWNS; spread the remainder onto the underlying element.

	Consumer can pass id, title, aria-*, data-*, onclick, style, etc., and
	they all land on the <button>. The component's own `variant` prop is
	consumed in the component and NOT forwarded (would create an invalid
	DOM attribute).
-->
<script lang="ts">
	interface Props {
		variant?: 'primary' | 'secondary';
		class?: string;
		children: import('svelte').Snippet;
		[key: string]: unknown;
	}

	let {
		variant = 'primary',
		class: className = '',
		children,
		...rest
	}: Props = $props();
</script>

<button type="button" class={['btn', variant, className]} {...rest}>
	{@render children()}
</button>

<style>
	.btn {
		padding: 0.5rem 1rem;
		border-radius: 0.25rem;
		cursor: pointer;
		border: 1px solid transparent;
	}

	.btn.primary {
		background: oklch(60% 0.2 24);
		color: white;
		border-color: oklch(60% 0.2 24);
	}

	.btn.secondary {
		background: transparent;
		color: inherit;
		border-color: #ccc;
	}
</style>
