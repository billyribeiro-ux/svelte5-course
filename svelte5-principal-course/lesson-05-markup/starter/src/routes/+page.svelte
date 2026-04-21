<script lang="ts">
	type Command = {
		id: string;
		icon: string;
		label: string;
		hint: string;
		shortcut?: string;
		run: () => string;
	};

	const commands: Command[] = [
		{
			id: 'new-doc',
			icon: '📄',
			label: 'New document',
			hint: 'Create a blank document in the current workspace',
			shortcut: '⌘N',
			run: () => 'Created a new document'
		},
		{
			id: 'new-folder',
			icon: '📁',
			label: 'New folder',
			hint: 'Create a new folder at the workspace root',
			run: () => 'Created a new folder'
		},
		{
			id: 'search',
			icon: '🔎',
			label: 'Search everywhere',
			hint: 'Full-text search across every document and comment',
			shortcut: '⌘⇧F',
			run: () => 'Opened full-text search'
		},
		{
			id: 'goto-line',
			icon: '↩',
			label: 'Go to line',
			hint: 'Jump to a specific line number in the active document',
			shortcut: '⌘G',
			run: () => 'Opened go-to-line'
		},
		{
			id: 'toggle-theme',
			icon: '🌗',
			label: 'Toggle theme',
			hint: 'Switch between light and dark appearance',
			run: () => 'Toggled theme'
		},
		{
			id: 'invite',
			icon: '✉',
			label: 'Invite teammate',
			hint: 'Send an invite link to a new collaborator',
			run: () => 'Opened invite dialog'
		},
		{
			id: 'export-pdf',
			icon: '⬇',
			label: 'Export as PDF',
			hint: 'Download the active document as a PDF',
			run: () => 'Started PDF export'
		},
		{
			id: 'shortcuts',
			icon: '⌨',
			label: 'Show keyboard shortcuts',
			hint: 'Open the cheatsheet overlay',
			shortcut: '?',
			run: () => 'Shown shortcut cheatsheet'
		},
		{
			id: 'settings',
			icon: '⚙',
			label: 'Open settings',
			hint: 'Workspace preferences, integrations, billing',
			shortcut: '⌘,',
			run: () => 'Opened settings'
		},
		{
			id: 'logout',
			icon: '🚪',
			label: 'Log out',
			hint: 'End the current session on this device',
			run: () => 'Logged out'
		}
	];

	// All UI state is $state — reactive by default. Part 1 reinforcement.
	let isOpen = $state(false);
	let query = $state('');
	let activeIndex = $state(0);
	let lastAction = $state<string | null>(null);
	let inputEl = $state<HTMLInputElement | undefined>();

	// Lesson 05 build: make this a $derived so it recomputes whenever `query`
	// or the command list changes. Case-insensitive substring match on label.
	const filtered = commands;

	// Lesson 05 build: focus the input whenever `isOpen` becomes true.
	// Hint: one $effect, guard on isOpen, call inputEl?.focus().

	// Optional while developing: watch the whole palette state in DevTools.
	// $inspect('palette', { isOpen, query, activeIndex, matches: filtered.length });

	function open(): void {
		// Lesson 05 build: set isOpen to true.
	}

	function close(): void {
		// Lesson 05 build: set isOpen to false, reset query to '', reset
		// activeIndex to 0. Closing should leave no ghost state behind.
	}

	function toggle(): void {
		if (isOpen) close();
		else open();
	}

	function run(cmd: Command): void {
		lastAction = cmd.run();
		close();
	}

	function handleInput(): void {
		// Lesson 05 build: when the user types, the filter changes — snap
		// activeIndex back to 0 so the highlight never points past the end.
	}

	function handleWindowKeydown(event: KeyboardEvent): void {
		// Lesson 05 build:
		//   1. If (metaKey OR ctrlKey) + key === 'k' → preventDefault + toggle().
		//   2. If isOpen AND key === 'Escape' → preventDefault + close().
	}

	function handlePaletteKeydown(event: KeyboardEvent): void {
		// Lesson 05 build:
		//   ArrowDown → move activeIndex forward, wrap at end.
		//   ArrowUp   → move activeIndex back, wrap at start.
		//   Enter     → run(filtered[activeIndex]) if it exists.
		// Don't forget event.preventDefault() to stop the caret from moving
		// inside the input.
	}
</script>

<!-- Lesson 05 build: attach a global keydown listener using <svelte:window>.
     Use handleWindowKeydown. -->

