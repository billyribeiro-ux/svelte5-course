<!--
	Card variants. Notice that `.card` is defined here and in other
	components (like Forms.svelte uses `.item`); each is scoped to its own
	file via the generated hash class.
-->
<h3>Cards</h3>

<div class="row">
	<article class="card">
		<h4>Default card</h4>
		<p>Plain surface. Uses the course tokens for padding, colour, and radius.</p>
		<a class="cta" href="#/">Read more →</a>
	</article>

	<article class="card highlighted">
		<h4>Highlighted card</h4>
		<p>Accent-coloured border; same interior.</p>
		<a class="cta" href="#/">Read more →</a>
	</article>

	<article class="card muted">
		<h4>Muted card</h4>
		<p>Lower-contrast surface for secondary content.</p>
		<a class="cta" href="#/">Read more →</a>
	</article>
</div>

<style>
	h3 {
		margin: 0 0 var(--space-sm);
		font-size: var(--text-md);
		color: var(--color-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.row {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
		gap: var(--space-sm);
	}

	.card {
		padding: calc(var(--space-md) * var(--density, 1));
		background: var(--color-surface-raised);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}

	.card h4 {
		margin: 0;
		font-size: var(--text-md);
		line-height: var(--leading-tight);
	}

	.card p {
		margin: 0;
		color: var(--color-text-muted);
		font-size: var(--text-sm);
	}

	.card.highlighted {
		border-color: var(--color-accent);
	}

	.card.muted {
		background: var(--color-surface-sunken);
	}

	.cta {
		margin-block-start: auto;
		font-size: var(--text-sm);
	}
</style>
