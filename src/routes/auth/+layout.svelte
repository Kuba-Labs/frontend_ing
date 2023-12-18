<script>
	import LoggedIn from '$lib/LoggedIn.svelte';
	import { data_loading, session } from '$lib/storage';
	import { onMount } from 'svelte';
	import LogIn from './LogIn.svelte';
	import TopMenu from './TopMenu.svelte';
	import { supabaseClient } from '$lib/database';
	export let data;
</script>

<LoggedIn>
	<div class="flex flex-col h-full p-4 gap-4">
		<div class="">
			<TopMenu available_numbers={data.numbers} />
		</div>
		<div class="min-h-0 flex-grow">
			<slot />
		</div>
	</div>

	<LogIn slot="not_logged" />
</LoggedIn>
