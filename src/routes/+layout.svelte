<script lang="ts">
	import Toasts from '$lib/Toasts.svelte';
	import './styles.css';
</script>

<div class="">
	<Toasts />
</div>

<div class="h-screen">
	<slot />
</div>
