<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';

	let { children } = $props();

	const nav = [
		{ href: '/', label: 'Home' },
		{ href: '/01-cart', label: '01 — Cart' },
		{ href: '/02-filter', label: '02 — Filter' },
		{ href: '/03-optimistic', label: '03 — Optimistic' },
		{ href: '/04-destructure', label: '04 — Destructure' }
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
