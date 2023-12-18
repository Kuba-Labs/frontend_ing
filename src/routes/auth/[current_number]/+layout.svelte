<script lang="ts">
	import { page } from '$app/stores';
	import { derived, get, writable, type Writable } from 'svelte/store';
	import SideMenu from './SideMenu.svelte';
	import { get_contacts, type ContactType, supabaseClient } from '$lib/database';
	import { browser } from '$app/environment';
	import { data_loading } from '$lib/storage';
	export let data;

	let last_number: number = 0;
	$: {
		if (browser && last_number != ($page.params.current_number as unknown as number)) {
			last_number = $page.params.current_number as unknown as number;
			console.log('subscribing');
			supabaseClient
				.channel('schema-db-changes')
				.on(
					'postgres_changes',
					{
						event: 'INSERT',
						schema: 'public',
						table: 'messages'
					},
					(payload) => {
						data_loading.reload();
					}
				)
				.subscribe();
			// console.log(room);
		}
	}
</script>

<div class="flex h-full gap-4">
	<div class="w-80 flex-shrink-0">
		<SideMenu contacts={data.contacts} />
	</div>
	<div class="flex-grow min-w-0">
		<slot />
	</div>
</div>
