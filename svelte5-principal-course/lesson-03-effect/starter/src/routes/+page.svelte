<script lang="ts">
	const pages = [
		{ href: '/01-canvas', title: '01 — Canvas redraw', blurb: 'Repaint a rounded rectangle on every state change.' },
		{ href: '/02-timer', title: '02 — Adjustable interval', blurb: 'setInterval with teardown; change speed and pause.' },
		{ href: '/03-autoscroll', title: '03 — Autoscroll chat', blurb: '$effect.pre to scroll only when near the bottom.' },
		{ href: '/04-persist', title: '04 — localStorage theme', blurb: 'Persist across reloads, apply to <html>.' }
	];
</script>

<h1>Lesson 03 — <code>$effect</code></h1>
<p>Four build challenges. Each forces a different seam between Svelte's reactive graph and the outside world.</p>

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
