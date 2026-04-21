<script lang="ts">
	// Proxies break a bunch of "pass this object somewhere else" APIs:
	//   - console.log prints "Proxy { ... }" instead of the underlying shape
	//   - structuredClone may fail or produce unexpected results
	//   - JSON.stringify works, but libraries that walk objects via Reflect
	//     or feature-detect shape often don't
	//
	// $state.snapshot returns a plain deep copy, safe to hand off.

	let state = $state({
		user: { name: 'Billy', age: 38 },
		todos: [
			{ text: 'ship lesson 01', done: true },
			{ text: 'ship lesson 02', done: false }
		]
	});

	let output = $state('');

	function logRaw() {
		console.log('raw proxy:', state);
		output = 'Check the console — you will see "Proxy { ... }".';
	}

	function logSnapshot() {
		const snap = $state.snapshot(state);
		console.log('snapshot:', snap);
		output = JSON.stringify(snap, null, 2);
	}

	function cloneDeep() {
		// ✅ idiomatic: snapshot, then clone
		const clone = structuredClone($state.snapshot(state));
		output = `cloned OK — name: ${clone.user.name}`;
	}

	function addTodo() {
		state.todos.push({ text: `todo ${state.todos.length + 1}`, done: false });
	}
</script>

<h2><code>$state.snapshot</code> + <code>structuredClone</code></h2>

<p>Snapshot before handing your state off to anything that isn't Svelte.</p>

<div class="actions">
	<button onclick={logRaw}>console.log(state)</button>
	<button onclick={logSnapshot}>snapshot + log</button>
	<button onclick={cloneDeep}>structuredClone</button>
	<button onclick={addTodo}>add todo</button>
</div>

<pre>{output}</pre>

<style>
	.actions {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
		margin-block: 1rem;
	}
	button {
		padding: 0.5rem 1rem;
		border: 1px solid currentColor;
		border-radius: 0.25rem;
	}
	pre {
		padding: 1rem;
		background: rgb(0 0 0 / 0.06);
		border-radius: 0.25rem;
		max-inline-size: 40rem;
		overflow-x: auto;
	}
	code {
		padding: 0.1em 0.3em;
		background: rgb(0 0 0 / 0.06);
		border-radius: 0.25rem;
	}
</style>
