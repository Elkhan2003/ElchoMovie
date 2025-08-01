import { useQuery } from '@tanstack/vue-query';
import { api_tmdb } from '..';

const useGetTradingsQuery = (date: Ref<TRADING.GetTradingsReq>) => {
	return useQuery<TRADING.GetTradingsRes, Error>({
		queryKey: computed(() => [`/trending/movie/${date.value}`]),
		queryFn: async () => {
			const response = await api_tmdb.get(`/trending/movie/${date.value}`);
			return response.data;
		}
	});
};

export { useGetTradingsQuery };
