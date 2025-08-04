import { createQuery } from '@tanstack/svelte-query';
import { api_tmdb } from '..';

const useGetPopularQuery = (type: POPULAR.GetPopularReq) => {
	return createQuery<POPULAR.GetPopularRes, Error>({
		queryKey: [`/${type}/popular`],
		queryFn: async () => {
			const response = await api_tmdb.get(`/${type}/popular`);
			return response.data;
		}
	});
};

export { useGetPopularQuery };