<section class="dashboard">
	<h1>Command palette</h1>
	<p class="muted">
		Press <kbd>⌘K</kbd> on macOS or <kbd>Ctrl+K</kbd> elsewhere. You can also click the button below.
	</p>

	<button type="button" class="open" onclick={open}>Open command palette</button>

	{#if lastAction}
		<div class="last-action" role="status">Last action: <strong>{lastAction}</strong></div>
	{/if}

	<ul class="fake-dashboard">
		<li><span class="tag">Docs</span><span>42 documents synced</span></li>
		<li><span class="tag">Team</span><span>6 members online</span></li>
		<li><span class="tag">Alerts</span><span>0 incidents</span></li>
	</ul>
</section>

{#if isOpen}
	<div class="overlay" role="presentation">
		<button
			type="button"
			class="backdrop"
			aria-label="Close command palette"
			onclick={close}
		></button>

		<div class="palette" role="dialog" aria-modal="true" aria-label="Command palette">
			<!-- Lesson 05 build: wire the input:
			     * bind:value to query
			     * bind:this to inputEl
			     * oninput to handleInput
			     * onkeydown to handlePaletteKeydown
			     The aria-activedescendant should read the id of the active command. -->
			<input
				type="text"
				placeholder="Search commands…"
				autocomplete="off"
				spellcheck="false"
				aria-label="Search commands"
				aria-controls="palette-list"
			/>

			<div class="meta">
				{filtered.length} of {commands.length} commands
			</div>

			{#if filtered.length === 0}
				<div class="empty">
					No commands match <em>{query}</em>.
				</div>
			{:else}
				<ul id="palette-list" role="listbox">
					{#each filtered as cmd, i (cmd.id)}
						<!-- `aria-selected` drives the highlight styling — look at the
						     selector `.palette li[aria-selected='true']` in <style>. -->
						<li id="cmd-{cmd.id}" role="option" aria-selected={i === activeIndex}>
							<button type="button" class="row" onclick={() => run(cmd)}>
								<span class="icon" aria-hidden="true">{cmd.icon}</span>
								<span class="label">{cmd.label}</span>
								<span class="hint">{cmd.hint}</span>
								{#if cmd.shortcut}
									<kbd>{cmd.shortcut}</kbd>
								{/if}
							</button>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	</div>
{/if}

<style>
	.dashboard {
		display: flex;
		flex-direction: column;
		gap: var(--space-lg);
	}

	.muted {
		color: var(--color-text-muted);
	}

	kbd {
		display: inline-block;
		padding: 0.1em 0.4em;
		background: var(--color-surface-sunken);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		font-size: var(--text-xs);
		line-height: 1;
	}

	.open {
		align-self: flex-start;
		padding: var(--space-sm) var(--space-md);
		background: var(--color-accent);
		color: var(--color-accent-text);
		border: 1px solid var(--color-accent);
		border-radius: var(--radius-md);
		font-size: var(--text-md);
		cursor: pointer;
		transition: background var(--duration-fast) var(--ease-out);
	}

	.open:hover {
		background: var(--color-accent-hover);
	}

	.last-action {
		padding: var(--space-sm) var(--space-md);
		background: var(--color-surface-raised);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		color: var(--color-text-muted);
	}

	.fake-dashboard {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		gap: var(--space-sm);
	}

	.fake-dashboard li {
		display: flex;
		gap: var(--space-md);
		align-items: center;
		padding: var(--space-sm) var(--space-md);
		background: var(--color-surface-raised);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		color: var(--color-text-muted);
	}

	.tag {
		font-size: var(--text-xs);
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--color-accent);
		font-weight: 600;
	}

	.overlay {
		position: fixed;
		inset: 0;
		display: grid;
		place-items: start center;
		padding-block-start: 10vh;
		z-index: 100;
	}

	.backdrop {
		position: absolute;
		inset: 0;
		background: oklch(0% 0 0 / 0.35);
		border: 0;
		padding: 0;
		cursor: pointer;
	}

	.palette {
		position: relative;
		z-index: 1;
		inline-size: min(40rem, calc(100vw - 2rem));
		background: var(--color-surface-raised);
		border: 1px solid var(--color-border-strong);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-lg);
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	.palette input {
		appearance: none;
		width: 100%;
		padding: var(--space-md);
		border: 0;
		border-block-end: 1px solid var(--color-border);
		background: transparent;
		color: var(--color-text);
		font-size: var(--text-lg);
		outline: none;
	}

	.meta {
		padding: var(--space-xs) var(--space-md);
		font-size: var(--text-xs);
		color: var(--color-text-subtle);
		background: var(--color-surface-sunken);
		border-block-end: 1px solid var(--color-border);
	}

	.empty {
		padding: var(--space-lg);
		text-align: center;
		color: var(--color-text-muted);
		font-size: var(--text-sm);
	}

	.palette ul {
		list-style: none;
		padding: var(--space-xs);
		margin: 0;
		max-block-size: 50vh;
		overflow-y: auto;
	}

	.palette li {
		border-radius: var(--radius-md);
	}

	.palette li[aria-selected='true'] {
		background: var(--color-accent);
		color: var(--color-accent-text);
	}

	.palette li[aria-selected='true'] .hint,
	.palette li[aria-selected='true'] kbd {
		color: var(--color-accent-text);
		opacity: 0.9;
	}

	.row {
		display: grid;
		grid-template-columns: auto 1fr auto;
		column-gap: var(--space-sm);
		align-items: center;
		inline-size: 100%;
		padding: var(--space-sm) var(--space-md);
		background: transparent;
		border: 0;
		color: inherit;
		text-align: start;
		cursor: pointer;
		font: inherit;
	}

	.row .icon {
		font-size: var(--text-lg);
	}

	.row .label {
		font-weight: 500;
	}

	.row .hint {
		grid-column: 2;
		font-size: var(--text-xs);
		color: var(--color-text-muted);
	}

	.row kbd {
		grid-row: 1 / span 2;
		grid-column: 3;
		align-self: center;
	}

	.palette li[aria-selected='true'] kbd {
		background: oklch(0% 0 0 / 0.15);
		border-color: oklch(0% 0 0 / 0.2);
	}
</style>
