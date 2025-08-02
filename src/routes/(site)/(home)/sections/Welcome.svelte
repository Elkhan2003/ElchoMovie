<script lang="ts">
	import { Play, Star, ChevronLeft, ChevronRight, Pause } from '@lucide/svelte';
	import { useGetUpcomingQuery } from '../../../../api/upcoming';

	// Queries
	const upcomingQuery = useGetUpcomingQuery();
	const { data: upcomingData, isLoading } = $derived($upcomingQuery);

	// Состояние слайдера
	let currentSlide = $state(0);
	let isPaused = $state(false);

	// Переменные для управления таймингом
	let autoplayInterval: number | undefined = $state();
	let elapsedTime = $state(0);

	const progressDuration = 5000; // 5 секунд
	const intervalStep = 16; // ~60fps для плавности

	// Функции для работы со слайдером
	const nextSlide = (isAutomatic = false) => {
		if (upcomingData?.results) {
			currentSlide = (currentSlide + 1) % upcomingData.results.length;
			// Сбрасываем прогресс только для ручного переключения
			if (!isAutomatic) {
				resetProgress();
			}
		}
	};

	const prevSlide = () => {
		if (upcomingData?.results) {
			currentSlide =
				currentSlide === 0 ? upcomingData.results.length - 1 : currentSlide - 1;
			resetProgress();
		}
	};

	const goToSlide = (index: number) => {
		currentSlide = index;
		resetProgress();
	};

	// Функция для сброса прогресса
	const resetProgress = () => {
		stopAutoplay();
		elapsedTime = 0;
		startAutoplay();
	};

	// Автоплей с учетом паузы
	const startAutoplay = () => {
		if (autoplayInterval) return; // Предотвращаем создание множественных интервалов

		autoplayInterval = setInterval(() => {
			if (!isPaused) {
				elapsedTime += intervalStep;

				if (elapsedTime >= progressDuration) {
					// Автоматическое переключение без сброса прогресса
					nextSlide(true);
					// Сбрасываем прогресс после переключения
					elapsedTime = 0;
				}
			}
		}, intervalStep);
	};

	const stopAutoplay = () => {
		if (autoplayInterval) {
			clearInterval(autoplayInterval);
			autoplayInterval = undefined;
		}
	};

	// Функция для обработки паузы/воспроизведения
	const togglePlayPause = () => {
		isPaused = !isPaused;
	};

	// Вычисляемое свойство для прогресса
	const progressPercentage = $derived(() => {
		const progress = Math.min((elapsedTime / progressDuration) * 100, 100);
		return progress;
	});

	// Утилиты
	const getPosterUrl = (posterPath: string) => {
		return `https://image.tmdb.org/t/p/w500${posterPath}`;
	};

	const getBackdropUrl = (backdropPath: string) => {
		return `https://image.tmdb.org/t/p/w1920${backdropPath}`;
	};

	const getRatingColor = (rating: number) => {
		if (rating >= 8) return '#10b981';
		if (rating >= 6) return '#f59e0b';
		return '#ef4444';
	};

	const formatYear = (dateString: string) => {
		return new Date(dateString).getFullYear();
	};

	const truncateText = (text: string, maxLength: number = 200) => {
		if (text.length <= maxLength) return text;
		return text.substring(0, maxLength).trim() + '...';
	};

	// Управление слайдером с клавиатуры через svelte:window
	const handleKeydown = (event: KeyboardEvent) => {
		if (event.key === 'ArrowLeft') {
			prevSlide();
		} else if (event.key === 'ArrowRight') {
			nextSlide();
		} else if (event.key === ' ') {
			event.preventDefault();
			togglePlayPause();
		}
	};

	// Инициализируем автоплей только один раз когда появятся данные
	let hasInitialized = $state(false);

	$effect(() => {
		if (upcomingData?.results?.length && !hasInitialized) {
			hasInitialized = true;
			resetProgress();
		}
	});
</script>

<!-- Обработка событий клавиатуры через svelte:window -->
<svelte:window on:keydown={handleKeydown} />

