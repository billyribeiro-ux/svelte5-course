<!--
	Cross-platform keyboard shortcut.

	macOS: ⌘ is metaKey.
	Windows / Linux: the Windows/Meta key is also metaKey, but the actual Ctrl
	key (what people press) is ctrlKey.

	Checking `(metaKey || ctrlKey)` gets you the behavior users expect on both
	platforms: ⌘K on macOS, Ctrl+K everywhere else.

	Don't forget `event.preventDefault()` for any shortcut the browser has a
	built-in binding for (⌘S save-page, ⌘K location bar, ⌘P print, etc.).
-->
<script lang="ts">
	let last = $state<string | null>(null);

	function handleKey(event: KeyboardEvent): void {
		const isModS = (event.metaKey || event.ctrlKey) && event.key === 's';
		if (!isModS) return;

		event.preventDefault(); // stop the "save page" dialog
		last = `Saved at ${new Date().toLocaleTimeString()}`;
	}
</script>

<svelte:window onkeydown={handleKey} />

<p>
	Press <kbd>⌘S</kbd> (macOS) or <kbd>Ctrl+S</kbd> (Windows / Linux) anywhere on this page. The
	browser's save-page dialog will not open because of <code>preventDefault()</code>.
</p>

{#if last}
	<p><strong>{last}</strong></p>
{/if}

<style>
	kbd {
		padding: 0.1em 0.4em;
		background: #eee;
		border: 1px solid #ccc;
		border-radius: 3px;
		font-size: 0.875em;
	}
</style>
