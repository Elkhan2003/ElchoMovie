import { createQuery } from '@tanstack/svelte-query';
import { computed, type Ref } from 'vue';
import { api_tmdb } from '..';

interface UseGetSearchQueryOptions {
	enabled?: Ref<boolean> | (() => boolean);
}

const useGetSearchQuery = (
	params: Ref<SEARCH.GetSearchReq>,
	options?: UseGetSearchQueryOptions
) => {
	return createQuery<SEARCH.GetSearchRes, Error>({
		queryKey: computed(() => [
			'search',
			params.value.search,
			params.value.page
		]),
		queryFn: async () => {
			const { search, page } = params.value;

			if (!search || search.trim().length === 0) {
				throw new Error('Search query is required');
			}

			const url = `/search/multi`;
			const response = await api_tmdb.get(url, {
				params: {
					query: search.trim(),
					page: page || 1,
					include_adult: false,
					language: 'ru-RU'
				}
			});

			return response.data;
		},
		enabled: options?.enabled,
		// Кэшируем результаты на 5 минут
		staleTime: 5 * 60 * 1000,
		// Повторяем запрос при ошибке
		retry: 2,
		// Не выполняем запрос в фоне при фокусе окна
		refetchOnWindowFocus: false
	});
};

export { useGetSearchQuery };
