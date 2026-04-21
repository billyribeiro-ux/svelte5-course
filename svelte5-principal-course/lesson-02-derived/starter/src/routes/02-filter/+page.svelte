<script lang="ts">
	// Lesson 02 build:
	//   Derive `matches` from `fruits` filtered by `query` (case-insensitive).
	//   Derive `count` as matches.length.
	//   Derive `empty` — true only when query.trim() is non-empty AND matches is empty.

	const fruits = [
		'Apple',
		'Apricot',
		'Avocado',
		'Banana',
		'Blackberry',
		'Blueberry',
		'Cantaloupe',
		'Cherry',
		'Clementine',
		'Coconut',
		'Cranberry',
		'Date',
		'Dragonfruit',
		'Elderberry',
		'Fig',
		'Grape',
		'Grapefruit',
		'Kiwi',
		'Lemon',
		'Lime',
		'Lychee',
		'Mango',
		'Nectarine',
		'Orange',
		'Papaya',
		'Passionfruit',
		'Peach',
		'Pear',
		'Persimmon',
		'Pineapple',
		'Plum',
		'Pomegranate',
		'Raspberry',
		'Strawberry',
		'Watermelon'
	];

	let query = $state('');

	let matches: string[] = []; // Lesson 02 build
	let count = 0; // Lesson 02 build
	let empty = false; // Lesson 02 build
</script>

<h1>02 — Filter</h1>

<label>
	Search
	<input type="search" bind:value={query} placeholder="e.g. berry" />
</label>

<p aria-live="polite">{count} {count === 1 ? 'match' : 'matches'}</p>

{#if empty}
	<p class="empty">No fruits match <q>{query}</q>.</p>
{:else}
	<ul>
		{#each matches as fruit (fruit)}
			<li>{fruit}</li>
		{/each}
	</ul>
{/if}

<style>
	label {
		display: flex;
		flex-direction: column;
		gap: var(--space-2xs);
		max-inline-size: 24rem;
	}

	ul {
		columns: 3 14rem;
		list-style: none;
		padding: 0;
		margin-block-start: var(--space-md);
	}

	li {
		padding-block: 0.15em;
	}

	.empty {
		color: var(--color-text-muted);
	}
</style>
