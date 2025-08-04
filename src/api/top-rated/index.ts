import { createQuery } from '@tanstack/svelte-query';
import { api_tmdb } from '..';

const useGetTopRatedQuery = (type: TOP_RATED.GetTopRatedReq) => {
	return createQuery<TOP_RATED.GetTopRatedRes, Error>({
		queryKey: [`/${type}/top_rated`],
		queryFn: async () => {
			const response = await api_tmdb.get(`/${type}/top_rated`);
			return response.data;
		}
	});
};

export { useGetTopRatedQuery };
