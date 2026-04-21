<!--
	Implicit `children` is just another named snippet prop — content
	between <Component>…</Component> tags. You can mix it with named
	slot-like snippets (header, footer) and the compiler routes each
	correctly.

	If you want BOTH named snippets AND implicit children, declare the
	children prop explicitly in the Props type.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		header?: Snippet;
		footer?: Snippet;
		children: Snippet;
	}

	let { header, footer, children }: Props = $props();
</script>

<article>
	{#if header}<div class="head">{@render header()}</div>{/if}
	<div class="body">{@render children()}</div>
	{#if footer}<div class="foot">{@render footer()}</div>{/if}
</article>

<style>
	article {
		display: flex;
		flex-direction: column;
		border: 1px solid #ccc;
		border-radius: 0.5rem;
	}
	.head { padding: 0.5rem; background: #f3f3f3; }
	.body { padding: 1rem; }
	.foot { padding: 0.5rem; background: #f3f3f3; }
</style>
