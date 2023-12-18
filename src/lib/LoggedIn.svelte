<script>
	import { session } from './storage';
</script>

{#if $session}
	<slot />
{:else}
	<slot name="not_logged">
		<p>Fai il <a href="/auth" class="link">login</a></p>
	</slot>
{/if}
