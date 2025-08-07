<script lang="ts">
	import { page } from '$app/state';
	import { Film, Search } from '@lucide/svelte';
	import { navigationRoutes } from '$lib/constants/route-links';
	import SearchModal from '../shared/SearchModal.svelte';

	let isOpenSearchModal = $state<boolean>(false);

	const toggleSearchModal = () => {
		isOpenSearchModal = !isOpenSearchModal;
	};

	const currentPath = $derived((href: string) => {
		return page.url.pathname === href;
	});
</script>

<header class="header">
	<div class="container">
		<div class="content">
			<!-- Логотип -->
			<a href="/" class="logo">
				<div class="logo_icon">
					<Film size={32} />
				</div>
				<span class="logo_text">ElchoMovie</span>
			</a>

			<!-- Навигация -->
			<nav class="nav">
				<ul class="nav_list">
					{#each navigationRoutes as item (item.path)}
						<li class="nav_item">
							<a
								href={item.path}
								class="nav_link"
								class:active={currentPath(item.path)}
							>
								{item.name}
							</a>
						</li>
					{/each}
				</ul>
			</nav>

			<!-- Поиск -->
			<div class="site_actions">
				<button onclick={toggleSearchModal} class="search_btn">
					<Search size={21} />
				</button>
			</div>

			<!-- Пользователь -->
			<div class="user_actions">
				<button class="btn btn_secondary">Войти</button>
				<button class="btn btn_primary">Регистрация</button>
			</div>
		</div>
	</div>
</header>

<SearchModal
	isOpen={isOpenSearchModal}
	onClose={() => (isOpenSearchModal = false)}
/>

<style lang="scss">
	.header {
		position: sticky;
		top: 0;
		left: 0;
		z-index: 9999;
		width: 100%;
		backdrop-filter: blur(10px);
		border-bottom: 1px solid rgba(139, 92, 246, 0.1);
		padding: 1rem 0;
		overflow: hidden;

		.content {
			display: flex;
			gap: 30px;
			align-items: center;
			justify-content: space-between;
			position: relative;
			z-index: 10;

			.logo {
				display: flex;
				align-items: center;
				gap: 0.75rem;
				text-decoration: none;
				color: white;
				font-weight: bold;
				font-size: 1.5rem;

				// Применяем hover эффект к иконке при наведении на весь логотип
				&:hover .logo_icon {
					transform: scale(1.1) rotate(5deg);
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
				}

				.logo_text {
					background: linear-gradient(45deg, #ffffff, #c084fc);
					-webkit-background-clip: text;
					-webkit-text-fill-color: transparent;
					background-clip: text;
				}
			}

			.nav {
				display: flex;
				align-items: center;

				.nav_list {
					display: flex;
					list-style: none;
					margin: 0;
					padding: 0;
					gap: 2rem;

					.nav_item {
						.nav_link {
							position: relative;
							padding: 0.5rem 0;
							text-decoration: none;
							font-weight: 500;
							transition: 0.3s ease;
							color: #ffffffcc;

							&::after {
								content: '';
								position: absolute;
								bottom: 0;
								left: 0;
								width: 0;
								height: 2px;
								background: linear-gradient(45deg, #8b5cf6, #a855f7);
								transition: 0.3s ease;
							}

							&:not(.active):hover {
								color: #fff;

								&::after {
									width: 100%;
								}
							}

							&.active {
								color: #a855f7;

								&::after {
									width: 100%;
								}
							}
						}
					}
				}
			}

			.site_actions {
				flex: 1;
				max-width: 400px;

				.search_btn {
					padding: 2px;
					display: flex;
					justify-content: center;
					align-items: center;
					background: transparent;
					border: none;
					outline: none;
					cursor: pointer;
					transition: 0.2s;
					&:hover {
						opacity: 0.7;
					}
				}
			}

			.user_actions {
				display: flex;
				gap: 1rem;
				align-items: center;

				.btn {
					padding: 0.5rem 1.5rem;
					border-radius: 25px;
					font-weight: 500;
					text-decoration: none;
					border: none;
					cursor: pointer;
					transition: all 0.3s ease;
					font-size: 0.9rem;

					&_primary {
						background: linear-gradient(45deg, #8b5cf6, #a855f7);
						color: white;
						box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);

						&:hover {
							transform: translateY(-2px);
							box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
						}
					}

					&_secondary {
						background: transparent;
						color: white;
						border: 1px solid rgba(139, 92, 246, 0.3);

						&:hover {
							background: rgba(139, 92, 246, 0.1);
							border-color: rgba(139, 92, 246, 0.5);
						}
					}
				}
			}
		}
	}
</style>
