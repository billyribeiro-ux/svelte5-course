<script lang="ts">
	// Lesson 02 build:
	//   Build a validator that returns { valid, errors, warnings }.
	//   Destructure a $derived.by(() => validate(...)) to expose all three reactively.
	//   The submit button should be disabled when !valid.
	//
	//   Rules:
	//     - email must contain '@'
	//     - password must be at least 8 chars
	//     - confirm must equal password
	//     - warning: password without a number is legal but "weak"

	let email = $state('');
	let password = $state('');
	let confirm = $state('');

	// Lesson 02 build: destructure these from a $derived.by(...)
	const valid = false;
	const errors: string[] = [];
	const warnings: string[] = [];

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
