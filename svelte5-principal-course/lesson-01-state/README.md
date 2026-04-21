# Lesson 01 — `$state`

> Verified against **Svelte 5.55.4**, **SvelteKit 2.57.1**, on **2026-04-21**.
> Official docs: <https://svelte.dev/docs/svelte/$state>

## What this lesson is about, in one sentence

`$state` is the one rune you will use in almost every Svelte component — it is how you tell Svelte "this value changes over time, and the screen should follow along."

## The problem it solves

In plain JavaScript, if you write:

```js
let count = 0;
document.querySelector('p').textContent = count;

count = 1;
// the <p> still says "0"
```

Nothing connects `count` the variable to the `<p>` the screen element. You changed the variable; the DOM has no idea. To keep them in sync you would have to write glue code — "when `count` changes, also update the DOM" — and then write more glue code the next time you add another place that reads `count`.

Svelte's job is to delete that glue code. You write:

```svelte
<script>
	let count = $state(0);
</script>

<p>{count}</p>
<button onclick={() => count++}>click</button>
```

`count` is now a reactive variable. Svelte has wired a thin proxy around it, and any part of the template that reads `count` re-renders automatically when it changes. That's the whole mental model. No observers. No subscriptions. No `setState`. Just a variable that the UI is listening to.

## A mental model that actually works

If you have a Pine Script / ThinkScript background: think of `$state(0)` as declaring a _series_ whose history doesn't matter, only its current value. The template is a plot of it. When the series updates, the plot redraws. Svelte does the "redraw" part; you do the "update" part.

If you do not have that background: think of `$state(0)` as an ordinary variable that the screen has tied a string to. Tug the variable — `count++` — and everything on the other end of the string moves.

## The rules (memorize these five)

1. **`$state(x)` makes `x` reactive.** `x` can be a primitive (`0`, `"hi"`, `true`), an object (`{ name: "Billy" }`), an array (`[1, 2, 3]`), or a class instance you built with `$state` fields.
2. **Arrays and plain objects become _deeply_ reactive.** Mutating a nested property (`todos[0].done = true`) triggers a re-render. Pushing to an array (`todos.push(x)`) does too.
3. **Class instances are NOT auto-proxied.** To make a class reactive, put `$state(...)` inside the class as field initializers.
4. **Destructuring breaks reactivity at the point of destructuring.** `let { done } = todos[0]` gives you a frozen snapshot of `done` at that moment. The template won't re-render when the original changes.
5. **You can only use `$state` in `.svelte`, `.svelte.js`, and `.svelte.ts` files.** Plain `.js` / `.ts` files don't run through Svelte's compiler.

## Worked example 1 — counter

```svelte
<script lang="ts">
	let count = $state(0);
</script>

<button onclick={() => count++}>clicks: {count}</button>
```

What just happened:

- `$state(0)` creates a reactive primitive starting at `0`.
- `onclick` is a normal DOM attribute in Svelte 5 (not the Svelte 4 `on:click`).
- `count++` is a normal variable update. Svelte's compiler has transformed it behind the scenes into a signal write, but you don't see that — you just write ordinary JavaScript.

## Worked example 2 — deep state

```svelte
<script lang="ts">
	type Todo = { text: string; done: boolean };

	let todos = $state<Todo[]>([{ text: 'ship lesson 01', done: false }]);

	function toggle(i: number) {
		todos[i]!.done = !todos[i]!.done; // nested mutation works
	}

	function add() {
		todos.push({ text: 'next todo', done: false }); // push works
	}
</script>

<ul>
	{#each todos as todo, i (i)}
		<li>
			<input type="checkbox" checked={todo.done} onchange={() => toggle(i)} />
			{todo.text}
		</li>
	{/each}
</ul>

<button onclick={add}>add</button>
```

What's non-obvious here:

- `todos[i].done = ...` works because the array and every plain object inside it are wrapped in proxies. The proxy notices the write and re-runs any piece of the template that reads `todos[i].done`.
- We use the non-null assertion `!` because `noUncheckedIndexedAccess` is on in `tsconfig.base.json`. That flag gives you `Todo | undefined` on array index access — TypeScript is reminding you that arrays can be sparse. In a `for` or `{#each}` where you just iterated the array, the `!` is safe; outside of it, narrow properly.

