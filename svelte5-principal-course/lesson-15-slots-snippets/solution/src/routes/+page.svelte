<script lang="ts">
	import NoticeLegacy from '$lib/NoticeLegacy.svelte';
	import NoticeSnippets from '$lib/NoticeSnippets.svelte';
</script>

<header class="top">
	<h1>Slots → snippets migration</h1>
	<p class="muted">Two Notice components, identical output. Left: Svelte 4 slots. Right: Svelte 5 snippets.</p>
</header>

<div class="grid">
	<section>
		<h2>Legacy (slots)</h2>
		<NoticeLegacy variant="info" let:close>
			<strong>Heads up.</strong> This notice is rendered via Svelte 4 slots — note the <code>let:close</code>.
			<svelte:fragment slot="actions" let:close>
				<button type="button" onclick={close}>OK</button>
			</svelte:fragment>
		</NoticeLegacy>
	</section>

	<section>
		<h2>Modern (snippets)</h2>
		<NoticeSnippets variant="info">
			{#snippet children({ close })}
				<strong>Heads up.</strong> Same notice, rendered via snippets — typed close callback and all.
			{/snippet}
			{#snippet actions({ close })}
				<button type="button" onclick={close}>OK</button>
			{/snippet}
		</NoticeSnippets>
	</section>
</div>

<style>
	.top { margin-block-end: var(--space-lg); }
	.top h1 { margin: 0; }
	.muted { margin: var(--space-2xs) 0 0; color: var(--color-text-muted); font-size: var(--text-sm); }

	.grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-md);
	}

	@media (max-width: 48rem) { .grid { grid-template-columns: 1fr; } }

	section h2 {
		font-size: var(--text-md);
		margin: 0 0 var(--space-sm);
		color: var(--color-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	code {
		padding: 0.1em 0.3em;
		background: var(--color-surface-sunken);
		border-radius: var(--radius-sm);
		font-size: 0.9em;
	}
</style>
