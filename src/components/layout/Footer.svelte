<script lang="ts">
	const currentYear = new Date().getFullYear();
	let email = "";

	const handleNewsletterSubmit = () => {
		if (email.trim()) {
			console.log("Подписка на новости:", email);
			email = "";
			// Здесь будет логика подписки
		}
	};

	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === "Enter") {
			handleNewsletterSubmit();
		}
	};

	const socialLinks = [
		{
			name: "Telegram",
			icon: "M9,10.5L12,8.5L15,10.5V7A2,2 0 0,0 13,5H11A2,2 0 0,0 9,7V10.5M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2Z",
			url: "#",
		},
		{
			name: "VK",
			icon: "M15.07,12.25L14.17,12.25C13.63,12.25 13.63,12.25 13.63,11.75C13.63,11.25 13.88,11 14.42,11H15.32C15.86,11 16.11,11.25 16.11,11.75V12.25C16.11,12.75 15.86,13 15.32,13H14.42C13.88,13 13.63,12.75 13.63,12.25M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2Z",
			url: "#",
		},
		{
			name: "YouTube",
			icon: "M10,15L15.19,12L10,9V15M21.56,7.17C21.69,7.64 21.78,8.27 21.84,9.07C21.91,9.87 21.94,10.56 21.94,11.16L22,12C22,14.19 21.84,15.8 21.56,16.83C21.31,17.73 20.73,18.31 19.83,18.56C19.36,18.69 18.5,18.78 17.18,18.84C15.88,18.91 14.69,18.94 13.59,18.94L12,19C7.81,19 5.2,18.84 4.17,18.56C3.27,18.31 2.69,17.73 2.44,16.83C2.31,16.36 2.22,15.73 2.16,14.93C2.09,14.13 2.06,13.44 2.06,12.84L2,12C2,9.81 2.16,8.2 2.44,7.17C2.69,6.27 3.27,5.69 4.17,5.44C4.64,5.31 5.5,5.22 6.82,5.16C8.12,5.09 9.31,5.06 10.41,5.06L12,5C16.19,5 18.8,5.16 19.83,5.44C20.73,5.69 21.31,6.27 21.56,7.17Z",
			url: "#",
		},
		{
			name: "Instagram",
			icon: "M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.8,5.8 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.8,5.8 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4C4,18.39 5.61,20 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6C20,5.61 18.39,4 16.4,4H7.6M17.25,5.5A1.25,1.25 0 0,1 18.5,6.75A1.25,1.25 0 0,1 17.25,8A1.25,1.25 0 0,1 16,6.75A1.25,1.25 0 0,1 17.25,5.5M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z",
			url: "#",
		},
	];
</script>

