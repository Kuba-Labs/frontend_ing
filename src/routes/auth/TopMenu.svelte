<script lang="ts">
	import { goto } from '$app/navigation';
	import { navigating, page } from '$app/stores';
	import type { ContactType } from '$lib/database';
	import { data_loading, hide_data, toasts } from '$lib/storage';
	export let available_numbers: ContactType[];
	let select: HTMLSelectElement;
</script>

<div class="flex gap-4 p-4 bg-base-200 rounded-xl">
	<div class="flex flex-grow gap-4">
		{#if available_numbers.length == 1}
			<p class="label">{available_numbers[0].wa_id + ' ' + available_numbers[0].name}</p>
		{:else}
			<label class="label" for="current">Scegli il numero:</label>
			<select
				class="select select-bordered"
				id="current"
				on:change={() => {
					goto(`/auth/${select.value}`);
				}}
				bind:this={select}
			>
				{#each available_numbers as { wa_id, name }, i}
					<option selected={wa_id.toString() == $page.params.current_number} value={wa_id}>
						{wa_id + ' ' + name}
					</option>
				{/each}
			</select>
		{/if}
	</div>

	<div class="flex gap-4 flex-shrink">
		{#if available_numbers[0]}
			<a
				class="btn flex-grow bg-base-300"
				href={`/auth/${$page.params.current_number || available_numbers[0].wa_id}`}
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
					<path stroke="none" d="M0 0h24v24H0z" />
					<path d="M21 14l-3 -3h-7a1 1 0 0 1 -1 -1v-6a1 1 0 0 1 1 -1h9a1 1 0 0 1 1 1v10" />
					<path d="M14 15v2a1 1 0 0 1 -1 1h-7l-3 3v-10a1 1 0 0 1 1 -1h2" /></svg
				>
				Messages
				<!-- <span class="badge badge-sm">99+</span> -->
			</a>
		{/if}
		{#if $page.params.current_number}
			<a
				class="btn flex-grow bg-base-300"
				href={`/auth/${$page.params.current_number}/statistiche`}
			>
				Statistiche
			</a>
		{/if}

		<a class="btn flex-grow bg-base-300" href="/auth">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="loading-sm"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				/></svg
			>
			Account
			<!-- <span class="badge badge-sm badge-warning">NEW</span> -->
		</a>
		<button class="btn flex-grow bg-base-300" on:click={() => data_loading.reload()}>
			{#if $navigating || $data_loading}
				<span class="loading loading-spinner loading-sm" />
			{:else}
				<svg
					class=" loading-sm"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					stroke-width="2"
					stroke="currentColor"
					fill="none"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path stroke="none" d="M0 0h24v24H0z" /> <path d="M5 12l5 5l10 -10" /></svg
				>
			{/if}
			RELOAD
			<!-- <span class="badge badge-sm badge-warning">NEW</span> -->
		</button>
		<!-- <li>
			<a>
				Stats
				<span class="badge badge-xs badge-info" />
			</a>
		</li> -->
	</div>
</div>
