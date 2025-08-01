namespace SEARCH {
	type GetSearchRes = {
		page: number;
		total_pages: number;
		total_results: number;
		results: Array<{
			adult: boolean;
			backdrop_path?: string;
			id: number;
			name?: string;
			original_name?: string;
			overview?: string;
			poster_path?: string;
			media_type: string;
			original_language?: string;
			genre_ids?: Array<number>;
			popularity: number;
			first_air_date?: string;
			vote_average?: number;
			vote_count?: number;
			origin_country?: Array<string>;
			title?: string;
			original_title?: string;
			release_date?: string;
			video?: boolean;
			gender?: number;
			known_for_department?: string;
			profile_path?: string;
			known_for?: Array<{
				adult: boolean;
				backdrop_path: string;
				id: number;
				name: string;
				original_name: string;
				overview: string;
				poster_path: string;
				media_type: string;
				original_language: string;
				genre_ids: Array<number>;
				popularity: number;
				first_air_date: string;
				vote_average: number;
				vote_count: number;
				origin_country: Array<string>;
			}>;
		}>;
	};
	type GetSearchReq = {
		search: string;
		page: number;
	};
}
