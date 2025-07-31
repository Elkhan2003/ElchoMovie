<script lang="ts">
	import { useDeleteTodoMutation, useGetTodosQuery } from "../../../api/todo";

	// Queries и mutations
	const todosQuery = useGetTodosQuery();
	const deleteMutation = useDeleteTodoMutation();

	// Деструктуризация данных
	$: ({ data: todos, isLoading, error } = $todosQuery);
	$: ({ mutateAsync: deleteTodo, isPending: isDeleting } = $deleteMutation);

	function handleDelete(id: number) {
		deleteTodo(id);
	}
</script>

<!-- UI -->
<section>
	HomePage
	{#if isLoading}
		<p>Загрузка...</p>
	{:else if error}
		<p>Ошибка: {error.message}</p>
	{:else if todos}
		<ul>
			{#each todos as todo (todo.id)}
				<li>
					{todo.title}
					<button onclick={() => handleDelete(todo.id)} disabled={isDeleting}>
						{isDeleting ? "Удаление..." : "Удалить"}
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</section>
