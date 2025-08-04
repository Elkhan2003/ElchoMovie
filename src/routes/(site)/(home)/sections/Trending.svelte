<script lang="ts">
	import { Star } from '@lucide/svelte';
	import { useGetTrendingQuery } from '../../../../api/trending';
	import MovieList from '../../../../components/shared/MovieList.svelte';

	let dateSwitcher = $state<'day' | 'week'>('day');
	let sortRatingDesc = $state<boolean>(true);

	const trendingQuery = $derived(useGetTrendingQuery(dateSwitcher));
	const {
		data: trendingData,
		isLoading: isLoadingTrending,
		error: isErrorTrending
	} = $derived($trendingQuery);

	// Computed свойство для отсортированных данных
	const sortedTrendingData = $derived(() => {
		if (!trendingData?.results) return [];

		const results = [...trendingData.results];

		return results.sort((a, b) => {
			if (sortRatingDesc) {
				return b.vote_average - a.vote_average;
			} else {
				return a.vote_average - b.vote_average;
			}
		});
	});

	const handleSwitchDate = async (date: 'day' | 'week') => {
		dateSwitcher = date;
	};

	const handleRatingSort = () => {
		sortRatingDesc = !sortRatingDesc;
	};

	// Обработчики событий для MovieList
	const handleMovieClick = (item: any) => {
		console.log('Movie clicked:', item);
		// Здесь можно добавить навигацию к детальной странице фильма
		// goto(`/movie/${item.id}`);
	};

	const handlePlayClick = (item: any) => {
		console.log('Play clicked:', item);
		// Здесь можно добавить логику воспроизведения трейлера
	};

	const handleReload = () => {
		window.location.reload();
	};
</script>

