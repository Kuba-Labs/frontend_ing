<script lang="ts">
	import { toasts } from '$lib/storage';

	let apiKey = '';
	let identifier = '';
	let messages: string[] = [''];

	function handleSubmit() {
		// Handle form submission here
		// console.log(apiKey, identifier, firstMessage);
		if (apiKey && identifier && messages[0] !== undefined) {
			toasts.success('Setup aggiornato con successo');
		} else {
			toasts.error('dati mancanti');
		}
	}
</script>

<main class="flex flex-col gap-8">
	<h1 class="text-2xl">Setup</h1>

	<form class="flex flex-col gap-4 form" on:submit|preventDefault={handleSubmit}>
		<div class="grid grid-cols-2 gap-4">
			<label class="flex flex-col">
				<span>API Key:</span>
				<input class="input bg-base-300" type="text" bind:value={apiKey} />
			</label>

			<label class="flex flex-col">
				<span>Identifier:</span>
				<input class="input bg-base-300" type="text" bind:value={identifier} />
			</label>

			{#each messages as message, i}
				<label class="flex flex-col">
					<span>Message {i}:</span>
					<textarea class="input bg-base-300" bind:value={message[0]} />
				</label>
			{/each}
			<span />
			<button
				type="submit"
				class="btn btn-neutral"
				on:click|preventDefault={() => {
					messages = [...messages, ''];
					console.log('ciao');
				}}
			>
				Add message
			</button>
		</div>

		<button type="submit" class="btn btn-secondary">Save</button>
	</form>
</main>
