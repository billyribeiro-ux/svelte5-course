# Lesson 03 — `$effect`

> **What you'll learn:** When state changes, how do you *do something* in the outside world — draw to a canvas, set a timer, write to `localStorage`, hit an API? That is what `$effect` is for.

## Concept

Here is the whole idea:

> A **`$effect`** is a function that runs automatically whenever the state it reads changes. It's your bridge from "something changed" to "go make the world match."

`$derived` is for *computing* a new value. `$effect` is for *doing* something — drawing, timing, fetching, logging. Different jobs. Do not mix them.

**Analogy:** a motion-activated light. The light itself is a `$effect`: when the sensor (state) fires, the light (side effect) turns on. You don't ask the light for a value — you ask it to *act*.

### The mental model — 9 rules

**Rule 1.** `$effect(() => { ... })` takes a function. That function runs *after* the component has mounted and *after* the DOM has updated.

```ts
$effect(() => {
  console.log('count is', count);
});
```

**Rule 2.** Any state read **synchronously** inside the function is tracked. When any tracked piece changes, the function re-runs.

**Rule 3.** State read **asynchronously** is NOT tracked. If you `await`, `setTimeout`, or `Promise.then`, values read inside those callbacks do not become dependencies.

```ts
$effect(() => {
  console.log(a); // tracked
  setTimeout(() => {
    console.log(b); // NOT tracked — b won't re-run this effect when it changes
  }, 0);
});
```

**Rule 4.** The function can **return a teardown function**. That teardown runs:
- immediately before the effect re-runs (with the next set of dependencies)
- when the component is destroyed

This is how you clean up timers, listeners, subscriptions.

```ts
$effect(() => {
  const id = setInterval(tick, 1000);
  return () => clearInterval(id); // teardown
});
```

**Rule 5. Object identity matters.** An effect re-runs when the *thing* it read is reassigned, not when a property *inside* it is mutated.

```ts
let obj = $state({ n: 0 });

$effect(() => {
  obj; // never re-runs after initial — obj is never reassigned
});

$effect(() => {
  obj.n; // re-runs every time obj.n changes
});
```

**Rule 6. Effects batch.** If you change five dependencies in the same tick, the effect runs once, not five times. Re-runs happen in a microtask after DOM updates.

**Rule 7.** `$effect.pre(() => { ... })` is exactly like `$effect` except it runs **before** the DOM update. Use it for things like autoscroll — you need the pre-update scroll position to decide whether to scroll after.

**Rule 8.** `$effect` **only runs in the browser.** Not during server-side render. If you need SSR work, use a load function (covered in Part 5).

**Rule 9. Do NOT use `$effect` to sync state.** This is the single most common abuse. If you want "Y is always X × 2," that is `$derived`. Effects that assign state invite infinite loops, desync bugs, and double-writer confusion.

### The big "do not" — effects are not for computing state

Resist this pattern:

```ts
// ❌ wrong — using $effect to compute doubled
let count = $state(0);
let doubled = $state(0);
$effect(() => { doubled = count * 2; });
```

Use `$derived`:

```ts
// ✅ right
let count = $state(0);
let doubled = $derived(count * 2);
```

Why the wrong version is wrong, concretely:
- `doubled` lags by one microtask — `$effect` runs after DOM update, so during the first render `doubled` is 0 even when `count` is 5.
- Two writers: `count` and the effect both want to own `doubled`. Someone else writing `doubled = 999` fights the effect.
- `$derived` is lazy; the effect version is eager (runs every time `count` changes, even if nobody reads `doubled`).

### When `$effect` IS the right answer

- **Drawing on a `<canvas>`.** State changes → repaint.
- **Timers (`setInterval` / `setTimeout`)** that need cleanup.
- **Third-party libraries** you have to imperatively feed (d3, Chart.js, Leaflet, Tauri, etc.).
- **`localStorage` / `sessionStorage`** — write on every change.
- **`IntersectionObserver`, `ResizeObserver`** — register and unsubscribe.
- **Analytics / logging** — "user saw page X" kinds of events.
- **Focus management** — `input.focus()` after a state change.

Notice the pattern: **reaching outside Svelte's reactive graph** — DOM APIs, storage, network, third-party code. That's the escape hatch.

## Worked examples

### 1 — Log on every change

```svelte
<script lang="ts">
  let count = $state(0);
  $effect(() => {
    console.log('count changed to', count);
  });
</script>

<button onclick={() => count++}>{count}</button>
```

### 2 — Teardown: interval with cleanup

```svelte
<script lang="ts">
  let seconds = $state(0);
  let ms = $state(1000);

  $effect(() => {
    const id = setInterval(() => { seconds++; }, ms);
    return () => clearInterval(id);
  });
</script>

<p>{seconds}s (tick every {ms}ms)</p>
<button onclick={() => (ms *= 2)}>slower</button>
<button onclick={() => (ms /= 2)}>faster</button>
```

Change `ms` and watch: teardown → clearInterval → new setInterval. Clean.

### 3 — Canvas redraw

```svelte
<script lang="ts">
  let canvas = $state<HTMLCanvasElement>();
  let size = $state(50);
  let color = $state('#ff3e00');

  $effect(() => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, size, size);
  });
</script>

<canvas bind:this={canvas} width="200" height="200"></canvas>
<input type="range" min="10" max="200" bind:value={size} />
<input type="color" bind:value={color} />
```

### 4 — Persist to localStorage

```svelte
<script lang="ts">
  import { untrack } from 'svelte';

  let theme = $state<'light' | 'dark'>('light');

  // mount-only read — untrack so we do not register a dep on theme
  $effect(() => {
    untrack(() => {
      const saved = localStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark') theme = saved;
    });
  });

  // write every time theme changes
  $effect(() => {
    localStorage.setItem('theme', theme);
  });
</script>
```

