<script lang="ts">
	type Theme = 'light' | 'dark' | 'system';
	type Density = 'compact' | 'normal' | 'comfortable';
	type Channel = 'push' | 'email' | 'sms' | 'in-app';

	type Settings = {
		profile: { name: string; tagline: string; shouty: boolean };
		appearance: { theme: Theme; fontSize: number; density: Density };
		notifications: { channels: Channel[]; quietStart: string; quietEnd: string };
	};

	const ALL_CHANNELS: Channel[] = ['push', 'email', 'sms', 'in-app'];

	const defaults: Settings = {
		profile: { name: 'Billy', tagline: 'Building things.', shouty: false },
		appearance: { theme: 'system', fontSize: 16, density: 'normal' },
		notifications: { channels: ['push', 'in-app'], quietStart: '22:00', quietEnd: '07:00' }
	};

	let settings = $state(structuredClone(defaults));
	let avatarFiles = $state<FileList | undefined>();
	let previewEl = $state<HTMLDivElement | undefined>();
	let previewW = $state(0);
	let previewH = $state(0);

	const selectedCount = $derived(settings.notifications.channels.length);
	const allSelected = $derived(selectedCount === ALL_CHANNELS.length);
	const noneSelected = $derived(selectedCount === 0);
	const someSelected = $derived(!allSelected && !noneSelected);

	const avatar = $derived(avatarFiles && avatarFiles.length > 0 ? avatarFiles[0] : undefined);

	const json = $derived(JSON.stringify(settings, null, 2));

	$inspect('settings', settings);

	function reset(): void {
		settings = structuredClone(defaults);
		avatarFiles = new DataTransfer().files;
	}

	function formatKB(bytes: number): string {
		return `${(bytes / 1024).toFixed(1)} KB`;
	}

	function handleWindowKeydown(event: KeyboardEvent): void {
		if (event.key !== '/') return;
		const target = event.target;
		if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) return;
		event.preventDefault();
		const first = document.querySelector<HTMLInputElement>('[data-first-input]');
		first?.focus();
	}
</script>

<svelte:window onkeydown={handleWindowKeydown} />

<header class="top">
	<div>
		<h1>Settings</h1>
		<p class="muted">
			Every change is live. Press <kbd>/</kbd> to focus the display name.
		</p>
	</div>
	<button type="button" class="ghost" onclick={reset}>Reset to defaults</button>
</header>

<fieldset>
	<legend>Profile</legend>
	<label>
		<span>Display name</span>
		<input
			data-first-input
			type="text"
			bind:value={
				() => settings.profile.name,
				(v: string) => (settings.profile.name = settings.profile.shouty ? v.toUpperCase() : v)
			}
		/>
	</label>

	<label>
		<span>Tagline</span>
		<input type="text" bind:value={settings.profile.tagline} />
	</label>

	<label class="inline">
		<input type="checkbox" bind:checked={settings.profile.shouty} />
		<span>Shouty mode (force upper-case on display name)</span>
	</label>
</fieldset>

