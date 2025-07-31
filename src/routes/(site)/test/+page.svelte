<script lang="ts">
	import { onMount } from "svelte";

	// Типы
	interface Todo {
		id: number;
		title: string;
		description?: string;
		completed: boolean;
		category?: string;
		dueDate?: string;
		createdAt?: string;
		tags?: string[];
		image?: string;
	}

	type DueDateStatus = "overdue" | "today" | "soon" | "normal" | "";

	// Состояние компонента
	let todos: Todo[] = [];
	let loading: boolean = true;
	let error: string | null = null;
	let filteredTodos: Todo[] = [];
	let selectedCategory: string = "all";
	let searchQuery: string = "";

	$: console.log("Текущие todos:", todos);

	// Функция для GET запроса
	async function fetchTodos(): Promise<void> {
		try {
			loading = true;
			error = null;

			const response: Response = await fetch(
				"https://1116a39bcd510908.mokky.dev/todo"
			);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data: Todo[] = await response.json();

			// Фильтруем только валидные задачи (с title)
			todos = data.filter(
				(todo: Todo) => todo.title && todo.title.trim() !== ""
			);
			filteredTodos = todos;
		} catch (err: unknown) {
			if (err instanceof Error) {
				error = err.message;
			} else {
				error = "Произошла неизвестная ошибка";
			}
			console.error("Ошибка при загрузке задач:", err);
		} finally {
			loading = false;
		}
	}

	// Получение уникальных категорий
	$: categories = [
		...new Set(todos.map((todo: Todo) => todo.category).filter(Boolean)),
	] as string[];

	// Фильтрация задач
	$: {
		filteredTodos = todos.filter((todo: Todo) => {
			const matchesCategory =
				selectedCategory === "all" || todo.category === selectedCategory;
			const matchesSearch =
				todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				(todo.description &&
					todo.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
				false;
			return matchesCategory && matchesSearch;
		});
	}

	// Форматирование даты
	function formatDate(dateString?: string): string {
		if (!dateString) return "";
		const date = new Date(dateString);
		return date.toLocaleDateString("ru-RU", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	}

	// Определение статуса срока выполнения
	function getDueDateStatus(dueDate?: string): DueDateStatus {
		if (!dueDate) return "";
		const due = new Date(dueDate);
		const today = new Date();
		const diffTime = due.getTime() - today.getTime();
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		if (diffDays < 0) return "overdue";
		if (diffDays === 0) return "today";
		if (diffDays <= 3) return "soon";
		return "normal";
	}

	// Вычисляемые значения для статистики
	$: totalTodos = todos.length;
	$: completedTodos = todos.filter((t: Todo) => t.completed).length;
	$: pendingTodos = todos.filter((t: Todo) => !t.completed).length;

	onMount(() => {
		fetchTodos();
	});
</script>

<!-- <svelte:head>
	<title>Список задач</title>
	<meta name="description" content="Управление задачами" />
</svelte:head> -->

<div class="container">
	<header class="header">
		<h1>📝 Мои задачи</h1>
		<button class="refresh-btn" on:click={fetchTodos} disabled={loading}>
			{loading ? "🔄" : "↻"} Обновить
		</button>
	</header>

	{#if error}
		<div class="error">
			<h3>❌ Ошибка загрузки</h3>
			<p>{error}</p>
			<button on:click={fetchTodos}>Попробовать снова</button>
		</div>
	{:else if loading}
		<div class="loading">
			<div class="spinner"></div>
			<p>Загружаем задачи...</p>
		</div>
	{:else}
		<!-- Фильтры и поиск -->
		<div class="filters">
			<div class="search-box">
				<input
					type="text"
					placeholder="🔍 Поиск задач..."
					bind:value={searchQuery}
				/>
			</div>

			<div class="category-filter">
				<select bind:value={selectedCategory}>
					<option value="all">Все категории</option>
					{#each categories as category (category)}
						<option value={category}>{category}</option>
					{/each}
				</select>
			</div>
		</div>

		<!-- Статистика -->
		<div class="stats">
			<div class="stat-item">
				<span class="stat-number">{totalTodos}</span>
				<span class="stat-label">Всего</span>
			</div>
			<div class="stat-item">
				<span class="stat-number">{completedTodos}</span>
				<span class="stat-label">Выполнено</span>
			</div>
			<div class="stat-item">
				<span class="stat-number">{pendingTodos}</span>
				<span class="stat-label">В работе</span>
			</div>
		</div>

		<!-- Список задач -->
		<div class="todos-grid">
			{#each filteredTodos as todo (todo.id)}
				<div class="todo-card {todo.completed ? 'completed' : ''}">
					{#if todo.image}
						<div class="todo-image">
							<img src={todo.image} alt={todo.title} />
						</div>
					{/if}

					<div class="todo-content">
						<div class="todo-header">
							<h3 class="todo-title">
								{#if todo.completed}
									<span class="completed-icon">✅</span>
								{:else}
									<span class="pending-icon">⏳</span>
								{/if}
								{todo.title}
							</h3>

							{#if todo.category}
								<span class="category-badge">{todo.category}</span>
							{/if}
						</div>

						{#if todo.description}
							<p class="todo-description">{todo.description}</p>
						{/if}

						<div class="todo-meta">
							{#if todo.dueDate}
								<div class="due-date {getDueDateStatus(todo.dueDate)}">
									<span class="date-icon">📅</span>
									{formatDate(todo.dueDate)}
								</div>
							{/if}

							{#if todo.createdAt}
								<div class="created-date">
									<span class="date-icon">📝</span>
									{formatDate(todo.createdAt)}
								</div>
							{/if}
						</div>

						{#if todo.tags && todo.tags.length > 0}
							<div class="tags">
								{#each todo.tags as tag (tag)}
									<span class="tag">#{tag}</span>
								{/each}
							</div>
						{/if}
					</div>
				</div>
			{/each}
		</div>

		{#if filteredTodos.length === 0}
			<div class="empty-state">
				<h3>🤷‍♀️ Задач не найдено</h3>
				<p>Попробуйте изменить фильтры или поисковый запрос</p>
			</div>
		{/if}
	{/if}
</div>

<style>
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 20px;
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
			sans-serif;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30px;
		padding-bottom: 20px;
		border-bottom: 2px solid #f0f0f0;
	}

	.header h1 {
		margin: 0;
		color: #333;
		font-size: 2.5rem;
	}

	.refresh-btn {
		background: #007bff;
		color: white;
		border: none;
		padding: 10px 20px;
		border-radius: 8px;
		cursor: pointer;
		font-size: 16px;
		transition: background-color 0.2s;
	}

	.refresh-btn:hover:not(:disabled) {
		background: #0056b3;
	}

	.refresh-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.error {
		background: #fff3cd;
		border: 1px solid #ffeaa7;
		padding: 20px;
		border-radius: 8px;
		text-align: center;
		color: #856404;
	}

	.error button {
		background: #ffc107;
		color: #856404;
		border: none;
		padding: 10px 20px;
		border-radius: 4px;
		cursor: pointer;
		margin-top: 10px;
	}

	.loading {
		text-align: center;
		padding: 40px;
		color: #666;
	}

	.spinner {
		width: 40px;
		height: 40px;
		border: 4px solid #f3f3f3;
		border-top: 4px solid #007bff;
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin: 0 auto 20px;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.filters {
		display: flex;
		gap: 20px;
		margin-bottom: 30px;
		flex-wrap: wrap;
	}

	.search-box input {
		padding: 12px 16px;
		border: 2px solid #e0e0e0;
		border-radius: 8px;
		font-size: 16px;
		width: 300px;
		max-width: 100%;
	}

	.search-box input:focus {
		outline: none;
		border-color: #007bff;
	}

	.category-filter select {
		padding: 12px 16px;
		border: 2px solid #e0e0e0;
		border-radius: 8px;
		font-size: 16px;
		background: white;
		cursor: pointer;
	}

	.stats {
		display: flex;
		gap: 20px;
		margin-bottom: 30px;
		flex-wrap: wrap;
	}

	.stat-item {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		padding: 20px;
		border-radius: 12px;
		text-align: center;
		min-width: 120px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.stat-number {
		display: block;
		font-size: 2rem;
		font-weight: bold;
		margin-bottom: 5px;
	}

	.stat-label {
		font-size: 0.9rem;
		opacity: 0.9;
	}

	.todos-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
		gap: 20px;
		margin-bottom: 30px;
	}

	.todo-card {
		background: white;
		border-radius: 12px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		overflow: hidden;
		transition:
			transform 0.2s,
			box-shadow 0.2s;
		border: 2px solid transparent;
	}

	.todo-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
	}

	.todo-card.completed {
		border-color: #28a745;
		opacity: 0.8;
	}

	.todo-image {
		height: 150px;
		overflow: hidden;
	}

	.todo-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.todo-content {
		padding: 20px;
	}

	.todo-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 10px;
		gap: 10px;
	}

	.todo-title {
		margin: 0;
		font-size: 1.2rem;
		color: #333;
		display: flex;
		align-items: center;
		gap: 8px;
		flex: 1;
	}

	.completed-icon,
	.pending-icon {
		font-size: 1rem;
	}

	.category-badge {
		background: #e9ecef;
		color: #495057;
		padding: 4px 8px;
		border-radius: 4px;
		font-size: 0.8rem;
		white-space: nowrap;
	}

	.todo-description {
		color: #666;
		margin: 10px 0;
		line-height: 1.5;
	}

	.todo-meta {
		display: flex;
		gap: 15px;
		margin: 15px 0;
		flex-wrap: wrap;
	}

	.due-date,
	.created-date {
		display: flex;
		align-items: center;
		gap: 5px;
		font-size: 0.9rem;
		color: #666;
	}

	.due-date.overdue {
		color: #dc3545;
		font-weight: bold;
	}

	.due-date.today {
		color: #ffc107;
		font-weight: bold;
	}

	.due-date.soon {
		color: #fd7e14;
		font-weight: bold;
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin-top: 15px;
	}

	.tag {
		background: #f8f9fa;
		color: #495057;
		padding: 2px 6px;
		border-radius: 4px;
		font-size: 0.8rem;
		border: 1px solid #dee2e6;
	}

	.empty-state {
		text-align: center;
		padding: 60px 20px;
		color: #666;
	}

	.empty-state h3 {
		margin-bottom: 10px;
		font-size: 1.5rem;
	}

	@media (max-width: 768px) {
		.container {
			padding: 15px;
		}

		.header {
			flex-direction: column;
			gap: 15px;
			text-align: center;
		}

		.filters {
			flex-direction: column;
		}

		.search-box input {
			width: 100%;
		}

		.todos-grid {
			grid-template-columns: 1fr;
		}

		.stats {
			justify-content: center;
		}
	}
</style>
