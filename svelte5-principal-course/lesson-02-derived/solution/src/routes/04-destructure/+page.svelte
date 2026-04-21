<script lang="ts">
	type Validation = { valid: boolean; errors: string[]; warnings: string[] };

	let email = $state('');
	let password = $state('');
	let confirm = $state('');

	function validate(e: string, p: string, c: string): Validation {
		const errors: string[] = [];
		const warnings: string[] = [];
		if (!e.includes('@') || !e.includes('.')) errors.push('Email looks wrong');
		if (p.length < 8) errors.push('Password must be at least 8 characters');
		if (p !== c) errors.push('Passwords do not match');
		if (p.length >= 8 && !/\d/.test(p)) warnings.push('Password is weak (no digits)');
		return { valid: errors.length === 0, errors, warnings };
	}

	const { valid, errors, warnings } = $derived.by(() => validate(email, password, confirm));

	function onSubmit(e: SubmitEvent): void {
		e.preventDefault();
		alert('Submitted!');
	}
</script>

<h1>04 — Destructured derived</h1>

<form onsubmit={onSubmit}>
	<label>
		Email
		<input type="email" bind:value={email} autocomplete="email" />
	</label>

	<label>
		Password
		<input type="password" bind:value={password} autocomplete="new-password" />
	</label>

	<label>
		Confirm password
		<input type="password" bind:value={confirm} autocomplete="new-password" />
	</label>

	<button type="submit" disabled={!valid}>Sign up</button>

	{#if errors.length > 0}
		<ul class="errs" aria-live="polite">
			{#each errors as err (err)}
				<li>{err}</li>
			{/each}
		</ul>
	{/if}

	{#if warnings.length > 0}
		<ul class="warns" aria-live="polite">
			{#each warnings as warn (warn)}
				<li>{warn}</li>
			{/each}
		</ul>
	{/if}
</form>

<style>
	form {
		display: grid;
		gap: var(--space-md);
		max-inline-size: 24rem;
	}

	label {
		display: flex;
		flex-direction: column;
		gap: var(--space-2xs);
	}

	.errs {
		list-style: none;
		padding: 0;
		margin: 0;
		color: oklch(55% 0.2 25);
	}

	.warns {
		list-style: none;
		padding: 0;
		margin: 0;
		color: oklch(60% 0.15 75);
	}
</style>
