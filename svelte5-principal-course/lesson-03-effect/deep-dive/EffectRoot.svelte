<!--
	Lesson 03 deep-dive — $effect.root for effects outside the component
	lifecycle.

	Regular $effect can only be created during component setup or inside
	another tracking context. Once the component unmounts, every effect it
	created is torn down.

	$effect.root() creates a TRACKING SCOPE that does not unmount automatically.
	You get a `destroy()` function back that you can call when you want the
	scope (and every effect inside it) to clean up.

	Real use cases:
	  - A long-running ticker shared across multiple components.
	  - A focus-trap or keyboard-shortcut manager owned by a singleton.
	  - Lazy bootstrap of a system that must outlive the component that
	    created it (a service worker registration, a websocket).

	Below: a START button creates a root, which sets up a $effect that ticks
	a timer every 250ms. A STOP button calls destroy() to tear it all down.
	The component above could unmount and the timer would keep running until
	you stop it (try it: navigate away, come back — but here we mount/unmount
	the timer block instead, to keep the demo self-contained).

	Cumulative-syntax callout: $state (L01), $effect (L03), plus the new
	$effect.root rune. We pull forward $inspect.trace from L04 in a comment
	to point at how you'd debug a misbehaving root scope.
-->
<script lang="ts">
	let ticks = $state(0);
	let running = $state(false);
	let destroy: (() => void) | null = null;

	function start(): void {
		if (running) return;

		destroy = $effect.root(() => {
			$effect(() => {
				const id = setInterval(() => {
					ticks += 1;
				}, 250);
				return () => clearInterval(id);
			});
		});

		running = true;
	}

	function stop(): void {
		destroy?.();
		destroy = null;
		running = false;
	}
</script>

<h2><code>$effect.root</code> — escape the component lifecycle</h2>

<p>
	The ticker below lives in a root scope, not inside a component effect. It
	keeps ticking until you call <code>destroy()</code>, even if the parent
	component re-runs or you mount/unmount this UI.
</p>

<p class="display">ticks: {ticks}</p>

<div class="actions">
	<button type="button" onclick={start} disabled={running}>start</button>
	<button type="button" onclick={stop} disabled={!running}>stop</button>
	<button type="button" onclick={() => (ticks = 0)}>reset count</button>
</div>

<p class="tip">
	Think of <code>$effect.root</code> as "manual lifecycle." You opt out of
	auto-cleanup. The cost is that YOU must call <code>destroy()</code> at the
	right moment. Forget it and you've leaked the effect for the rest of the
	session. Use sparingly — it is the escape hatch.
</p>

<style>
	.display {
		font-size: 1.5em;
		font-variant-numeric: tabular-nums;
		margin-block: 1rem 0.5rem;
	}
	.actions {
		display: flex;
		gap: 0.5rem;
	}
	button {
		padding: 0.25rem 0.75rem;
		border: 1px solid rgb(0 0 0 / 0.2);
		border-radius: 0.25rem;
		background: transparent;
		cursor: pointer;
	}
	button:disabled {
		opacity: 0.5;
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
