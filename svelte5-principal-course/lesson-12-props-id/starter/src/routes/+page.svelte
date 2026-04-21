<script lang="ts">
	import AccordionItem from '$lib/AccordionItem.svelte';
</script>

<header class="top">
	<h1>Settings FAQ</h1>
	<p class="muted">
		Nested accordion. Each <code>&lt;AccordionItem&gt;</code> should use <code>$props.id()</code>
		to wire <code>aria-controls</code> and <code>aria-labelledby</code>. Inspect the DOM to confirm
		every ID is unique.
	</p>
</header>

<section class="accordion">
	<AccordionItem title="Profile" open>
		<p>Manage your display name, tagline, and avatar.</p>

		<div class="sub">
			<AccordionItem title="Can I change my username?">
				<p>
					Yes — once every 30 days. Your profile URL updates, and old links fall back
					gracefully with a redirect for 60 days.
				</p>
			</AccordionItem>
			<AccordionItem title="What are the avatar size limits?">
				<p>5 MB max, 512×512 recommended. JPEG, PNG, and WebP accepted.</p>
			</AccordionItem>
			<AccordionItem title="Is my profile public?">
				<p>
					Only the display name and avatar. Your email and login activity are never shown to
					anyone but you.
				</p>
			</AccordionItem>
		</div>
	</AccordionItem>

	<AccordionItem title="Billing">
		<p>Subscriptions, invoices, payment methods.</p>

		<div class="sub">
			<AccordionItem title="When am I charged?">
				<p>On the first of each month, in the currency of your billing address.</p>
			</AccordionItem>
			<AccordionItem title="How do refunds work?">
				<p>
					If you cancel within 14 days of payment, you get a full refund, no questions.
					After 14 days, the subscription runs to the end of the period.
				</p>
			</AccordionItem>
			<AccordionItem title="Can I switch plans mid-month?">
				<p>
					Yes. Upgrades are prorated; downgrades take effect at the next cycle.
				</p>
			</AccordionItem>
		</div>
	</AccordionItem>

	<AccordionItem title="Notifications">
		<p>Email, push, SMS, and the quiet-hours window.</p>

		<div class="sub">
			<AccordionItem title="Why did I stop getting emails?">
				<p>
					Check the "Channels" settings — you may have turned off email. Also
					check your inbox filters.
				</p>
			</AccordionItem>
			<AccordionItem title="What does the quiet-hours setting do?">
				<p>
					Suppresses push and SMS (not email) during the specified window. Timezone
					follows your profile.
				</p>
			</AccordionItem>
			<AccordionItem title="Can I unsubscribe from all emails?">
				<p>Yes — toggle "Email" off in Channels. You'll still get security-critical emails.</p>
			</AccordionItem>
		</div>
	</AccordionItem>
</section>

<style>
	.top {
		margin-block-end: var(--space-lg);
	}

	.top h1 {
		margin: 0;
	}

	.muted {
		margin: var(--space-2xs) 0 0;
		color: var(--color-text-muted);
		font-size: var(--text-sm);
	}

	code {
		padding: 0.1em 0.3em;
		background: var(--color-surface-sunken);
		border-radius: var(--radius-sm);
		font-size: 0.9em;
	}

	.accordion {
		border-block-start: 1px solid var(--color-border);
		background: var(--color-surface-raised);
		border-radius: var(--radius-lg);
		padding-inline: var(--space-md);
	}

	.sub {
		margin-inline-start: var(--space-md);
		padding-inline-start: var(--space-md);
		border-inline-start: 2px solid var(--color-border);
		margin-block: var(--space-sm) 0;
	}

	.sub :global(.item:last-child) {
		border-block-end: 0;
	}

	.accordion > :global(.item:last-child) {
		border-block-end: 0;
	}
</style>
