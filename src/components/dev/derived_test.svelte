<script lang="ts">
	import { useGetTrendingQuery } from '../../api/trending';

	let switchDate = $state<'day' | 'week'>('day');

	const trendingQuery = $derived(useGetTrendingQuery(switchDate));
	const { data: trendingData, isLoading, error } = $derived($trendingQuery);

	$effect(() => {
		console.log('Trending data updated:', trendingData);
		console.log('Current date filter:', switchDate);
	});
</script>

<section class="Trading">
	<div class="container">
		<div class="content">
			<h1>Trending</h1>

			<div class="controls">
				<button
					onclick={() => (switchDate = 'day')}
					class:active={switchDate === 'day'}
				>
					Today
				</button>
				<button
					onclick={() => (switchDate = 'week')}
					class:active={switchDate === 'week'}
				>
					This Week
				</button>
			</div>

			<div class="status">
				<p>Current filter: <strong>{switchDate}</strong></p>

				{#if isLoading}
					<p>Loading trending movies...</p>
				{:else if error}
					<p>Error: {error.message}</p>
				{:else if trendingData}
					<p>Found {trendingData.results?.length || 0} trending movies</p>
				{/if}
			</div>

			{#if trendingData?.results}
				<div class="movies">
					{#each trendingData.results.slice(0, 5) as movie (movie.id)}
						<div class="movie-card">
							<h3>{movie.title}</h3>
							<p>Rating: {movie.vote_average.toFixed(1)}</p>
							<p>Release: {movie.release_date}</p>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</section>

<style lang="scss">
	.Trading {
		padding: 2rem 0;

		.content {
			h1 {
				color: #a855f7;
				margin-bottom: 2rem;
			}

			.controls {
				display: flex;
				gap: 1rem;
				margin-bottom: 2rem;

				button {
					padding: 0.75rem 1.5rem;
					border: 2px solid #a855f7;
					background: transparent;
					color: #a855f7;
					border-radius: 8px;
					cursor: pointer;
					transition: all 0.3s ease;

					&:hover {
						background: rgba(168, 85, 247, 0.1);
					}

					&.active {
						background: #a855f7;
						color: white;
					}
				}
			}

			.status {
				margin-bottom: 2rem;
				padding: 1rem;
				background: rgba(168, 85, 247, 0.1);
				border-radius: 8px;
				border-left: 4px solid #a855f7;

				p {
					margin: 0.5rem 0;
					color: rgba(255, 255, 255, 0.8);

					strong {
						color: #a855f7;
					}
				}
			}

			.movies {
				display: grid;
				grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
				gap: 1rem;

				.movie-card {
					padding: 1rem;
					background: rgba(255, 255, 255, 0.05);
					border: 1px solid rgba(168, 85, 247, 0.2);
					border-radius: 8px;
					transition: all 0.3s ease;

					&:hover {
						border-color: #a855f7;
						transform: translateY(-2px);
					}

					h3 {
						color: white;
						margin: 0 0 0.5rem 0;
						font-size: 1.1rem;
					}

					p {
						color: rgba(255, 255, 255, 0.7);
						margin: 0.25rem 0;
						font-size: 0.9rem;
					}
				}
			}
		}
	}
</style>
