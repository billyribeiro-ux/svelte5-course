<!--
	The parent-child checkbox pattern in its smallest form.

	Three states:
	  - none checked    → parent: unchecked, not indeterminate
	  - some checked    → parent: checked state irrelevant, INDETERMINATE = true
	  - all checked     → parent: checked, not indeterminate

	`indeterminate` is a plain attribute driven by a $derived. DO NOT
	`bind:indeterminate` — binding it doesn't derive it from anything.

	The parent's `checked` uses a function binding so clicking it writes
	all-or-nothing into the children array.
-->
<script lang="ts">
	const all = ['apples', 'bananas', 'cherries', 'dates'];
	let picked = $state<string[]>(['apples']);

	const allChecked = $derived(picked.length === all.length);
	const noneChecked = $derived(picked.length === 0);
	const someChecked = $derived(!allChecked && !noneChecked);
</script>

<label>
	<input
		type="checkbox"
		bind:checked={
			() => allChecked,
			(checked: boolean) => (picked = checked ? [...all] : [])
		}
		indeterminate={someChecked}
	/>
	<strong>All fruit</strong>
</label>

<ul>
	{#each all as fruit (fruit)}
		<li>
			<label>
				<input type="checkbox" value={fruit} bind:group={picked} />
				{fruit}
			</label>
		</li>
	{/each}
</ul>

<p>Picked: <code>{picked.join(', ') || '(none)'}</code></p>

<style>
	ul {
		list-style: none;
		padding: 0;
	}
	label {
		display: inline-flex;
		gap: 0.25rem;
		margin-block: 0.25rem;
	}
</style>
