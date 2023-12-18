<script lang="ts">
	import { get } from 'svelte/store';
	import type { ContactType } from './database';
	import { hide_data } from './storage';
	import { format } from './format_message';

	export let contact: { wa_id: number; data?: any; name?: string | null; timestamp?: Date | null };
	export let inmessages = false;
	// console.log(contact);

	function seedRandom(seed: number) {
		var x = Math.sin(seed) * 10000;
		return x - Math.floor(x);
	}

	function generateColor(seed: number) {
		var r = Math.floor(seedRandom(seed + 1) * 256);
		var g = Math.floor(seedRandom(seed + 2) * 256);
		var b = Math.floor(seedRandom(seed + 3) * 256);
		return { r, g, b };
	}
	function getContrastTextColor(r: number, g: number, b: number) {
		return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? 'black' : 'white';
	}
	function colorToString({ r, g, b }: { r: number; g: number; b: number }) {
		return `rgb(${r},${g},${b})`;
	}
	let color: any;
	let accent_color_string: string;
	$: {
		if (contact?.wa_id) {
			color = generateColor(contact.wa_id);
			accent_color_string = getContrastTextColor(color.r, color.g, color.b);
		}
	}

	function censor(str: string | number) {
		str = str.toString();

		if (str.length <= 2) {
			return '*'.repeat(str.length);
		}

		const firstChar = str[0];
		const lastChar = str[str.length - 1];
		const middle = '*'.repeat(str.length - 2);

		return firstChar + middle + lastChar;
	}

	let exerpt = '';
	$: {
		exerpt = format(contact).content;
	}
</script>

<div class="flex items-center space-x-3">
	<div class="avatar placeholder">
		<div
			class="bg-neutral-focus text-neutral-content rounded-full w-12"
			style={`background-color: ${colorToString(color)};`}
		>
			<span style={`color: ${accent_color_string}`}>{contact.name ? contact.name[0] : ' '}</span>
		</div>
	</div>
	<div class={'flex flex-col flex-grow min-w-0 '}>
		{#if !inmessages}
			<div class="text-xs opacity-40">
				{contact.timestamp ? contact.timestamp.toLocaleString() : ''}
			</div>
		{/if}
		<div class="font-bold">
			{contact.name ? ($hide_data ? censor(contact.name) : contact.name) : 'unknown'}
		</div>
		{#if !inmessages}
			<div class="text-sm opacity-50 whitespace-nowrap text-ellipsis w-full overflow-hidden">
				{$hide_data ? censor(exerpt || ' ') : exerpt}
			</div>
		{:else}
			{contact.wa_id}
		{/if}
	</div>
</div>
