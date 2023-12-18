<script lang="ts">
	import type { RowOf } from '$lib/database';
	import { format } from '$lib/format_message';
	import { stringify } from 'postcss';
	export let message: RowOf<'messages'>;
	export let current_number: number;

	// let content: string;
	// let buttons: string[] = [];
	// let note: string;

	// let message_data: any = message.data;

	// if (message_data.template?.text) {
	// 	message_data.template.template_data = message_data.template.text;
	// }

	// try {
	// 	switch (message_data.type) {
	// 		case 'text':
	// 			content = message_data.text.body;
	// 			break;
	// 		case 'template':
	// 			content = get_text_from_template(message_data.template);
	// 			buttons = get_buttons_from_template(message_data.template);
	// 			break;
	// 		case 'reaction':
	// 			content = message_data.reaction.emoji;
	// 			note = 'reaction';
	// 			break;

	// 		case 'unsupported':
	// 			content = 'Unsupported';
	// 			note = 'Message not supported by WhatsApp API';
	// 			break;
	// 		case 'button':
	// 			content = message_data.button.text;
	// 			break;
	// 		case 'interactive':
	// 			switch (message_data.interactive.type) {
	// 				case 'button':
	// 					content = message_data.interactive.body.text;
	// 					buttons = message_data.interactive.action.buttons.map((b: any) => b.reply.title);
	// 					break;
	// 				case 'button_reply':
	// 					content = message_data.interactive.button_reply.title;
	// 					break;
	// 				default:
	// 					throw new Error('Interactive not supported');
	// 			}

	// 			break;
	// 		default:
	// 			content = JSON.stringify(message.data, null);
	// 	}
	// } catch (e) {
	// 	console.log(e);
	// 	content = JSON.stringify(message.data, null);
	// }

	// function get_text_from_template(template_msg: any): string {
	// 	const parameters: string[] = template_msg.components
	// 		?.find((c: any) => c.type.toLowerCase() == 'body')
	// 		.parameters?.map((component: any) => component.text);
	// 	const template_text: string = template_msg.template_data.components.find(
	// 		(c: any) => c.type.toLowerCase() == 'body'
	// 	)?.text;

	// 	const formatted_template = template_text.replace(/\{\{(\d+)\}\}/g, (match, p1) => {
	// 		const index = parseInt(p1, 10) - 1; // Adjust index since array is 0-based and placeholders are 1-based
	// 		return parameters[index] || match; // Use the placeholder as the default value if no replacement is found
	// 	});

	// 	return formatted_template;
	// }
	// function get_buttons_from_template(template_msg: any): string[] {
	// 	const buttons: string[] = [];
	// 	template_msg.template_data.components
	// 		.find((c: any) => c.type.toLowerCase() == 'buttons')
	// 		?.buttons.map((button: any) => {
	// 			buttons.push(button.text);
	// 		});

	// 	return buttons;
	// }

	const { content, buttons, note } = format(message);

	let view_raw: boolean = false;
	function handleRaw(e: MouseEvent) {
		e.preventDefault();
		view_raw = !view_raw;
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="chat {message.from != current_number ? 'chat-start' : 'chat-end'}">
	<div class="chat-header" on:contextmenu={handleRaw}>
		<!-- {message.from} -->
		<time class="text-xs opacity-50">
			{new Date(message.timestamp).toLocaleString()}
		</time>
	</div>

	<div class=" flex flex-col max-w-lg chat-bubble gap-2">
		{#if view_raw}
			{JSON.stringify(message.data)}
		{:else}
			<div style="white-space: pre-line">
				{content}
				{#if note}
					<p class="opacity-50 leading-none italic">{note}</p>
				{/if}
			</div>
			{#if buttons.length}
				<div class="flex flex-col gap-2">
					{#each buttons as button}
						<button class="btn btn-sm no-animation">{button}</button>
					{/each}
				</div>
			{/if}
		{/if}
	</div>
	{#if message.status}
		<div class=" chat-footer opacity-50">{message.status}</div>
	{/if}
</div>
