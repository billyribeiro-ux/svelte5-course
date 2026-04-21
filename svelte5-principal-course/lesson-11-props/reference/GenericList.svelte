<!--
	A generic list. `T` is inferred from the caller's `items` array; the
	`row` snippet then receives one of those items with its type preserved.

	Usage from a parent:

	<GenericList items={users} row={userRow} />

	Where `users: User[]` and `userRow: Snippet<[User]>`. Inside
	GenericList, `item` in the each block is typed as `User`, no casts.
-->
<script lang="ts" generics="T">
	import type { Snippet } from 'svelte';

	interface Props {
		items: T[];
		row: Snippet<[T]>;
		class?: string;
	}

	let { items, row, class: className = '' }: Props = $props();
</script>

<ul class={['list', className]}>
	{#each items as item}
		<li>{@render row(item)}</li>
	{/each}
</ul>

<style>
	.list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.list li {
		padding: 0.5rem;
		border-block-end: 1px solid #eee;
	}
</style>
