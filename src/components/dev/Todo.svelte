<script lang="ts">
	import { useDeleteTodoMutation, useGetTodosQuery } from '../../api/todo';

	let deletingId = $state<number | null>(null);

	const todosQuery = useGetTodosQuery();
	const deleteMutation = useDeleteTodoMutation();
	const { data: todos, isLoading, error } = $derived($todosQuery);
	const { mutateAsync: deleteTodo } = $derived($deleteMutation);

	const handleDelete = async (id: number) => {
		try {
			deletingId = id;
			await deleteTodo(id);
		} catch (err) {
			console.error('Ошибка при удалении:', err);
		} finally {
			deletingId = null;
		}
	};
</script>

<section class="todo_section">
	<div class="container">
		<div class="content">
			<h1>todo_section</h1>

			{#if isLoading}
				<div class="loading">
					<p>Загрузка...</p>
				</div>
			{:else if error}
				<div class="error">
					<p>Ошибка: {error.message}</p>
				</div>
			{:else if todos}
				<div class="todos">
					<h2>Список задач ({todos.length})</h2>
					<ul class="todos_list">
						{#each todos as todo (todo.id)}
							<li class="todo_item">
								<span class="todo_title">{todo.title}</span>
								<button
									class="delete_btn"
									onclick={() => handleDelete(todo.id)}
									disabled={deletingId === todo.id}
								>
									{deletingId === todo.id ? 'Удаление...' : 'Удалить'}
								</button>
							</li>
						{/each}
					</ul>
				</div>
			{:else}
				<div class="empty">
					<p>Нет задач</p>
				</div>
			{/if}
		</div>
	</div>
</section>

<style lang="scss">
	.todo_section {
		padding: 2rem 0;
		.content {
			.loading,
			.error,
			.empty {
				text-align: center;
				padding: 2rem;
				border-radius: 8px;
				margin: 1rem 0;
			}

			.loading {
				background: rgba(59, 130, 246, 0.1);
				color: #3b82f6;
			}

			.error {
				background: rgba(239, 68, 68, 0.1);
				color: #ef4444;
			}

			.empty {
				background: rgba(156, 163, 175, 0.1);
				color: #6b7280;
			}

			.todos {
				margin: 2rem 0;
			}

			.todos h2 {
				margin-bottom: 1rem;
				color: #1f2937;
			}

			.todos_list {
				list-style: none;
				padding: 0;
				margin: 0;
			}

			.todo_item {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 1rem;
				border: 1px solid #e5e7eb;
				border-radius: 8px;
				margin-bottom: 0.5rem;
				background: white;
				transition: all 0.2s ease;
			}

			.todo_item:hover {
				box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
				border-color: #d1d5db;
			}

			.todo_title {
				flex: 1;
				font-weight: 500;
				color: #374151;
			}

			.delete_btn {
				background: #ef4444;
				color: white;
				border: none;
				padding: 0.5rem 1rem;
				border-radius: 6px;
				cursor: pointer;
				font-size: 0.9rem;
				transition: all 0.2s ease;
			}

			.delete_btn:hover:not(:disabled) {
				background: #dc2626;
				transform: translateY(-1px);
			}

			.delete_btn:disabled {
				background: #9ca3af;
				cursor: not-allowed;
				transform: none;
			}
		}
	}
</style>
