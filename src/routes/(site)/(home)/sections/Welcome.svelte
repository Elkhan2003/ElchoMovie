<script lang="ts">
	import {
		Play,
		Star,
		ChevronLeft,
		ChevronRight,
		Pause,
		Calendar,
		Clock,
		Globe,
		Film,
		Shield
	} from '@lucide/svelte';
	import { useGetUpcomingQuery } from '../../../../api/upcoming';

	// Queries
	const upcomingQuery = useGetUpcomingQuery();
	const { data: upcomingData, isLoading } = $derived($upcomingQuery);

	// Состояние слайдера
	let sectionRef: HTMLElement;
	let currentSlide = $state(0);
	let isPaused = $state(false);
	let isHovered = $state(false);

	// Переменные для управления timer
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

	// Autoplay с учетом паузы и ховера
	const startAutoplay = () => {
		if (autoplayInterval) return;

		autoplayInterval = setInterval(() => {
			if (!isPaused && !isHovered) {
				elapsedTime += intervalStep;

				if (elapsedTime >= progressDuration) {
					nextSlide(true);
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

	// Обработчики для hover эффектов
	const handleMouseEnter = () => {
		isHovered = true;
	};

	const handleMouseLeave = () => {
		isHovered = false;
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

	const getRandomDuration = () => {
		const hours = Math.floor(Math.random() * 2) + 1;
		const minutes = Math.floor(Math.random() * 60);
		return `${hours}ч ${minutes}мин`;
	};

	const getRandomCountry = () => {
		const countries = [
			'США',
			'Великобритания',
			'Франция',
			'Германия',
			'Япония',
			'Корея'
		];
		return countries[Math.floor(Math.random() * countries.length)];
	};

	const getRandomAgeRating = () => {
		const ratings = ['12+', '16+', '18+', '6+'];
		return ratings[Math.floor(Math.random() * ratings.length)];
	};

	// Управление слайдером с клавиатуры
	const handleKeydown = (event: KeyboardEvent) => {
		if (sectionRef.contains(document.activeElement)) {
			if (event.key === 'ArrowLeft') {
				prevSlide();
			} else if (event.key === 'ArrowRight') {
				nextSlide();
			} else if (event.key === ' ') {
				event.preventDefault();
				togglePlayPause();
			}
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
<!-- <svelte:window on:keydown={handleKeydown} /> -->

<section
	class="Welcome"
	aria-label="Слайдер с популярными фильмами"
	onmouseenter={handleMouseEnter}
	onmouseleave={handleMouseLeave}
	bind:this={sectionRef}
>
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
										<span>
											<Film size={16} />
											Фильм
										</span>
										<span>
											<Shield size={16} />
											{getRandomAgeRating()}
										</span>
										<span>
											<Calendar size={16} />
											{formatYear(movie.release_date)}
										</span>
										<span>
											<Globe size={16} />
											{getRandomCountry()}
										</span>
										<span>
											<Clock size={16} />
											{getRandomDuration()}
										</span>
									</div>

									<h1 class="slide_title">
										<span class="slide_title_text">{movie.title}</span>
										<div class="slide_title_underline"></div>
									</h1>

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
											<div class="rating_stars">
												{#each Array(5) as _, i}
													<span
														class="rating_star"
														class:rating_star--filled={i <
															Math.floor(movie.vote_average / 2)}
													>
														<Star size={16} />
													</span>
												{/each}
											</div>
										</div>
										<div class="rating_sources">
											<div class="rating_source">
												<span class="rating_icon">🎬</span>
												<span class="rating_label">TMDB</span>
												<span class="rating_value">
													{movie.vote_average.toFixed(1)}
												</span>
											</div>
											<div class="rating_source">
												<span class="rating_icon">⭐</span>
												<span class="rating_label">IMDb</span>
												<span class="rating_value">
													{(movie.vote_average * 0.9).toFixed(1)}
												</span>
											</div>
										</div>
									</div>

									<div class="slide_actions">
										<button class="btn btn--primary">
											<Play size={20} />
											<span class="btn_text">Перейти к фильму</span>
											<div class="btn_ripple"></div>
										</button>
										<button class="btn btn--secondary">
											<Star size={20} />
											<span class="btn_text">В избранное</span>
											<div class="btn_ripple"></div>
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
												<div class="play_btn_ripple"></div>
											</button>
										</div>
										<div class="poster_glow"></div>
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
						<div class="nav_btn_ripple"></div>
					</button>
					<button
						class="nav_btn"
						onclick={() => nextSlide()}
						disabled={upcomingData.results.length <= 1}
					>
						<ChevronRight size={24} />
						<div class="nav_btn_ripple"></div>
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
						>
							<div class="dot_inner"></div>
						</button>
					{/each}
				</div>

				<!-- Progress Bar -->
				<div class="slider_progress">
					<div
						class="progress_bar"
						style:width="{progressPercentage()}%"
						style:transition={isPaused || isHovered
							? 'none'
							: 'width 16ms linear'}
					>
						<div class="progress_glow"></div>
					</div>
				</div>

				<!-- Play/Pause Control -->
				<button
					class="play_pause_btn"
					class:play_pause_btn--paused={isPaused}
					onclick={togglePlayPause}
					title={isPaused ? 'Воспроизвести' : 'Пауза'}
				>
					{#if isPaused}
						<Play size={20} />
					{:else}
						<Pause size={20} />
					{/if}
					<div class="play_pause_ripple"></div>
				</button>
			</div>
		{:else}
			<!-- Empty State -->
			<div class="slider_empty">
				<div class="empty_icon">🎬</div>
				<p class="empty_text">Нет доступных фильмов</p>
				<div class="empty_decoration"></div>
			</div>
		{/if}
	</div>

	<!-- Background Effects -->
	<div class="hero_bg_effects">
		<div class="hero_gradient"></div>
		<div class="hero_particles"></div>
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

		// Loading State - Moved out of .slider_content nesting
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
				animation: pulse 2s ease-in-out infinite;
			}
		}

		.slider_content {
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

					.slide_title_text {
						animation: slideInUp 1s ease-out 0.3s both;
					}

					.slide_title_underline {
						animation: slideInRight 1s ease-out 0.5s both;
					}

					.slide_description {
						animation: slideInUp 1s ease-out 0.4s both;
					}

					.slide_actions {
						animation: slideInUp 1s ease-out 0.5s both;
					}
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
						transition: transform 8s ease-in-out;
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

				&--active .slide_bg_image {
					transform: scale(1.1);
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
					max-width: 670px;

					.slide_meta {
						display: flex;
						align-items: center;
						gap: 1rem;
						margin-bottom: 1.5rem;

						@media (max-width: 1024px) {
							justify-content: center;
						}

						span {
							display: flex;
							align-items: center;
							gap: 0.5rem;
							padding: 0.5rem 1rem;
							background: rgba(139, 92, 246, 0.2);
							border: 1px solid rgba(139, 92, 246, 0.4);
							border-radius: 20px;
							color: #c084fc;
							font-size: 14px;
							font-weight: 500;
							transition: all 0.3s ease;

							&:hover {
								background: rgba(139, 92, 246, 0.3);
								border-color: rgba(139, 92, 246, 0.6);
								transform: translateY(-2px);
							}
						}
					}

					.slide_title {
						position: relative;
						margin-bottom: 1.5rem;

						.slide_title_text {
							font-size: clamp(2.5rem, 5vw, 3.5rem);
							font-weight: 800;
							color: white;
							line-height: 1.1;
							display: block;
							opacity: 0;
						}

						.slide_title_underline {
							position: absolute;
							bottom: -0.5rem;
							left: 0;
							width: 0;
							height: 4px;
							background: linear-gradient(45deg, #8b5cf6, #a855f7);
							border-radius: 2px;
						}
					}

					.slide_description {
						font-size: 1.1rem;
						line-height: 1.6;
						color: rgba(255, 255, 255, 0.8);
						margin-bottom: 2rem;
						opacity: 0;
					}

					.slide_rating {
						display: flex;
						align-items: center;
						gap: 2rem;
						margin-bottom: 2.5rem;

						@media (max-width: 1024px) {
							justify-content: center;
							flex-direction: column;
							gap: 1rem;
						}

						.rating_score {
							display: flex;
							flex-direction: column;
							align-items: center;
							gap: 0.5rem;

							.rating_number {
								font-size: 2rem;
								font-weight: 700;
							}

							.rating_stars {
								display: flex;
								gap: 0.25rem;

								.rating_star {
									color: rgba(255, 255, 255, 0.3);
									transition: color 0.3s ease;
									display: inline-flex;

									&--filled {
										color: #fbbf24;
									}
								}
							}
						}

						.rating_sources {
							display: flex;
							gap: 1rem;

							.rating_source {
								display: flex;
								flex-direction: column;
								align-items: center;
								gap: 0.25rem;
								padding: 0.75rem 1rem;
								background: rgba(255, 255, 255, 0.1);
								border-radius: 15px;
								transition: all 0.3s ease;

								&:hover {
									background: rgba(255, 255, 255, 0.15);
									transform: translateY(-2px);
								}

								.rating_icon {
									font-size: 1.2rem;
								}

								.rating_label {
									color: rgba(255, 255, 255, 0.6);
									font-size: 0.8rem;
									font-weight: 500;
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
						opacity: 0;

						@media (max-width: 1024px) {
							justify-content: center;
						}

						.btn {
							position: relative;
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
							overflow: hidden;

							:global(.btn_icon) {
								transition: transform 0.3s ease;
								z-index: 2;
								position: relative;
							}

							.btn_text {
								z-index: 2;
								position: relative;
							}

							.btn_ripple {
								position: absolute;
								top: 50%;
								left: 50%;
								width: 0;
								height: 0;
								background: rgba(255, 255, 255, 0.3);
								border-radius: 50%;
								transform: translate(-50%, -50%);
								transition: all 0.6s ease;
								z-index: 1;
							}

							&:hover .btn_ripple {
								width: 300px;
								height: 300px;
							}

							&--primary {
								background: linear-gradient(45deg, #8b5cf6, #a855f7);
								color: white;

								&:hover {
									transform: translateY(-2px);
									box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);

									:global(.btn_icon) {
										transform: scale(1.1);
									}
								}
							}

							&--secondary {
								background: rgba(255, 255, 255, 0.1);
								color: white;
								border: 1px solid rgba(139, 92, 246, 0.3);

								&:hover {
									background: rgba(139, 92, 246, 0.2);
									border-color: rgba(139, 92, 246, 0.5);
									transform: translateY(-2px);

									:global(.btn_icon) {
										transform: scale(1.1);
									}
								}
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
						transform: scale(1.05);

						.poster_overlay {
							opacity: 1;
						}

						.poster_glow {
							opacity: 1;
						}
					}

					.poster_image {
						width: 100%;
						height: 100%;
						object-fit: cover;
						transition: transform 0.3s ease;
					}

					.poster_overlay {
						position: absolute;
						top: 0;
						left: 0;
						right: 0;
						bottom: 0;
						display: flex;
						align-items: center;
						justify-content: center;
						opacity: 0;
						transition: opacity 0.3s ease;

						.play_btn {
							position: relative;
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
							overflow: hidden;

							.play_btn_ripple {
								position: absolute;
								top: 50%;
								left: 50%;
								width: 0;
								height: 0;
								background: rgba(255, 255, 255, 0.3);
								border-radius: 50%;
								transform: translate(-50%, -50%);
								transition: all 0.6s ease;
							}

							&:hover {
								background: rgba(255, 255, 255, 0.3);
								transform: scale(1.1);

								.play_btn_ripple {
									width: 100px;
									height: 100px;
								}
							}
						}
					}

					.poster_glow {
						position: absolute;
						top: -10px;
						left: -10px;
						right: -10px;
						bottom: -10px;
						background: linear-gradient(45deg, #8b5cf6, #a855f7);
						border-radius: 30px;
						opacity: 0;
						filter: blur(20px);
						transition: opacity 0.3s ease;
						z-index: -1;
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
				position: relative;
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
				overflow: hidden;

				.nav_btn_ripple {
					position: absolute;
					top: 50%;
					left: 50%;
					width: 0;
					height: 0;
					background: rgba(139, 92, 246, 0.3);
					border-radius: 50%;
					transform: translate(-50%, -50%);
					transition: all 0.6s ease;
				}

				&:hover:not(:disabled) {
					background: #8b5cf6;
					border-color: #8b5cf6;
					transform: scale(1.1);

					.nav_btn_ripple {
						width: 80px;
						height: 80px;
					}
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
				position: relative;
				width: 12px;
				height: 12px;
				border-radius: 50%;
				background: transparent;
				border: 2px solid rgba(255, 255, 255, 0.3);
				cursor: pointer;
				transition: all 0.3s ease;

				.dot_inner {
					position: absolute;
					top: 50%;
					left: 50%;
					width: 0;
					height: 0;
					background: #8b5cf6;
					border-radius: 50%;
					transform: translate(-50%, -50%);
					transition: all 0.3s ease;
				}

				&:hover {
					border-color: rgba(139, 92, 246, 0.7);
					transform: scale(1.2);

					.dot_inner {
						width: 8px;
						height: 8px;
					}
				}

				&--active {
					border-color: #8b5cf6;

					.dot_inner {
						width: 8px;
						height: 8px;
					}
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
				position: relative;
				height: 100%;
				background: linear-gradient(45deg, #8b5cf6, #a855f7);
				width: 0;

				.progress_glow {
					position: absolute;
					top: -2px;
					right: -5px;
					width: 10px;
					height: 8px;
					background: #a855f7;
					border-radius: 50%;
					filter: blur(3px);
					animation: pulse 1s ease-in-out infinite;
				}
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
			overflow: hidden;

			.play_pause_ripple {
				position: absolute;
				top: 50%;
				left: 50%;
				width: 0;
				height: 0;
				background: rgba(139, 92, 246, 0.3);
				border-radius: 50%;
				transform: translate(-50%, -50%);
				transition: all 0.6s ease;
			}

			&:hover {
				background: #8b5cf6;
				border-color: #8b5cf6;
				transform: scale(1.1);

				.play_pause_ripple {
					width: 70px;
					height: 70px;
				}
			}

			&--paused {
				background: rgba(245, 158, 11, 0.2);
				border-color: #f59e0b;
				color: #f59e0b;

				&:hover {
					background: #f59e0b;
					color: white;
				}
			}
		}

		// Empty State
		.slider_empty {
			position: relative;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			height: 100%;
			gap: 2rem;

			.empty_icon {
				font-size: 4rem;
				opacity: 0.5;
				animation: bounce 2s ease-in-out infinite;
			}

			.empty_text {
				color: rgba(255, 255, 255, 0.7);
				font-size: 1.2rem;
			}

			.empty_decoration {
				position: absolute;
				width: 200px;
				height: 200px;
				border: 2px solid rgba(139, 92, 246, 0.1);
				border-radius: 50%;
				animation: rotate 20s linear infinite;

				&::before {
					content: '';
					position: absolute;
					top: -10px;
					left: 50%;
					width: 20px;
					height: 20px;
					background: rgba(139, 92, 246, 0.3);
					border-radius: 50%;
					transform: translateX(-50%);
				}
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

			.hero_particles {
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;

				&::before,
				&::after {
					content: '';
					position: absolute;
					width: 4px;
					height: 4px;
					background: rgba(139, 92, 246, 0.3);
					border-radius: 50%;
					animation: float 6s ease-in-out infinite;
				}

				&::before {
					top: 20%;
					left: 10%;
					animation-delay: 0s;
				}

				&::after {
					top: 60%;
					right: 15%;
					animation-delay: 3s;
				}
			}
		}
	}

	// Animations
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}

	@keyframes slideInUp {
		from {
			opacity: 0;
			transform: translateY(30px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes slideInRight {
		from {
			width: 0;
		}
		to {
			width: 100px;
		}
	}

	@keyframes bounce {
		0%,
		20%,
		50%,
		80%,
		100% {
			transform: translateY(0);
		}
		40% {
			transform: translateY(-10px);
		}
		60% {
			transform: translateY(-5px);
		}
	}

	@keyframes rotate {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	@keyframes float {
		0%,
		100% {
			transform: translateY(0px);
		}
		50% {
			transform: translateY(-20px);
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

			.slide .slide_info .slide_title .slide_title_text {
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
