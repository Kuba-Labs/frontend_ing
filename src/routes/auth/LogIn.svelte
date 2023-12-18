<script lang="ts">
	import { login } from '$lib/database';

	let email: string;
	let password: string;
</script>

<div class="bg-base-200">
	<p class="menu-title">Log in</p>
	<form
		class="form"
		on:submit|preventDefault={(e) => {
			login(email, password);
		}}
	>
		<input type="email" class="input" placeholder="Email" bind:value={email} />
		<input type="password" class="input" placeholder="Password" bind:value={password} />
		<input type="submit" class="btn" />
	</form>
</div>
