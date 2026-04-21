# Lesson 07 — `bind:` directives

## The project you're building

**A settings editor.** The scroll-through "Preferences" page every serious app has — GitHub, Linear, Figma, VS Code — where every control is immediately live. No "Save" button: the moment you toggle a checkbox, change a slider, pick a radio, or upload a file, the app state updates and a JSON preview at the bottom reflects it.

What it does:
- **Profile** — display name and tagline (text bindings), plus a "shouty mode" checkbox that flips the displayed name to upper-case via a function binding.
- **Appearance** — theme (radio group: `light` / `dark` / `system`), font size (range 12–24, coerced to a number), density (select: `compact` / `normal` / `comfortable`).
- **Notifications** — a "select all channels" parent checkbox that drives and reflects a child checkbox group (`push`, `email`, `sms`, `in-app`). The parent shows an *indeterminate* state when the children are partially selected. Quiet-hours start/end times (`<input type="time">`) bound two-way.
- **Avatar** — a file input (`bind:files`). On selection, shows the file name, MIME type, and size in KB.
- **Preview** — a small card that renders name + tagline styled by theme + size + density. Its `clientWidth` and `clientHeight` are read back via dimension bindings and displayed below it.
- **Live JSON** — a `<pre>` at the bottom showing the entire settings object serialized, so you can watch every binding write through.
- **Reset to defaults** — restores the original settings and re-serializes.

Why this project: a real settings page is the most concentrated form of `bind:` usage you'll ever see. Almost every flavour shows up in one place: the two-way text binding, the number-coerced range, the select, the `bind:group` for radios, the `bind:group` for a checkbox array, the `bind:indeterminate` for partial states, the `bind:files` with a `FileList`, the `bind:this` for imperative DOM access, readonly dimension bindings, and the function binding for normalization. If you can write this page cleanly, form code on production apps stops feeling hard.

## What this lesson teaches

The feature is **`bind:` — two-way data flow from an element's property back to a variable.** You've seen `bind:value` in Lessons 05 and 06. Here you go through every binding the DOM exposes, plus the function-binding form for transformation.

Ten flavours to learn:

1. `bind:value` on text / number / range / select — two-way, with type coercion for numeric inputs.
2. `bind:checked` on checkboxes — two-way boolean.
3. `bind:group` on radios — two-way to a single value shared across a group.
4. `bind:group` on checkboxes — two-way to an **array** of values.
5. `bind:indeterminate` — the "partial" checkbox state, independent of `checked`.
6. `bind:files` — a `FileList` on `<input type="file">`.
7. `<select multiple bind:value={arr}>` — an array of option values.
8. `bind:this` — a reference to the DOM node itself, available post-mount.
9. **Dimension bindings** (`bind:clientWidth`, `bind:offsetHeight`, etc.) — readonly, driven by a `ResizeObserver`.
10. **Function bindings** `bind:value={() => getX(), (v) => setX(v)}` — interpose a getter / setter for validation or transformation.

