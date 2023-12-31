<script lang="ts">
	export let data;
</script>

<div class="w-full h-full flex bg-base-300 justify-center items-center rounded-xl">
	<div class="stats shadow">
		<div class="stat place-items-center">
			<div class="stat-title">Clienti contattati</div>
			<div class="stat-value text-secondary">{data.numerocontattati}</div>
			<!-- <div class="stat-desc text-secondary">↗︎ 40 (2%)</div> -->
		</div>

		<div class="stat place-items-center">
			<div class="stat-title">Risposte ricevute</div>
			<div class="stat-value">{data.numerorisposte}</div>
			<!-- <div class="stat-desc">↘︎ 90 (14%)</div> -->
		</div>
	</div>
</div>
