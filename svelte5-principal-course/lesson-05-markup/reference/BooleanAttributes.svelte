<!--
	Lesson 05 reference — boolean attributes are present-or-absent.

	When an HTML attribute is "boolean" (like `disabled`, `hidden`, `open`,
	`readonly`, `required`), its presence on the element is what matters —
	not the string value.

	In Svelte, an expression in `{...}` is COERCED to truthy/falsy:
	  - disabled={true}   → <button disabled>
	  - disabled={false}  → <button>  (attribute removed entirely)
	  - disabled={null}   → <button>  (nullish → removed)
	  - disabled={''}     → <button>  ('' is falsy)
	  - disabled={'no'}   → <button disabled>  (truthy string!)

	Non-boolean attributes follow a different rule: they drop off when the
	value is `null` or `undefined`, but otherwise the value becomes the string.

	  aria-current={i === selected ? 'true' : undefined}

	is the idiom for "set this attribute or omit it entirely."
-->
<script lang="ts">
	let count = $state(0);
	let max = $state(3);
</script>

<p>count = {count}, max = {max}</p>

<div class="row">
	<button type="button" onclick={() => count++} disabled={count >= max}>increment</button>
	<button type="button" onclick={() => count--} disabled={count <= 0}>decrement</button>
	<button type="button" onclick={() => (count = 0)} disabled={count === 0}>reset</button>
</div>

<p class="tip">
	The buttons disable themselves at the bounds. Watch the rendered HTML in DevTools
	→ Elements: the <code>disabled</code> attribute appears and disappears, it does
	not become <code>disabled="false"</code>. That's the boolean-attribute rule.
</p>

<style>
	.row {
		display: flex;
		gap: 0.5rem;
		margin-block: 0.5rem;
	}
	button {
		padding: 0.25rem 0.75rem;
		border: 1px solid rgb(0 0 0 / 0.2);
		border-radius: 0.25rem;
		background: transparent;
		cursor: pointer;
	}
	button:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}
	.tip {
		margin-block-start: 1rem;
		font-size: 0.9em;
		color: rgb(0 0 0 / 0.55);
		max-inline-size: 42rem;
	}
	code {
		padding: 0.1em 0.3em;
		background: rgb(0 0 0 / 0.06);
		border-radius: 0.2rem;
	}
</style>
