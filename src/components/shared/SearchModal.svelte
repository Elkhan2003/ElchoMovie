<script lang="ts">
	import { Search, X, Image, LoaderCircle } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { useGetSearchQuery } from '../../api/search';
	import { portal } from 'svelte-portal';

	interface Props {
		isOpen: boolean;
		onClose: () => void;
	}

	let { isOpen, onClose }: Props = $props();
	let searchInput = $state<string>('');

	const searchQuery = $derived(
		useGetSearchQuery(
			{ page: 1, search: searchInput.trim() },
			{ enabled: !!searchInput.trim() }
		)
	);

	const { data: searchData, isLoading, error } = $derived($searchQuery);
	const allResults = $derived(searchData?.results || []);
	const totalResults = $derived(searchData?.total_results || 0);

	// Упрощенные утилиты
	const getItemInfo = (item: ISearch) => {
		const date = item.release_date || item.first_air_date;
		const year = date ? new Date(date).getFullYear().toString() : 'Неизвестно';
		const rating = item.vote_average?.toFixed(1) || '0.0';
		const title = item.title || item.name || '';

		const typeMap = { movie: 'Фильм', tv: 'Сериал', person: 'Персона' };
		const type =
			typeMap[item.media_type as keyof typeof typeMap] || 'Неизвестно';

		return { year, rating, title, type };
	};

	const truncateTitle = (title: string, maxLength = 20) => {
		if (title.length <= maxLength) return title;
		const words = title.split(' ');
		let result = '';
		for (const word of words) {
			const newResult = result + (result ? ' ' : '') + word;
			if (newResult.length > maxLength) break;
			result = newResult;
		}
		return result + '...';
	};

	const closeModal = () => {
		onClose();
		searchInput = '';
	};

	const handleItemClick = (item: ISearch) => {
		closeModal();
		goto(`/${item.media_type}/${item.id}`);
	};

	// Упрощенное склонение
	const getResultsText = (count: number) => {
		const lastDigit = count % 10;
		const lastTwoDigits = count % 100;
		if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return 'ов';
		if (lastDigit === 1) return '';
		if (lastDigit >= 2 && lastDigit <= 4) return 'а';
		return 'ов';
	};

	// Управление overflow body
	$effect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
			return () => {
				document.body.style.overflow = '';
			};
		}
	});
</script>

<div
	use:portal={'body'}
	class="modal-overlay"
	class:active={isOpen}
	role="dialog"
	aria-modal="true"
	aria-label="Поиск фильмов и сериалов"
