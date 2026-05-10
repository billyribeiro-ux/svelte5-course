<!--
	Lesson 05 reference — `<svelte:window>` for global key listeners.

	Inside a Svelte component, `<svelte:window>` registers an event listener
	on `window` and removes it automatically when the component unmounts.
	No manual addEventListener/removeEventListener bookkeeping.

	Use cases:
	  - Keyboard shortcuts (this file).
	  - online/offline detection (bind:online).
	  - Scroll tracking (bind:scrollY).

	The rule: `<svelte:window>` must be at the TOP LEVEL of the template.
	It cannot live inside an {#if} or a {#each}.

	Below: a tiny key recorder. Press any key — its `e.key` value appears.
	Hold ⌘/Ctrl/Shift/Alt and press a key — the modifier flags show too.
-->
<script lang="ts">
	type KeyEvent = {
		key: string;
		ctrl: boolean;
		meta: boolean;
		shift: boolean;
		alt: boolean;
	};

	let lastKey = $state<KeyEvent | null>(null);
	let count = $state(0);

	function onKeydown(e: KeyboardEvent): void {
		lastKey = {
			key: e.key,
			ctrl: e.ctrlKey,
			meta: e.metaKey,
			shift: e.shiftKey,
			alt: e.altKey
		};
		count += 1;
	}
</script>

<svelte:window onkeydown={onKeydown} />

<h2><code>&lt;svelte:window&gt;</code> — global key listener</h2>
<p>Press any key. (Click in this window first so the page has focus.)</p>

{#if lastKey}
	<dl>
		<dt>e.key</dt><dd><code>{lastKey.key}</code></dd>
		<dt>ctrlKey</dt><dd>{lastKey.ctrl}</dd>
		<dt>metaKey</dt><dd>{lastKey.meta}</dd>
		<dt>shiftKey</dt><dd>{lastKey.shift}</dd>
		<dt>altKey</dt><dd>{lastKey.alt}</dd>
		<dt>keys recorded</dt><dd>{count}</dd>
	</dl>
{:else}
	<p class="hint">No key recorded yet.</p>
{/if}

<style>
	dl {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0.25rem 1rem;
		margin-block-start: 1rem;
	}
	dt {
		font-family: ui-monospace, monospace;
		font-size: 0.9em;
		color: rgb(0 0 0 / 0.6);
	}
	code {
		padding: 0.1em 0.3em;
		background: rgb(0 0 0 / 0.06);
		border-radius: 0.2rem;
	}
	.hint {
		color: rgb(0 0 0 / 0.55);
		font-style: italic;
	}
</style>
