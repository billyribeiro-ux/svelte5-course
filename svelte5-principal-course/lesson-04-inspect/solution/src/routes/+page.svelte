<script lang="ts">
	const pages = [
		{ href: '/01-basic', title: '01 — Basic $inspect', blurb: 'Observe state. Open DevTools console.' },
		{ href: '/02-filtered', title: '02 — $inspect(...).with', blurb: 'Filter, warn, debugger only on interesting transitions.' },
		{ href: '/03-trace', title: '03 — $inspect.trace', blurb: 'Identify which dep fired a derived or effect.' },
		{ href: '/04-debug', title: '04 — Debug the broken page', blurb: 'Use inspect to find the planted reactivity bug.' }
	];
</script>

<h1>Lesson 04 — <code>$inspect</code> (solution)</h1>
<p>Reference solutions. Open DevTools and compare the console output against the expected behaviour described in each page.</p>

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
