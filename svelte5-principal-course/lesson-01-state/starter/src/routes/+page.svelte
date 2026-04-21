<script lang="ts">
	const pages = [
		{ href: '/01-counter', title: '01 — Counter', blurb: 'Basic $state primitive.' },
		{ href: '/02-todos', title: '02 — Todos', blurb: 'Deep reactive state.' },
		{ href: '/03-class', title: '03 — Class state', blurb: 'Class fields with $state.' },
		{ href: '/04-module', title: '04 — Module state', blurb: 'Sharing state across files.' }
	];
</script>

<h1>Lesson 01 — <code>$state</code></h1>
<p>Four build challenges. Complete each page listed below.</p>

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
