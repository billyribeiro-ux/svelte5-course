<script lang="ts">
	import { untrack } from 'svelte';

	type Theme = 'light' | 'dark' | 'auto';
	const STORAGE_KEY = 'lesson-03-theme';

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

	$effect(() => {
		untrack(() => {
			const saved = localStorage.getItem(STORAGE_KEY);
			if (saved === 'light' || saved === 'dark' || saved === 'auto') {
				theme = saved;
			}
		});
	});

	$effect(() => {
		localStorage.setItem(STORAGE_KEY, theme);
		document.documentElement.dataset.theme = resolved(theme);
	});
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
