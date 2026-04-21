<!--
	Readonly dimension bindings — powered by a ResizeObserver behind the scenes.

	Available on every visible element (not `display: inline`):
	  bind:clientWidth / bind:clientHeight   → content + padding
	  bind:offsetWidth / bind:offsetHeight   → content + padding + border
	  bind:contentRect                       → DOMRectReadOnly
	  bind:contentBoxSize                    → ResizeObserverSize[]

	Drag the corner of the textarea below (native resize handle) and watch
	the numbers update. Zero boilerplate.
-->
<script lang="ts">
	let w = $state(0);
	let h = $state(0);
</script>

<textarea bind:clientWidth={w} bind:clientHeight={h}>
Drag my corner.
</textarea>

<p>Size: <strong>{w}</strong> × <strong>{h}</strong> px</p>

<style>
	textarea {
		display: block;
		min-inline-size: 10rem;
		min-block-size: 4rem;
		padding: 0.5rem;
		border: 1px solid #888;
		border-radius: 0.25rem;
		font: inherit;
	}
	p {
		font-variant-numeric: tabular-nums;
	}
</style>
