<!--
	Lesson 02 deep-dive — overriding a derived (optimistic UI).

	Since Svelte 5.25 a `$derived` declared with `let` (not `const`) can be
	REASSIGNED. The override is temporary: as soon as a dependency changes,
	the derived snaps back to its computed value.

	That's the perfect shape for optimistic UI:
	  1. Reflect the source of truth as a derived.
	  2. On user action: assign a new value to it (instant feedback).
	  3. Send the request.
	  4. On success: let the source of truth update — the derived recomputes
	     and your override is harmlessly overwritten.
	  5. On failure: assign the old value back (rollback).

	This file builds on `/03-optimistic` in the lesson and adds: typed
	rollback, explicit "in flight" indicator, and a button to simulate
	a fail so you can see the rollback path. Cumulative-syntax: $state
	(L01), $derived (L02). No new runes.
-->
<script lang="ts">
	type Post = { id: number; title: string; likes: number };

	const post = $state<Post>({ id: 1, title: 'Push-pull reactivity', likes: 42 });
	let pending = $state(false);
	let lastError = $state<string | null>(null);

	let likes = $derived(post.likes);

	async function fakeApi(failNext: boolean): Promise<void> {
		await new Promise((r) => setTimeout(r, 600));
		if (failNext) throw new Error('Server returned 500');
		post.likes += 1;
	}

	async function onLike(failNext: boolean): Promise<void> {
		pending = true;
		lastError = null;
		const before = likes;
		likes += 1; // optimistic override

		try {
			await fakeApi(failNext);
			// success — `post.likes` changed, the derived will snap back to it
			// and overwrite our override. No code needed.
		} catch (err) {
			likes = before; // rollback the override
			lastError = err instanceof Error ? err.message : 'Unknown error';
		} finally {
			pending = false;
		}
	}
</script>

<h2>Overriding a derived — optimistic UI with rollback</h2>

<article>
	<h3>{post.title}</h3>
	<p class="meta">Server truth: <code>post.likes = {post.likes}</code></p>

	<div class="actions">
		<button type="button" disabled={pending} onclick={() => onLike(false)}>
			🧡 {likes} <small>(succeed)</small>
		</button>
		<button type="button" disabled={pending} onclick={() => onLike(true)}>
			🧡 {likes} <small>(fail)</small>
		</button>
	</div>

	{#if pending}<p class="status">saving…</p>{/if}
	{#if lastError}<p class="error" role="alert">rollback: {lastError}</p>{/if}
</article>

<p class="tip">
	Click <em>succeed</em> — the override jumps the count up, then the server confirms and
	<code>post.likes</code> catches up. Click <em>fail</em> — the override jumps, then we explicitly
	reassign <code>likes = before</code> to roll back. Notice you never had to set up a derived AND
	a separate $state mirror. The derived itself does both jobs.
</p>

<style>
	article {
		max-inline-size: 32rem;
		padding: 1rem;
		border: 1px solid rgb(0 0 0 / 0.15);
		border-radius: 0.5rem;
	}
	.meta {
		font-size: 0.85em;
		color: rgb(0 0 0 / 0.6);
	}
	.actions {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}
	button {
		padding: 0.5rem 0.75rem;
		border: 1px solid rgb(0 0 0 / 0.2);
		border-radius: 0.25rem;
		background: transparent;
		cursor: pointer;
		font-size: 1.05em;
	}
	button:disabled {
		opacity: 0.5;
		cursor: wait;
	}
	.status {
		font-size: 0.9em;
		color: rgb(0 0 0 / 0.55);
	}
	.error {
		color: oklch(55% 0.2 25);
		font-size: 0.9em;
	}
	.tip {
		margin-block-start: 1rem;
		font-size: 0.9em;
		color: rgb(0 0 0 / 0.55);
		max-inline-size: 40rem;
	}
	code {
		padding: 0.1em 0.3em;
		background: rgb(0 0 0 / 0.06);
		border-radius: 0.2rem;
	}
</style>
