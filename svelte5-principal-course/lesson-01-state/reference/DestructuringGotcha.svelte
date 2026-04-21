<script lang="ts">
	// The destructuring gotcha.
	//
	// Destructuring a reactive object gives you LOCAL variables — their
	// values at the moment you destructured. The originals keep changing;
	// the locals don't. Anything in the template that reads the local is
	// frozen to the value at first render.

	let person = $state({ name: 'Billy', age: 38 });

	// ❌ snapshots — the template will read these, but they never update
	const { name, age } = person;

	function bumpAge() {
		person.age += 1; // updates the proxy
	}

	function renamePerson() {
		// writes THROUGH the proxy — the "through proxy" row updates
		person.name = person.name === 'Billy' ? 'Bill' : 'Billy';
	}
</script>

<h2>Destructuring breaks reactivity</h2>

<p>Read values through the proxy, not around it.</p>

<dl>
	<dt>person.name <em>(through proxy)</em></dt>
	<dd>{person.name}</dd>
	<dt>person.age <em>(through proxy)</em></dt>
	<dd>{person.age}</dd>
	<dt><code>name</code> <em>(destructured, frozen)</em></dt>
	<dd>{name}</dd>
	<dt><code>age</code> <em>(destructured, frozen)</em></dt>
	<dd>{age}</dd>
</dl>

<div class="actions">
	<button onclick={bumpAge}>person.age += 1</button>
	<button onclick={renamePerson}>rename person</button>
</div>

<p class="note">
	Click the buttons: the top rows update, the bottom rows don't. The proxy
	only notifies subscribers when <em>it</em> is read or written. Destructured
	locals bypass the proxy entirely.
</p>

<style>
	dl {
		display: grid;
		grid-template-columns: max-content 1fr;
		gap: 0.5rem 1rem;
		margin-block: 1rem;
	}
	dt {
		font-family: ui-monospace, monospace;
		font-size: 0.9em;
		color: rgb(0 0 0 / 0.6);
	}
	.actions {
		display: flex;
		gap: 0.5rem;
	}
	button {
		padding: 0.5rem 1rem;
		border: 1px solid currentColor;
		border-radius: 0.25rem;
	}
	code {
		padding: 0.1em 0.3em;
		background: rgb(0 0 0 / 0.06);
		border-radius: 0.25rem;
	}
	.note {
		font-size: 0.9em;
		color: rgb(0 0 0 / 0.7);
	}
	em {
		color: rgb(0 0 0 / 0.55);
	}
</style>
