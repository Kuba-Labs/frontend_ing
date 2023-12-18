<script>
	import { fly } from 'svelte/transition';
	import { toasts } from './storage';
	import { flip } from 'svelte/animate';

	// function getColor(type: string) {
	//     switch (type) {
	//         case "success":
	//             return
	//     }
	// }
</script>

<svelte:head>
	<!-- importante: le classi di tailwind non vengono buildate altrimenti -->
	<!-- importante: le classi di tailwind non vengono buildate altrimenti -->
	<script class="alert-success alert-info alert-error"></script>
</svelte:head>
<div class="flex gap-2 flex-col fixed right-0 top-0 z-10 p-6">
	{#each $toasts as toast (toast)}
		<div
			class={`alert-${toast.type} alert w-80 overflow-hidden`}
			animate:flip
			in:fly={{ x: 100 }}
			out:fly={{ x: 100 }}
		>
			<span>{toast.message}</span>
		</div>
	{/each}
</div>
