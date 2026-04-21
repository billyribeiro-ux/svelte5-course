# Lesson 15 — Slots → snippets migration

## The project you're building

**A legacy-to-modern migration of a `<Notice>` component.** Ship starts with the Svelte 4 slot-based version (running in legacy mode via `<svelte:options runes={false}>`) and migrate it to the Svelte 5 snippet shape. Both versions live on the page side-by-side so you can confirm visual parity.

## What this lesson teaches

One table of equivalences. That's it. The whole lesson is memorising the translation.

| Svelte 4 (slots) | Svelte 5 (snippets) |
|---|---|
| `<slot>` (default) | `{@render children()}` + accept `children` prop |
| `<slot name="footer">` | `{@render footer?.()}` + accept `footer` prop |
| `<slot name="row" {item}>` (slot props down) | `{@render row(item)}` + accept `row: Snippet<[Item]>` |
| `<slot name="footer"><p>fallback</p></slot>` | `{#if footer}{@render footer()}{:else}<p>fallback</p>{/if}` |
| `$$slots.footer` | `{#if footer}…{/if}` on the prop |
| `<Modal let:close>...</Modal>` | `<Modal>{#snippet children({ close })}…{/snippet}</Modal>` |
| `slot="footer"` attribute on child markup | `{#snippet footer()}…{/snippet}` inside child tag |

### The one non-obvious migration: `let:` bindings

Slot props (old `let:x` syntax) become named snippet parameters. The child declares the snippet's signature; the parent destructures in its `{#snippet}` block.

```svelte
<!-- Svelte 4 -->
<Modal let:close>
	<button onclick={close}>Dismiss</button>
</Modal>

<!-- Svelte 5 -->
<Modal>
	{#snippet children({ close })}
		<button onclick={close}>Dismiss</button>
	{/snippet}
</Modal>
```

The `children` snippet now takes an object with `close`. The child's `<script>` types it: `children: Snippet<[{ close: () => void }]>`. When rendering: `{@render children({ close })}`.

### The `svelte/legacy` module

For the rare case where you need to *keep* a component as a legacy artefact (e.g., imported by an older package you can't update), Svelte ships `svelte/legacy` with interop helpers and `<svelte:options runes={false}>` for per-component legacy mode. Use both as bridges, not destinations. Migrate when possible.

## Build challenge

`starter/` ships:
- `NoticeLegacy.svelte` — the Svelte 4 slot-based version, in legacy mode.
- `NoticeSnippets.svelte` — **your migration target.** Currently a stub.
- `+page.svelte` — renders both side-by-side.

Migrate `NoticeSnippets.svelte` to the runes + snippets shape described in the README. Acceptance: both notices render identical output.

### Success

```sh
pnpm --filter @course/lesson-15-starter dev     # see both notices — should look identical
pnpm --filter @course/lesson-15-starter check   # 0 / 0
pnpm --filter @course/lesson-15-solution check  # 0 / 0
```

## Self-check

<details>
<summary>1. What's the single biggest practical win of snippets over slots?</summary>

Type safety for slot props. In Svelte 4, `let:item` was typed `any` without painful workarounds. In Svelte 5, `children: Snippet<[Item]>` flows the type through cleanly. Autocomplete inside the snippet body, red squigglies when the parent passes the wrong shape. That was the single biggest papercut.

Second-biggest: snippets are first-class values, so you can conditionally render them, pass them to multiple siblings, or assign them to variables. Slots couldn't leave their declaration site.
</details>

<details>
<summary>2. You migrate <code>&lt;slot&gt;</code> to <code>{@render children()}</code> and Svelte errors about <code>children</code> being undefined. What did you miss?</summary>

You didn't declare `children` as a prop. The implicit-children behaviour requires the component to accept `children` via `$props()`. The compiler doesn't auto-magic it — you have to explicitly pull it out:

```svelte
<script>
	let { children } = $props();
</script>

{@render children()}
```

Use `children?.()` if there might be no children passed.
</details>

<details>
<summary>3. A Svelte 4 consumer was passing slot props via <code>let:foo</code>. Your migrated component now takes <code>foo</code> via <code>Snippet&lt;[{ foo }]&gt;</code>. Consumers break. Why?</summary>

Because the *consumers* have to migrate too. Their old `<Component let:foo>…</Component>` syntax doesn't work against the new snippet-based component. They need to switch to:

```svelte
<Component>
	{#snippet children({ foo })}
		…
	{/snippet}
</Component>
```

Migrations cross the component boundary. When you ship a breaking rename, leave an alias or version-bump with a clear changelog note.
</details>

## Links

- [Svelte docs — Slots (legacy)](https://svelte.dev/docs/svelte/legacy-slots)
- [Svelte docs — Snippets](https://svelte.dev/docs/svelte/snippet)
- [Svelte docs — Migration guide (v4 → v5)](https://svelte.dev/docs/svelte/v5-migration-guide)

**Part 3 complete.** Next: [Lesson 16 — `.svelte.js` / `.svelte.ts` modules](../lesson-16-modules/README.md).