<footer class="footer">
	<div class="container">
		<div class="footer-content">
			<!-- Основная информация -->
			<div class="footer-section footer-section--main">
				<div class="footer-logo">
					<div class="logo-icon">
						<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
							<path
								d="M18,4L20,8H17L15,4H13L15,8H12L10,4H8L10,8H7L5,4H3L5,8H2V10H22V8H20L18,4M2,12V22H22V12H2Z"
							/>
						</svg>
					</div>
					<span class="logo-text">CinemaHub</span>
				</div>
				<p class="footer-description">
					Ваш идеальный спутник в мире кино и сериалов. Откройте для себя новые
					горизонты развлечений.
				</p>
				<div class="social-links">
					{#each socialLinks as social (social.name)}
						<a href={social.url} title={social.name} class="social-link">
							<svg
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="currentColor"
							>
								<path d={social.icon} />
							</svg>
						</a>
					{/each}
				</div>
			</div>

			<!-- Навигация -->
			<div class="footer-section">
				<h3 class="section-title">Навигация</h3>
				<ul class="footer-links">
					<li><a href="#" class="footer-link">Главная</a></li>
					<li><a href="#" class="footer-link">Новинки</a></li>
					<li><a href="#" class="footer-link">Топ 100</a></li>
					<li><a href="#" class="footer-link">Рекомендации</a></li>
					<li><a href="#" class="footer-link">Избранное</a></li>
				</ul>
			</div>

			<!-- Категории -->
			<div class="footer-section">
				<h3 class="section-title">Категории</h3>
				<ul class="footer-links">
					<li><a href="#" class="footer-link">Фильмы</a></li>
					<li><a href="#" class="footer-link">Сериалы</a></li>
					<li><a href="#" class="footer-link">Документальные</a></li>
					<li><a href="#" class="footer-link">Мультфильмы</a></li>
					<li><a href="#" class="footer-link">Аниме</a></li>
				</ul>
			</div>

			<!-- Жанры -->
			<div class="footer-section">
				<h3 class="section-title">Жанры</h3>
				<ul class="footer-links">
					<li><a href="#" class="footer-link">Боевики</a></li>
					<li><a href="#" class="footer-link">Комедии</a></li>
					<li><a href="#" class="footer-link">Драмы</a></li>
					<li><a href="#" class="footer-link">Триллеры</a></li>
					<li><a href="#" class="footer-link">Фантастика</a></li>
				</ul>
			</div>

			<!-- Подписка на новости -->
			<div class="footer-section footer-section--newsletter">
				<h3 class="section-title">Будьте в курсе</h3>
				<p class="newsletter-description">
					Подпишитесь на новости и получайте информацию о новинках первыми
				</p>
				<div class="newsletter-form">
					<div class="newsletter-input-wrapper">
						<input
							bind:value={email}
							type="email"
							placeholder="Ваш email"
							class="newsletter-input"
							on:keydown={handleKeyDown}
						/>
						<button on:click={handleNewsletterSubmit} class="newsletter-btn">
							<svg
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="currentColor"
							>
								<path d="M2,21L23,12L2,3V10L17,12L2,14V21Z" />
							</svg>
						</button>
					</div>
				</div>
			</div>
		</div>

		<!-- Нижняя часть -->
		<div class="footer-bottom">
			<div class="footer-bottom-content">
				<div class="footer-bottom-left">
					<p class="copyright">
						© {currentYear} CinemaHub. Все права защищены.
					</p>
				</div>
				<div class="footer-bottom-right">
					<ul class="footer-bottom-links">
						<li>
							<a href="#" class="footer-bottom-link"
								>Политика конфиденциальности</a
							>
						</li>
						<li>
							<a href="#" class="footer-bottom-link"
								>Пользовательское соглашение</a
							>
						</li>
						<li><a href="#" class="footer-bottom-link">Поддержка</a></li>
					</ul>
				</div>
			</div>
		</div>
	</div>

	<!-- Фоновые эффекты -->
	<div class="footer-bg">
		<div class="footer-gradient"></div>
		<div class="footer-dots"></div>
	</div>
</footer>

<style lang="scss">
	.footer {
		position: relative;
		/* background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #1e1e3f 100%); */
		border-top: 1px solid rgba(139, 92, 246, 0.1);
		overflow: hidden;
		margin-top: auto;

		&::before {
			content: "";
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			/* background: radial-gradient(
				circle at 20% 80%,
				rgba(139, 92, 246, 0.1) 0%,
				transparent 50%
			),
			radial-gradient(
				circle at 80% 20%,
				rgba(168, 85, 247, 0.08) 0%,
				transparent 50%
			),
			radial-gradient(
				circle at 40% 40%,
				rgba(192, 132, 252, 0.05) 0%,
				transparent 50%
			); */
			pointer-events: none;
		}

		.footer-content {
			display: grid;
			grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr;
			gap: 3rem;
			padding: 4rem 0 3rem;

			@media (max-width: 1024px) {
				grid-template-columns: 1fr 1fr 1fr;
				gap: 2rem;
			}

			@media (max-width: 768px) {
				grid-template-columns: 1fr;
				gap: 2rem;
				text-align: center;
			}
		}

		.footer-section {
			&--main {
				.footer-logo {
					display: flex;
					align-items: center;
					gap: 0.75rem;
					margin-bottom: 1.5rem;

					@media (max-width: 768px) {
						justify-content: center;
					}

					.logo-icon {
						width: 40px;
						height: 40px;
						background: linear-gradient(45deg, #8b5cf6, #a855f7);
						border-radius: 8px;
						display: flex;
						align-items: center;
						justify-content: center;
						color: white;
						box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
						transition: transform 0.3s ease;

						&:hover {
							transform: scale(1.1) rotate(5deg);
						}
					}

					.logo-text {
						background: linear-gradient(45deg, #ffffff, #c084fc);
						-webkit-background-clip: text;
						-webkit-text-fill-color: transparent;
						background-clip: text;
						font-size: 1.5rem;
						font-weight: bold;
					}
				}

				.footer-description {
					color: rgba(255, 255, 255, 0.7);
					line-height: 1.6;
					margin-bottom: 2rem;
					font-size: 0.9rem;
				}

				.social-links {
					display: flex;
					gap: 1rem;

					@media (max-width: 768px) {
						justify-content: center;
					}

					.social-link {
						width: 40px;
						height: 40px;
						background: rgba(255, 255, 255, 0.08);
						border-radius: 50%;
						display: flex;
						align-items: center;
						justify-content: center;
						color: rgba(255, 255, 255, 0.7);
						transition: all 0.3s ease;
						backdrop-filter: blur(10px);
						border: 1px solid rgba(139, 92, 246, 0.2);

						&:hover {
							background: linear-gradient(45deg, #8b5cf6, #a855f7);
							color: white;
							transform: translateY(-2px) scale(1.1);
							box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
						}
					}
				}
			}

			&--newsletter {
				.newsletter-description {
					color: rgba(255, 255, 255, 0.7);
					font-size: 0.9rem;
					line-height: 1.5;
					margin-bottom: 1.5rem;
				}

				.newsletter-form {
					.newsletter-input-wrapper {
						position: relative;
						display: flex;
						align-items: center;

						.newsletter-input {
							width: 100%;
							padding: 0.75rem 3rem 0.75rem 1rem;
							background: rgba(255, 255, 255, 0.08);
							border: 1px solid rgba(139, 92, 246, 0.2);
							border-radius: 25px;
							color: white;
							font-size: 0.9rem;
							backdrop-filter: blur(10px);
							transition: all 0.3s ease;

							&::placeholder {
								color: rgba(255, 255, 255, 0.5);
							}

							&:focus {
								outline: none;
								border-color: #8b5cf6;
								background: rgba(255, 255, 255, 0.12);
								box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
							}
						}

						.newsletter-btn {
							position: absolute;
							right: 8px;
							background: linear-gradient(45deg, #8b5cf6, #a855f7);
							border: none;
							border-radius: 50%;
							width: 32px;
							height: 32px;
							display: flex;
							align-items: center;
							justify-content: center;
							color: white;
							cursor: pointer;
							transition: all 0.3s ease;

							&:hover {
								transform: scale(1.1);
								box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
							}
						}
					}
				}
			}

			.section-title {
				color: white;
				font-size: 1.1rem;
				font-weight: 600;
				margin-bottom: 1.5rem;
				position: relative;

				&::after {
					content: "";
					position: absolute;
					bottom: -0.5rem;
					left: 0;
					width: 2rem;
					height: 2px;
					background: linear-gradient(45deg, #8b5cf6, #a855f7);

					@media (max-width: 768px) {
						left: 50%;
						transform: translateX(-50%);
					}
				}
			}

			.footer-links {
				list-style: none;
				padding: 0;
				margin: 0;

				li {
					margin-bottom: 0.75rem;

					.footer-link {
						color: rgba(255, 255, 255, 0.7);
						text-decoration: none;
						font-size: 0.9rem;
						transition: all 0.3s ease;
						position: relative;
						display: inline-block;

						&::before {
							content: "";
							position: absolute;
							bottom: -2px;
							left: 0;
							width: 0;
							height: 1px;
							background: linear-gradient(45deg, #8b5cf6, #a855f7);
							transition: width 0.3s ease;
						}

						&:hover {
							color: white;
							transform: translateX(4px);

							&::before {
								width: 100%;
							}
						}
					}
				}
			}
		}

		.footer-bottom {
			border-top: 1px solid rgba(139, 92, 246, 0.1);
			padding: 2rem 0;

			.footer-bottom-content {
				display: flex;
				justify-content: space-between;
				align-items: center;

				@media (max-width: 768px) {
					flex-direction: column;
					gap: 1rem;
					text-align: center;
				}

				.footer-bottom-left {
					.copyright {
						color: rgba(255, 255, 255, 0.6);
						font-size: 0.9rem;
						margin: 0;
					}
				}

				.footer-bottom-right {
					.footer-bottom-links {
						display: flex;
						list-style: none;
						margin: 0;
						padding: 0;
						gap: 1.5rem;

						@media (max-width: 768px) {
							flex-direction: column;
							gap: 0.5rem;
						}

						.footer-bottom-link {
							color: rgba(255, 255, 255, 0.6);
							text-decoration: none;
							font-size: 0.9rem;
							transition: color 0.3s ease;

							&:hover {
								color: #a855f7;
							}
						}
					}
				}
			}
		}

		.footer-bg {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			pointer-events: none;
			overflow: hidden;

			.footer-dots {
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				background-image: radial-gradient(
						1px 1px at 20px 30px,
						rgba(139, 92, 246, 0.1),
						transparent
					),
					radial-gradient(
						1px 1px at 40px 70px,
						rgba(168, 85, 247, 0.1),
						transparent
					),
					radial-gradient(
						1px 1px at 90px 40px,
						rgba(192, 132, 252, 0.1),
						transparent
					);
				background-repeat: repeat;
				background-size: 100px 100px;
				animation: dots-move-reverse 25s linear infinite;
			}
		}
	}

	@keyframes dots-move-reverse {
		0% {
			background-position: 0 0;
		}
		100% {
			background-position: -100px -100px;
		}
	}
</style>