<section class="trending">
	<div class="container">
		<div class="trending_content">
			<!-- Header Section -->
			<div class="trending_header">
				<div class="trending_title_section">
					<h1 class="trending_title">Trending</h1>
					<p class="trending_subtitle">Discover what's popular right now</p>
				</div>

				<div class="trending_controls">
					<!-- Rating Sort Switch -->
					<div class="rating_sort">
						<div class="rating_sort_label">
							<Star class="rating_sort_icon" size={16} fill="currentColor" />
							<span class="rating_sort_text">
								{sortRatingDesc ? 'Высокий → Низкий' : 'Низкий → Высокий'}
							</span>
						</div>
						<button
							onclick={handleRatingSort}
							class="rating_switch"
							class:rating_switch--active={sortRatingDesc}
							aria-label="Toggle rating sort"
						>
							<div class="rating_switch_thumb"></div>
						</button>
					</div>

					<!-- Date Switcher -->
					<div class="date_switcher">
						<button
							onclick={() => handleSwitchDate('day')}
							class="date_switcher_btn"
							class:date_switcher_btn--active={dateSwitcher === 'day'}
						>
							<span class="date_switcher_btn_text">Today</span>
						</button>
						<button
							onclick={() => handleSwitchDate('week')}
							class="date_switcher_btn"
							class:date_switcher_btn--active={dateSwitcher === 'week'}
						>
							<span class="date_switcher_btn_text">This Week</span>
						</button>
					</div>
				</div>
			</div>

			<!-- Content Section -->
			<div class="trending_main">
				<!-- Error State -->
				{#if isErrorTrending}
					<div class="trending_error">
						<div class="error_icon">⚠️</div>
						<p class="error_text">Failed to load trending content</p>
						<button class="error_retry_btn" onclick={handleReload}>
							Try Again
						</button>
					</div>
				{:else}
					<!-- Movie List Component -->
					<MovieList
						items={sortedTrendingData()}
						loading={isLoadingTrending}
						maxOverviewLength={80}
					/>
				{/if}
			</div>
		</div>
	</div>
</section>

<style lang="scss">
	.trending {
		position: relative;
		padding: 30px 0;
		overflow: hidden;

		.trending_content {
			position: relative;
			z-index: 10;
		}

		.trending_header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 1rem;
			padding-bottom: 1rem;
			border-bottom: 1px solid rgba(139, 92, 246, 0.1);

			@media (max-width: 768px) {
				flex-direction: column;
				gap: 2rem;
				text-align: center;
			}

			.trending_title_section {
				.trending_title {
					display: flex;
					align-items: center;
					gap: 1rem;
					font-size: 3rem;
					font-weight: bold;
					background: linear-gradient(45deg, #ffffff, #c084fc);
					-webkit-background-clip: text;
					-webkit-text-fill-color: transparent;
					background-clip: text;
					margin: 0 0 0.5rem 0;

					@media (max-width: 768px) {
						justify-content: center;
						font-size: 2.5rem;
					}
				}

				.trending_subtitle {
					color: rgba(255, 255, 255, 0.7);
					font-size: 1.1rem;
					margin: 0;
				}
			}

			.trending_controls {
				display: flex;
				align-items: center;
				gap: 1.5rem;

				@media (max-width: 768px) {
					flex-direction: column;
					gap: 1rem;
					width: 100%;
				}

				.rating_sort {
					display: flex;
					align-items: center;
					gap: 1rem;
					padding: 0.75rem 1rem;
					background: rgba(255, 255, 255, 0.08);
					border-radius: 50px;
					backdrop-filter: blur(10px);
					transition: all 0.3s ease;

					&:hover {
						border-color: rgba(139, 92, 246, 0.3);
						background: rgba(255, 255, 255, 0.12);
					}

					.rating_sort_label {
						display: flex;
						align-items: center;
						gap: 0.5rem;
						color: rgba(255, 255, 255, 0.8);
						font-size: 0.9rem;
						font-weight: 500;

						:global(.rating_sort_icon) {
							color: #fbbf24;
						}

						.rating_sort_text {
							white-space: nowrap;

							@media (max-width: 768px) {
								font-size: 0.8rem;
							}
						}
					}

					.rating_switch {
						position: relative;
						width: 44px;
						height: 24px;
						background: rgba(255, 255, 255, 0.2);
						border: 1px solid rgba(139, 92, 246, 0.3);
						border-radius: 12px;
						cursor: pointer;
						transition: all 0.3s ease;

						&:hover {
							background: rgba(255, 255, 255, 0.3);
						}

						&--active {
							background: linear-gradient(45deg, #8b5cf6, #a855f7);
							border-color: transparent;

							.rating_switch_thumb {
								transform: translateX(20px);
							}
						}

						.rating_switch_thumb {
							position: absolute;
							top: 2px;
							left: 2px;
							width: 18px;
							height: 18px;
							background: white;
							border-radius: 50%;
							transition: transform 0.3s ease;
						}
					}
				}

				.date_switcher {
					display: flex;
					gap: 5px;
					background: rgba(255, 255, 255, 0.08);
					border-radius: 50px;
					padding: 5px;
					backdrop-filter: blur(10px);
					border: 1px solid rgba(139, 92, 246, 0.2);
					transition: all 0.3s ease;

					&:hover {
						border-color: rgba(139, 92, 246, 0.3);
						background: rgba(255, 255, 255, 0.12);
					}

					.date_switcher_btn {
						background: transparent;
						border: none;
						padding: 0.75rem 1.5rem;
						border-radius: 25px;
						color: rgba(255, 255, 255, 0.7);
						font-weight: 500;
						cursor: pointer;
						transition: all 0.3s ease;
						position: relative;
						overflow: hidden;

						&::before {
							content: '';
							position: absolute;
							top: 0;
							left: 0;
							right: 0;
							bottom: 0;
							background: linear-gradient(45deg, #8b5cf6, #a855f7);
							opacity: 0;
							transition: opacity 0.3s ease;
						}

						.date_switcher_btn_text {
							position: relative;
							z-index: 2;
						}

						&:hover:not(.date_switcher_btn--active) {
							color: white;
							transform: translateY(-1px);

							&::before {
								opacity: 0.1;
							}
						}

						&--active {
							color: white;

							&::before {
								opacity: 1;
							}
						}
					}
				}
			}
		}

		.trending_main {
			.trending_error {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				min-height: 400px;
				gap: 1.5rem;

				.error_icon {
					font-size: 3rem;
				}

				.error_text {
					color: rgba(255, 255, 255, 0.7);
					font-size: 1.1rem;
					margin: 0;
				}

				.error_retry_btn {
					background: linear-gradient(45deg, #8b5cf6, #a855f7);
					color: white;
					border: none;
					padding: 0.75rem 2rem;
					border-radius: 25px;
					font-weight: 500;
					cursor: pointer;
					transition: all 0.3s ease;

					&:hover {
						transform: translateY(-2px);
						box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
					}
				}
			}
		}
	}
</style>
