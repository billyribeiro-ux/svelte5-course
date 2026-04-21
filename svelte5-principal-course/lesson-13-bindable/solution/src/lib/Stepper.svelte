<script lang="ts">
	interface Props {
		step?: number;
		total: number;
		labels: string[];
		canAdvance?: boolean;
	}

	let { step = $bindable(0), total, labels, canAdvance = true }: Props = $props();

	function prev(): void {
		if (step > 0) step -= 1;
	}

	function next(): void {
		if (step < total - 1) step += 1;
	}

	function goTo(i: number): void {
		if (i <= step) step = i;
	}
</script>

<nav class="stepper" aria-label="Progress">
	<ol>
		{#each labels as label, i (label)}
			<li class={['step', i === step && 'current', i < step && 'done']}>
				<button type="button" onclick={() => goTo(i)} disabled={i > step}>
					<span class="dot" aria-hidden="true">{i < step ? '✓' : i + 1}</span>
					<span class="label">{label}</span>
				</button>
			</li>
		{/each}
	</ol>
</nav>

<div class="actions">
	<button type="button" class="ghost" onclick={prev} disabled={step === 0}>← Back</button>
	<button type="button" class="primary" onclick={next} disabled={!canAdvance || step === total - 1}>
		{step === total - 1 ? 'Done' : 'Next →'}
	</button>
</div>

<style>
	.stepper ol {
		list-style: none;
		padding: 0;
		margin: 0 0 var(--space-md);
		display: flex;
		gap: var(--space-xs);
		align-items: center;
	}

	.step {
		flex: 1;
	}

	.step button {
		inline-size: 100%;
		display: flex;
		align-items: center;
		gap: var(--space-xs);
		padding: var(--space-xs) var(--space-sm);
		background: transparent;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		color: var(--color-text-muted);
		font: inherit;
		font-size: var(--text-sm);
		cursor: pointer;
	}

	.step.current button {
		background: var(--color-accent);
		color: var(--color-accent-text);
		border-color: var(--color-accent);
		cursor: default;
	}

	.step.done button {
		color: var(--color-text);
		border-color: var(--color-border-strong);
	}

	.step button:disabled {
		cursor: not-allowed;
	}

	.dot {
		inline-size: 1.5rem;
		block-size: 1.5rem;
		border-radius: 999px;
		background: var(--color-surface-sunken);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-weight: 600;
	}

	.step.current .dot {
		background: oklch(100% 0 0 / 0.25);
		color: var(--color-accent-text);
	}

	.actions {
		display: flex;
		justify-content: space-between;
		gap: var(--space-sm);
		margin-block-start: var(--space-md);
	}

	.actions button {
		padding: var(--space-xs) var(--space-md);
		border-radius: var(--radius-md);
		font: inherit;
		font-size: var(--text-sm);
		cursor: pointer;
	}

	.primary {
		background: var(--color-accent);
		color: var(--color-accent-text);
		border: 1px solid var(--color-accent);
	}

	.primary:hover:not(:disabled) {
		background: var(--color-accent-hover);
	}

	.primary:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.ghost {
		background: transparent;
		color: var(--color-text);
		border: 1px solid var(--color-border);
	}

	.ghost:hover:not(:disabled) {
		background: var(--color-surface-raised);
	}

	.ghost:disabled {
		opacity: 0.35;
		cursor: not-allowed;
	}
</style>
