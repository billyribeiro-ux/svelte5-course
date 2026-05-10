<!--
	Lesson 01 deep-dive — two patterns for sharing $state across files.

	This component imports both patterns from `module-counter.svelte.ts`
	and shows them side by side. Both increment correctly. Both update
	the UI. The difference is the API shape:

	  Pattern A:  counterA.count           ← read the property
	              incrementA()             ← mutate via helper
	              counterA = {...}         ← would BREAK reactivity
	                                         (do not reassign the export)

	  Pattern B:  getCountB()              ← always call the getter
	              incrementB()             ← helper hides _count
	              resetB()                 ← state stays file-private

	Why both exist: Pattern A is shorter and lets you bind, e.g.
	`bind:value={counterA.count}`. Pattern B lets you keep a primitive
	$state private — useful when the variable type isn't a natural
	"container" (auth state, a number, etc.).

	Cumulative-syntax callout: both patterns are pure $state from Lesson 01.
	No new runes are needed here.
-->
<script lang="ts">
	import { counterA, incrementA, getCountB, incrementB, resetB } from './module-counter.svelte';
</script>

<h2>Sharing <code>$state</code> across modules</h2>

<div class="grid">
	<section>
		<h3>Pattern A — object + mutate property</h3>
		<p class="display">count: <strong>{counterA.count}</strong></p>
		<button type="button" onclick={incrementA}>increment</button>
		<p class="hint">The export is a stable object. We only mutate its <code>.count</code>.</p>
	</section>

	<section>
		<h3>Pattern B — getter + helpers</h3>
		<p class="display">count: <strong>{getCountB()}</strong></p>
		<button type="button" onclick={incrementB}>increment</button>
		<button type="button" onclick={resetB}>reset</button>
		<p class="hint">The <code>$state</code> primitive is file-private. The API is the three functions.</p>
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
	.display {
		font-family: ui-monospace, monospace;
		margin: 0 0 0.5rem;
	}
	button {
		margin-inline-end: 0.5rem;
		padding: 0.25rem 0.75rem;
		border: 1px solid rgb(0 0 0 / 0.2);
		border-radius: 0.25rem;
		background: transparent;
		cursor: pointer;
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
