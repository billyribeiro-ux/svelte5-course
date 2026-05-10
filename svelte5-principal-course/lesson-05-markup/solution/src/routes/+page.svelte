<script lang="ts">
	import { untrack } from 'svelte';
	import { commands, type Command } from '$lib/commands';

	const STORAGE_KEY = 'lesson-05-recent';
	const MAX_RECENT = 5;

	// === Reactive state ($state — Lesson 01) ===
	let open = $state(false);
	let query = $state('');
	let selectedIndex = $state(0);
	let recent = $state<string[]>([]);

	// === DOM references ===
	let inputRef = $state<HTMLInputElement | undefined>(undefined);
	let triggerRef = $state<HTMLButtonElement | undefined>(undefined);
	let panelRef = $state<HTMLDivElement | undefined>(undefined);
	let listRef = $state<HTMLUListElement | undefined>(undefined);

	// === Derived ($derived — Lesson 02) ===
	const filtered = $derived.by(() => {
		const q = query.trim().toLowerCase();
		if (q === '') return commands;
		return commands.filter(
			(c) => c.title.toLowerCase().includes(q) || c.keywords.toLowerCase().includes(q)
		);
	});

	const ranked = $derived.by(() => {
		// $inspect.trace (Lesson 04) — see the console for which dep caused this recompute.
		$inspect.trace('ranked');
		const recentSet = new Set(recent);
		const recents: Command[] = [];
		const others: Command[] = [];
		for (const c of filtered) {
			if (recentSet.has(c.id)) recents.push(c);
			else others.push(c);
		}
		recents.sort((a, b) => recent.indexOf(a.id) - recent.indexOf(b.id));
		return [...recents, ...others];
	});

	// === Effects ($effect — Lesson 03) ===

	// 1. Mount-only read from localStorage. `untrack` keeps `recent` from
	//    becoming a dependency of this effect.
	$effect(() => {
		untrack(() => {
			const saved = localStorage.getItem(STORAGE_KEY);
			if (!saved) return;
			try {
				const parsed = JSON.parse(saved);
				if (Array.isArray(parsed) && parsed.every((x) => typeof x === 'string')) {
					recent = parsed.slice(0, MAX_RECENT);
				}
			} catch {
				// ignore bad JSON
			}
		});
	});

	// 2. Write-on-change: persist `recent` to localStorage.
	$effect(() => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(recent));
	});

	// 3. Focus management. open=true → focus input. open=false → focus trigger.
	$effect(() => {
		if (open) inputRef?.focus();
		else triggerRef?.focus();
	});

	// 4. Keep `selectedIndex` in range when `ranked` shortens (e.g. filter narrows).
	$effect(() => {
		if (selectedIndex >= ranked.length) selectedIndex = Math.max(0, ranked.length - 1);
	});

	// 5. Scroll the selected row into view as the highlight moves.
	$effect(() => {
		if (!listRef) return;
		const el = listRef.children[selectedIndex] as HTMLElement | undefined;
		el?.scrollIntoView({ block: 'nearest' });
	});

	// 6. Derived id of the currently-selected option, used by aria-activedescendant.
	//    Bound to a separate variable to keep TypeScript's narrowing happy under
	//    `noUncheckedIndexedAccess`.
	const selectedDescendant = $derived(
		ranked[selectedIndex] ? `cmd-${ranked[selectedIndex]!.id}` : undefined
	);

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
		const next = [cmd.id, ...recent.filter((id) => id !== cmd.id)].slice(0, MAX_RECENT);
		recent = next;
		close();
	}

	function onGlobalKeydown(e: KeyboardEvent): void {
		// ⌘K / Ctrl+K toggles the palette.
		if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
			e.preventDefault();
			toggle();
			return;
		}
		// Escape closes it.
		if (e.key === 'Escape' && open) {
			e.preventDefault();
			close();
		}
	}

	function onInputKeydown(e: KeyboardEvent): void {
		if (ranked.length === 0) return;
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			selectedIndex = (selectedIndex + 1) % ranked.length;
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			selectedIndex = (selectedIndex - 1 + ranked.length) % ranked.length;
		} else if (e.key === 'Enter') {
			e.preventDefault();
			const cmd = ranked[selectedIndex];
			if (cmd) run(cmd);
		}
	}

	function onBackdropClick(e: MouseEvent): void {
		if (panelRef && !panelRef.contains(e.target as Node)) close();
	}
</script>

<svelte:window onkeydown={onGlobalKeydown} />

<h1>Lesson 05 — Command palette (solution)</h1>

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
						<!--
							a11y: keyboard navigation lives on the input above (Arrow/Enter).
							Each row is role="option" inside role="listbox" — the WAI-ARIA
							pattern Svelte's a11y lint doesn't model.
						-->
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
