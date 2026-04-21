<!--
	Showcase of every button variant the design system provides.
	Zero props — this component renders its own demo content.
	Every class here is scoped to this file; `.btn` here is NOT the same
	class as `.btn` in any other component.
-->
<h3>Buttons</h3>

<div class="row">
	<button class="btn">Primary</button>
	<button class="btn secondary">Secondary</button>
	<button class="btn ghost">Ghost</button>
	<button class="btn destructive">Destructive</button>
</div>

<div class="row">
	<button class="btn sm">Small</button>
	<button class="btn">Normal</button>
	<button class="btn lg">Large</button>
	<button class="btn" disabled>Disabled</button>
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
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-xs);
		margin-block-end: var(--space-sm);
	}

	.btn {
		padding-block: calc(var(--space-xs) * var(--density, 1));
		padding-inline: calc(var(--space-md) * var(--density, 1));
		background: var(--color-accent);
		color: var(--color-accent-text);
		border: 1px solid var(--color-accent);
		border-radius: var(--radius-md);
		font: inherit;
		font-size: var(--text-sm);
		cursor: pointer;
		transition: background var(--duration-fast) var(--ease-out);
	}

	.btn:hover:not(:disabled) {
		background: var(--color-accent-hover);
	}

	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn.secondary {
		background: var(--color-surface-raised);
		color: var(--color-text);
		border-color: var(--color-border-strong);
	}

	.btn.secondary:hover:not(:disabled) {
		background: var(--color-surface-sunken);
	}

	.btn.ghost {
		background: transparent;
		color: var(--color-accent);
		border-color: transparent;
	}

	.btn.ghost:hover:not(:disabled) {
		background: var(--color-surface-raised);
	}

	.btn.destructive {
		background: var(--color-danger);
		border-color: var(--color-danger);
		color: white;
	}

	.btn.destructive:hover:not(:disabled) {
		background: oklch(from var(--color-danger) calc(l - 5) c h);
	}

	.btn.sm {
		padding-block: calc(var(--space-3xs) * var(--density, 1));
		padding-inline: calc(var(--space-sm) * var(--density, 1));
		font-size: var(--text-xs);
	}

	.btn.lg {
		padding-block: calc(var(--space-sm) * var(--density, 1));
		padding-inline: calc(var(--space-lg) * var(--density, 1));
		font-size: var(--text-md);
	}
</style>
