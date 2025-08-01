import { useQuery } from '@tanstack/vue-query';
import { api_tmdb } from '..';

const useGetTopRatedQuery = (type: Ref<TOP_RATED.GetTopRatedReq>) => {
	return useQuery<TOP_RATED.GetTopRatedRes, Error>({
		queryKey: computed(() => [`/${type.value}/top_rated`]),
		queryFn: async () => {
			const response = await api_tmdb.get(`/${type.value}/top_rated`);
			return response.data;
		}
	});
};

export { useGetTopRatedQuery };
