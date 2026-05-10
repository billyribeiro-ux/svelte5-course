<!--
	Lesson 04 deep-dive — $inspect vs {@debug ...}

	Both are dev-only debug tools. They look similar but serve slightly
	different purposes:

	  $inspect(value)
	    - Lives in the <script>. Re-runs whenever value changes.
	    - Default behaviour is console.log + stack trace.
	    - `.with(callback)` swaps the default for a custom handler.
	    - Use when you want a programmatic, conditional log (filter,
	      throw, set a flag for E2E tests).

	  {@debug value}
	    - Lives in the markup. Pauses execution (`debugger` statement)
	      when value changes AND devtools are open.
	    - Otherwise no-op.
	    - Use when you want to STOP at a state change, not just log it.

	  {@debug} with no args
	    - Pauses on ANY reactive change in scope. Heavy hammer.

	Below: both attached to the same value. The $inspect logs every change.
	The {@debug} pauses if you have devtools open. Use one OR the other —
	or both, for different debug intents.

	Cumulative-syntax callout: $state (L01), $inspect (L04), plus the
	{@debug} markup tag.
-->
<script lang="ts">
	let user = $state({ name: 'Billy', age: 38 });

	// programmatic — fires every change, even without devtools open
	$inspect(user);

	function birthday(): void {
		user.age += 1;
	}

	function rename(): void {
		user.name = user.name === 'Billy' ? 'Bill' : 'Billy';
	}
</script>

<h2><code>$inspect</code> vs <code>&#123;@debug ...&#125;</code></h2>

<!--
	With devtools OPEN, this pauses execution every time `user` changes
	(name OR age). With devtools closed, it's a no-op. Try both states.
-->
{@debug user}

<dl>
	<dt>name</dt><dd>{user.name}</dd>
	<dt>age</dt><dd>{user.age}</dd>
</dl>

<div class="actions">
	<button type="button" onclick={birthday}>birthday</button>
	<button type="button" onclick={rename}>rename</button>
</div>

<p class="tip">
	Open DevTools → Console. Click either button. <code>$inspect(user)</code>
	prints the new value. With DevTools open, <code>&#123;@debug user&#125;</code> also pauses
	execution. Close DevTools and only the inspect still runs. Two tools, two intents:
	<em>log changes</em> vs <em>pause on changes</em>.
</p>

<style>
	dl {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0.25rem 1rem;
	}
	dt {
		font-family: ui-monospace, monospace;
		font-size: 0.9em;
		color: rgb(0 0 0 / 0.6);
	}
	.actions {
		display: flex;
		gap: 0.5rem;
		margin-block-start: 1rem;
	}
	button {
		padding: 0.25rem 0.75rem;
		border: 1px solid rgb(0 0 0 / 0.2);
		border-radius: 0.25rem;
		background: transparent;
		cursor: pointer;
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
