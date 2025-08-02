<script lang="ts">
	import { setContext } from 'svelte';
	import { useGetTrendingQuery } from '../../../../api/trending';

	let switchDate = $state<'day' | 'week'>('day');

	// const trendingQuery = useGetTrendingQuery(switchDateRef);
	const trendingQuery = useGetTrendingQuery(switchDate);
	const { data: trendingData } = $derived($trendingQuery);
	$effect(() => {
		console.log(trendingData);
	});
</script>

<section class="Trading">
	<div class="container">
		<div class="content">
			<h1>Trending</h1>
			<button onclick={() => (switchDate = 'day')}>day</button>
			<button onclick={() => (switchDate = 'week')}>week</button>
		</div>
	</div>
</section>

<style lang="scss">
	.Trading {
		.content {
		}
	}
</style>
