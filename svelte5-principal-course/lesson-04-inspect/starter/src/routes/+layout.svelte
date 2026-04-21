<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';

	let { children } = $props();

	const nav = [
		{ href: '/', label: 'Home' },
		{ href: '/01-basic', label: '01 — Basic' },
		{ href: '/02-filtered', label: '02 — Filtered' },
		{ href: '/03-trace', label: '03 — Trace' },
		{ href: '/04-debug', label: '04 — Debug' }
	];
</script>

<header>
	<nav>
		{#each nav as item (item.href)}
			<a href={item.href} aria-current={page.url.pathname === item.href ? 'page' : undefined}>
				{item.label}
			</a>
		{/each}
	</nav>
</header>

<main>
	{@render children?.()}
</main>

<style>
	header {
		border-block-end: 1px solid var(--color-border);
		padding: var(--space-md) var(--space-lg);
	}

	nav {
		display: flex;
		gap: var(--space-md);
		flex-wrap: wrap;
		max-inline-size: var(--container-sm);
		margin-inline: auto;
	}

	nav a {
		text-decoration: none;
		color: var(--color-text-muted);
		font-size: var(--text-sm);
	}

	nav a[aria-current='page'] {
		color: var(--color-accent);
		font-weight: 600;
	}
</style>
