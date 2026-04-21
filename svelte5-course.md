# Svelte 5 — Zero to Principal, April 2026 Edition

A 15-lesson course written for Billy Ribeiro. No JavaScript prerequisites beyond "I can read code and copy commands." Every concept is taught inside a Svelte 5 component, because that's where you'll use it. Each lesson ends with a build you run yourself and three questions you should be able to answer cold.

**Verified against:** Svelte 5.55.x, SvelteKit 2.57.x, TypeScript 6, as of April 21, 2026.

**Time commitment:** ~1 hour per lesson. Do one a day, skip a day if life happens, but don't skip a lesson. Each one builds on the last.

**Setup needed before Lesson 1:**
- Node.js 24 LTS installed (`node --version` shows v24.x)
- pnpm installed (`pnpm --version` shows 10.x)
- VS Code with the official "Svelte for VS Code" extension

---

## The shape of this course

**Lessons 1–3** — The three core runes you'll use every single day.
**Lessons 4–6** — Template syntax. How to write the markup.
**Lessons 7–9** — Components. How to split and combine code.
**Lessons 10–12** — Real-world patterns. Forms, data, effects.
**Lessons 13–15** — Modern Svelte 5 features (attachments, async, boundaries).

By the end of lesson 15, you'll understand every line of the free-book funnel we built earlier.

---

# LESSON 1 — `$state` and thinking in runes

## What a rune is, in plain English

A **rune** is a special keyword that Svelte understands. It looks like a function call with a dollar sign in front. Unlike a regular function, you don't import it — it's part of the language, the same way `if` and `for` are part of JavaScript.

Runes tell Svelte: **"this variable is special. Track it. Re-render the screen when it changes."**

Without a rune, a variable is just a variable. It sits there. Nothing happens when you change it.

## Your first component

Create a new project:

```bash
cd ~/Desktop
npx sv create lesson-01
cd lesson-01
```

Prompts: `SvelteKit minimal` → `Yes, TypeScript` → add `prettier` and `eslint` only → `vercel` adapter → `pnpm`.

Then:

```bash
pnpm dev
```

Open `http://localhost:5173`. You see the default page.

Now open `src/routes/+page.svelte` and delete everything in it. Replace with:

```svelte
<script lang="ts">
	let count = $state(0);
</script>

<button onclick={() => count++}>
	Clicks: {count}
</button>
```

Save. The browser auto-reloads. Click the button.

## What just happened

- `let count = $state(0)` — declared a reactive variable. Starting value is `0`.
- `onclick={() => count++}` — when the button is clicked, increment `count`.
- `{count}` — display the current value in the markup. Curly braces mean "evaluate this JavaScript expression and insert the result."

**Without `$state`**, `count` would still increment, but the screen wouldn't update. Svelte wouldn't know to re-render.

With `$state`, Svelte wraps the variable in something that notifies it whenever the value changes.

## Objects and arrays work too

Replace the file with:

```svelte
<script lang="ts">
	let user = $state({ name: 'Billy', age: 40 });
</script>

<p>Name: {user.name}</p>
<p>Age: {user.age}</p>

<button onclick={() => user.age++}>Birthday</button>
<button onclick={() => (user.name = 'William')}>Rename</button>
```

Click the buttons. Both update. Svelte is tracking changes to properties *inside* the object, not just reassignment of the object itself. This is called **deep reactivity**.

## Arrays too

```svelte
<script lang="ts">
	let todos = $state<string[]>(['Write blog post', 'Ship v1']);
</script>

<ul>
	{#each todos as todo}
		<li>{todo}</li>
	{/each}
</ul>

<button onclick={() => todos.push('New task')}>Add task</button>
```

`todos.push(...)` works and triggers a re-render. This would not work in most other frameworks — you'd have to create a new array. Svelte's deep reactivity handles it.

## Lesson 1 build

Build a simple counter that:
1. Starts at 0
2. Has a `+` button that adds 1
3. Has a `-` button that subtracts 1
4. Has a `Reset` button that sets it back to 0
5. Shows the count in a big heading

No hints. Write it from scratch. If you get stuck, re-read the examples above.

## Three questions you should answer

1. What's the difference between `let count = 0` and `let count = $state(0)` inside a `.svelte` file?
2. Why can I write `todos.push(...)` and have the screen update, instead of having to replace the whole array?
3. What does the `<script lang="ts">` tag tell Svelte?

---

# LESSON 2 — `$derived` and computed values

## The problem `$derived` solves

Say you want to show the total price of items in a cart:

```svelte
<script lang="ts">
	let price = $state(10);
	let quantity = $state(3);
	let total = price * quantity; // 30
</script>

<p>Total: ${total}</p>
<button onclick={() => quantity++}>Add one</button>
```

Click the button. The quantity changes, but the total stays at 30. Why?

Because `total` was computed **once**, at the moment the component was created. It's not reactive. It's just the number 30, sitting there forever.

## The fix: `$derived`

```svelte
<script lang="ts">
	let price = $state(10);
	let quantity = $state(3);
	let total = $derived(price * quantity);
</script>

<p>Total: ${total}</p>
<button onclick={() => quantity++}>Add one</button>
```

Now it works. `$derived(price * quantity)` tells Svelte: **"this is a computed value. Recalculate it whenever anything inside the parentheses changes."**

Svelte automatically figures out that `total` depends on `price` and `quantity`. No manual tracking. No dependency arrays like you'd have in React.

## Rule of thumb

- `$state` = a value you own and can change
- `$derived` = a value calculated from other state

**Never use `$state` for something you could derive.** That's the most common beginner mistake.