## Common mistakes

| Mistake | Why it bites | Fix |
|---|---|---|
| Using `$effect` to compute a value from other state | Creates two writers, desync, microtask lag, eager recompute. | Use `$derived` (or `$derived.by`). |
| Reading state inside `setTimeout`/`await`/`.then` and expecting re-runs | Only **synchronous** reads are tracked. | Read the state outside the async call first; cache it in a local. |
| Forgetting the teardown for timers/listeners | Leak. If the effect re-runs and never clears, you get 10 intervals firing. | Return a cleanup function. |
| Reading `state` (an object) instead of `state.value` | Object identity is stable; the effect runs once and never again. | Read the actual property: `state.value`. |
| Reassigning the very state you read | Infinite loop. | Do not. If you truly must, wrap the write in [`untrack`](https://svelte.dev/docs/svelte/svelte#untrack). |
| Calling `focus()` / measuring DOM inside `$effect` (default) | DOM is up-to-date. But if you need *pre-update* timing (autoscroll), use `$effect.pre`. | Pick the right variant. |

## The PE lens

**Effects are an escape hatch.** Every effect is a seam between Svelte's reactive graph and something outside it (DOM, storage, network). Treat each one as a small integration — name the external thing, write the teardown first, then fill in setup. If you cannot name what's outside Svelte, you're probably misusing the rune.

**Teardown-first discipline.** The easiest heap leaks in long-lived SPAs are uncleared intervals and stale event listeners. Write the `return () => ...` cleanup *before* you write the setup. Makes leaks structurally impossible.

**Batching is your friend.** Effects coalesce multiple state changes in the same tick into one re-run. You never need to manually debounce inside an effect — the framework already does.

**Beware the feedback loop.** An effect that writes to state it also reads will loop. Svelte throws on this at dev time, but in deeply-indirect code you can get a loop through a graph of three effects and two deriveds. If you feel the urge, stop and reach for `$derived`.

**When stuck between `$effect` and `$effect.pre`:** default to `$effect`. Only reach for `.pre` when you have a concrete "I need the DOM state BEFORE the update" reason (autoscroll, preserving caret position, animating a layout-shift). Most of the time the default is right.

## Build challenge

Four pages. Each hits a different effect use case.

### 1 — `/01-canvas` — Canvas redraw on state change

- Two sliders (`size`, `cornerRadius`) and a color picker.
- A canvas that draws a rounded rectangle with those values.
- Every change re-runs the effect and repaints.

### 2 — `/02-timer` — Adjustable interval with teardown

- A counter that ticks up every `ms` milliseconds.
- Buttons: "slower" (×2), "faster" (÷2), "pause/resume".
- When `ms` changes, the teardown must fire and a new interval start.
- When paused, no interval should exist at all.

### 3 — `/03-autoscroll` — Chat list with `$effect.pre`

- A scrollable div that renders a list of messages.
- A form that appends a new message.
- When the user is already scrolled near the bottom, **auto-scroll to new messages**. When they've scrolled up to read older ones, DO NOT yank them back.
- Use `$effect.pre` — you need the *pre-update* scroll position to decide.

### 4 — `/04-persist` — localStorage-backed theme switcher

- A theme state: `'light' | 'dark' | 'auto'`.
- Read from `localStorage` once on mount (untracked).
- Write to `localStorage` on every change.
- Apply it to the DOM by setting `document.documentElement.dataset.theme`.
- A button to cycle through the three values.

### Success looks like

```sh
pnpm --filter @course/lesson-03-starter dev
# all four pages work, timers clear cleanly, scroll respects user intent

pnpm --filter @course/lesson-03-starter check
# 0 errors, 0 warnings
```

## Self-check

<details>
<summary>1. You see <code>$effect(() =&gt; { doubled = count * 2 })</code>. Name three things wrong with it.</summary>

(a) It reinvents `$derived` the hard way. (b) Effects run in a microtask *after* DOM update, so `doubled` is stale on first render. (c) Two writers on `doubled` (the effect and anyone else) produce desync bugs. Replace with `let doubled = $derived(count * 2)`.
</details>

<details>
<summary>2. Inside an effect you call <code>setTimeout(() =&gt; console.log(count), 0)</code>. When <code>count</code> changes, does the effect re-run?</summary>

No. Async reads are not tracked. The `setTimeout` callback runs *after* the synchronous body of the effect, and Svelte only tracks what's read during that synchronous body. `count` isn't a dependency of the effect. If you want the log to re-run, read `count` synchronously first (e.g. `const c = count;`), then use `c` inside the timeout.
</details>

<details>
<summary>3. You have <code>$effect(() =&gt; { const id = setInterval(tick, ms); })</code> and forgot the teardown. What breaks, and when?</summary>

Nothing breaks *immediately*. The interval works, the UI updates. The break arrives when `ms` changes (or the component unmounts): the old interval is never cleared, so now two (or ten) intervals are all ticking. You'll see the counter accelerate on every "slower"/"faster" click. Fix: `return () => clearInterval(id)`.
</details>

## Links

- [Svelte docs — `$effect`](https://svelte.dev/docs/svelte/$effect)
- [Svelte docs — When NOT to use `$effect`](https://svelte.dev/docs/svelte/$effect#When-not-to-use-$effect)
- [`untrack`](https://svelte.dev/docs/svelte/svelte#untrack) for intentional non-tracking reads

Next: [Lesson 04 — `$inspect`](../lesson-04-inspect/README.md).
