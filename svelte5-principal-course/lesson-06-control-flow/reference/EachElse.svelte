<!--
	The `{:else}` branch inside an `{#each}` block renders when the collection
	is empty (length === 0). It replaces a common anti-pattern:

	  Wrong (duplicates logic):
	    {#if items.length === 0}<p>empty</p>{/if}
	    {#each items as item}<Item {item} />{/each}

	  Right:
	    {#each items as item}<Item {item} />{:else}<p>empty</p>{/each}
-->
<script lang="ts">
	let items = $state<string[]>([]);

	function add(): void {
		items.push(`item ${items.length + 1}`);
	}

	function clear(): void {
		items = [];
	}
</script>

<button type="button" onclick={add}>Add item</button>
<button type="button" onclick={clear}>Clear</button>

<ul>
	{#each items as item, i (i + item)}
		<li>{item}</li>
	{:else}
		<li class="empty">List is empty — click "Add item".</li>
	{/each}
</ul>

<style>
	.empty {
		color: grey;
		font-style: italic;
	}
</style>
