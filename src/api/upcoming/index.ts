import { useQuery } from '@tanstack/vue-query';
import { api_tmdb } from '..';

const useGetUpcomingQuery = () => {
	return useQuery<UPCOMING.GetUpcomingRes, Error>({
		queryKey: computed(() => [`/movie/upcoming`]),
		queryFn: async () => {
			const response = await api_tmdb.get(`/movie/upcoming`);
			return response.data;
		}
	});
};

export { useGetUpcomingQuery };
