<script lang="ts">
	const pages = [
		{ href: '/01-cart', title: '01 — Cart totals', blurb: 'Derive subtotal, tax, total.' },
		{ href: '/02-filter', title: '02 — Filter', blurb: 'Derived list from a search query.' },
		{ href: '/03-optimistic', title: '03 — Optimistic UI', blurb: 'Override a derived for instant feedback.' },
		{ href: '/04-destructure', title: '04 — Destructured derived', blurb: 'Form validation via a destructured derived.' }
	];
</script>

<h1>Lesson 02 — <code>$derived</code></h1>
<p>Four build challenges. Each one forces a different muscle of derived reactivity.</p>

<ul class="challenges">
	{#each pages as p (p.href)}
		<li>
			<a href={p.href}>
				<strong>{p.title}</strong>
				<span>{p.blurb}</span>
			</a>
		</li>
	{/each}
</ul>

<style>
	.challenges {
		list-style: none;
		padding: 0;
		display: grid;
		gap: var(--space-md);
		margin-block-start: var(--space-lg);
	}

	.challenges a {
		display: flex;
		flex-direction: column;
		gap: var(--space-2xs);
		padding: var(--space-md);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		text-decoration: none;
		color: var(--color-text);
		transition: border-color var(--duration-fast) var(--ease-out);
	}

	.challenges a:hover {
		border-color: var(--color-accent);
	}

	.challenges span {
		color: var(--color-text-muted);
		font-size: var(--text-sm);
	}

	code {
		padding: 0.1em 0.3em;
		background: var(--color-surface-sunken);
		border-radius: var(--radius-sm);
	}
</style>
