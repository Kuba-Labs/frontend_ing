<script lang="ts">
	import { remove_tag, type ContactType, add_tag } from '$lib/database';
	import { toasts } from '$lib/storage';
	import Icon from '@iconify/svelte';

	export let contact: ContactType;
	export let ecom_wa_id: number;
	export let wa_id: number;
	export let tags: string[];

	let missing_tags: string[] = [];
	$: {
		missing_tags = tags.filter((tag) => !contact.tags?.includes(tag));
	}
	let new_tag = '';
</script>

<div class=" flex flex-col h-full w-full bg-base-200 rounded-xl p-4 gap-4">
	<p>Clicca su "unsubscribed" per rimuovere il cliente</p>
	<div class="flex flex-col gap-2">
		{#each contact.tags || [] as tag}
			<div class="badge badge-neutral gap-2 h-auto">
				<button
					class="btn btn-neutral btn-xs"
					on:click={() => {
						remove_tag(ecom_wa_id, wa_id, tag);
					}}
				>
					<Icon icon="material-symbols-light:remove-rounded" height="1rem" />
				</button>
				{tag}
			</div>
		{/each}
	</div>

	<div class="flex flex-col gap-2">
		{#each missing_tags as tag}
			<div class="badge badge-neutral gap-2 h-auto">
				<button
					class="btn btn-neutral btn-xs"
					on:click={() => {
						add_tag(ecom_wa_id, wa_id, tag);
					}}
				>
					<Icon icon="material-symbols-light:add" height="1rem" />
				</button>
				{tag}
			</div>
		{/each}
	</div>
</div>
