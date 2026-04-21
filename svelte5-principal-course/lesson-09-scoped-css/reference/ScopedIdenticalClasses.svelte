<!--
	Two adjacent sections using the exact same `.card` class name.
	Because scoped CSS hashes per-file, this file's `.card` targets only
	the elements rendered by this file. If another component in the app
	also defined `.card { color: red }`, it wouldn't leak here — and vice
	versa.

	Open DevTools on the rendered elements to see the `.svelte-xxxxx`
	hash class that makes this work.
-->
<div class="card">
	<h4>Scoped</h4>
	<p>Both cards use the same `.card` class. The styles here only apply to this component's output.</p>
</div>

<div class="card">
	<h4>Also scoped</h4>
	<p>Drop another component defining its own <code>.card</code> into the same page — its styles stay in its own file.</p>
</div>

<style>
	.card {
		padding: 1rem;
		margin-block-end: 0.5rem;
		background: oklch(95% 0.01 250);
		border-radius: 0.5rem;
	}

	.card h4 {
		margin: 0 0 0.25rem;
	}

	.card p {
		margin: 0;
		color: oklch(40% 0.01 250);
		font-size: 0.875rem;
	}
</style>
