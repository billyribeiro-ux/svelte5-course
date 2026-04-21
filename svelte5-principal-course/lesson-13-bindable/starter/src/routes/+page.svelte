<script lang="ts">
	import { fade } from 'svelte/transition';
	import { prefersReducedMotion } from 'svelte/motion';
	import Stepper from '$lib/Stepper.svelte';

	const labels = ['Email', 'Password', 'Profile', 'Summary'];

	let step = $state(0);
	let form = $state({
		email: '',
		password: '',
		name: '',
		role: 'developer' as 'developer' | 'designer' | 'pm'
	});

	const canAdvance = $derived.by(() => {
		if (step === 0) return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email);
		if (step === 1) return form.password.length >= 8;
		if (step === 2) return form.name.trim().length > 0;
		return true;
	});

	const duration = $derived(prefersReducedMotion.current ? 0 : 250);

	// Optional while developing:
	// $inspect('signup', { step, form });
</script>

<header class="top">
	<h1>Create account</h1>
	<p class="muted">Four steps. Parent owns <code>step</code>; the Stepper mutates it via <code>$bindable</code>.</p>
</header>

<!-- Lesson 13 build: bind `step` so changes inside Stepper propagate back here. -->
<Stepper bind:step total={labels.length} {labels} {canAdvance} />

<section class="screen">
	{#key step}
		<div in:fade={{ duration }}>
			{#if step === 0}
				<label>
					<span>Email</span>
					<input type="email" bind:value={form.email} placeholder="you@company.com" />
				</label>
				<p class="hint">We'll send a confirmation link.</p>
			{:else if step === 1}
				<label>
					<span>Password</span>
					<input type="password" bind:value={form.password} placeholder="At least 8 characters" />
				</label>
				<p class="hint">{form.password.length} / 8 characters so far.</p>
			{:else if step === 2}
				<label>
					<span>Name</span>
					<input type="text" bind:value={form.name} placeholder="Your name" />
				</label>
				<label>
					<span>Role</span>
					<select bind:value={form.role}>
						<option value="developer">Developer</option>
						<option value="designer">Designer</option>
						<option value="pm">Product manager</option>
					</select>
				</label>
			{:else}
				<h2>Confirm</h2>
				<dl>
					<dt>Email</dt><dd>{form.email}</dd>
					<dt>Password</dt><dd>{'•'.repeat(form.password.length)}</dd>
					<dt>Name</dt><dd>{form.name}</dd>
					<dt>Role</dt><dd>{form.role}</dd>
				</dl>
			{/if}
		</div>
	{/key}
</section>

<style>
	.top { margin-block-end: var(--space-lg); }
	.top h1 { margin: 0; }
	.muted { margin: var(--space-2xs) 0 0; color: var(--color-text-muted); font-size: var(--text-sm); }
	code { padding: 0.1em 0.3em; background: var(--color-surface-sunken); border-radius: var(--radius-sm); font-size: 0.9em; }
	.screen { min-block-size: 10rem; padding: var(--space-md); background: var(--color-surface-raised); border: 1px solid var(--color-border); border-radius: var(--radius-lg); display: flex; flex-direction: column; gap: var(--space-sm); }
	label { display: flex; flex-direction: column; gap: var(--space-2xs); font-size: var(--text-sm); }
	label > span { color: var(--color-text-muted); font-size: var(--text-xs); text-transform: uppercase; letter-spacing: 0.04em; }
	input, select { padding: var(--space-xs) var(--space-sm); background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-sm); color: var(--color-text); font: inherit; }
	.hint { margin: 0; color: var(--color-text-muted); font-size: var(--text-xs); }
	dl { display: grid; grid-template-columns: 6rem 1fr; gap: var(--space-xs); margin: 0; font-size: var(--text-sm); }
	dt { color: var(--color-text-muted); font-size: var(--text-xs); text-transform: uppercase; letter-spacing: 0.04em; }
	dd { margin: 0; }
</style>