Compounds from earlier lessons:
- **$state** — the entire `settings` object is one `$state`.
- **$derived** — the serialized JSON preview, the "all channels selected" boolean, the indeterminate flag, a summary-text.
- **$effect** — persists settings to `localStorage` on change and reads them back on mount.
- **$inspect** — watches the settings shape during development.
- **Lesson 05** — `onclick` for reset, `<svelte:window onkeydown>` for `⌘S` as a "no-op toast" (there's nothing to save — but we stop the browser default).
- **Lesson 06** — `{#each}` over the channel list with a stable key, `{#if}` to show the file info panel only when a file exists, `{#snippet}` for the section wrapper to kill duplication.

## Concept

### The mental model — 6 rules

**Rule 1. `bind:x={y}` is sugar for "listen for the property change AND reflect the variable back to the property."** It's a two-way bridge, not a one-way handler. Most of the time you want it; sometimes you don't (for controlled inputs driven by a derived, use `value={...}` + an `oninput` handler instead).

```svelte
<input bind:value={name} />
<!-- equivalent to -->
<input value={name} oninput={(e) => name = e.currentTarget.value} />
```

**Rule 2. Shorthand when identifiers match.** `bind:value` alone means `bind:value={value}`.

```svelte
<input bind:value />   <!-- binds to local `value` -->
```

**Rule 3. Numeric inputs coerce.** On `type="number"` and `type="range"`, the bound value is a **number** (or `undefined` if the input is empty/invalid). You do not parse manually.

```svelte
<input type="range" min="12" max="24" bind:value={size} />
<!-- size is always a number -->
```

**Rule 4. `bind:group` collapses to a single variable.** Radios share one variable (the selected value). Checkboxes share one variable (an array of the checked values). The `value` attribute on each input determines what goes into that variable.

```svelte
<!-- radio: pick exactly one -->
<label><input type="radio" bind:group={theme} value="light" /> Light</label>
<label><input type="radio" bind:group={theme} value="dark" /> Dark</label>

<!-- checkbox: pick many -->
<label><input type="checkbox" bind:group={channels} value="email" /> Email</label>
<label><input type="checkbox" bind:group={channels} value="push" /> Push</label>
```

**Rule 5. Function bindings let you transform.** `bind:value={() => getter(), (v) => setter(v)}` — the getter returns the current value for the element to display; the setter is called whenever the element fires a change and lets you validate, normalize, or reject. Use it for:
- Trim whitespace on blur.
- Clamp numbers to a range.
- Uppercase an incoming string.
- Reject invalid selections.

```svelte
<input bind:value={() => name, (v) => name = v.toUpperCase()} />
```

**Rule 6. Readonly bindings exist for measurements you can't write.** `bind:clientWidth`, `bind:clientHeight`, `bind:offsetHeight`, `bind:contentRect` — all driven by a `ResizeObserver` behind the scenes. You read, never write.

```svelte
<div bind:clientWidth={w} bind:clientHeight={h}>preview</div>
<p>{w} × {h}</p>
```

### `bind:this` — the imperative escape hatch

`bind:this={node}` assigns the DOM node to `node` after mount. Before mount, `node` is `undefined`. So you cannot read it in top-level script at init — only inside `$effect`, event handlers, or any callback that runs post-mount. You saw this in Lesson 05 for focusing the palette input. Here you use it to read imperative properties that don't have declarative bindings, like `HTMLInputElement.selectionStart`.

### Indeterminate checkboxes — the parent-child pattern

Three states, not two:
- `checked = true, indeterminate = false` → fully checked.
- `checked = false, indeterminate = false` → fully unchecked.
- `checked = any, indeterminate = true` → partial (children mixed).

`indeterminate` is independent of `checked` at the DOM level. In Svelte:

```ts
const allSelected = $derived(channels.length === allChannels.length);
const noneSelected = $derived(channels.length === 0);
const indeterminate = $derived(!allSelected && !noneSelected);
```

Then:

```svelte
<input
	type="checkbox"
	bind:checked={() => allSelected, (checked) => { channels = checked ? [...allChannels] : []; }}
	{indeterminate}
/>
```

Note the function binding: the getter returns "all selected?" (for a natural two-state checkbox), the setter writes all-or-nothing to the array. `indeterminate` is a plain attribute, driven by the derived.

### `bind:files` — `FileList`, not `File[]`

`<input type="file">` exposes a `FileList`, not a plain array. It's array-like (has `.length`, indexable). You can iterate it but not `.map` it directly — wrap with `Array.from(files)`. To programmatically clear it, assign `new DataTransfer().files`. To delete a single file, build a fresh `DataTransfer` and add the files you want to keep.

```svelte
<script lang="ts">
	let files = $state<FileList | undefined>();
</script>

<input type="file" accept="image/*" bind:files />

{#if files && files.length > 0}
	{@const file = files[0]}
	{#if file}
		<p>{file.name} — {(file.size / 1024).toFixed(1)} KB</p>
	{/if}
{/if}
```

Leave `files` uninitialized (`undefined`), not `null`, if the component might SSR — some Node runtimes don't have `DataTransfer`.

## Common mistakes

| Mistake | Why it bites | Fix |
|---|---|---|
| Using `bind:value` on a value that's `$derived` | Derived is read-only; you cannot assign back into it. | Put the raw value in `$state`, derive the display version for read-only places. |
| Destructuring a `$state` object into locals, then binding to the local | Destructuring copies primitives; the bind writes to a dead reference. | Bind to the property path on the state object: `bind:value={form.name}`. |
| `bind:value` on a `type="number"` input without handling `undefined` | Empty inputs set the value to `undefined`; `$state(0)` becomes `$state(undefined)`. | Guard with a default: `value = value ?? 0` in an event, or use a function binding to coerce. |
| `bind:group` with `<select multiple>` | Wrong directive — select multi uses `bind:value`. | `<select multiple bind:value={arr}>`. |
| Forgetting `name` attribute on radios | Radios still mutually-exclude within the Svelte group, but screen readers and native form submission rely on `name`. | Add `name="theme"` on each radio. |
| `bind:this` read in top-level script | It's `undefined` until mount. | Read inside `$effect` or an event handler. |
| Function binding with a side-effectful getter | Getter is called during render; side effects run too often. | Getters must be pure reads. Side effects belong in `$effect` or the setter. |
| Mutating a `FileList` expecting the input to update | `FileList` is immutable. | Replace the whole value with a new `DataTransfer().files`. |
| Setting `indeterminate={true}` permanently | Once a user clicks, the `checked` state flips and UX feels broken if `indeterminate` doesn't also update. | Derive `indeterminate` from the underlying selection state — never hard-code. |
| Binding to an element that doesn't expose the property | e.g. `bind:innerHTML` on a non-contenteditable div does nothing. | Add `contenteditable="true"`. |

## The PE lens

**Forms without a save button beat forms with one.** For preferences, auto-apply is almost always right. "Save" creates anxiety, introduces dirty-state UI, and is a net negative for power users. The exception is destructive or costly changes (irreversible deletions, paid upgrades) — those deserve explicit confirmation.

**Prefer `bind:` for simple two-way cases. Drop to `value={...}` + `oninput={...}` only when you need to intercept or transform.** Function bindings (`{get, set}`) are the middle ground. Reach for them for normalization, not for anything that smells like business logic — at that point, a real component wraps it.

**Never put validation inside a function binding.** It runs on every keystroke. Put format normalization there (trim, uppercase, clamp). Put validation — "is this email valid?", "is this password strong?" — on blur or submit. Keystroke-time validation creates "error-while-typing" UI that users hate.

**Dimension bindings over `ResizeObserver` boilerplate.** If you find yourself writing `new ResizeObserver((entries) => ...)` by hand in a component, Svelte probably has a binding for it. `bind:clientWidth` / `bind:contentRect` are zero-boilerplate.

**`bind:indeterminate` is an ARIA-adjacent concern, not a style trick.** The default browser "dash" visual only shows when `indeterminate` is `true`. Screen readers announce "mixed." Don't simulate it with CSS; use the actual property.

**File inputs are stateful bombs.** `FileList` is immutable, server-side-hostile, and has weird semantics around re-selecting the same file (no change event). Anywhere you can avoid binding `files` directly and just read it in an `onchange` handler, do. This lesson *does* bind it because that's the pedagogy — in production, a wrapping `<FileDrop>` component hides the quirks.

## Build challenge

The `starter/` ships the shell: the settings defaults, the section snippet, the JSON preview, the reset handler, the `<svelte:window>` for `⌘S`, the CSS. What's stubbed is **every binding**. Nine stubs, each marked `// Lesson 07 build:`.

### Acceptance criteria

1. **Text bindings.** Name and tagline update as you type. The live JSON reflects immediately.
2. **Shouty mode.** When enabled, the function-bound display name forces upper case on every keystroke. When disabled, typing lowercase letters is preserved.
3. **Theme radio group.** Selecting a radio updates `settings.appearance.theme`. The preview card below the form restyles per theme.
4. **Font size range.** Dragging the slider updates a *number* (`typeof === 'number'`), and the preview's font size tracks it live.
5. **Channel checkboxes.** Clicking individual channels updates `settings.notifications.channels` as an array. Order doesn't matter, deduped values only.
6. **"All channels" parent.** The parent checkbox shows `checked` when all 4 are selected, `indeterminate` when 1–3 are selected, unchecked when 0 are. Clicking it toggles all on or all off.
7. **File input.** Uploading an avatar shows the filename, MIME type, and size in KB. Uploading a different file replaces the info.
8. **Dimension bindings.** The preview card's `clientWidth` × `clientHeight` is displayed live beneath it; resize the window and the numbers update.
9. **Reset.** "Reset to defaults" restores every value (including the file input, if present).

### Success looks like

```sh
pnpm --filter @course/lesson-07-starter dev
# toggle every control, watch the JSON reflect each change

pnpm --filter @course/lesson-07-starter check
# 0 errors, 0 warnings

pnpm --filter @course/lesson-07-solution check
# 0 errors, 0 warnings
```

## Self-check

<details>
<summary>1. You <code>bind:value</code> to a <code>$derived</code>. Svelte throws at runtime. Why?</summary>

`$derived` is a read-only view on reactive inputs. Its value is computed, not stored. `bind:` needs a writable lvalue — a `$state` variable or a property of a `$state` object. Svelte checks this at runtime and throws `state_descriptors_fixed` (or similar) on the first write attempt.

The fix: put the raw value in `$state` and use `$derived` only for read-only projections. If you need a writable view with a transformation, use a function binding.
</details>

<details>
<summary>2. You have <code>let n = $state(0)</code> and <code>bind:value={n}</code> on a <code>type="number"</code> input. The user clears the input. What's the value of <code>n</code>?</summary>

`undefined`. Empty or invalid numeric inputs coerce to `undefined`, not `NaN` and not `0`. If the rest of your code assumes `n` is always a number, you now have a silent bug.

Three ways to handle it, listed by preference:

1. Make the type honest: `let n = $state<number | undefined>(0)`. Check before use.
2. Use a function binding that coerces on set: `bind:value={() => n, (v) => n = v ?? 0}`.
3. Use a plain `value={n}` + an `oninput` handler that writes `parseInt(e.currentTarget.value) || 0`.
</details>

<details>
<summary>3. You wire a parent "select all" checkbox with <code>bind:indeterminate</code> pointing at a <code>$state</code> boolean. You click the children. <code>indeterminate</code> stays stuck. Why?</summary>

`bind:indeterminate` is two-way — writing to the bound variable *updates the checkbox property*, reading reflects the browser state. The variable is not automatically derived from your children array. You have to drive it yourself.

The correct pattern: compute it from the source of truth (the children array) via `$derived`, and pass it as a plain attribute, not as `bind:indeterminate`. The *checked* state of the parent can still be `bind:`-ed via a function binding that writes all-or-nothing into the children array. Writing `indeterminate` as a plain attribute from a derived is the idiomatic shape.
</details>

## Links

- [Svelte docs — `bind:`](https://svelte.dev/docs/svelte/bind)
- [MDN — `<input type="file">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file)
- [MDN — `HTMLInputElement.indeterminate`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/indeterminate)
- [MDN — `ResizeObserver`](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver) (what dimension bindings use under the hood)

Next: [Lesson 08 — `class:` / `style:`](../lesson-08-class-style/README.md). You'll build a theme customizer with live token editing.