Wrong:
```svelte
<script lang="ts">
	let count = $state(0);
	let doubled = $state(0); // wrong!

	// now you have to manually keep doubled in sync
</script>
```

Right:
```svelte
<script lang="ts">
	let count = $state(0);
	let doubled = $derived(count * 2); // Svelte keeps it in sync
</script>
```

## `$derived.by` for complex logic

If your calculation needs more than a single expression — loops, conditionals, multiple steps — use `$derived.by` with a function:

```svelte
<script lang="ts">
	let numbers = $state([1, 2, 3, 4, 5]);

	let sum = $derived.by(() => {
		let total = 0;
		for (const n of numbers) {
			total += n;
		}
		return total;
	});
</script>

<p>Sum: {sum}</p>
<button onclick={() => numbers.push(numbers.length + 1)}>Add</button>
```

`$derived.by` takes a function. Whatever the function returns becomes the derived value. Same rules — Svelte tracks what you read and recomputes when it changes.

## Derived values are read-only... usually

You can't assign to a derived value:

```svelte
<script lang="ts">
	let count = $state(0);
	let doubled = $derived(count * 2);

	function reset() {
		doubled = 0; // ERROR (as of Svelte 5.25+, this actually works — but it's advanced)
	}
</script>
```

As of Svelte 5.25, you **can** temporarily override a derived value for patterns like optimistic UI. But in 95% of cases, treat derived as read-only. Don't reach for this feature unless you specifically need it.

## Lesson 2 build

Build a tip calculator:
1. Input for bill amount (a number)
2. Input for tip percentage (a number, default 20)
3. Show: subtotal, tip amount, total
4. All three values update live as you type

Use `$state` for the two inputs, `$derived` for the three computed values.

Hint: to bind an input to state, use `bind:value={yourVariable}`. We'll cover `bind:` properly in Lesson 4, but it works here.

## Three questions

1. When do you use `$state` vs `$derived`?
2. What's the difference between `$derived(expression)` and `$derived.by(() => { ... })`?
3. Why is deriving `doubled` from `count` better than keeping both in `$state` and syncing them manually?

---

# LESSON 3 — `$effect` and side effects

## What a side effect is

A **side effect** is anything your code does besides calculating a value. Examples:
- Logging to the console
- Making a network request
- Reading or writing to `localStorage`
- Starting a timer
- Drawing on a canvas
- Calling a third-party library

Regular JavaScript code runs once, top-to-bottom. But in a reactive framework, you sometimes want a side effect to **re-run whenever some state changes**. That's what `$effect` is for.

## Your first effect

```svelte
<script lang="ts">
	let count = $state(0);

	$effect(() => {
		console.log('Count changed to:', count);
	});
</script>

<button onclick={() => count++}>
	Clicks: {count}
</button>
```

Open the browser console. Every click logs a new line. `$effect` automatically tracks that it reads `count`, so it re-runs whenever `count` changes.

## Cleanup — the teardown function

When `$effect` re-runs (or the component goes away), you often need to clean up what the previous run did. Return a function from your effect — that's the **teardown** function.

```svelte
<script lang="ts">
	let count = $state(0);
	let seconds = $state(0);

	$effect(() => {
		const interval = setInterval(() => {
			seconds++;
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	});
</script>

<p>Seconds: {seconds}</p>
```

Without the teardown, every time the effect re-ran you'd have multiple intervals stacking up. The teardown clears the old one before setting up a new one, and also runs when the component is destroyed.

## The biggest trap: don't use `$effect` for derived values

This is wrong:

```svelte
<script lang="ts">
	let count = $state(0);
	let doubled = $state(0);

	// Wrong! Use $derived instead.
	$effect(() => {
		doubled = count * 2;
	});
</script>
```

This works but it's bad. You're fighting the framework. It's also easy to cause infinite loops this way.

Right:
```svelte
<script lang="ts">
	let count = $state(0);
	let doubled = $derived(count * 2);
</script>
```

**Rule:** if you're setting state inside an effect, you're probably doing it wrong. `$effect` is for side effects — things that happen *outside* your reactive graph. DOM manipulation, network calls, timers.

## Effects only run in the browser

