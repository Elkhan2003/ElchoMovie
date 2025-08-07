<script lang="ts">
	import { Search, X, Image, LoaderCircle } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { useGetSearchQuery } from '../../api/search';

	// Props
	interface Props {
		isOpen: boolean;
		onClose: () => void;
	}

	let { isOpen, onClose }: Props = $props();

	// State
	let searchInput = $state<string>('');
	let debouncedSearchInput = $state<string>('');
	let debounceTimer: number | undefined = $state();
	let searchInputElement: HTMLInputElement | undefined = $state();

	// Search API query
	const searchQuery = $derived(
		useGetSearchQuery({
			page: 1,
			search: debouncedSearchInput
		})
	);
	const { data: searchData, isLoading, error } = $derived($searchQuery);

	// Computed values
	const allResults = $derived(searchData?.results || []);
	const totalResults = $derived(searchData?.total_results || 0);

	// Utility functions
	const getYearFromDate = (dateString: string | undefined): string => {
		if (!dateString) return 'Неизвестно';
		try {
			return new Date(dateString).getFullYear().toString();
		} catch {
			return 'Неизвестно';
		}
	};

	const getItemYear = (item: ISearch): string => {
		const dateString = item.release_date || item.first_air_date;
		return getYearFromDate(dateString);
	};

	const getRating = (item: ISearch): string => {
		const rating = item.vote_average;
		return rating ? rating.toFixed(1) : '0.0';
	};

	const truncateTitle = (title?: string, maxLength: number = 20): string => {
		if (!title) return '';
		if (title.length <= maxLength) return title;
		const words = title.split(' ');
		let result = '';
		for (const word of words) {
			if ((result + word).length > maxLength) {
				break;
			}
			result += (result ? ' ' : '') + word;
		}
		return result + '...';
	};

	// Debounce function
	const debouncedSearch = (value: string) => {
		if (debounceTimer) {
			clearTimeout(debounceTimer);
		}
		debounceTimer = setTimeout(() => {
			debouncedSearchInput = value;
		}, 300);
	};

	// Event handlers
	const closeModal = () => {
		onClose();
		searchInput = '';
		debouncedSearchInput = '';
		if (debounceTimer) {
			clearTimeout(debounceTimer);
		}
	};

	const handleItemClick = (item: ISearch) => {
		closeModal();
		if (item.media_type === 'movie') {
			goto(`/movie/${item.id}`);
		} else if (item.media_type === 'tv') {
			goto(`/tv/${item.id}`);
		} else if (item.media_type === 'person') {
			goto(`/person/${item.id}`);
		}
	};

	// Handle keyboard shortcuts
	const handleKeydown = (event: KeyboardEvent) => {
		if (event.key === 'Escape') {
			closeModal();
		}
	};

	// Handle keyboard events for result items
	const handleResultItemKeydown = (event: KeyboardEvent, item: ISearch) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			handleItemClick(item);
		}
	};

	// Handle overlay keyboard events
	const handleOverlayKeydown = (event: KeyboardEvent) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			closeModal();
		}
	};

	// Focus management
	const focusSearchInput = () => {
		if (searchInputElement) {
			// Small delay to ensure the element is rendered and accessible
			setTimeout(() => {
				searchInputElement?.focus();
			}, 100);
		}
	};

	// Debounce search input
	$effect(() => {
		debouncedSearch(searchInput);
	});

	// Handle modal open/close and focus management
	$effect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
			focusSearchInput();
			return () => {
				document.body.style.overflow = '';
			};
		}
	});
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isOpen}
	<div
		class="modal_overlay"
		onclick={closeModal}
		onkeydown={handleOverlayKeydown}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
		aria-labelledby="search-modal-title"
	>
		<div class="modal_content">
			<button class="close_btn" onclick={closeModal} aria-label="Закрыть поиск">
				<X />
			</button>

			<div class="search_content">
				<h1 id="search-modal-title" class="search_title">Поиск</h1>
				<div class="search_input_wrapper">
					<Search class="search_icon" size={20} />
					<input
						bind:this={searchInputElement}
						bind:value={searchInput}
						type="text"
						placeholder="Название фильма/сериала"
						class="search_input"
						aria-label="Поле поиска фильмов и сериалов"
					/>
				</div>
			</div>

			<div class="results_content">
				<!-- Состояние загрузки -->
				{#if isLoading}
					<div class="loading_state" aria-live="polite">
						<LoaderCircle class="loading_icon" size={24} />
						<p>Поиск...</p>
					</div>
				{:else if error}
					<!-- Состояние ошибки -->
					<div class="error_state" role="alert" aria-live="assertive">
						<p>Произошла ошибка при поиске</p>
					</div>
				{:else if allResults.length > 0 && debouncedSearchInput.trim()}
					<!-- Результаты поиска -->
					<div class="search_results">
						<div class="results_info">
							<p class="results_count" aria-live="polite">
								Найдено {totalResults} результатов
							</p>
						</div>

						<div
							class="results_grid"
							role="grid"
							aria-label="Результаты поиска"
						>
							{#each allResults as item (item.id)}
								<button
									class="result_item"
									onclick={() => handleItemClick(item)}
									onkeydown={(event) => handleResultItemKeydown(event, item)}
									role="gridcell"
									aria-label="Открыть {item.title ||
										item.name}, {item.media_type === 'movie'
										? 'Фильм'
										: item.media_type === 'tv'
											? 'Сериал'
											: 'Персона'}, {getItemYear(item)}, рейтинг {getRating(
										item
									)}"
								>
									<div class="result_poster">
										{#if item.poster_path}
											<img
												src="https://image.tmdb.org/t/p/w500{item.poster_path}"
												alt=""
												class="poster_image"
												loading="lazy"
												decoding="async"
											/>
										{:else}
											<div class="poster_placeholder">
												<Image
													size={48}
													class="placeholder_icon"
													aria-hidden="true"
												/>
												<span class="placeholder_text">Нет изображения</span>
											</div>
										{/if}
									</div>

									<div class="result_info">
										<h3 class="result_title">
											<span
												class="rating_badge"
												aria-label="Рейтинг {getRating(item)}"
												>{getRating(item)}</span
											>
											<span class="cinema_name">
												{truncateTitle(item.title || item.name)}
											</span>
										</h3>

										<div class="result_meta">
											<span class="result_year">{getItemYear(item)},</span>
											<span class="result_type">
												{item.media_type === 'movie'
													? 'Фильм'
													: item.media_type === 'tv'
														? 'Сериал'
														: 'Персона'}
											</span>
										</div>
									</div>
								</button>
							{/each}
						</div>
					</div>
				{:else if debouncedSearchInput.trim() && !isLoading}
					<!-- Нет результатов -->
					<div class="no_results" role="status" aria-live="polite">
						<p>Ничего не найдено для "{debouncedSearchInput}"</p>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style lang="scss">
	.modal_overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: rgba(0, 0, 0, 0.8);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		display: flex;
		align-items: flex-start;
		justify-content: center;
		z-index: 99999;
		padding: 0;
		animation: fadeIn 0.3s ease;

		&:focus {
			outline: none;
		}

		.modal_content {
			width: 100%;
			height: 100%;
			background: transparent;
			position: relative;
			display: flex;
			flex-direction: column;
			animation: slideIn 0.3s ease 0.1s both;
			pointer-events: none; /* Предотвращаем клики на контенте */

			/* Делаем интерактивными только дочерние элементы */
			> * {
				pointer-events: auto;
			}

			.close_btn {
				position: absolute;
				top: 2rem;
				right: 2rem;
				width: 2.5rem;
				height: 2.5rem;
				background: rgba(255, 255, 255, 0.1);
				border: none;
				color: white;
				cursor: pointer;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 50%;
				transition: all 0.2s ease;
				z-index: 10;
				backdrop-filter: blur(10px);

				&:hover {
					background: rgba(255, 255, 255, 0.2);
					transform: scale(1.1);
				}

				&:active {
					transform: scale(0.95);
				}

				&:focus {
					outline: 2px solid rgba(139, 92, 246, 0.6);
					outline-offset: 2px;
				}
			}

			.search_content {
				padding: 2.5rem 4rem 1rem 4rem;
				margin: 0 auto;
				width: 100%;

				.search_title {
					color: white;
					font-size: 3rem;
					font-weight: 700;
					margin-bottom: 20px;
					text-align: left;
					font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
						sans-serif;
				}

				.search_input_wrapper {
					position: relative;
					display: flex;
					align-items: center;

					:global(.search_icon) {
						position: absolute;
						left: 12px;
						color: rgba(255, 255, 255, 0.6);
						z-index: 1;
						transition: color 0.3s ease;
					}

					.search_input {
						width: 100%;
						background: transparent;
						border: none;
						border-bottom: 1.5px solid transparent;
						border-image: linear-gradient(
								90deg,
								rgba(255, 255, 255, 0.1),
								rgba(200, 162, 255, 0.6),
								rgba(255, 255, 255, 0.1)
							)
							1;
						color: #ffffffba;
						font-size: 16px;
						padding: 13px 0 13px 2.7rem;
						outline: none;
						transition: all 0.3s ease;

						&::placeholder {
							color: rgba(255, 255, 255, 0.6);
						}

						&:focus {
							border-image: linear-gradient(
									90deg,
									rgba(147, 112, 219, 0.4),
									rgba(200, 162, 255, 0.9),
									rgba(147, 112, 219, 0.4)
								)
								1;
						}

						&:focus + :global(.search_icon) {
							color: rgba(255, 255, 255, 0.8);
						}
					}
				}
			}

			.results_content {
				flex: 1;
				padding: 2rem 4rem;
				overflow-y: auto;
				scroll-behavior: smooth;

				.loading_state,
				.error_state,
				.no_results {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					color: rgba(255, 255, 255, 0.8);
					text-align: center;
					padding: 2rem;

					:global(.loading_icon) {
						animation: spin 1s linear infinite;
						margin-bottom: 1rem;
					}
				}

				.search_results {
					.results_info {
						margin-bottom: 1.5rem;

						.results_count {
							color: rgba(255, 255, 255, 0.7);
							font-size: 0.9rem;
							margin: 0;
						}
					}

					.results_grid {
						display: grid;
						grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
						gap: 2rem;
						margin-bottom: 2rem;

						.result_item {
							border-radius: 16px;
							padding: 0;
							cursor: pointer;
							transition: all 0.7s ease;
							overflow: hidden;
							background: transparent;
							border: none;
							text-align: left;
							width: 100%;

							&:hover {
								transform: scale(1.02);
							}

							&:focus {
								outline: 2px solid rgba(139, 92, 246, 0.6);
								outline-offset: 2px;
							}

							&:active {
								transform: scale(0.98);
							}

							.result_poster {
								position: relative;
								display: flex;
								justify-content: center;
								align-items: center;
								width: 100%;
								border-radius: 16px;
								overflow: hidden;
								aspect-ratio: 2/3;
								background: rgba(255, 255, 255, 0.05);

								.poster_image {
									width: 100%;
									height: 100%;
									object-fit: cover;
									transition: transform 0.3s ease;
								}

								.poster_placeholder {
									width: 100%;
									height: 100%;
									display: flex;
									flex-direction: column;
									align-items: center;
									justify-content: center;
									background: linear-gradient(
										135deg,
										rgba(95, 0, 215, 0.1) 0%,
										rgba(200, 162, 255, 0.05) 100%
									);
									border: 2px dashed rgba(255, 255, 255, 0.2);
									border-radius: 16px;
									gap: 0.5rem;

									:global(.placeholder_icon) {
										color: rgba(255, 255, 255, 0.4);
										margin-bottom: 0.5rem;
									}

									.placeholder_text {
										color: rgba(255, 255, 255, 0.6);
										font-size: 0.8rem;
										font-weight: 500;
										text-align: center;
									}
								}
							}

							.result_info {
								padding: 10px 0 20px 0;
								position: relative;

								.result_title {
									display: flex;
									align-items: center;
									gap: 0.5rem;
									color: white;

									.rating_badge {
										background: radial-gradient(
												50.11% 34.33% at 50.22% 91.67%,
												hsla(0, 0%, 100%, 0.3) 3.13%,
												hsla(0, 0%, 100%, 0.15) 41.15%,
												rgba(0, 0, 0, 0.15) 100%
											),
											linear-gradient(0deg, #5f00d7, #5f00d7);
										border-radius: 10px;
										color: #feffff;
										font-size: 14px;
										font-weight: 600;
										margin-left: 2px;
										min-width: 45px;
										padding: 7px 12px;
										text-align: center;
									}

									.cinema_name {
										font-size: 1.1rem;
										font-weight: 700;
										margin-bottom: 0.5rem;
										line-height: 1.3;
										display: -webkit-box;
										-webkit-box-orient: vertical;
										overflow: hidden;
										margin-top: 0.5rem;
									}
								}

								.result_meta {
									margin: 5px 0;
									display: flex;
									align-items: center;
									gap: 0.5rem;

									.result_year,
									.result_type {
										color: rgba(255, 255, 255, 0.7);
										font-size: 0.9rem;
										font-weight: 500;
									}
								}
							}
						}
					}
				}
			}
		}
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			backdrop-filter: blur(0px);
			-webkit-backdrop-filter: blur(0px);
		}
		to {
			opacity: 1;
			backdrop-filter: blur(10px);
			-webkit-backdrop-filter: blur(10px);
		}
	}

	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	// Responsive design
	@media (max-width: 1200px) {
		.modal_content .results_content .search_results .results_grid {
			grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
			gap: 1.5rem;
		}
	}

	@media (max-width: 768px) {
		.modal_content {
			.search_content {
				padding: 2rem 2rem 1rem 2rem;

				.search_title {
					font-size: 2.5rem;
				}
			}

			.results_content {
				padding: 1rem 2rem;

				.search_results .results_grid {
					grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
					gap: 1rem;
				}
			}
		}
	}
</style>
