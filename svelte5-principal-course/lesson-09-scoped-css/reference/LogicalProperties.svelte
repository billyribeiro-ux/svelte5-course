<!--
	Logical properties in action. Click the toggle to flip the document
	direction to RTL. Notice that all the layout stays symmetric:
	padding-inline, margin-inline-start, border-inline-end — everything
	that talks about the "inline" axis swaps sides automatically.

	Writing `padding-left` instead would break in RTL. Never do that.
-->
<script lang="ts">
	let rtl = $state(false);
</script>

<label>
	<input type="checkbox" bind:checked={rtl} />
	RTL
</label>

<div class="page" dir={rtl ? 'rtl' : 'ltr'}>
	<aside class="sidebar">
		<h4>Sidebar</h4>
		<p>
			I use <code>padding-inline-start</code> and <code>border-inline-end</code> — so I snap to
			the correct side when the direction flips.
		</p>
	</aside>

	<main class="content">
		<h4>Main</h4>
		<p>Toggle RTL above. The sidebar moves, the divider stays "before" the content.</p>
	</main>
</div>

<style>
	label {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		margin-block-end: 0.5rem;
	}

	.page {
		display: flex;
		border: 1px solid #ddd;
		border-radius: 0.5rem;
		overflow: hidden;
	}

	.sidebar {
		inline-size: 12rem;
		padding: 1rem;
		padding-inline-start: 1.5rem;
		background: oklch(96% 0.01 250);
		border-inline-end: 1px solid #ddd;
	}

	.content {
		flex: 1;
		padding: 1rem;
	}

	h4 {
		margin: 0 0 0.25rem;
	}

	p {
		margin: 0;
		font-size: 0.875rem;
	}

	code {
		padding: 0.1em 0.3em;
		background: #eee;
		border-radius: 3px;
		font-size: 0.875em;
	}
</style>
