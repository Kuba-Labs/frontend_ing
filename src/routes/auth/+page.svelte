<script>
	import { logout } from '$lib/database';
</script>

<button class="btn btn-primary" on:click|preventDefault={logout}>Esci</button>
