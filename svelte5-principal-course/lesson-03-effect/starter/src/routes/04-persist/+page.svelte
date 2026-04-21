<script lang="ts">
	// Lesson 03 build:
	//   1) On mount, read the saved theme from localStorage and set `theme` to it.
	//      Wrap that read in `untrack` so the mount-effect does not register
	//      a dependency on `theme` itself.
	//   2) Any time `theme` changes, write it to localStorage AND set
	//      document.documentElement.dataset.theme to the value (or 'light' if 'auto').
	//
	//   The cycle button rotates through 'light' → 'dark' → 'auto' → 'light'.

	import { untrack } from 'svelte';

	type Theme = 'light' | 'dark' | 'auto';
	let theme = $state<Theme>('light');

	function cycle(): void {
		theme = theme === 'light' ? 'dark' : theme === 'dark' ? 'auto' : 'light';
	}

	function resolved(t: Theme): 'light' | 'dark' {
		if (t === 'auto') {
			return typeof window !== 'undefined' &&
				window.matchMedia?.('(prefers-color-scheme: dark)').matches
				? 'dark'
				: 'light';
		}
		return t;
	}

	// Lesson 03 build: mount-only read effect (use `untrack`)
	void untrack; // silence unused-var hint while you fill this in
	// Lesson 03 build: write-on-change effect
</script>

<h1>04 — localStorage theme</h1>

<p>Current theme: <strong>{theme}</strong> → renders as <code>{resolved(theme)}</code></p>

<button type="button" onclick={cycle}>Cycle theme</button>

<p class="tip">Reload the page — your choice should stick. Toggle the system appearance while on <code>auto</code> to see it flip.</p>

<style>
	.tip {
		color: var(--color-text-muted);
		font-size: var(--text-sm);
		margin-block-start: var(--space-md);
	}

	code {
		padding: 0.1em 0.3em;
		background: var(--color-surface-sunken);
		border-radius: var(--radius-sm);
	}
</style>
