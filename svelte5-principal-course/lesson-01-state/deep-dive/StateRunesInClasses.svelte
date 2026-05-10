<!--
	Lesson 01 deep-dive — $state inside a class, the deeper rules.

	Three things this clarifies, building on the Todo class from the lesson:

	1. Class instances are NOT auto-proxified. You opt in by marking specific
	   fields with `$state(...)`. Other fields stay plain.

	2. Methods rebind `this` when passed as event handlers. Use arrow-fields
	   (toggle = () => ...) so `this` is captured at construction time.

	3. Class GETTERS are the natural place to expose computed values from a
	   class. Inside the getter you can read $state fields — anything that
	   reads the getter in the template (or in a $derived/$effect) will
	   subscribe automatically. (We will formalise this with $derived in
	   Lesson 02.)

	Click rows below. The toggle button works because `toggle` is an arrow
	field. The "marked done" count uses a getter that reads .done from every
	task — it stays in sync without you wiring anything.
-->
<script lang="ts">
	class Task {
		title = $state('');
		done = $state(false);

		// Private convention via `_` for clarity; runtime is plain.
		// (Real `#private` fields work too — they also accept $state.)
		_createdAt = new Date();

		constructor(title: string) {
			this.title = title;
		}

		// Arrow field — `this` is permanently bound to the Task instance,
		// so we can pass `task.toggle` directly into an event handler.
		toggle = (): void => {
			this.done = !this.done;
		};

		// Getter — computed view over the instance's reactive fields.
		// Any template/effect/derived that reads `.summary` will re-run when
		// .title or .done change.
		get summary(): string {
			const dot = this.done ? '✓' : '·';
			return `${dot} ${this.title}`;
		}
	}

	class TaskList {
		tasks = $state<Task[]>([new Task('write the lesson'), new Task('ship the lesson')]);

		// Getter aggregates over a $state array — also reactive.
		get completed(): number {
			return this.tasks.filter((t) => t.done).length;
		}

		add(title: string): void {
			this.tasks.push(new Task(title));
		}
	}

	const list = new TaskList();
	let draft = $state('');

	function add(): void {
		const t = draft.trim();
		if (!t) return;
		list.add(t);
		draft = '';
	}
</script>

<h2>$state in classes — methods, fields, getters</h2>

<form
	onsubmit={(e) => {
		e.preventDefault();
		add();
	}}
>
	<input bind:value={draft} placeholder="new task…" />
	<button type="submit" disabled={draft.trim() === ''}>add</button>
</form>

<p class="meta">completed: {list.completed} / {list.tasks.length}</p>

<ul>
	{#each list.tasks as task (task)}
		<li>
			<label>
				<input type="checkbox" checked={task.done} onchange={task.toggle} />
				<span class:done={task.done}>{task.summary}</span>
			</label>
		</li>
	{/each}
</ul>

<style>
	form {
		display: flex;
		gap: 0.5rem;
		margin-block-end: 1rem;
	}
	input:not([type]) {
		flex: 1;
		padding: 0.25rem 0.5rem;
	}
	.meta {
		font-family: ui-monospace, monospace;
		font-size: 0.9em;
		color: rgb(0 0 0 / 0.6);
	}
	ul {
		list-style: none;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}
	label {
		display: inline-flex;
		gap: 0.5rem;
		align-items: center;
	}
	.done {
		text-decoration: line-through;
		color: rgb(0 0 0 / 0.5);
	}
</style>