<fieldset>
	<legend>Appearance</legend>

	<div class="field">
		<span class="label">Theme</span>
		<div class="radios">
			{#each ['light', 'dark', 'system'] as t (t)}
				<label class="inline">
					<input type="radio" name="theme" value={t} bind:group={settings.appearance.theme} />
					<span>{t}</span>
				</label>
			{/each}
		</div>
	</div>

	<label>
		<span>Font size ({settings.appearance.fontSize}px)</span>
		<input
			type="range"
			min="12"
			max="24"
			step="1"
			bind:value={settings.appearance.fontSize}
		/>
	</label>

	<label>
		<span>Density</span>
		<select bind:value={settings.appearance.density}>
			<option value="compact">compact</option>
			<option value="normal">normal</option>
			<option value="comfortable">comfortable</option>
		</select>
	</label>
</fieldset>

<fieldset>
	<legend>Notifications</legend>

	<label class="inline">
		<input
			type="checkbox"
			bind:checked={
				() => allSelected,
				(checked: boolean) => {
					settings.notifications.channels = checked ? [...ALL_CHANNELS] : [];
				}
			}
			indeterminate={someSelected}
		/>
		<span>All channels</span>
	</label>

	<div class="checks">
		{#each ALL_CHANNELS as c (c)}
			<label class="inline">
				<input type="checkbox" value={c} bind:group={settings.notifications.channels} />
				<span>{c}</span>
			</label>
		{/each}
	</div>

	<div class="two-col">
		<label>
			<span>Quiet hours — start</span>
			<input type="time" bind:value={settings.notifications.quietStart} />
		</label>
		<label>
			<span>Quiet hours — end</span>
			<input type="time" bind:value={settings.notifications.quietEnd} />
		</label>
	</div>
</fieldset>

<fieldset>
	<legend>Avatar</legend>
	<label>
		<span>Upload image</span>
		<input type="file" accept="image/*" bind:files={avatarFiles} />
	</label>
	{#if avatar}
		<p class="file-info">
			<strong>{avatar.name}</strong> — {avatar.type || 'unknown type'} — {formatKB(avatar.size)}
		</p>
	{/if}
</fieldset>

<fieldset>
	<legend>Preview</legend>
	<div
		class="preview"
		data-theme={settings.appearance.theme}
		data-density={settings.appearance.density}
		style:font-size="{settings.appearance.fontSize}px"
		bind:this={previewEl}
		bind:clientWidth={previewW}
		bind:clientHeight={previewH}
	>
		<div class="name">{settings.profile.name || 'No name'}</div>
		<div class="tagline">{settings.profile.tagline || 'No tagline'}</div>
	</div>
	<p class="dims">
		Card size: <strong>{previewW}</strong> × <strong>{previewH}</strong> px
	</p>
</fieldset>

<fieldset>
	<legend>Live JSON</legend>
	<pre>{json}</pre>
</fieldset>

<style>
	.top {
		display: flex;
		justify-content: space-between;
		align-items: end;
		gap: var(--space-md);
		margin-block-end: var(--space-lg);
	}

	.top h1 {
		margin: 0;
	}

	.muted {
		margin: 0;
		color: var(--color-text-muted);
		font-size: var(--text-sm);
	}

	kbd {
		display: inline-block;
		padding: 0.1em 0.4em;
		background: var(--color-surface-sunken);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		font-size: var(--text-xs);
		line-height: 1;
	}

	.ghost {
		padding: var(--space-xs) var(--space-md);
		background: transparent;
		color: var(--color-text);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		cursor: pointer;
	}

	.ghost:hover {
		background: var(--color-surface-raised);
		border-color: var(--color-border-strong);
	}

	fieldset {
		margin-block: var(--space-md) 0;
		padding: var(--space-md);
		background: var(--color-surface-raised);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}

	legend {
		padding: 0 var(--space-xs);
		font-weight: 600;
		color: var(--color-text);
	}

	label {
		display: flex;
		flex-direction: column;
		gap: var(--space-2xs);
		font-size: var(--text-sm);
	}

	label > span:first-of-type,
	.field > .label {
		color: var(--color-text-muted);
		font-size: var(--text-xs);
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	label.inline {
		flex-direction: row;
		align-items: center;
		gap: var(--space-xs);
	}

	label.inline > span:first-of-type,
	label.inline > span {
		color: var(--color-text);
		font-size: var(--text-sm);
		text-transform: none;
		letter-spacing: normal;
	}

	input[type='text'],
	input[type='time'],
	select {
		padding: var(--space-xs) var(--space-sm);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		color: var(--color-text);
		font: inherit;
	}

	input[type='range'] {
		accent-color: var(--color-accent);
	}

	input:focus,
	select:focus {
		outline: 2px solid var(--color-accent);
		outline-offset: 1px;
	}

	.radios,
	.checks {
		display: flex;
		gap: var(--space-md);
		flex-wrap: wrap;
	}

	.two-col {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-md);
	}

	.file-info {
		margin: 0;
		padding: var(--space-xs) var(--space-sm);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		font-size: var(--text-sm);
		color: var(--color-text-muted);
	}

	.preview {
		padding: var(--space-md);
		background: var(--color-surface);
		border: 1px solid var(--color-border-strong);
		border-radius: var(--radius-md);
	}

	.preview[data-theme='light'] {
		background: oklch(98% 0.005 260);
		color: oklch(18% 0.014 260);
		border-color: oklch(80% 0.012 260);
	}

	.preview[data-theme='dark'] {
		background: oklch(18% 0.014 260);
		color: oklch(95% 0.005 260);
		border-color: oklch(40% 0.018 260);
	}

	.preview[data-density='compact'] {
		padding: var(--space-xs) var(--space-sm);
	}

	.preview[data-density='comfortable'] {
		padding: var(--space-lg);
	}

	.preview .name {
		font-weight: 600;
		line-height: var(--leading-tight);
	}

	.preview .tagline {
		opacity: 0.8;
		font-size: 0.875em;
	}

	.dims {
		margin: 0;
		font-size: var(--text-xs);
		color: var(--color-text-muted);
		font-variant-numeric: tabular-nums;
	}

	pre {
		margin: 0;
		padding: var(--space-md);
		background: var(--color-surface-sunken);
		border-radius: var(--radius-md);
		font-size: var(--text-xs);
		overflow-x: auto;
		color: var(--color-text);
	}
</style>
