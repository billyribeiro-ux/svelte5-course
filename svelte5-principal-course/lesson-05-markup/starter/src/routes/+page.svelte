<script lang="ts">
	import { untrack } from 'svelte';
	import { commands, type Command } from '$lib/commands';

	const STORAGE_KEY = 'lesson-05-recent';
	const MAX_RECENT = 5;

	// === Reactive state (Lesson 01 — $state) ===
	let open = $state(false);
	let query = $state('');
	let selectedIndex = $state(0);
	let recent = $state<string[]>([]);

	// === DOM references — already wired via bind:this below ===
	let inputRef = $state<HTMLInputElement | undefined>(undefined);
	let triggerRef = $state<HTMLButtonElement | undefined>(undefined);
	let panelRef = $state<HTMLDivElement | undefined>(undefined);
	let listRef = $state<HTMLUListElement | undefined>(undefined);

	// === Derived (Lesson 02 — $derived) ===
	// `filtered` is done for you — it's the substring match.
	const filtered = $derived.by(() => {
		const q = query.trim().toLowerCase();
		if (q === '') return commands;
		return commands.filter(
			(c) => c.title.toLowerCase().includes(q) || c.keywords.toLowerCase().includes(q)
		);
	});

	// Lesson 05 build (step 7):
	//   Add `$inspect.trace('ranked')` as the first statement of this derived
	//   body. (Lesson 04 — labelled traces.) Watch DevTools when you type or
	//   run a command — the trace shows whether `query` or `recent` caused
	//   the recompute.
	//
	// Lesson 05 build (step 5):
	//   Rank `filtered` so that any command whose id appears in `recent` rises
	//   to the top, preserving `recent`'s order. Commands not in `recent`
	//   keep their original order.
	const ranked = $derived.by(() => {
		// TODO: replace this body with the rank logic described above.
		return filtered;
	});

	// === Effects (Lesson 03 — $effect) ===

	// Lesson 05 build (step 6, part a):
	//   On mount, read STORAGE_KEY from localStorage and parse it. If it's a
	//   string[] of length ≤ MAX_RECENT, assign it to `recent`. Wrap the
	//   read in `untrack(...)` so this effect doesn't subscribe to `recent`.
	//
	// Lesson 05 build (step 6, part b):
	//   Write a second $effect that persists `recent` to localStorage every
	//   time it changes.

	// Lesson 05 build (step 2):
	//   On `open` → true, call inputRef?.focus().
	//   On `open` → false, call triggerRef?.focus().
	//   One $effect that reads `open` and both refs.

	// Already wired — keeps selectedIndex inside ranked.length when the list shortens.
	$effect(() => {
		if (selectedIndex >= ranked.length) selectedIndex = Math.max(0, ranked.length - 1);
	});

	// Already wired — scrolls the highlighted row into view.
	$effect(() => {
		if (!listRef) return;
		const el = listRef.children[selectedIndex] as HTMLElement | undefined;
		el?.scrollIntoView({ block: 'nearest' });
	});

	// Already wired — id of the currently-selected option (or undefined).
	const selectedDescendant = $derived(
		ranked[selectedIndex] ? `cmd-${ranked[selectedIndex]!.id}` : undefined
	);

	// `untrack` is imported so the read-on-mount stub above can use it
	// without needing to add an import line first.
	void untrack;

	// === Actions ===

	function toggle(): void {
		open = !open;
		if (open) {
			query = '';
			selectedIndex = 0;
		}
	}

	function close(): void {
		open = false;
	}

	function run(cmd: Command): void {
		cmd.run();
		// Lesson 05 build (step 5, continued):
		//   Move `cmd.id` to the front of `recent`. Drop any existing copy
		//   so an id only appears once. Cap the list at MAX_RECENT.
		close();
	}

	function onGlobalKeydown(e: KeyboardEvent): void {
		// Lesson 05 build (step 1):
		//   - If (e.metaKey || e.ctrlKey) AND e.key === 'k': call e.preventDefault()
		//     and toggle().
		//   - If e.key === 'Escape' AND `open`: call e.preventDefault() and close().
		void e;
	}

	function onInputKeydown(e: KeyboardEvent): void {
		// Lesson 05 build (step 4):
		//   - ArrowDown: selectedIndex = (selectedIndex + 1) % ranked.length
		//   - ArrowUp:   selectedIndex = (selectedIndex - 1 + ranked.length) % ranked.length
		//   - Enter:     read ranked[selectedIndex] and run() it.
		//   All three need e.preventDefault() before mutating selectedIndex.
		//   Bail when ranked.length === 0.
		void e;
	}

	function onBackdropClick(e: MouseEvent): void {
		// Lesson 05 build (step 3):
		//   If e.target is OUTSIDE panelRef (use panelRef.contains(...)), close().
		void e;
	}
