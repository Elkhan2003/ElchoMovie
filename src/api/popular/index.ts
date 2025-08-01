import { useQuery } from '@tanstack/vue-query';
import { api_tmdb } from '..';

const useGetPopularQuery = (type: Ref<POPULAR.GetPopularReq>) => {
	return useQuery<POPULAR.GetPopularRes, Error>({
		queryKey: computed(() => [`/${type.value}/popular`]),
		queryFn: async () => {
			const response = await api_tmdb.get(`/${type.value}/popular`);
			return response.data;
		}
	});
};

export { useGetPopularQuery };