## Worked example 3 — class with state

```ts
// src/lib/todo.svelte.ts
export class Todo {
	text = $state('');
	done = $state(false);

	constructor(text: string) {
		this.text = text;
	}

	// arrow function so `this` stays bound when passed as an event handler
	toggle = () => {
		this.done = !this.done;
	};
}
```

```svelte
<script lang="ts">
	import { Todo } from '$lib/todo.svelte';

	let todos = $state<Todo[]>([new Todo('first')]);
</script>

{#each todos as todo (todo)}
	<label>
		<input type="checkbox" checked={todo.done} onchange={todo.toggle} />
		{todo.text}
	</label>
{/each}
```

Why this matters:

- Class instances don't get auto-proxied. The reactivity lives in the `$state`-marked fields.
- `toggle` is an **arrow function**, not a method. If you wrote `toggle() { ... }` and passed `todo.toggle` directly to `onchange`, `this` inside the method would be the DOM `<input>`, not the `Todo`. Arrow functions capture `this` lexically, which is what you want.

## Worked example 4 — passing state across modules

You can put state in a `.svelte.ts` file and import it elsewhere, but there is one rule that catches everyone:

> **You can't export a `$state` value that you then _reassign_.**

This is fine:

```ts
// src/lib/counter-store.svelte.ts — exports an OBJECT (never reassigned)
export const counter = $state({ count: 0 });

export function increment() {
	counter.count += 1; // mutation, not reassignment
}
```

This is also fine (keep state private, expose accessors):

```ts
// src/lib/counter-store.svelte.ts — state stays inside the module
let count = $state(0);

export function getCount() {
	return count;
}
export function increment() {
	count += 1;
}
```

This is **broken**:

```ts
// DON'T do this
export let count = $state(0); // exported primitive, reassignable — breaks reactivity across modules
export function increment() {
	count += 1;
}
```

### Why it breaks

The Svelte compiler rewrites `count` reads and writes to call `$.get(count)` and `$.set(count, ...)` **inside the same file**. When another file imports `count`, it doesn't get that rewriting — it just gets the raw signal object. So the import sees a weird `Signal` thing instead of a number, and updates never propagate.