`$effect` does not run during server-side rendering. This makes sense — you wouldn't want to start a timer on the server. If you need code to run both on server and client, use `$derived` (if it's a computed value) or put it at the top level of your `<script>` (if it's initialization logic).

## Lesson 3 build

Build a stopwatch:
1. A display showing MM:SS
2. A `Start` button that starts the timer
3. A `Stop` button that pauses it
4. A `Reset` button that sets it back to 00:00
5. Use `$state` for elapsed seconds and a boolean `running`
6. Use `$effect` to set up the interval when `running` becomes true, and clean it up when `running` becomes false

## Three questions

1. What's the purpose of the return function inside `$effect`?
2. Why shouldn't you use `$effect` to set derived values?
3. Does `$effect` run during SSR? Why does that matter?

---

# LESSON 4 — Template syntax: if, each, and bindings

## The `{#if}` block

Conditional rendering:

```svelte
<script lang="ts">
	let loggedIn = $state(false);
</script>

{#if loggedIn}
	<p>Welcome back.</p>
{:else}
	<p>Please log in.</p>
{/if}

<button onclick={() => (loggedIn = !loggedIn)}>Toggle</button>
```

Three forms:
- `{#if condition} ... {/if}`
- `{#if condition} ... {:else} ... {/if}`
- `{#if a} ... {:else if b} ... {:else} ... {/if}`

## The `{#each}` block

Iteration:

```svelte
<script lang="ts">
	let items = $state(['apple', 'banana', 'cherry']);
</script>

<ul>
	{#each items as item}
		<li>{item}</li>
	{/each}
</ul>
```

With index:

```svelte
{#each items as item, i}
	<li>{i + 1}: {item}</li>
{/each}
```

## Keyed each — critical for dynamic lists

When items can be added, removed, or reordered, you **must** give each item a unique key. Put it in parentheses after the item name:

```svelte
<script lang="ts">
	let todos = $state([
		{ id: 1, text: 'Ship v1' },
		{ id: 2, text: 'Write docs' }
	]);
</script>

<ul>
	{#each todos as todo (todo.id)}
		<li>{todo.text}</li>
	{/each}
</ul>
```

Without the key, Svelte has to guess which DOM element to update when the list changes, which can cause bugs (especially with animations or form inputs inside the list). With the key, Svelte knows exactly which item is which.

**Rule:** if items can change, add a key. If in doubt, add a key.

## Two-way binding with `bind:value`

Data flows *down* by default (parent → child). `bind:` lets data flow *up* from an input back to your state:

```svelte
<script lang="ts">
	let name = $state('');
</script>

<input type="text" bind:value={name} placeholder="Your name" />

<p>Hello, {name || 'stranger'}</p>
```

Type in the input. The paragraph updates in real time. `bind:value` creates a two-way connection.

Other useful bindings:
- `bind:checked={boolean}` for checkboxes
- `bind:value={array}` on a `<select multiple>`
- `bind:files={files}` on `<input type="file">`
- `bind:group={value}` for radio button groups

## Event handlers

In Svelte 5, event handlers are just attributes starting with `on`:

```svelte
<button onclick={() => alert('hi')}>Click</button>
<input oninput={(e) => console.log(e.currentTarget.value)} />
<form onsubmit={(e) => { e.preventDefault(); save(); }}>...</form>
```

No more `on:click` with the colon — that was Svelte 4 syntax. In Svelte 5, it's just `onclick`, like HTML.

## Lesson 4 build

Build a shopping list:
1. An input for adding an item
2. A list showing current items (each item has `id` and `text`)
3. A delete button on each list item that removes it
4. When the input has text and you press Enter or click "Add", it adds the item and clears the input
5. Show a message "No items yet" when the list is empty (use `{#each}` with `{:else}`)

Use a keyed each block.

## Three questions

1. Why is adding a unique key to `{#each}` blocks important?
2. What does `bind:value` do that `value=` alone doesn't?
3. How has event handler syntax changed from Svelte 4 to Svelte 5?

---

# LESSON 5 — Snippets and render tags

## The problem snippets solve

Say you have a list of products, and you want to display each one in a nice card. You could write the card markup inline inside `{#each}`:

```svelte
{#each products as product}
	<div class="card">
		<img src={product.image} alt={product.name} />
		<h3>{product.name}</h3>
		<p>${product.price}</p>
	</div>
{/each}
```

Fine for once. But what if you need to render a card in three different places on the page? You'd have three copies of that markup. A pain to maintain.

**Snippets** are reusable chunks of markup, like functions that return HTML.

## Defining and rendering a snippet

```svelte
<script lang="ts">
	let products = $state([
		{ id: 1, name: 'Book', price: 20 },
		{ id: 2, name: 'Pen', price: 3 }
	]);
</script>

{#snippet card(product)}
	<div class="card">
		<h3>{product.name}</h3>
		<p>${product.price}</p>
	</div>
{/snippet}

<section>
	{#each products as product (product.id)}
		{@render card(product)}
	{/each}
</section>

<aside>
	<h2>Featured</h2>
	{@render card(products[0])}
</aside>
```

- `{#snippet name(args)}` defines a snippet.
- `{@render name(args)}` renders it. Think of it like calling a function.

Snippets can have any number of parameters, including zero:

```svelte
{#snippet divider()}
	<hr class="fancy" />
{/snippet}

{@render divider()}
```

## Snippets replaced slots

In Svelte 4, you had `<slot>` elements for passing content to components. **Svelte 5 replaced slots with snippets.** If you see a tutorial using `<slot />`, it's outdated.

## The `children` snippet

When you put content between a component's tags, it automatically becomes a snippet called `children`:

`Card.svelte`:
```svelte
<script lang="ts">
	let { children } = $props();
</script>

<div class="card">
	{@render children()}
</div>

<style>
	.card {
		padding: 1rem;
		border: 1px solid #ccc;
		border-radius: 8px;
	}
</style>
```

`+page.svelte`:
```svelte
<script lang="ts">
	import Card from './Card.svelte';
</script>

<Card>
	<h2>Hello</h2>
	<p>This content is inside the card.</p>
</Card>
```

`children` is just a special name that Svelte wires up automatically. You can pass other named snippets too, which we'll get into next lesson when we cover `$props` properly.

## Lesson 5 build

Build a page showing a list of blog posts:
1. Each post has `id`, `title`, `excerpt`, and `date`
2. Define a snippet `postCard(post)` that shows the title, date, and excerpt
3. Render the same snippet in two sections: "Latest posts" (all of them) and "Featured" (just the first)

## Three questions

1. What replaced `<slot>` in Svelte 5?
2. What's the difference between defining a snippet and rendering one?
3. What's special about the name `children`?

---

# LESSON 6 — Scoped styles and dynamic classes

## Styles are scoped by default

When you put a `<style>` block in a `.svelte` file, those styles only apply to that component. No bleeding into other components, no class name collisions.

```svelte
<p>This is styled.</p>

<style>
	p {
		color: darkred;
	}
</style>
```

That `p` selector only affects `<p>` elements in this component. Another component with its own `p` styles won't be touched.

Svelte does this by adding a unique class to every element in the component at compile time, e.g. `svelte-abc123`, and rewriting your selectors.

## Dynamic classes

Three ways to set classes conditionally:

### 1. Ternary in the class attribute

```svelte
<button class={active ? 'btn-active' : 'btn-idle'}>Click</button>
```

### 2. Object form (Svelte 5.16+)

```svelte
<button class={{ 'btn-active': active, 'btn-idle': !active }}>Click</button>
```

Keys are class names. Values are booleans. Truthy keys get added.

### 3. Array form

```svelte
<button class={['base', active && 'btn-active', disabled && 'opacity-50']}>Click</button>
```

Falsy values (like `false`, `null`, `undefined`) are ignored. Great for chaining conditions.

## Dynamic inline styles

```svelte
<script lang="ts">
	let x = $state(100);
	let y = $state(50);
</script>

<div style="transform: translate({x}px, {y}px);">Moveable</div>
```

Or with the `style:` directive:

```svelte
<div style:transform="translate({x}px, {y}px)">Moveable</div>
```

## CSS custom properties (variables)

Use them heavily — they're the foundation of a design system.

```svelte
<div class="card">Hello</div>

<style>
	.card {
		background: var(--color-surface, white);
		color: var(--color-ink, black);
		padding: var(--space-4, 1rem);
	}
</style>
```

The second argument to `var()` is a fallback. If `--color-surface` isn't defined anywhere, it falls back to `white`.

You'll typically define your design tokens in a global stylesheet (like the `tokens.css` from the free-book funnel):

```css
@layer tokens {
	:root {
		--color-surface: oklch(98% 0.005 250);
		--space-4: 1rem;
	}
}
```

## `@layer` — the PE7 way

`@layer` is modern CSS. It lets you control which styles win when selectors are equally specific. The order you declare layers is the order of precedence — later layers override earlier ones.

```css
@layer tokens, base, components, utilities;

@layer tokens {
	/* design system variables */
}

@layer components {
	/* component styles */
}

@layer utilities {
	/* overrides */
}
```

Without `@layer`, you'd rely on source order and specificity hacks. With it, the intent is explicit.

## Lesson 6 build

Build a theme toggle:
1. A button that switches between light and dark mode
2. Use CSS custom properties for colors (`--bg`, `--text`)
3. Change the variable values based on a `$state` boolean `isDark`
4. The whole page background and text color flip when you click

Hint: you can apply the style at the `:root` level using `<svelte:head>` or toggle a class on the `<html>` element via a `$effect`.

## Three questions

1. Why are Svelte styles scoped by default, and how does Svelte achieve that?
2. Given `<button class={['a', false, 'b', null, 'c']}>`, what class string ends up on the button?
3. What problem does `@layer` solve in CSS?

---

# LESSON 7 — `$props` and TypeScript

## Props are how components talk

A component receives data from its parent via **props**. In Svelte 5, you get props using the `$props()` rune.

`Greeting.svelte`:
```svelte
<script lang="ts">
	let { name } = $props();
</script>

<p>Hello, {name}!</p>
```

`+page.svelte`:
```svelte
<script lang="ts">
	import Greeting from '$lib/Greeting.svelte';
</script>

<Greeting name="Billy" />
<Greeting name="Claude" />
```

## Fallback values

```svelte
<script lang="ts">
	let { name = 'stranger' } = $props();
</script>

<p>Hello, {name}!</p>
```

If the parent doesn't pass `name`, or passes `undefined`, the fallback kicks in.

## Multiple props

```svelte
<script lang="ts">
	let { name, age, email } = $props();
</script>
```

Just standard JavaScript destructuring.

## Rest props — forward the leftovers

```svelte
<script lang="ts">
	let { label, ...rest } = $props();
</script>

<button {...rest}>{label}</button>
```

This "spreads" any remaining props onto the `<button>`. Great for wrapper components — callers can pass any button attribute (`disabled`, `type`, `onclick`, etc.) and it just flows through.

## Typing props — TypeScript in practice

This is where strict mode earns its keep. You type your props so TypeScript catches mistakes before runtime.

```svelte
<script lang="ts">
	interface Props {
		name: string;
		age?: number;
		onGreet?: () => void;
	}

	let { name, age = 0, onGreet }: Props = $props();
</script>

<p>Hello {name}, age {age}</p>
{#if onGreet}
	<button onclick={onGreet}>Greet</button>
{/if}
```

- `name: string` — required string
- `age?: number` — optional number (the `?` means it might be undefined)
- `onGreet?: () => void` — optional function that takes no arguments and returns nothing

If a parent tries `<Greeting name={42} />`, TypeScript will yell at you — 42 isn't a string.

## The component shorthand

When the prop name and the variable name match, you can use the shorthand:

Long form:
```svelte
<Greeting name={name} age={age} />
```

Short form:
```svelte
<Greeting {name} {age} />
```

## `$props.id()` — unique IDs per instance

Added in Svelte 5.20. Generates a unique string per component instance. Useful for linking `<label>` to `<input>`:

```svelte
<script lang="ts">
	const uid = $props.id();
</script>

<label for="{uid}-email">Email</label>
<input id="{uid}-email" type="email" />
```

If you have this component on a page twice, each instance gets a different `uid`, so the `for`/`id` pairs don't collide.

## Lesson 7 build

Build a `Card` component:
1. Accepts props: `title` (required string), `subtitle` (optional string), `variant` (either `'primary'` or `'secondary'`, default `'primary'`)
2. Has a `children` snippet for the body content
3. Uses different colors for each variant
4. Type all props with a TypeScript interface

Use it on `+page.svelte` three times with different props to verify it works.

## Three questions

1. What's the difference between `let { name } = $props()` and `let { name = 'default' } = $props()`?
2. How do you type props with TypeScript in Svelte 5?
3. What does `...rest` do in `let { label, ...rest } = $props()`?

---

# LESSON 8 — `$bindable` and two-way component props

## Props are one-way by default

Normally, props flow **down**: parent passes data to child, child displays or uses it. Changes in the child don't propagate back up.

This is good. It makes data flow predictable.

But sometimes you want **two-way** — a form input component, for example, where the parent wants to both read and write the value.

## Marking a prop bindable

`FancyInput.svelte`:
```svelte
<script lang="ts">
	let { value = $bindable('') } = $props();
</script>

<input bind:value class="fancy" />
```

The `$bindable()` rune marks this prop as able to flow both ways. The value `''` inside is the fallback.

## Using it from the parent

```svelte
<script lang="ts">
	import FancyInput from '$lib/FancyInput.svelte';

	let name = $state('');
</script>

<FancyInput bind:value={name} />
<p>You typed: {name}</p>
```

When the user types in the `FancyInput`, the child updates `value`, and because the parent used `bind:value`, the parent's `name` variable updates too.

## Don't overuse this

`$bindable` is a power tool. Overusing it makes data flow hard to follow — you can no longer just trace "where does this value come from" by reading the parent. It could be getting mutated by any child.

**Rule:** use `$bindable` for components that *are* the source of truth for a value (like a custom input). Otherwise, pass a callback:

Instead of:
```svelte
<Child bind:value={x} />
```

Prefer:
```svelte
<Child value={x} onChange={(newValue) => (x = newValue)} />
```

Unless the two-way binding genuinely simplifies your code.

## Lesson 8 build

Build a `NumberStepper` component:
1. Shows a number
2. Has `+` and `−` buttons
3. `value` is bindable
4. Accepts optional `min` and `max` props that prevent the value from going out of range

Use it on a page where the parent both sets the initial value and reads the current value in real time.

## Three questions

1. Why is one-way data flow the default, and when do you break it?
2. What happens if you try to use `bind:` on a prop that wasn't declared with `$bindable()`?
3. When would you pass a callback (`onChange`) instead of using `bind:`?

---

# LESSON 9 — Shared state and `.svelte.js` files

## The problem

All the state we've written so far lives inside a single component. But what if multiple components need to share state? A shopping cart, for example — the header shows the item count, the cart page shows the full list, the product page has an "add to cart" button.

You *could* lift state up to a common ancestor and pass it down through props. For deep trees, this gets ugly fast (it's called "prop drilling").

## `.svelte.js` and `.svelte.ts` files

Regular `.js` or `.ts` files can't use runes. But **`.svelte.js`** and **`.svelte.ts`** files can. This is the mechanism for sharing reactive state across your app.

Create `src/lib/cart.svelte.ts`:

```ts
export const cart = $state<{ items: string[] }>({
	items: []
});

export function addItem(name: string) {
	cart.items.push(name);
}

export function clearCart() {
	cart.items = [];
}
```

Now any component can import and use it:

`Header.svelte`:
```svelte
<script lang="ts">
	import { cart } from '$lib/cart.svelte';
</script>

<header>
	Cart: {cart.items.length} items
</header>
```

`ProductPage.svelte`:
```svelte
<script lang="ts">
	import { cart, addItem } from '$lib/cart.svelte';
</script>

<button onclick={() => addItem('Widget')}>Add Widget</button>
<p>Items so far: {cart.items.length}</p>
```

Both components read from the same `cart` object. When one updates it, the other sees the change.

## The gotcha: don't export reassigned state

This is **broken**:

```ts
// cart.svelte.ts
export let count = $state(0); // DON'T DO THIS

export function increment() {
	count += 1; // This only works inside this file
}
```

Other files that import `count` will get a stale value because Svelte can only track reassignments within a single file.

**Rule:** export objects (which you mutate), not primitive state that gets reassigned.

Right:
```ts
export const counter = $state({ value: 0 });

export function increment() {
	counter.value += 1;
}
```

Or export getter/setter functions:

```ts
let count = $state(0);

export function getCount() {
	return count;
}

export function increment() {
	count += 1;
}
```

## Lesson 9 build

Build a global toast notification system:
1. Create `src/lib/toasts.svelte.ts` with a `toasts` array and `addToast(message)` and `removeToast(id)` functions
2. Create a `ToastContainer.svelte` component that reads from `toasts` and displays them
3. Create a `+page.svelte` with a button that calls `addToast('Hello!')`
4. Mount the container in `+layout.svelte` so it's visible on every page
5. Toasts disappear after 3 seconds (use `setTimeout` inside `addToast`)

## Three questions

1. Why can't regular `.ts` files use runes?
2. What's wrong with `export let count = $state(0)` in a `.svelte.ts` file?
3. Why is shared state in `.svelte.ts` different from "global variables"?

---

# LESSON 10 — SvelteKit basics: routes, loads, layouts

So far we've been working inside a single route. Time to zoom out.

## The routing model

In SvelteKit, **folders under `src/routes` become URL paths**:

- `src/routes/+page.svelte` → `/`
- `src/routes/about/+page.svelte` → `/about`
- `src/routes/blog/+page.svelte` → `/blog`
- `src/routes/blog/[slug]/+page.svelte` → `/blog/anything`

The `+` prefix is a SvelteKit convention. Files starting with `+` are special. Files not starting with `+` are ignored by the router, so you can put component files and utilities next to your routes.

## Dynamic route parameters

A folder in brackets like `[slug]` is a dynamic parameter. It matches any path segment.

`src/routes/blog/[slug]/+page.svelte`:
```svelte
<script lang="ts">
	import { page } from '$app/state';
</script>

<h1>Post: {page.params.slug}</h1>
```

Visit `/blog/hello-world` → shows "Post: hello-world". Visit `/blog/another-one` → shows "Post: another-one".

`page.params` is an object with all URL parameters. You get it from `$app/state`, which is SvelteKit's global state.

## Loading data: `+page.ts`

Sometimes a page needs data before it renders. Put a `load` function in a sibling `+page.ts`:

`src/routes/blog/+page.ts`:
```ts
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const res = await fetch('/api/posts');
	const posts = await res.json();
	return { posts };
};
```

`src/routes/blog/+page.svelte`:
```svelte
<script lang="ts">
	let { data } = $props();
</script>

<ul>
	{#each data.posts as post}
		<li>{post.title}</li>
	{/each}
</ul>
```

The data returned from `load` becomes the `data` prop on the page. Fully typed — `PageLoad` is auto-generated by SvelteKit based on your routes.

## `+page.ts` vs `+page.server.ts`

- **`+page.ts`** — runs on both server and client. Use when the data is public (e.g. fetching from a public API).
- **`+page.server.ts`** — runs only on the server. Use when you need database access, secrets, or anything that shouldn't ship to the browser.

You'll mostly use `+page.server.ts` for real apps.

## Layouts

A `+layout.svelte` wraps all pages in its folder and subfolders:

`src/routes/+layout.svelte`:
```svelte
<script lang="ts">
	let { children } = $props();
</script>

<nav>
	<a href="/">Home</a>
	<a href="/about">About</a>
	<a href="/blog">Blog</a>
</nav>

<main>
	{@render children()}
</main>
```

Every page now renders inside this layout. The nav bar appears on every page automatically.

You can nest layouts — `src/routes/blog/+layout.svelte` wraps all pages under `/blog`, and sits inside the root layout.

## Lesson 10 build

Build a mini blog:
1. `/` — home page listing three posts (hardcoded in `+page.ts`)
2. `/blog/[slug]` — individual post page
3. Each post has `slug`, `title`, `body`
4. Loading data with `+page.ts` on both routes
5. A shared `+layout.svelte` with a nav bar

Don't use a real database. Just hardcode an array of posts in a `src/lib/posts.ts` file and import it in the load functions.

## Three questions

1. What's the difference between a `.svelte` file and a `+page.svelte` file in SvelteKit?
2. When would you use `+page.server.ts` instead of `+page.ts`?
3. How do layouts compose when you have nested folders?

---

# LESSON 11 — Form actions

## The old way (still works)

You could submit forms by adding JavaScript event handlers, calling `fetch`, parsing JSON responses, handling loading states. That's 50+ lines of boilerplate for a login form.

## The SvelteKit way: form actions

Put an `actions` export in a `+page.server.ts`, and SvelteKit wires up the form submission for you — **with no JavaScript required in the browser**. It progressively enhances if JS is available.

`src/routes/login/+page.server.ts`:
```ts
import { fail, redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const email = data.get('email') as string;
		const password = data.get('password') as string;

		if (!email || !password) {
			return fail(400, { error: 'Missing fields', email });
		}

		// Pretend to log the user in
		if (email !== 'test@example.com' || password !== 'secret') {
			return fail(401, { error: 'Invalid credentials', email });
		}

		redirect(303, '/dashboard');
	}
};
```

`src/routes/login/+page.svelte`:
```svelte
<script lang="ts">
	let { form } = $props();
</script>

<form method="POST">
	{#if form?.error}
		<p class="error">{form.error}</p>
	{/if}

	<label>
		Email
		<input name="email" type="email" value={form?.email ?? ''} required />
	</label>

	<label>
		Password
		<input name="password" type="password" required />
	</label>

	<button type="submit">Log in</button>
</form>
```

- `form` prop contains whatever `fail()` returned, or is `undefined` on first load.
- `method="POST"` on the form.
- Input `name` attributes match what the server reads via `data.get(...)`.
- On success, `redirect()` sends the user to `/dashboard`.

Submit the form with JS disabled. Still works.

## Named actions

Multiple actions on one page:

```ts
export const actions: Actions = {
	login: async ({ request }) => { /* ... */ },
	register: async ({ request }) => { /* ... */ }
};
```

Then in the form:
```svelte
<form method="POST" action="?/login">...</form>
<form method="POST" action="?/register">...</form>
```

Or use `formaction` on a button:
```svelte
<form method="POST">
	<button formaction="?/login">Log in</button>
	<button formaction="?/register">Register</button>
</form>
```

## Progressive enhancement with `use:enhance`

Add `use:enhance` to the form and SvelteKit intercepts the submission with JavaScript, avoiding full page reloads while keeping the same API:

```svelte
<script lang="ts">
	import { enhance } from '$app/forms';

	let { form } = $props();
</script>

<form method="POST" use:enhance>
	<!-- ... -->
</form>
```

Same code. Smoother experience when JS is available. Still works without.

## Lesson 11 build

Build a signup form:
1. Name, email, password fields
2. Server-side validation: name ≥ 2 chars, valid email, password ≥ 8 chars
3. Show field-specific errors
4. On success, redirect to `/welcome`
5. Use `use:enhance` for progressive enhancement

Don't hook it up to a real database — just `console.log` the data on success.

## Three questions

1. What's the advantage of form actions over `fetch`-based submissions?
2. When does the `form` prop get populated?
3. What does `use:enhance` add on top of the basic form action flow?

---

# LESSON 12 — `bind:this` and DOM access

## When you need the actual DOM element

Most of the time, you don't touch the DOM directly — you describe the UI declaratively and Svelte handles it. But sometimes you need the raw element: for canvas drawing, measuring dimensions, calling a third-party library on the node, or setting focus.

`bind:this` gives you a reference.

```svelte
<script lang="ts">
	let input = $state<HTMLInputElement | null>(null);

	function focusInput() {
		input?.focus();
	}
</script>

<input bind:this={input} />
<button onclick={focusInput}>Focus the input</button>
```

The variable starts as `null` and gets set to the actual DOM element when the component mounts.

## Using it in `$effect`

A common pattern: use the element reference inside an effect to initialize something after mount.

```svelte
<script lang="ts">
	import Chart from 'chart.js/auto';

	let canvas = $state<HTMLCanvasElement | null>(null);

	$effect(() => {
		if (!canvas) return;

		const chart = new Chart(canvas, {
			type: 'bar',
			data: { /* ... */ }
		});

		return () => {
			chart.destroy();
		};
	});
</script>

<canvas bind:this={canvas}></canvas>
```

Classic third-party library integration.

## The modern alternative: `{@attach}`

Svelte 5.29 added **attachments**. They're cleaner than `bind:this` + `$effect` for most cases. We'll cover them next lesson.

## Lesson 12 build

Build a "canvas doodle" page:
1. A `<canvas>` element (600 × 400)
2. When the mouse moves over it, draw a dot at the cursor position
3. A "Clear" button that wipes the canvas
4. Use `bind:this` to get the canvas element, `$effect` to set up the mouse listener, and the teardown function to clean up

## Three questions

1. What's `input` before the component mounts, and what's it after?
2. Why do we put the chart initialization inside `$effect` instead of at the top of `<script>`?
3. What's a scenario where you *need* direct DOM access vs just using Svelte's declarative features?

---

# LESSON 13 — Attachments: `{@attach}` (Svelte 5.29+)

## What attachments replaced

In Svelte 4, "actions" (`use:something`) were the way to attach behavior to a DOM element: tooltips, click-outside handlers, drag libraries. They worked but had quirks — they couldn't be passed through components, they didn't participate in reactivity cleanly, and the setup was awkward.

Svelte 5.29 introduced **attachments** (`{@attach}`). Same idea, better in every way.

## Basic attachment

```svelte
<script lang="ts">
	import type { Attachment } from 'svelte/attachments';

	const logMount: Attachment = (element) => {
		console.log('Element mounted:', element.nodeName);

		return () => {
			console.log('Element unmounted');
		};
	};
</script>

<div {@attach logMount}>Watch the console</div>
```

An attachment is a function that receives the element. It optionally returns a cleanup function.

## Attachment factories — the killer feature

This is where it shines. Write a function that *returns* an attachment, so you can parameterize it:

```svelte
<script lang="ts">
	import type { Attachment } from 'svelte/attachments';

	function tooltip(text: string): Attachment {
		return (element) => {
			element.setAttribute('title', text);
			// In real code you'd integrate a tooltip library like Tippy.js
		};
	}
</script>

<button {@attach tooltip('Click me!')}>Hover</button>
<button {@attach tooltip('Different tip')}>Hover me</button>
```

The attachment automatically re-runs when its arguments change — if you had `{@attach tooltip(reactiveState)}`, updating `reactiveState` rebuilds the tooltip.

## Passing attachments to components

Actions couldn't be passed to components. Attachments can, as long as the component spreads props onto an element:

`Button.svelte`:
```svelte
<script lang="ts">
	let { children, ...props } = $props();
</script>

<button {...props}>
	{@render children?.()}
</button>
```

Usage:
```svelte
<Button {@attach tooltip('Saved!')}>
	Save
</Button>
```

The tooltip attachment travels through the component and lands on the actual `<button>` element.

## Lesson 13 build

Build a `clickOutside` attachment:
1. Takes a callback function
2. Calls the callback when the user clicks anywhere outside the element
3. Use it to close a dropdown menu when clicking away

Skeleton to complete:

```ts
import type { Attachment } from 'svelte/attachments';

export function clickOutside(callback: () => void): Attachment {
	return (element) => {
		function handler(event: MouseEvent) {
			// Your code
		}
		document.addEventListener('click', handler);
		return () => {
			document.removeEventListener('click', handler);
		};
	};
}
```

## Three questions

1. Why are attachments better than actions?
2. What does the attachment's return function do?
3. How does an attachment passed to a component find its way to a DOM element?

---

# LESSON 14 — `<svelte:boundary>`: error and loading handling

## The problem

When a component errors during rendering, Svelte by default crashes the entire app. When an `await` is pending, there's no built-in way to show a "loading..." UI at a boundary.

`<svelte:boundary>` (added in Svelte 5.3, enhanced since) solves both.

## Catching errors

```svelte
<svelte:boundary>
	<FlakyComponent />

	{#snippet failed(error, reset)}
		<div class="error">
			<p>Something went wrong: {error.message}</p>
			<button onclick={reset}>Try again</button>
		</div>
	{/snippet}
</svelte:boundary>
```

If `FlakyComponent` or anything inside the boundary throws during rendering, the `failed` snippet renders instead. Call `reset()` to retry.

This means a bug in one widget doesn't crash the whole page. Huge for production stability.

## Reporting errors

```svelte
<svelte:boundary onerror={(e) => reportToSentry(e)}>
	<App />
	{#snippet failed(error, reset)}
		<p>Error.</p>
	{/snippet}
</svelte:boundary>
```

The `onerror` callback fires when an error is caught. Wire it up to your error tracker.

## Pending states (for async)

When Svelte 5's async features are enabled (we'll cover those next lesson), the `pending` snippet shows during initial async resolution:

```svelte
<svelte:boundary>
	<p>{await fetchData()}</p>

	{#snippet pending()}
		<p>Loading...</p>
	{/snippet}
</svelte:boundary>
```

## Server-side error boundaries (new in April 2026)

As of SvelteKit 2.54 (March 2026), error boundaries can catch errors *on the server* during SSR, not just in the browser. Previously, an SSR render error would kill the whole page. Now, the boundary catches it, renders the `failed` snippet, and the user sees a graceful error instead of a blank page.

## Lesson 14 build

1. Make a component `RandomFailure.svelte` that has a 50% chance of throwing during render (use `if (Math.random() < 0.5) throw new Error('Random fail')` in the `<script>`)
2. Wrap it in a `<svelte:boundary>` with a `failed` snippet that shows the error and a reset button
3. Include 3 instances of `RandomFailure` on the page — observe that only the failing ones show the error, not the whole page

## Three questions

1. What's the difference between an error boundary and a try/catch?
2. When does the `failed` snippet get rendered?
3. Why is this useful for production apps?

---

# LESSON 15 — Async Svelte: top-level `await`, `$derived(await ...)`, and `{await ...}` in markup

## The big 5.36 change

Svelte 5.36 (summer 2025) introduced **async Svelte**, an experimental feature set that's now widely stable as of April 2026. It will be the default in Svelte 6.

Currently you enable it in `svelte.config.js`:

```js
export default {
	compilerOptions: {
		experimental: {
			async: true
		}
	}
};
```

With that enabled, you can use `await` in three new places:

## 1. Top-level `await` in `<script>`

```svelte
<script lang="ts">
	const data = await fetch('/api/posts').then((r) => r.json());
</script>

<ul>
	{#each data as post}
		<li>{post.title}</li>
	{/each}
</ul>
```

Before async mode, top-level `await` was not allowed. You had to use `load` functions or `$effect`. Now the component itself can await.

## 2. `await` inside `$derived`

```svelte
<script lang="ts">
	let id = $state(1);

	let post = $derived(await fetch(`/api/posts/${id}`).then((r) => r.json()));
</script>

<p>Title: {post.title}</p>

<button onclick={() => id++}>Next post</button>
```

When `id` changes, Svelte refetches automatically. No effect, no manual loading state management.

## 3. `await` in markup

```svelte
<p>The answer is: {await getAnswer()}</p>
```

## Coordinating with `<svelte:boundary>`

Show a loading state while async work is in flight:

```svelte
<svelte:boundary>
	<p>{await fetchUser().then((u) => u.name)}</p>

	{#snippet pending()}
		<p>Loading user...</p>
	{/snippet}

	{#snippet failed(error)}
		<p>Couldn't load user: {error.message}</p>
	{/snippet}
</svelte:boundary>
```

Handles pending, fulfilled, and rejected in one clean block.

## When to use async Svelte vs `load` functions

For **page-level data**, stick with SvelteKit's `load` functions — they integrate with routing, run on the server, and are prerenderable.

For **component-level data** — a widget that fetches its own stats, a search box with live results, a chart loading from an API — async Svelte is the modern approach.

## What about old `{#await}` blocks?

`{#await ... then ... catch ...}` still works. It's useful when you explicitly want to handle loading states inline without a boundary. But for most cases, the new async features + boundaries are cleaner.

## Lesson 15 build

1. Enable async in `svelte.config.js`
2. Create a component `UserCard.svelte` that takes a `userId` prop
3. Inside the component, fetch `https://jsonplaceholder.typicode.com/users/{userId}` using `$derived(await ...)`
4. Display the user's name, email, and company
5. Wrap it in a `<svelte:boundary>` with `pending` and `failed` snippets
6. On the page, have a button that cycles through user IDs 1–10

## Three questions

1. Why was async mode introduced?
2. What's the relationship between `await` in `$derived` and state changes?
3. When would you still reach for a `load` function instead?

---

# AFTER LESSON 15

You now know:

- The three core runes: `$state`, `$derived`, `$effect`
- Every template construct: `{#if}`, `{#each}`, `{#await}`, `{#snippet}`, `{@render}`, `{@attach}`, `{@const}`, `bind:`, `transition:`, `class`, `style`
- Components: props, typing, slots-replaced-by-snippets, two-way binding with `$bindable`
- Shared state via `.svelte.ts`
- SvelteKit: routing, load functions, layouts, form actions
- DOM access: `bind:this` and the newer `{@attach}`
- Error and loading boundaries: `<svelte:boundary>`
- Modern async: top-level await, `$derived(await ...)`, markup await

That's the full surface area of Svelte 5 as of April 2026. The free-book funnel will now read like English to you.

## What to build next

- Rebuild the free-book funnel yourself, referencing my code only if you get stuck
- Port one of your existing tools — even just a simple calculator — to Svelte 5 + TypeScript strict
- Start one of the bigger projects (ProspectEngine, SvelteForge) and apply what you've learned

## Where to go deeper

- The official tutorial at `svelte.dev/tutorial` covers advanced topics like transitions, motion (`svelte/motion`), stores (for legacy interop), and custom elements
- `svelte.dev/docs/svelte` is the full reference — bookmark it
- The monthly "What's new in Svelte" blog posts keep you current
- The Svelte Discord for bugs and weird edge cases

You don't need another course after this. You need repetitions.
