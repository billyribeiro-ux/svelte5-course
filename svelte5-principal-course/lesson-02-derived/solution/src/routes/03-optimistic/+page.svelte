<script lang="ts">
	const post = $state({ id: 1, title: 'Push-pull reactivity explained', likes: 42 });

	let pending = $state(false);
	let error = $state<string | null>(null);

	let likes = $derived(post.likes);

	async function fakeApiLike(): Promise<void> {
		await new Promise((r) => setTimeout(r, 600));
		if (Math.random() < 0.2) throw new Error('Network burp');
		post.likes += 1;
	}

	async function onLike(): Promise<void> {
		pending = true;
		error = null;
		likes += 1;
		try {
			await fakeApiLike();
		} catch (err) {
			likes -= 1;
			error = err instanceof Error ? err.message : 'Unknown error';
		} finally {
			pending = false;
		}
	}
</script>

<h1>03 — Optimistic likes</h1>

<article>
	<h2>{post.title}</h2>
	<p class="meta">Server truth: {post.likes} likes</p>

	<button type="button" onclick={onLike} disabled={pending}>
		🧡 {likes}
	</button>
	{#if pending}<span class="pending">saving…</span>{/if}
	{#if error}<p class="error" role="alert">Rollback: {error}</p>{/if}
</article>

<style>
	article {
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		padding: var(--space-lg);
		max-inline-size: 32rem;
	}

	.meta {
		color: var(--color-text-muted);
		font-size: var(--text-sm);
	}

	button {
		font-size: var(--text-lg);
	}

	.pending {
		margin-inline-start: var(--space-sm);
		color: var(--color-text-muted);
		font-size: var(--text-sm);
	}

	.error {
		color: oklch(55% 0.2 25);
		font-size: var(--text-sm);
	}
</style>
