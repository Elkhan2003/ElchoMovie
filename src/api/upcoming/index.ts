import { createQuery } from '@tanstack/svelte-query';
import { api_tmdb } from '..';

const useGetUpcomingQuery = () => {
	return createQuery<UPCOMING.GetUpcomingRes, Error>({
		queryKey: [`/movie/upcoming`],
		queryFn: async () => {
			const response = await api_tmdb.get(`/movie/upcoming`);
			return response.data;
		}
	});
};

export { useGetUpcomingQuery };
