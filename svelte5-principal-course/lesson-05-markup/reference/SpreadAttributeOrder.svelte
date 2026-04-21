<!--
	Spread precedence, the thing every design-system component deals with.

	`{...props} class="override"`  — explicit `class` WINS (later attribute).
	`class="under" {...props}`     — spread WINS for any key it provides.

	Same rule for events: `{...props} onclick={mine}` — `mine` wins. That's why
	"allow parent to override my default handler" is the common idiom — put
	the defaults first, then spread.
-->
<script lang="ts">
	const incoming = $state({
		class: 'from-parent',
		title: 'parent title',
		onclick: () => alert('parent onclick')
	});
</script>

<h2>Spread after explicit — explicit wins</h2>
<button type="button" class="mine" {...incoming}>
	Inspect this button's class: parent's `from-parent` wins
</button>

<h2>Spread before explicit — explicit wins</h2>
<button type="button" {...incoming} class="mine">
	Inspect this button's class: my `mine` wins
</button>

<h2>Mixed override</h2>
<button type="button" class="defaults" {...incoming} title="override title">
	Parent controls class+onclick; I override only the title.
</button>
