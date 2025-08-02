import {
	createMutation,
	createQuery,
	useQueryClient
} from '@tanstack/svelte-query';
import { api_tmdb } from '..';

const useGetTodosQuery = () => {
	return createQuery<TODO.GetTodoResponse>({
		queryKey: ['/todo'],
		queryFn: async () => {
			const response = await api_tmdb.get('/todo');
			return response.data;
		}
	});
};

const useDeleteTodoMutation = () => {
	const queryClient = useQueryClient();
	return createMutation<TODO.DeleteTodoRes, Error, TODO.DeleteTodoReq>({
		mutationFn: async (id) => {
			const response = await api_tmdb.delete(`/todo/${id}`);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['/todo'] });
		}
	});
};

export { useGetTodosQuery, useDeleteTodoMutation };