>
	<div class="modal-content">
		<button class="close-btn" onclick={closeModal} aria-label="Закрыть поиск">
			<X />
		</button>

		<div class="search-section">
			<h1 class="title">Поиск</h1>
			<div class="search-wrapper">
				<Search class="search-icon" size={20} />
				<input
					type="text"
					bind:value={searchInput}
					placeholder="Название фильма, сериала или актёра"
					class="search-input"
				/>
			</div>
		</div>

		<div class="results-section">
			{#if isLoading && searchInput.trim()}
				<div class="state-message">
					<LoaderCircle class="loading-icon" size={24} />
					<p>Поиск...</p>
				</div>
			{:else if error}
				<div class="state-message error">
					<p>Произошла ошибка при поиске</p>
					<button class="retry-btn" onclick={() => (searchInput = searchInput)}>
						Повторить поиск
					</button>
				</div>
			{:else if allResults.length > 0 && searchInput.trim()}
				<div class="results">
					<p class="results-info">
						Найдено {totalResults} результат{getResultsText(totalResults)}
						для "{searchInput.trim()}"
					</p>
					<div class="results-grid">
						{#each allResults as item (item.id)}
							{@const info = getItemInfo(item)}
							<button
								class="result-item"
								onclick={() => handleItemClick(item)}
								aria-label="Открыть {info.title}"
							>
								<div class="poster">
									{#if item.poster_path}
										<img
											src="https://image.tmdb.org/t/p/w500{item.poster_path}"
											alt="Постер {info.title}"
											class="poster-image"
											loading="lazy"
										/>
									{:else}
										<div class="poster-placeholder">
											<Image size={48} />
											<span>Нет изображения</span>
										</div>
									{/if}
								</div>

								<div class="info">
									<h3 class="title-section">
										<span
											class="rating rating-{parseFloat(info.rating) >= 7
												? 'good'
												: parseFloat(info.rating) >= 5
													? 'average'
													: 'poor'}"
										>
											{info.rating}
										</span>
										<span class="name" title={info.title}>
											{truncateTitle(info.title)}
										</span>
									</h3>
									<div class="meta">
										<span>{info.year} • {info.type}</span>
									</div>
								</div>
							</button>
						{/each}
					</div>
				</div>
			{:else if searchInput.trim() && !isLoading}
				<div class="state-message">
					<p>Ничего не найдено для "{searchInput.trim()}"</p>
					<p class="suggestion">Попробуйте изменить поисковый запрос</p>
				</div>
			{:else}
				<div class="state-message welcome">
					<Search size={48} />
					<p>Введите название фильма, сериала или имя актёра</p>
				</div>
			{/if}
		</div>
	</div>
</div>

<style lang="scss">
	.modal-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.85);
		backdrop-filter: blur(12px);
		display: flex;
		justify-content: center;
		z-index: 99999;
		opacity: 1;
		visibility: visible;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

		visibility: hidden;
		opacity: 0;
		&.active {
			visibility: visible;
			opacity: 1;
		}
	}

	.modal-content {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		position: relative;
		animation: slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.1s both;
	}

	.close-btn {
		position: absolute;
		top: 2rem;
		right: 2rem;
		width: 2.5rem;
		height: 2.5rem;
		background: rgba(255, 255, 255, 0.1);
		border: none;
		color: white;
		border-radius: 50%;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
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
	}

	.search-section {
		padding: 2.5rem 4rem 1rem;

		.title {
			color: white;
			font-size: 3rem;
			font-weight: 700;
			margin-bottom: 20px;
		}

		.search-wrapper {
			position: relative;
			display: flex;
			align-items: center;

			:global(.search-icon) {
				position: absolute;
				left: 12px;
				color: rgba(255, 255, 255, 0.6);
				z-index: 1;
			}

			:global(.search-input) {
				flex: 1;
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
				padding: 13px 3.5rem 13px 2.7rem;
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
			}
		}
	}

	.results-section {
		flex: 1;
		padding: 2rem 4rem;
		overflow-y: auto;

		&::-webkit-scrollbar {
			width: 6px;
		}

		&::-webkit-scrollbar-track {
			background: rgba(255, 255, 255, 0.05);
		}

		&::-webkit-scrollbar-thumb {
			background: rgba(255, 255, 255, 0.2);
			border-radius: 3px;

			&:hover {
				background: rgba(255, 255, 255, 0.3);
			}
		}
	}

	.state-message {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		color: rgba(255, 255, 255, 0.8);
		text-align: center;
		padding: 3rem 2rem;

		&.welcome {
			color: rgba(255, 255, 255, 0.6);

			:global(svg) {
				margin-bottom: 1rem;
				opacity: 0.5;
			}
		}

		&.error {
			.retry-btn {
				margin-top: 1rem;
				background: linear-gradient(135deg, #dc2626, #ef4444);
				border: none;
				color: white;
				padding: 8px 16px;
				border-radius: 8px;
				font-size: 14px;
				cursor: pointer;
				transition: all 0.2s ease;

				&:hover {
					background: linear-gradient(135deg, #b91c1c, #dc2626);
				}
			}
		}

		:global(.loading-icon) {
			animation: spin 1s linear infinite;
			margin-bottom: 1rem;
		}

		.suggestion {
			font-size: 0.9rem;
			opacity: 0.7;
			margin-top: 0.5rem;
		}
	}

	.results {
		.results-info {
			color: rgba(255, 255, 255, 0.7);
			font-size: 0.9rem;
			margin-bottom: 1.5rem;
		}

		.results-grid {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
			gap: 2rem;

			.result-item {
				background: transparent;
				border: none;
				border-radius: 16px;
				cursor: pointer;
				text-align: left;
				transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
				width: 100%;

				&:hover {
					transform: scale(1.02);

					.poster-image {
						transform: scale(1.05);
					}
				}

				&:active {
					transform: scale(0.98);
				}

				&:focus {
					outline: 2px solid rgba(200, 162, 255, 0.6);
					outline-offset: 4px;
				}

				.poster {
					position: relative;
					width: 100%;
					aspect-ratio: 2/3;
					border-radius: 16px;
					overflow: hidden;
					background: rgba(255, 255, 255, 0.05);
					display: flex;
					align-items: center;
					justify-content: center;

					.poster-image {
						width: 100%;
						height: 100%;
						object-fit: cover;
						transition: transform 0.3s ease;
					}

					.poster-placeholder {
						display: flex;
						flex-direction: column;
						align-items: center;
						gap: 0.5rem;
						color: rgba(255, 255, 255, 0.6);
						font-size: 0.8rem;
						background: linear-gradient(
							135deg,
							rgba(95, 0, 215, 0.1),
							rgba(200, 162, 255, 0.05)
						);
						border: 2px dashed rgba(255, 255, 255, 0.2);
						border-radius: 16px;
						width: 100%;
						height: 100%;
						justify-content: center;
					}
				}

				.info {
					padding: 10px 0 20px;

					.title-section {
						display: flex;
						align-items: center;
						gap: 0.5rem;
						color: white;

						.rating {
							border-radius: 10px;
							color: white;
							font-size: 14px;
							font-weight: 600;
							min-width: 45px;
							padding: 7px 12px;
							text-align: center;

							&-good {
								background: linear-gradient(135deg, #059669, #10b981);
							}

							&-average {
								background: linear-gradient(135deg, #d97706, #f59e0b);
							}

							&-poor {
								background: linear-gradient(135deg, #dc2626, #ef4444);
							}
						}

						.name {
							font-size: 1.1rem;
							font-weight: 700;
							line-height: 1.3;
						}
					}

					.meta {
						margin: 5px 0;
						color: rgba(255, 255, 255, 0.7);
						font-size: 0.9rem;
					}
				}
			}
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
</style>
