<script lang="ts">
	// $inspect walks the whole proxy — one inspect on the root object
	// observes mutations at any depth. You rarely need to scatter many
	// individual inspects across leaf fields.

	const user = $state({
		name: 'Billy',
		profile: {
			email: 'b@example.com',
			prefs: { theme: 'dark' as 'dark' | 'light' }
		},
		tags: ['a', 'b']
	});

	$inspect(user);
</script>

<button onclick={() => (user.name = user.name + '!')}>rename</button>
<button onclick={() => (user.profile.email = 'new@example.com')}>change email</button>
<button onclick={() => (user.profile.prefs.theme = user.profile.prefs.theme === 'dark' ? 'light' : 'dark')}>toggle theme</button>
<button onclick={() => user.tags.push(String(user.tags.length))}>push tag</button>