</script>

<svelte:window onkeydown={onGlobalKeydown} />

<h1>Lesson 05 — Command palette (starter)</h1>

<p>
	Press <kbd>⌘K</kbd> / <kbd>Ctrl+K</kbd> to open. Type to filter. ↑/↓ to navigate.
	Enter to run. Esc to close.
</p>

<button
	bind:this={triggerRef}
	type="button"
	class="trigger"
	onclick={toggle}
	aria-haspopup="dialog"
	aria-expanded={open}
>
	<span>Open command palette</span>
	<kbd>⌘K</kbd>
</button>

{#if open}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div class="backdrop" role="presentation" onmousedown={onBackdropClick}>
		<div
			bind:this={panelRef}
			class="panel"
			role="dialog"
			aria-modal="true"
			aria-label="Command palette"
		>
			<input
				bind:this={inputRef}
				bind:value={query}
				oninput={() => (selectedIndex = 0)}
				onkeydown={onInputKeydown}
				placeholder="Type a command…"
				autocomplete="off"
				autocapitalize="off"
				spellcheck="false"
				aria-controls="cmd-listbox"
				aria-activedescendant={selectedDescendant}
			/>

			{#if ranked.length === 0}
				<p class="empty">No commands match <q>{query}</q>.</p>
			{:else}
				<ul bind:this={listRef} id="cmd-listbox" role="listbox">
					{#each ranked as cmd, i (cmd.id)}
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<li
							id="cmd-{cmd.id}"
							role="option"
							class:selected={i === selectedIndex}
							aria-selected={i === selectedIndex}
							onmousemove={() => (selectedIndex = i)}
							onclick={() => run(cmd)}
						>
							<span>{cmd.title}</span>
							{#if recent.includes(cmd.id)}
								<span class="badge">recent</span>
							{/if}
						</li>
					{/each}
				</ul>
			{/if}

			<footer>
				<span><kbd>↑</kbd><kbd>↓</kbd> nav</span>
				<span><kbd>↵</kbd> run</span>
				<span><kbd>esc</kbd> close</span>
			</footer>
		</div>
	</div>
{/if}

<style>
	h1 {
		margin-block-end: var(--space-sm);
	}
	.trigger {
		display: inline-flex;
		gap: var(--space-sm);
		align-items: center;
		padding: var(--space-xs) var(--space-md);
		margin-block-start: var(--space-md);
		border: 1px solid var(--color-border-strong);
		border-radius: var(--radius-md);
		background: var(--color-surface);
		cursor: pointer;
	}
	.trigger kbd {
		font-family: var(--font-mono);
		font-size: var(--text-xs);
		padding: 0.1em 0.4em;
		background: var(--color-surface-sunken);
		border-radius: var(--radius-sm);
	}
	kbd {
		font-family: var(--font-mono);
	}
	.backdrop {
		position: fixed;
		inset: 0;
		background: rgb(0 0 0 / 0.4);
		display: grid;
		place-items: start center;
		padding-block-start: 10vh;
		z-index: 50;
	}
	.panel {
		inline-size: min(90vw, 32rem);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		box-shadow: 0 20px 40px rgb(0 0 0 / 0.2);
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}
	.panel input {
		padding: var(--space-md);
		border: 0;
		border-block-end: 1px solid var(--color-border);
		font-size: var(--text-lg);
		background: transparent;
		outline: none;
	}
	ul {
		list-style: none;
		margin: 0;
		padding: var(--space-2xs) 0;
		max-block-size: 18rem;
		overflow-y: auto;
	}
	li {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--space-sm);
		padding: var(--space-xs) var(--space-md);
		cursor: pointer;
		font-size: var(--text-sm);
	}
	li.selected {
		background: var(--color-accent);
		color: var(--color-accent-text);
	}
	.badge {
		font-size: var(--text-xs);
		padding: 0.1em 0.4em;
		background: var(--color-surface-sunken);
		color: var(--color-text-muted);
		border-radius: var(--radius-sm);
	}
	li.selected .badge {
		background: rgb(255 255 255 / 0.2);
		color: var(--color-accent-text);
	}
	.empty {
		padding: var(--space-md);
		margin: 0;
		color: var(--color-text-muted);
		font-style: italic;
	}
	footer {
		display: flex;
		gap: var(--space-md);
		padding: var(--space-2xs) var(--space-md);
		border-block-start: 1px solid var(--color-border);
		background: var(--color-surface-sunken);
		color: var(--color-text-muted);
		font-size: var(--text-xs);
	}
	footer kbd {
		display: inline-block;
		min-inline-size: 1.2em;
		padding: 0 0.3em;
		margin-inline-end: 0.25em;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		text-align: center;
	}
</style>
