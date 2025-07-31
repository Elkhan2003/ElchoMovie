<script lang="ts">
	import {
		Film,
		Send,
		MessageCircle,
		Users,
		Youtube,
		Instagram
	} from '@lucide/svelte';

	const currentYear = new Date().getFullYear();

	let email = '';

	const handleNewsletterSubmit = () => {
		if (email.trim()) {
			console.log('Подписка на новости:', email);
			email = '';
			// Здесь будет логика подписки
		}
	};

	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'Enter') {
			handleNewsletterSubmit();
		}
	};

	const socialLinks = [
		{
			name: 'Telegram',
			icon: MessageCircle,
			url: 'https://t.me/cinemahub' // Замените на реальную ссылку
		},
		{
			name: 'VK',
			icon: Users,
			url: 'https://vk.com/cinemahub' // Замените на реальную ссылку
		},
		{
			name: 'YouTube',
			icon: Youtube,
			url: 'https://youtube.com/@cinemahub' // Замените на реальную ссылку
		},
		{
			name: 'Instagram',
			icon: Instagram,
			url: 'https://instagram.com/cinemahub' // Замените на реальную ссылку
		}
	];
</script>

<footer class="footer">
	<div class="container">
		<div class="footer_content">
			<!-- Основная информация -->
			<div class="footer_section footer_section--main">
				<div class="footer_logo">
					<div class="logo_icon">
						<Film size={32} />
					</div>
					<span class="logo_text">KinoDev</span>
				</div>
				<p class="footer_description">
					Ваш идеальный спутник в мире кино и сериалов. Откройте для себя новые
					горизонты развлечений.
				</p>
				<div class="social_links">
					{#each socialLinks as social (social.name)}
						<a href={social.url} title={social.name} class="social_link">
							<svelte:component this={social.icon} size={18} />
						</a>
					{/each}
				</div>
			</div>

			<!-- Навигация -->
			<div class="footer_section">
				<h3 class="section_title">Навигация</h3>
				<ul class="footer_links">
					<li><a href="/" class="footer_link">Главная</a></li>
					<li><a href="/new" class="footer_link">Новинки</a></li>
					<li><a href="/top100" class="footer_link">Топ 100</a></li>
					<li>
						<a href="/recommendations" class="footer_link">Рекомендации</a>
					</li>
					<li><a href="/favorites" class="footer_link">Избранное</a></li>
				</ul>
			</div>

			<!-- Категории -->
			<div class="footer_section">
				<h3 class="section_title">Категории</h3>
				<ul class="footer_links">
					<li><a href="/movies" class="footer_link">Фильмы</a></li>
					<li><a href="/series" class="footer_link">Сериалы</a></li>
					<li>
						<a href="/documentaries" class="footer_link">Документальные</a>
					</li>
					<li><a href="/cartoons" class="footer_link">Мультфильмы</a></li>
					<li><a href="/anime" class="footer_link">Аниме</a></li>
				</ul>
			</div>

			<!-- Жанры -->
			<div class="footer_section">
				<h3 class="section_title">Жанры</h3>
				<ul class="footer_links">
					<li><a href="/genre/action" class="footer_link">Боевики</a></li>
					<li><a href="/genre/comedy" class="footer_link">Комедии</a></li>
					<li><a href="/genre/drama" class="footer_link">Драмы</a></li>
					<li><a href="/genre/thriller" class="footer_link">Триллеры</a></li>
					<li><a href="/genre/sci-fi" class="footer_link">Фантастика</a></li>
				</ul>
			</div>

			<!-- Подписка на новости -->
			<div class="footer_section footer_section--newsletter">
				<h3 class="section_title">Будьте в курсе</h3>
				<p class="newsletter_description">
					Подпишитесь на новости и получайте информацию о новинках первыми
				</p>
				<div class="newsletter_form">
					<div class="newsletter_input_wrapper">
						<input
							bind:value={email}
							type="email"
							placeholder="Ваш email"
							class="newsletter_input"
							on:keydown={handleKeyDown}
						/>
						<button on:click={handleNewsletterSubmit} class="newsletter_btn">
							<Send size={16} />
						</button>
					</div>
				</div>
			</div>
		</div>

		<!-- Нижняя часть -->
		<div class="footer_bottom">
			<div class="footer_bottom_content">
				<div class="footer_bottom_left">
					<p class="copyright">
						© {currentYear} CinemaHub. Все права защищены.
					</p>
				</div>
				<div class="footer_bottom_right">
					<ul class="footer_bottom_links">
						<li>
							<a href="/privacy" class="footer_bottom_link"
								>Политика конфиденциальности</a
							>
						</li>
						<li>
							<a href="/terms" class="footer_bottom_link"
								>Пользовательское соглашение</a
							>
						</li>
						<li><a href="/support" class="footer_bottom_link">Поддержка</a></li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</footer>

<style lang="scss">
	.footer {
		position: relative;
		/* background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #1e1e3f 100%); */
		border-top: 1px solid rgba(139, 92, 246, 0.1);
		overflow: hidden;
		margin-top: auto;

		.footer_content {
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

		.footer_section {
			&--main {
				.footer_logo {
					display: flex;
					align-items: center;
					gap: 0.75rem;
					margin-bottom: 1.5rem;

					@media (max-width: 768px) {
						justify-content: center;
					}

					.logo_icon {
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

					.logo_text {
						background: linear-gradient(45deg, #ffffff, #c084fc);
						-webkit-background-clip: text;
						-webkit-text-fill-color: transparent;
						background-clip: text;
						font-size: 1.5rem;
						font-weight: bold;
					}
				}

				.footer_description {
					color: rgba(255, 255, 255, 0.7);
					line-height: 1.6;
					margin-bottom: 2rem;
					font-size: 0.9rem;
				}

				.social_links {
					display: flex;
					gap: 1rem;

					@media (max-width: 768px) {
						justify-content: center;
					}

					.social_link {
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
				.newsletter_description {
					color: rgba(255, 255, 255, 0.7);
					font-size: 0.9rem;
					line-height: 1.5;
					margin-bottom: 1.5rem;
				}

				.newsletter_form {
					.newsletter_input_wrapper {
						position: relative;
						display: flex;
						align-items: center;

						.newsletter_input {
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

						.newsletter_btn {
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

			.section_title {
				color: white;
				font-size: 1.1rem;
				font-weight: 600;
				margin-bottom: 1.5rem;
				position: relative;

				&::after {
					content: '';
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

			.footer_links {
				list-style: none;
				padding: 0;
				margin: 0;

				li {
					margin-bottom: 0.75rem;

					.footer_link {
						color: rgba(255, 255, 255, 0.7);
						text-decoration: none;
						font-size: 0.9rem;
						transition: all 0.3s ease;
						position: relative;
						display: inline-block;

						&::before {
							content: '';
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

		.footer_bottom {
			border-top: 1px solid rgba(139, 92, 246, 0.1);
			padding: 2rem 0;

			.footer_bottom_content {
				display: flex;
				justify-content: space-between;
				align-items: center;

				@media (max-width: 768px) {
					flex-direction: column;
					gap: 1rem;
					text-align: center;
				}

				.footer_bottom_left {
					.copyright {
						color: rgba(255, 255, 255, 0.6);
						font-size: 0.9rem;
						margin: 0;
					}
				}

				.footer_bottom_right {
					.footer_bottom_links {
						display: flex;
						list-style: none;
						margin: 0;
						padding: 0;
						gap: 1.5rem;

						@media (max-width: 768px) {
							flex-direction: column;
							gap: 0.5rem;
						}

						.footer_bottom_link {
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
	}
</style>
