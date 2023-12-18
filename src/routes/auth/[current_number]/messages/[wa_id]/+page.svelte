<script lang="ts">
	import { page } from '$app/stores';
	import { send_message, type ContactType } from '$lib/database';
	import { afterUpdate } from 'svelte';
	import Message from './Message.svelte';
	import Loading from '$lib/Loading.svelte';
	import Contact from '$lib/Contact.svelte';
	import RimuoviCliente from './RimuoviCliente.svelte';

	export let data;

	let contact: ContactType | undefined;
	$: {
		contact = data.contacts.find((c) => c.wa_id == data.wa_id);
	}

	let div: HTMLDivElement;

	afterUpdate(() => {
		div.scroll({
			top: div.scrollHeight,
			behavior: 'instant'
		});
	});

	let input: string;
	let template: string;
</script>

<div class="flex gap-4 h-full">
	<div class="flex flex-col h-full bg-base-200 rounded-xl flex-grow min-w-0">
		<div class="flex bg-base-300 p-4 rounded-t-xl">
			<div class="flex-grow">
				<Contact contact={contact || { wa_id: data.wa_id }} inmessages />
			</div>
		</div>
		<div class="flex-grow overflow-x-hidden px-4" bind:this={div}>
			{#each data.messages as message (message.wam_id)}
				<Message {message} current_number={parseInt($page.params.current_number)} />
			{/each}
		</div>
		<div class="bg-base-300 p-4 pb-0 max-w-full">
			{#if template}
				{data.templates.find((t) => t.name == template)?.text}
			{/if}
		</div>
		<div class="bg-base-300 flex p-4 rounded-b-xl rounded-t-none">
			<div class="flex-grow">
				<div>
					<input
						class="input w-full rounded-r-none"
						placeholder="Scrivi un messaggio (parametri separati da virgola per template)"
						bind:value={input}
					/>
				</div>
			</div>
			<div class="divider divider-horizontal m-0 w-auto" />
			<select class="select rounded-none" bind:value={template}>
				<option value="" selected>Testo</option>

				{#each data.templates as templateee}
					<option value={templateee.name}>{templateee.name}</option>
				{/each}
			</select>
			<button
				class="btn btn-primary rounded-l-none"
				on:click={() => send_message(template, input, data.current_number, data.wa_id)}
			>
				<svg
					class="loading-sm"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					stroke-width="2"
					stroke="currentColor"
					fill="none"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path stroke="none" d="M0 0h24v24H0z" /> <line x1="10" y1="14" x2="21" y2="3" />
					<path d="M21 3L14.5 21a.55 .55 0 0 1 -1 0L10 14L3 10.5a.55 .55 0 0 1 0 -1L21 3" /></svg
				>
			</button>
		</div>
	</div>
	{#if contact}
		<div class="w-80 flex-shrink-0">
			<RimuoviCliente
				{contact}
				ecom_wa_id={data.current_number}
				wa_id={data.wa_id}
				tags={data.tags}
			/>
		</div>
	{/if}
</div>
