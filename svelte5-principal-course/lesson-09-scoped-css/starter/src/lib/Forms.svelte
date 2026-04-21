<script lang="ts">
	let name = $state('Billy');
	let size = $state<'sm' | 'md' | 'lg'>('md');
	let agreed = $state(false);
	let flavor = $state<'vanilla' | 'chocolate' | 'strawberry'>('chocolate');
	let intensity = $state(50);
</script>

<h3>Form controls</h3>

<div class="grid">
	<label class="item">
		<span>Name</span>
		<input type="text" bind:value={name} />
	</label>

	<label class="item">
		<span>Size</span>
		<select bind:value={size}>
			<option value="sm">Small</option>
			<option value="md">Medium</option>
			<option value="lg">Large</option>
		</select>
	</label>

	<label class="item inline">
		<input type="checkbox" bind:checked={agreed} />
		<span>I accept the terms</span>
	</label>

	<div class="item">
		<span class="label">Flavour</span>
		<div class="radios">
			{#each ['vanilla', 'chocolate', 'strawberry'] as f (f)}
				<label class="radio">
					<input type="radio" name="flavor" value={f} bind:group={flavor} />
					<span>{f}</span>
				</label>
			{/each}
		</div>
	</div>

	<label class="item">
		<span>Intensity ({intensity})</span>
		<input type="range" min="0" max="100" bind:value={intensity} />
	</label>
</div>

<p class="summary">
	<strong>{name}</strong> · size {size} · {agreed ? 'agreed' : 'not agreed'} · {flavor} · intensity {intensity}
</p>

<style>
	h3 {
		margin: 0 0 var(--space-sm);
		font-size: var(--text-md);
		color: var(--color-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
		gap: var(--space-sm);
	}

	.item {
		display: flex;
		flex-direction: column;
		gap: var(--space-2xs);
		font-size: var(--text-sm);
	}

	.item > span,
	.item .label {
		color: var(--color-text-muted);
		font-size: var(--text-xs);
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.item.inline {
		flex-direction: row;
		align-items: center;
		gap: var(--space-xs);
	}

	.item.inline > span {
		color: var(--color-text);
		font-size: var(--text-sm);
		text-transform: none;
		letter-spacing: normal;
	}

	input[type='text'],
	select {
		padding-block: calc(var(--space-xs) * var(--density, 1));
		padding-inline: calc(var(--space-sm) * var(--density, 1));
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		color: var(--color-text);
		font: inherit;
	}

	input[type='range'] {
		accent-color: var(--color-accent);
	}

	.radios {
		display: flex;
		gap: var(--space-sm);
		flex-wrap: wrap;
	}

	.radio {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2xs);
		font-size: var(--text-sm);
	}

	.summary {
		margin-block-start: var(--space-sm);
		padding: var(--space-xs) var(--space-sm);
		background: var(--color-surface-sunken);
		border-radius: var(--radius-sm);
		font-size: var(--text-xs);
		color: var(--color-text-muted);
	}
</style>
