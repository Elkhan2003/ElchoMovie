<script lang="ts">
	import { useGetPopularQuery } from '../../../../api/popular';

	const type_switcher = $state<'movie' | 'tv'>('movie');
	const sort_rating_desc = $state<boolean>(true);

	const trendingQuery = $derived(useGetPopularQuery(type_switcher));
</script>

<section class="Popular">
	<div class="container">
		<div class="content">
			<h1>Popular</h1>
		</div>
	</div>
</section>

<style lang="scss">
	.Popular {
		.content {
		}
	}
</style>
