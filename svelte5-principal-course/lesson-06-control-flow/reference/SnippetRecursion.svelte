<!--
	Snippets can call themselves. This is how you render tree-shaped data
	(folders, comment threads, outlines, menus) without reaching for a
	recursive component — which is overkill for markup reuse.

	Each recursive call is just `{@render snippet(arg)}` inside the snippet's
	own body. Svelte does not special-case recursion; it works because
	snippets are first-class values visible inside their own lexical scope.
-->
<script lang="ts">
	type Node = { label: string; children?: Node[] };

	const tree: Node = {
		label: 'root',
		children: [
			{ label: 'src', children: [{ label: 'app.ts' }, { label: 'main.ts' }] },
			{
				label: 'docs',
				children: [{ label: 'README.md' }, { label: 'changelog.md' }]
			},
			{ label: 'package.json' }
		]
	};
</script>

{#snippet branch(node: Node)}
	<li>
		{node.label}
		{#if node.children && node.children.length > 0}
			<ul>
				{#each node.children as child (child.label)}
					{@render branch(child)}
				{/each}
			</ul>
		{/if}
	</li>
{/snippet}

<ul>
	{@render branch(tree)}
</ul>

<style>
	ul {
		list-style: disc;
		padding-inline-start: 1.25rem;
	}
</style>
