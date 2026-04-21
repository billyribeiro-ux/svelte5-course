<script lang="ts">
	// Lesson 02 build:
	//   Declare `likes` as $derived from `post.likes`.
	//   On click: `likes += 1` (override), call fakeApiLike(), on failure `likes -= 1`.
	//   Disable the button while the request is in flight.
	//
	// Try clicking fast — the override should show instantly while the request pends.
	// About 1 in 5 calls will "fail" — the override should roll back cleanly.

	const post = $state({ id: 1, title: 'Push-pull reactivity explained', likes: 42 });

	let pending = $state(false);

	let likes = post.likes; // Lesson 02 build: make this a $derived

	async function fakeApiLike(): Promise<void> {
		await new Promise((r) => setTimeout(r, 600));
		if (Math.random() < 0.2) throw new Error('Network burp');
		post.likes += 1;
	}

	async function onLike(): Promise<void> {
		// Lesson 02 build: optimistic override + rollback
		pending = true;
		try {
			await fakeApiLike();
		} catch {
			// roll back here
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
</style>
