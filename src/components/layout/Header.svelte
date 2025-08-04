<script lang="ts">
	import { page } from '$app/state';
	import { Film, Search } from '@lucide/svelte';
	import { navigationRoutes } from '$lib/constants/route-links';

	let searchQuery = $state('');

	const handleSearch = () => {
		if (searchQuery.trim()) {
			console.log('Поиск:', searchQuery);
			// Здесь будет логика поиска
		}
	};

	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'Enter') {
			handleSearch();
		}
	};

	const toggleSearchModal = () => {
		console.log('Открыть модальное окно поиска');
		// Здесь будет логика открытия модального окна
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
				<span class="logo_text">KinoDev</span>
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
			<div class="search">
				<div class="search_input_wrapper">
					<input
						bind:value={searchQuery}
						type="text"
						placeholder="Поиск фильмов, сериалов..."
						class="search_input"
						onkeydown={handleKeyDown}
						onclick={toggleSearchModal}
					/>
					<button onclick={handleSearch} class="search_btn">
						<Search size={18} />
					</button>
				</div>
			</div>

			<!-- Пользователь -->
			<div class="user_actions">
				<button class="btn btn_secondary">Войти</button>
				<button class="btn btn_primary">Регистрация</button>
			</div>
		</div>
	</div>
</header>

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

		&::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			pointer-events: none;
		}

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

			.search {
				flex: 1;
				max-width: 400px;

				.search_input_wrapper {
					position: relative;
					display: flex;
					align-items: center;

					.search_input {
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

					.search_btn {
						position: absolute;
						right: 8px;
						background: linear-gradient(45deg, #8b5cf6, #a855f7);
						border: none;
						border-radius: 50%;
						width: 36px;
						height: 36px;
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
