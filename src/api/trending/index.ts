import { createQuery } from '@tanstack/svelte-query';
import { api_tmdb } from '..';

const useGetTrendingQuery = (date: TRADING.GetTradingsReq) => {
	return createQuery<TRADING.GetTradingsRes, Error>({
		queryKey: [`/trending/movie/${date}`],
		queryFn: async () => {
			const response = await api_tmdb.get(`/trending/movie/${date}`);
			return response.data;
		}
	});
};

export { useGetTrendingQuery };
