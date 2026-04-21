<!--
	The array form shines when composing with a parent-forwarded class prop.

	Rules:
	  - strings are included as-is
	  - falsy values (false, '', null, undefined, 0) drop out
	  - arrays are flattened
	  - objects (per clsx) also work — `class={[{ active }, 'base']}`

	This is the pattern every design-system Button in Svelte should use.
-->
<script lang="ts">
	type Props = { primary?: boolean; class?: string; children?: any };
	let { primary = false, class: extraClass = '', children }: Props = $props();
</script>

<button class={['btn', primary && 'primary', extraClass]}>
	{#if children}{@render children()}{:else}Button{/if}
</button>

<p>Try instantiating this component with <code>class="my-4"</code> — the class is appended alongside the component's own classes.</p>

<style>
	.btn {
		padding: 0.5rem 1rem;
		border: 1px solid #888;
		background: white;
		border-radius: 0.25rem;
		cursor: pointer;
	}

	.btn.primary {
		background: oklch(60% 0.2 24);
		color: white;
		border-color: oklch(60% 0.2 24);
	}
</style>
