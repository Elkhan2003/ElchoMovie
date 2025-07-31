<script lang="ts">
	import { Star, Play } from '@lucide/svelte';

	interface MovieItem {
		id: number;
		title: string;
		poster_path: string;
		vote_average: number;
		release_date: string;
		overview: string;
		media_type: string;
	}

	interface Props {
		items: MovieItem[];
		loading?: boolean;
	}

	let { items, loading = false }: Props = $props();

	const processedItems = $derived(
		items.map((item) => ({
			...item,
			posterUrl: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
			ratingColor: getRatingColor(item.vote_average),
			formattedRating: item.vote_average.toFixed(1)
		}))
	);

	const getRatingColor = (rating: number): string => {
		if (rating >= 8) return '#10b981';
		if (rating >= 6) return '#f59e0b';
		return '#ef4444';
	};

	const handleItemClick = (item: MovieItem) => {
		console.log('Item clicked:', item);
	};

	const handlePlayClick = (item: MovieItem, event: Event) => {
		event.stopPropagation();
		console.log('playClick:', item);
	};

	const skeletonItems = $derived(Array.from({ length: 6 }, (_, i) => i));
</script>

<div class="movie_list">
	<!-- Loading Skeleton -->
	{#if loading}
		<div class="movie_grid">
			{#each skeletonItems as i (`skeleton-${i}`)}
				<div class="movie_item movie_item--skeleton">
					<div class="movie_item_inner">
						<div class="movie_item_poster skeleton_poster"></div>
						<div class="movie_item_info">
							<div class="skeleton_title"></div>
							<div class="skeleton_date"></div>
							<div class="skeleton_overview"></div>
							<div class="movie_item_meta">
								<div class="skeleton_type"></div>
								<div class="skeleton_rating"></div>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<!-- Movie Grid -->
		<div class="movie_grid">
			{#each processedItems as processedItem (processedItem.id)}
				<div
					class="movie_item"
					role="button"
					tabindex="0"
					aria-label={`View details for ${processedItem.title}`}
					onclick={() => handleItemClick(processedItem)}
					onkeydown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							e.preventDefault();
							handleItemClick(processedItem);
						}
					}}
				>
					<div class="movie_item_inner">
						<!-- Poster -->
						<div class="movie_item_poster">
							<img
								src={processedItem.posterUrl}
								alt={processedItem.title}
								class="movie_item_image"
								loading="lazy"
								decoding="async"
							/>
							<div class="movie_item_overlay">
								<div class="movie_item_rating">
									<Star class="rating_icon" size={16} fill="currentColor" />
									<span class="rating_value">
										{processedItem.formattedRating}
									</span>
								</div>
								<button
									class="movie_item_play"
									onclick={(event) => handlePlayClick(processedItem, event)}
									aria-label="Play"
									type="button"
								>
									<Play class="play_icon" size={24} fill="currentColor" />
								</button>
							</div>
						</div>

						<!-- Info -->
						<div class="movie_item_info">
							<h3 class="movie_item_title">{processedItem.title}</h3>
							<p class="movie_item_date">{processedItem.release_date}</p>
							<p class="movie_item_overview">{processedItem.overview}</p>
							<div class="movie_item_meta">
								<span class="movie_item_type">{processedItem.media_type}</span>
								<div class="movie_item_rating_badge">
									<span
										class="rating_badge"
										style="color: {processedItem.ratingColor}"
									>
										{processedItem.formattedRating}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style lang="scss">
	.movie_list {
		.movie_grid {
			display: flex;
			gap: 2rem;
			overflow-x: auto;
			overflow-y: hidden;
			padding: 1rem 0 2rem 0;
			scroll-behavior: smooth;
			// Добавляем will-change для оптимизации анимаций
			will-change: scroll-position;

			/* Custom scrollbar */
			&::-webkit-scrollbar {
				height: 8px;
			}

			&::-webkit-scrollbar-track {
				background: rgba(255, 255, 255, 0.1);
				border-radius: 10px;
			}

			&::-webkit-scrollbar-thumb {
				background: linear-gradient(45deg, #8b5cf6, #a855f7);
				border-radius: 10px;

				&:hover {
					background: linear-gradient(45deg, #7c3aed, #9333ea);
				}
			}

			@media (max-width: 768px) {
				gap: 1.5rem;
			}

			.movie_item {
				background: rgba(255, 255, 255, 0.08);
				border-radius: 20px;
				overflow: hidden;
				border: 1px solid rgba(139, 92, 246, 0.2);
				backdrop-filter: blur(10px);
				transition: all 0.3s ease;
				cursor: pointer;
				flex: 0 0 280px;
				// Оптимизация для GPU рендеринга
				transform: translateZ(0);
				will-change: transform;

				@media (max-width: 768px) {
					flex: 0 0 250px;
				}

				&:hover {
					transform: translateY(-10px) translateZ(0);
					border-color: rgba(139, 92, 246, 0.4);
					box-shadow: 0 20px 40px rgba(139, 92, 246, 0.2);
					@media (max-width: 768px) {
						box-shadow: none;
					}

					.movie_item_image {
						transform: scale(1.1);
					}

					.movie_item_overlay {
						opacity: 1;
					}
				}

				&--skeleton {
					cursor: default;

					&:hover {
						transform: translateZ(0);
						border-color: rgba(139, 92, 246, 0.2);
						box-shadow: none;
					}
				}

				.movie_item_inner {
					height: 100%;
					display: flex;
					flex-direction: column;
				}

				.movie_item_poster {
					position: relative;
					aspect-ratio: 2/3;
					overflow: hidden;
					// Оптимизация изображений
					contain: layout style paint;

					.movie_item_image {
						width: 100%;
						height: 100%;
						object-fit: cover;
						transition: transform 0.3s ease;
						// Предотвращение layout shift
						display: block;
					}

					&.skeleton_poster {
						background: linear-gradient(
							90deg,
							rgba(255, 255, 255, 0.1) 25%,
							rgba(255, 255, 255, 0.2) 50%,
							rgba(255, 255, 255, 0.1) 75%
						);
						background-size: 200% 100%;
						animation: shimmer 2s infinite;
					}

					.movie_item_overlay {
						position: absolute;
						inset: 0;
						background: linear-gradient(
							45deg,
							rgba(139, 92, 246, 0.8),
							rgba(168, 85, 247, 0.8)
						);
						display: flex;
						align-items: center;
						justify-content: center;
						opacity: 0;
						transition: opacity 0.3s ease;
						// Оптимизация композитного слоя
						will-change: opacity;

						.movie_item_rating {
							position: absolute;
							top: 1rem;
							right: 1rem;
							background: rgba(0, 0, 0, 0.7);
							padding: 0.5rem;
							border-radius: 50px;
							display: flex;
							align-items: center;
							gap: 0.25rem;
							color: #fbbf24;

							:global(.rating_icon) {
								width: 16px;
								height: 16px;
							}

							.rating_value {
								font-size: 0.9rem;
								font-weight: 600;
								color: white;
							}
						}

						.movie_item_play {
							width: 60px;
							height: 60px;
							background: rgba(255, 255, 255, 0.2);
							border-radius: 50%;
							display: flex;
							align-items: center;
							justify-content: center;
							backdrop-filter: blur(10px);
							border: 2px solid rgba(255, 255, 255, 0.3);
							transition: all 0.3s ease;
							will-change: transform;

							&:hover {
								background: rgba(255, 255, 255, 0.3);
								transform: scale(1.1);
							}

							:global(.play_icon) {
								color: white;
								margin-left: 3px;
							}
						}
					}
				}

				.movie_item_info {
					padding: 1.5rem;
					flex: 1;
					display: flex;
					flex-direction: column;

					.movie_item_title {
						color: white;
						font-size: 1.1rem;
						font-weight: 600;
						margin: 0 0 0.5rem 0;
						line-height: 1.4;
						display: -webkit-box;
						line-clamp: 2;
						-webkit-box-orient: vertical;
						overflow: hidden;
						word-break: break-word;
					}

					.movie_item_date {
						color: rgba(255, 255, 255, 0.6);
						font-size: 0.9rem;
						margin: 0 0 1rem 0;
					}

					.movie_item_overview {
						color: rgba(255, 255, 255, 0.7);
						font-size: 0.9rem;
						line-height: 1.5;
						margin: 0 0 1rem 0;
						flex: 1;
						display: -webkit-box;
						line-clamp: 3;
						-webkit-box-orient: vertical;
						overflow: hidden;
						word-break: break-word;
					}

					.movie_item_meta {
						display: flex;
						justify-content: space-between;
						align-items: center;
						margin-top: auto;

						.movie_item_type {
							background: rgba(139, 92, 246, 0.2);
							color: #c084fc;
							padding: 0.25rem 0.75rem;
							border-radius: 15px;
							font-size: 0.8rem;
							font-weight: 500;
							text-transform: uppercase;
						}

						.movie_item_rating_badge {
							.rating_badge {
								font-weight: 600;
								font-size: 0.9rem;
							}
						}
					}

					// Skeleton styles с содержанием layout и style
					.skeleton_title,
					.skeleton_date,
					.skeleton_overview,
					.skeleton_type,
					.skeleton_rating {
						background: linear-gradient(
							90deg,
							rgba(255, 255, 255, 0.1) 25%,
							rgba(255, 255, 255, 0.2) 50%,
							rgba(255, 255, 255, 0.1) 75%
						);
						background-size: 200% 100%;
						animation: shimmer 2s infinite;
						border-radius: 4px;
						contain: layout style;
					}

					.skeleton_title {
						height: 1.5rem;
						margin-bottom: 0.5rem;
					}

					.skeleton_date {
						height: 1rem;
						width: 60%;
						margin-bottom: 1rem;
					}

					.skeleton_overview {
						height: 3rem;
						margin-bottom: 1rem;
						flex: 1;
					}

					.skeleton_type {
						height: 1.5rem;
						width: 60px;
						border-radius: 15px;
					}

					.skeleton_rating {
						height: 1rem;
						width: 30px;
					}
				}
			}
		}
	}

	@keyframes shimmer {
		0% {
			background-position: -200% 0;
		}
		100% {
			background-position: 200% 0;
		}
	}
</style>
