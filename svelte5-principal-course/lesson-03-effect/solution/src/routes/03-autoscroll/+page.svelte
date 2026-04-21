<script lang="ts">
	import { tick } from 'svelte';

	let container = $state<HTMLDivElement | undefined>(undefined);
	let messages = $state<string[]>(seed());
	let draft = $state('');

	function seed(): string[] {
		return Array.from({ length: 20 }, (_, i) => `Message ${i + 1}`);
	}

	function send(e: SubmitEvent): void {
		e.preventDefault();
		const text = draft.trim();
		if (text === '') return;
		messages.push(text);
		draft = '';
	}

	$effect.pre(() => {
		if (!container) return;

		// Track messages.length so this re-runs when it changes.
		messages.length;

		const el = container;
		const wasNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 40;

		if (wasNearBottom) {
			void tick().then(() => {
				el.scrollTop = el.scrollHeight;
			});
		}
	});
</script>

<h1>03 — Autoscroll chat</h1>

<div class="chat" bind:this={container}>
	{#each messages as msg, i (i)}
		<p class="msg">{msg}</p>
	{/each}
</div>

<form onsubmit={send}>
	<input bind:value={draft} placeholder="Type and press Enter…" />
	<button type="submit">Send</button>
</form>

<p class="tip">Scroll up to read older messages and then send a new one — you should stay where you are. Scroll back to the bottom, send another — it should track.</p>

<style>
	.chat {
		block-size: 280px;
		overflow-y: auto;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		padding: var(--space-md);
		background: var(--color-surface-sunken);
	}

	.msg {
		margin: 0;
		padding-block: var(--space-2xs);
	}

	form {
		display: flex;
		gap: var(--space-sm);
		margin-block-start: var(--space-md);
	}

	form input {
		flex: 1;
	}

	.tip {
		color: var(--color-text-muted);
		font-size: var(--text-sm);
	}
</style>
