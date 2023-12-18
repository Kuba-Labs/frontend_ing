<script lang="ts">
	import LoggedIn from '$lib/LoggedIn.svelte';
	import type { ContactType } from '$lib/database';
	import Contact from '$lib/Contact.svelte';
	import { page } from '$app/stores';
	import { data_loading, show_sent } from '$lib/storage';
	// current_number.set(1); // logs '1'
	export let contacts: ContactType[];

	let showing_numbers: ContactType[];
	let filter: string;
	$: {
		if (contacts) {
			showing_numbers = contacts.filter((c) => {
				if (!filter) {
					return true;
				} else {
					return (
						(c.wa_id + '').includes(filter) || c.name?.toLowerCase().includes(filter.toLowerCase())
					);
				}
			});
		} else {
			showing_numbers = [];
		}
	}
	$: {
		$show_sent;
		data_loading.reload();
	}
</script>

<div class="flex flex-col h-full gap-4 p-4 bg-base-200 rounded-xl">
	<div class="flex gap-4">
		<input
			type="text"
			placeholder="Scrivi qui per cercare..."
			class="input w-full"
			bind:value={filter}
		/>
		<button class="btn btn-square btn-neutral" on:click={() => (filter = '')}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M6 18L18 6M6 6l12 12"
				/></svg
			>
		</button>
	</div>
	<div class="flex items-center gap-2">
		<label class="label" for="show_sent">Mostra chat senza risposte:</label>
		<input id="show_sent" type="checkbox" class="toggle" bind:checked={$show_sent} />
	</div>

	<div class="flex-grow flex flex-col rounded-xl bg-base-300 p-2 gap-3 h-full overflow-scroll">
		<LoggedIn>
			{#each showing_numbers as contact}
				<a href="/auth/{$page.params.current_number}/messages/{contact.wa_id}">
					<Contact {contact} />
				</a>
			{/each}
		</LoggedIn>
	</div>
</div>
