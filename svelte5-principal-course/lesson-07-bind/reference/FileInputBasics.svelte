<!--
	`bind:files` binds a FileList, not a File[]. FileList is:

	- array-like (has .length, indexable)
	- NOT mutable
	- NOT always available in SSR Node runtimes

	To clear: `files = new DataTransfer().files` (falsy values won't work).
	To iterate/map: `Array.from(files)` first.
	To delete an entry: build a fresh DataTransfer with the survivors.
-->
<script lang="ts">
	let files = $state<FileList | undefined>();

	function clear(): void {
		files = new DataTransfer().files;
	}
</script>

<label>
	Pick one or many:
	<input type="file" multiple bind:files />
</label>

<button type="button" onclick={clear}>Clear selection</button>

{#if files && files.length > 0}
	<ul>
		{#each Array.from(files) as file (file.name + file.size)}
			<li>{file.name} — {(file.size / 1024).toFixed(1)} KB</li>
		{/each}
	</ul>
{:else}
	<p>No files selected.</p>
{/if}

<style>
	label {
		display: block;
		margin-block-end: 0.5rem;
	}
	button {
		margin-block: 0.5rem;
	}
	ul {
		padding-inline-start: 1.25rem;
	}
</style>