<section class="Welcome">
	<div class="slider_container">
		<!-- Loading State -->
		{#if isLoading}
			<div class="slider_loading">
				<div class="loading_spinner"></div>
				<p class="loading_text">Загружаем лучшие фильмы...</p>
			</div>
		{:else if upcomingData?.results?.length}
			<!-- Slider Content -->
			<div class="slider_content">
				<!-- Slides -->
				{#each upcomingData.results as movie, index (movie.id)}
					<div class="slide" class:slide--active={index === currentSlide}>
						<!-- Background Image -->
						<div class="slide_bg">
							<img
								src={getBackdropUrl(movie.backdrop_path)}
								alt={movie.title}
								class="slide_bg_image"
							/>
							<div class="slide_gradient"></div>
						</div>

						<!-- Content -->
						<div class="container">
							<div class="slide_content">
								<div class="slide_info">
									<div class="slide_meta">
										<span class="slide_type">Фильм</span>
										<span class="slide_age">18+</span>
										<span class="slide_year"
											>{formatYear(movie.release_date)}</span
										>
										<span class="slide_country">США</span>
										<span class="slide_duration">2ч 15мин</span>
									</div>

									<h1 class="slide_title">{movie.title}</h1>

									<p class="slide_description">
										{truncateText(movie.overview)}
									</p>

									<div class="slide_rating">
										<div class="rating_score">
											<span
												class="rating_number"
												style:color={getRatingColor(movie.vote_average)}
											>
												{movie.vote_average.toFixed(1)}
											</span>
										</div>
										<div class="rating_sources">
											<div class="rating_source">
												<span class="rating_icon">🎬</span>
												<span class="rating_value"
													>{movie.vote_average.toFixed(1)}</span
												>
											</div>
											<div class="rating_source">
												<span class="rating_icon">⭐</span>
												<span class="rating_value"
													>{(movie.vote_average * 0.9).toFixed(1)}</span
												>
											</div>
										</div>
									</div>

									<div class="slide_actions">
										<button class="btn btn--primary">
											<Play class="btn_icon" size={20} />
											Перейти к фильму
										</button>
										<button class="btn btn--secondary">
											<Star class="btn_icon" size={20} />
											В избранное
										</button>
									</div>
								</div>

								<div class="slide_poster">
									<div class="poster_container">
										<img
											src={getPosterUrl(movie.poster_path)}
											alt={movie.title}
											class="poster_image"
										/>
										<div class="poster_overlay">
											<button class="play_btn">
												<Play size={30} />
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				{/each}

				<!-- Navigation -->
				<div class="slider_nav">
					<button
						class="nav_btn"
						onclick={prevSlide}
						disabled={upcomingData.results.length <= 1}
					>
						<ChevronLeft size={24} />
					</button>
					<button
						class="nav_btn"
						onclick={() => nextSlide()}
						disabled={upcomingData.results.length <= 1}
					>
						<ChevronRight size={24} />
					</button>
				</div>

				<!-- Dots Pagination -->
				<div class="slider_dots">
					{#each upcomingData.results as _, index (index)}
						<button
							class="dot"
							class:dot--active={index === currentSlide}
							onclick={() => goToSlide(index)}
							aria-label="Перейти к слайду {index + 1}"
						></button>
					{/each}
				</div>

				<!-- Progress Bar -->
				<div class="slider_progress">
					<div
						class="progress_bar"
						style:width="{progressPercentage()}%"
						style:transition={isPaused ? 'none' : 'width 16ms linear'}
					></div>
				</div>

				<!-- Play/Pause Control -->
				<button
					class="play_pause_btn"
					onclick={togglePlayPause}
					title={isPaused ? 'Воспроизвести' : 'Пауза'}
				>
					{#if isPaused}
						<Play size={20} />
					{:else}
						<Pause size={20} />
					{/if}
				</button>
			</div>
		{:else}
			<!-- Empty State -->
			<div class="slider_empty">
				<div class="empty_icon">🎬</div>
				<p class="empty_text">Нет доступных фильмов</p>
			</div>
		{/if}
	</div>

	<!-- Background Effects -->
	<div class="hero_bg_effects">
		<div class="hero_gradient"></div>
	</div>
</section>

<style lang="scss">
	.Welcome {
		position: relative;
		height: 80vh;
		min-height: 600px;
		overflow: hidden;
		background: #1a1a2e;

		.slider_container {
			position: relative;
			height: 100%;
			width: 100%;
		}

		// Loading State
		.slider_loading {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			height: 100%;
			gap: 2rem;

			.loading_spinner {
				width: 60px;
				height: 60px;
				border: 4px solid rgba(139, 92, 246, 0.1);
				border-left: 4px solid #8b5cf6;
				border-radius: 50%;
				animation: spin 1s linear infinite;
			}

			.loading_text {
				color: rgba(255, 255, 255, 0.8);
				font-size: 1.2rem;
				font-weight: 500;
			}
		}

		// Slides
		.slide {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			opacity: 0;
			visibility: hidden;
			transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
			transform: scale(1.05);
			display: flex;
			align-items: center;

			&--active {
				opacity: 1;
				visibility: visible;
				transform: scale(1);
			}

			.slide_bg {
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				z-index: 1;

				.slide_bg_image {
					width: 100%;
					height: 100%;
					object-fit: cover;
					object-position: center;
				}

				.slide_gradient {
					position: absolute;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					background: linear-gradient(
							135deg,
							rgba(15, 15, 35, 0.9) 0%,
							rgba(26, 26, 46, 0.7) 40%,
							rgba(30, 30, 63, 0.8) 100%
						),
						linear-gradient(90deg, rgba(0, 0, 0, 0.8) 0%, transparent 70%);
				}
			}

			.slide_content {
				position: relative;
				z-index: 2;
				height: 100%;
				display: flex;
				align-items: center;
				gap: 4rem;

				@media (max-width: 1024px) {
					flex-direction: column;
					justify-content: center;
					text-align: center;
					gap: 2rem;
				}
			}

			.slide_info {
				flex: 1;
				max-width: 600px;

				.slide_meta {
					display: flex;
					align-items: center;
					gap: 1rem;
					margin-bottom: 1.5rem;
					flex-wrap: wrap;

					@media (max-width: 1024px) {
						justify-content: center;
					}

					span {
						padding: 0.5rem 1rem;
						background: rgba(139, 92, 246, 0.2);
						border: 1px solid rgba(139, 92, 246, 0.4);
						border-radius: 20px;
						color: #c084fc;
						font-size: 0.9rem;
						font-weight: 500;
					}

					.slide_type {
						background: linear-gradient(45deg, #8b5cf6, #a855f7);
						color: white;
						border-color: transparent;
					}
				}

				.slide_title {
					font-size: clamp(2.5rem, 5vw, 4rem);
					font-weight: 800;
					color: white;
					margin-bottom: 1.5rem;
					line-height: 1.1;
				}

				.slide_description {
					font-size: 1.1rem;
					line-height: 1.6;
					color: rgba(255, 255, 255, 0.8);
					margin-bottom: 2rem;
				}

				.slide_rating {
					display: flex;
					align-items: center;
					gap: 2rem;
					margin-bottom: 2.5rem;

					@media (max-width: 1024px) {
						justify-content: center;
					}

					.rating_score {
						.rating_number {
							font-size: 2rem;
							font-weight: 700;
						}
					}

					.rating_sources {
						display: flex;
						gap: 1rem;

						.rating_source {
							display: flex;
							align-items: center;
							gap: 0.5rem;
							padding: 0.5rem 1rem;
							background: rgba(255, 255, 255, 0.1);
							border-radius: 15px;

							.rating_icon {
								font-size: 1.2rem;
							}

							.rating_value {
								color: rgba(255, 255, 255, 0.9);
								font-weight: 600;
							}
						}
					}
				}

				.slide_actions {
					display: flex;
					gap: 1rem;
					flex-wrap: wrap;

					@media (max-width: 1024px) {
						justify-content: center;
					}

					.btn {
						display: flex;
						align-items: center;
						gap: 0.75rem;
						padding: 1rem 2rem;
						border-radius: 50px;
						font-weight: 600;
						font-size: 1rem;
						border: none;
						cursor: pointer;
						transition: all 0.3s ease;

						&--primary {
							background: linear-gradient(45deg, #8b5cf6, #a855f7);
							color: white;

							&:hover {
								transform: translateY(-2px);
								opacity: 0.9;
							}
						}

						&--secondary {
							background: rgba(255, 255, 255, 0.1);
							color: white;
							border: 1px solid rgba(139, 92, 246, 0.3);

							&:hover {
								background: rgba(139, 92, 246, 0.2);
								border-color: rgba(139, 92, 246, 0.5);
							}
						}
					}
				}
			}

			.slide_poster {
				flex: 0 0 auto;

				@media (max-width: 1024px) {
					order: -1;
				}

				.poster_container {
					position: relative;
					width: 300px;
					aspect-ratio: 2/3;
					border-radius: 20px;
					overflow: hidden;
					border: 2px solid rgba(139, 92, 246, 0.3);
					transition: all 0.3s ease;

					@media (max-width: 1024px) {
						width: 250px;
					}

					@media (max-width: 480px) {
						width: 200px;
					}

					&:hover {
						border-color: rgba(139, 92, 246, 0.6);

						.poster_overlay {
							opacity: 1;
						}
					}

					.poster_image {
						width: 100%;
						height: 100%;
						object-fit: cover;
					}

					.poster_overlay {
						position: absolute;
						top: 0;
						left: 0;
						right: 0;
						bottom: 0;
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

						.play_btn {
							width: 80px;
							height: 80px;
							background: rgba(255, 255, 255, 0.2);
							border: 2px solid white;
							border-radius: 50%;
							display: flex;
							align-items: center;
							justify-content: center;
							color: white;
							cursor: pointer;
							transition: all 0.3s ease;

							&:hover {
								background: rgba(255, 255, 255, 0.3);
							}
						}
					}
				}
			}
		}

		// Navigation
		.slider_nav {
			position: absolute;
			top: 50%;
			left: 0;
			right: 0;
			z-index: 10;
			display: flex;
			justify-content: space-between;
			padding: 0 2rem;
			transform: translateY(-50%);
			pointer-events: none;

			.nav_btn {
				pointer-events: all;
				width: 60px;
				height: 60px;
				background: rgba(0, 0, 0, 0.5);
				border: 1px solid rgba(139, 92, 246, 0.3);
				border-radius: 50%;
				color: white;
				cursor: pointer;
				transition: all 0.3s ease;
				display: flex;
				align-items: center;
				justify-content: center;

				&:hover:not(:disabled) {
					background: #8b5cf6;
					border-color: #8b5cf6;
				}

				&:disabled {
					opacity: 0.3;
					cursor: not-allowed;
				}

				@media (max-width: 768px) {
					width: 50px;
					height: 50px;
				}
			}
		}

		// Dots Pagination
		.slider_dots {
			position: absolute;
			bottom: 2rem;
			left: 50%;
			transform: translateX(-50%);
			z-index: 10;
			display: flex;
			gap: 1rem;

			.dot {
				width: 12px;
				height: 12px;
				border-radius: 50%;
				background: rgba(255, 255, 255, 0.3);
				border: none;
				cursor: pointer;
				transition: background 0.3s ease;

				&:hover {
					background: rgba(139, 92, 246, 0.7);
				}

				&--active {
					background: #8b5cf6;
				}
			}
		}

		// Progress Bar
		.slider_progress {
			position: absolute;
			bottom: 0;
			left: 0;
			right: 0;
			height: 4px;
			background: rgba(255, 255, 255, 0.1);
			z-index: 10;

			.progress_bar {
				height: 100%;
				background: linear-gradient(45deg, #8b5cf6, #a855f7);
				width: 0;
			}
		}

		// Play/Pause Control
		.play_pause_btn {
			position: absolute;
			top: 7rem;
			right: 2rem;
			z-index: 10;
			width: 50px;
			height: 50px;
			background: rgba(0, 0, 0, 0.5);
			border: 1px solid rgba(139, 92, 246, 0.3);
			border-radius: 50%;
			color: white;
			cursor: pointer;
			transition: all 0.3s ease;
			display: flex;
			align-items: center;
			justify-content: center;

			&:hover {
				background: #8b5cf6;
				border-color: #8b5cf6;
			}
		}

		// Empty State
		.slider_empty {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			height: 100%;
			gap: 2rem;

			.empty_icon {
				font-size: 4rem;
				opacity: 0.5;
			}

			.empty_text {
				color: rgba(255, 255, 255, 0.7);
				font-size: 1.2rem;
			}
		}

		// Background Effects
		.hero_bg_effects {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			pointer-events: none;
			z-index: 0;

			.hero_gradient {
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				background: radial-gradient(
						circle at 20% 80%,
						rgba(139, 92, 246, 0.1) 0%,
						transparent 50%
					),
					radial-gradient(
						circle at 80% 20%,
						rgba(168, 85, 247, 0.08) 0%,
						transparent 50%
					);
			}
		}
	}

	// Animations
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	@keyframes progress {
		to {
			width: 100%;
		}
	}

	// Media Queries
	@media (max-width: 768px) {
		.Welcome {
			height: 80vh;
			min-height: 500px;

			.slider_nav {
				padding: 0 1rem;
			}

			.slide .slide_content {
				padding: 1rem 0;
				gap: 1.5rem;
			}

			.slide .slide_info .slide_title {
				font-size: clamp(2rem, 8vw, 3rem);
			}

			.slide .slide_info .slide_actions {
				justify-content: center;
			}
		}
	}

	@media (max-width: 480px) {
		.Welcome {
			height: 70vh;
			min-height: 400px;

			.slide .slide_info .slide_description {
				font-size: 1rem;
			}

			.slide .slide_info .slide_actions .btn {
				padding: 0.75rem 1.5rem;
				font-size: 0.9rem;
			}

			.slide .slide_info .slide_rating {
				flex-direction: column;
				gap: 1rem;
				align-items: flex-start;

				@media (max-width: 1024px) {
					align-items: center;
				}
			}
		}
	}
</style>
