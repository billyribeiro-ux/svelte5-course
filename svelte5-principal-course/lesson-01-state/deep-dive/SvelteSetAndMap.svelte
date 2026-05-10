<!--
	Lesson 01 deep-dive — reactive collections.

	You learned that $state(array) and $state(object) become deeply reactive
	proxies, so `arr.push(...)` or `obj.foo = 1` triggers updates.

	But what about Set, Map, Date, URL? Those are CLASS instances. Class
	instances are NOT proxied — wrapping a Set in $state does almost nothing.

	The fix lives in `svelte/reactivity`: SvelteSet, SvelteMap, SvelteDate,
	SvelteURL — drop-in replacements that ARE reactive. Use them whenever
	you would have reached for the plain built-in.

	Below: two side-by-side selection trackers, one with each. Click any tag.
	The LEFT (plain Set wrapped in $state) silently mutates but the count
	does not update. The RIGHT (SvelteSet) just works.

	This is one of the most common "why isn't my UI updating?" traps in
	Svelte 5. Recognise it on sight.
-->
<script lang="ts">
	import { SvelteSet } from 'svelte/reactivity';

	const tags = ['svelte', 'kit', 'runes', 'typescript', 'vite'] as const;

	// ❌ Looks reactive. Isn't. Set/Map are class instances; not proxified.
	const broken = $state(new Set<string>());

	// ✅ Reactive Set from svelte/reactivity.
	const working = new SvelteSet<string>();

	function toggleBroken(tag: string): void {
		if (broken.has(tag)) broken.delete(tag);
		else broken.add(tag);
	}

	function toggleWorking(tag: string): void {
		if (working.has(tag)) working.delete(tag);
		else working.add(tag);
	}
</script>

<h2>Reactive collections</h2>

<div class="grid">
	<section>
		<h3>❌ <code>$state(new Set())</code></h3>
		<p class="count">selected: {broken.size}</p>
		<div class="row">
			{#each tags as tag (tag)}
				<button
					type="button"
					class:on={broken.has(tag)}
					onclick={() => toggleBroken(tag)}
				>{tag}</button>
			{/each}
		</div>
		<p class="hint">Clicks mutate the Set, but the <em>count</em> and the <em>on</em> class do not update — the Set's methods are not tracked.</p>
	</section>

	<section>
		<h3>✅ <code>new SvelteSet()</code></h3>
		<p class="count">selected: {working.size}</p>
		<div class="row">
			{#each tags as tag (tag)}
				<button
					type="button"
					class:on={working.has(tag)}
					onclick={() => toggleWorking(tag)}
				>{tag}</button>
			{/each}
		</div>
		<p class="hint">Reading <code>set.size</code> or <code>set.has(...)</code> inside the template subscribes the UI; mutations re-render.</p>
	</section>
</div>

<style>
	.grid {
		display: grid;
		gap: 1rem;
		grid-template-columns: 1fr 1fr;
		max-inline-size: 48rem;
	}
	section {
		padding: 1rem;
		border: 1px solid rgb(0 0 0 / 0.15);
		border-radius: 0.5rem;
	}
	.count {
		font-family: ui-monospace, monospace;
		font-size: 0.9em;
		margin: 0 0 0.5rem;
	}
	.row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem;
	}
	button {
		padding: 0.25rem 0.5rem;
		border: 1px solid rgb(0 0 0 / 0.2);
		border-radius: 0.25rem;
		background: transparent;
		cursor: pointer;
	}
	button.on {
		background: oklch(75% 0.15 250);
		color: white;
	}
	.hint {
		margin-block-start: 0.75rem;
		font-size: 0.85em;
		color: rgb(0 0 0 / 0.55);
	}
	code {
		padding: 0.1em 0.3em;
		background: rgb(0 0 0 / 0.06);
		border-radius: 0.2rem;
	}
</style>
