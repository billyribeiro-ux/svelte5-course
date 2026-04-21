<!--
	`:global()` — three forms.

	Use form 3 (scoped-outer, global-inner) by default. It styles content
	you don't own (injected HTML, library internals, portaled children)
	while keeping your selector names from polluting the app.
-->
<script lang="ts">
	const html = `
		<h1>From {@html}</h1>
		<p>This markup has no hash class. Scoped selectors won't reach it.</p>
		<blockquote>Unless you use :global().</blockquote>
	`;
</script>

<div class="prose">
	{@html html}
</div>

<style>
	.prose {
		padding: 1rem;
		border: 1px dashed #aaa;
		border-radius: 0.5rem;
	}

	/*
		Scoped outer (.prose gets a hash), global inner. Styles only apply
		to descendants of THIS component's .prose element — not every h1,
		p, or blockquote in the app.
	*/
	.prose :global(h1) {
		margin: 0 0 0.5rem;
		font-size: 1.5rem;
	}

	.prose :global(p) {
		margin: 0 0 0.5rem;
	}

	.prose :global(blockquote) {
		margin: 0;
		padding-inline-start: 1rem;
		border-inline-start: 3px solid oklch(70% 0.15 150);
		color: oklch(50% 0.08 150);
		font-style: italic;
	}
</style>
