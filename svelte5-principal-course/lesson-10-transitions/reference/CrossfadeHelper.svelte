<!--
	`crossfade` from svelte/transition creates a pair of directives — `send`
	and `receive` — that coordinate animating between two DOM positions.

	Pattern: two lists (here: "to do" and "done"). Each item has the same
	`key`. When an item moves from one list to the other, the `send`
	directive on the old element and the `receive` directive on the new
	element pair up and animate the element between its two positions.

	The result looks like the item *flies* from one list to the other.
-->
<script lang="ts">
	import { crossfade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	type Task = { id: number; text: string };

	let todo = $state<Task[]>([
		{ id: 1, text: 'Write tests' },
		{ id: 2, text: 'Draft release notes' },
		{ id: 3, text: 'Reply to PR comments' }
	]);

	let done = $state<Task[]>([]);

	const [send, receive] = crossfade({
		duration: 400,
		easing: quintOut
	});

	function complete(task: Task): void {
		todo = todo.filter((t) => t.id !== task.id);
		done = [...done, task];
	}

	function reopen(task: Task): void {
		done = done.filter((t) => t.id !== task.id);
		todo = [...todo, task];
	}
</script>

<div class="grid">
	<section>
		<h4>To do</h4>
		{#each todo as task (task.id)}
			<button
				type="button"
				class="task"
				onclick={() => complete(task)}
				in:receive={{ key: task.id }}
				out:send={{ key: task.id }}
			>
				{task.text}
			</button>
		{/each}
	</section>

	<section>
		<h4>Done</h4>
		{#each done as task (task.id)}
			<button
				type="button"
				class="task done"
				onclick={() => reopen(task)}
				in:receive={{ key: task.id }}
				out:send={{ key: task.id }}
			>
				{task.text}
			</button>
		{/each}
	</section>
</div>

<style>
	.grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	h4 {
		margin: 0 0 0.5rem;
	}

	.task {
		display: block;
		inline-size: 100%;
		padding: 0.5rem;
		margin-block-end: 0.25rem;
		background: oklch(95% 0.01 220);
		border: 1px solid oklch(80% 0.02 220);
		border-radius: 0.25rem;
		text-align: start;
		cursor: pointer;
		font: inherit;
	}

	.task.done {
		background: oklch(95% 0.05 150);
		border-color: oklch(65% 0.1 150);
		text-decoration: line-through;
		opacity: 0.75;
	}
</style>