Two workarounds, both shown above: wrap the state in an object (so you're mutating its properties, never reassigning the variable itself), or keep the state private and expose functions.

## When NOT to use `$state`

- **For values derived from other state.** If `fullName = firstName + ' ' + lastName`, that's `$derived`, not `$state`. Lesson 02 will drill this in. Using `$state` + `$effect` to sync one value to another is the #1 anti-pattern in Svelte 5.
- **For props.** Props come in via `$props()` and are already reactive in their own way. Don't shadow them with `$state`.
- **For large readonly data you never mutate.** Use `$state.raw` to skip the proxy cost (see Challenge 5 in the reference folder).

## Common mistakes

| Mistake | What you'll see | Fix |
|---|---|---|
| Destructuring reactive data and expecting the locals to update | `let { count } = state;` then UI never changes when `state.count` changes | Read through the object: `state.count`, or use `$derived(state.count)` |
| Using `$state` outside a `.svelte`/`.svelte.ts`/`.svelte.js` file | Runtime error: `$state is not defined` | Rename the file to end in `.svelte.ts` (or move the code into a `.svelte` component) |
| Exporting a reassigned primitive `$state` from a module | Runtime warning about signal reads, or values just don't update | Wrap in an object or expose accessors (see example 4) |
| Class method `foo() {}` passed as event handler, then `this` is `undefined` | `TypeError: Cannot read property X of undefined` inside the handler | Use arrow functions: `foo = () => { ... }` |
| `console.log(myState)` prints `Proxy(...)` gibberish | Log looks unreadable | Use `$state.snapshot(myState)` to get a plain-object copy for logging |

## Principal Engineer lens

**When to reach for `$state`:** almost always, when you need a value the UI should react to. Primitives, small objects, small arrays — default to `$state`.

**When to reach for `$state.raw`:** large objects or arrays (thousands of items) where you never mutate — you replace the whole thing. The proxy overhead for a 10k-row array is real. But benchmark before optimizing; most apps don't have this problem.

**When to reach for a class:** when the data has behavior bolted to it. A `Todo` with `toggle()` and `remove()` is a class. A `{ name, age }` record is just `$state(...)`.

**When to reach for `.svelte.ts` module state:** when multiple unrelated components need the same piece of state, and passing it via props or context is more ceremony than value. For most cases, prefer **context** (Lesson 17) over module state — context scopes to a component tree, module state is global. Global is convenient and a liability.

The trade-off nobody tells you: Svelte's reactivity is _dense_. Every `$state` access is a signal read. For a 100-component app this is nothing. For a 10k-component app, or a tight animation loop reading state 60 times a second, you will start to notice. `$state.raw` is one lever. `untrack()` is another (Lesson 03). Most code never needs them.

## Build challenge

Ship four working pages in `starter/`:

1. **`/01-counter`** — a button that says "clicks: N". Clicking increments. Use a primitive `$state`.
2. **`/02-todos`** — a todo list with add / toggle / delete. Use deeply reactive `$state<Todo[]>`. Use a keyed `{#each}` block so reorders animate correctly later.
3. **`/03-class`** — rewrite `/02-todos` using a `Todo` class in `$lib/todo.svelte.ts` with a `toggle` arrow-function method. Removing a todo still belongs in the route, not on the class — a class shouldn't know about its container.
4. **`/04-module`** — a counter whose state lives in `$lib/counter-store.svelte.ts`. Expose `count` as a getter from a store object, plus `increment()` and `reset()` functions.

Acceptance: every page runs, nothing logs warnings, `pnpm --filter @course/lesson-01-starter check` passes with 0 errors / 0 warnings.

When done: diff against `solution/`. Read `reference/` for `$state.raw`, `$state.snapshot`, and the pass-state-into-functions pattern.

## Self-check

Answer these out loud before opening the `<details>` blocks.

<details>
<summary>1. Why does `todos[0].done = true` trigger a re-render, but `let { done } = todos[0]; done = true` does not?</summary>

The first line writes _through_ the proxy — the proxy's setter runs, notifies subscribers, and anything in the template that read `todos[0].done` gets marked dirty.

The second line destructures the current value of `done` into a new local variable. Nobody is watching that local. Writing to it is just writing to a disconnected primitive.

Rule of thumb: reactivity lives at the proxy boundary. The moment you pull a primitive out of the proxy, you are holding a snapshot.
</details>

<details>
<summary>2. You put `export let counter = $state(0); export function bump() { counter++; }` in a `.svelte.ts` file and a component imports both. The UI doesn't update. Why, and what's the fix?</summary>

`counter` is a directly-exported, reassigned `$state` primitive. The compiler rewrites reads/writes in the _declaring_ file, but the importing file gets the raw signal object instead of the rewritten access pattern. Reactivity breaks at the module boundary.

Fix: either wrap the state in an object (`export const counter = $state({ value: 0 })` and mutate `counter.value`), or keep `count` private to the module and export accessor functions.
</details>

<details>
<summary>3. You've got a class `Todo` with a method `toggle() { this.done = !this.done }`. You pass `onchange={todo.toggle}` and it throws. What's wrong and how do you fix it?</summary>

When you write `todo.toggle` (no call parens), you pass the function reference. DOM event handlers are invoked with `this` bound to the element that fired the event — so inside `toggle`, `this` is the `<input>`, not the `Todo`. `this.done` blows up.

Two fixes:
- Inline arrow wrapper: `onchange={() => todo.toggle()}` (preserves the method call).
- Arrow field (preferred in Svelte): `toggle = () => { this.done = !this.done }`. Arrow functions don't have their own `this`; they capture the surrounding lexical `this`, which is the class instance.

The arrow field is the pattern the official docs recommend for exactly this reason.
</details>

## Links

- [$state — Svelte docs](https://svelte.dev/docs/svelte/$state)
- [.svelte.js and .svelte.ts files — Svelte docs](https://svelte.dev/docs/svelte/svelte-js-files)
- [What are runes? — Svelte docs](https://svelte.dev/docs/svelte/what-are-runes)
