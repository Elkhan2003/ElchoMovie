import axios from 'axios';

export const api_tmdb = axios.create({
	baseURL: 'https://api.themoviedb.org/3',
	headers: {
		Authorization:
			'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhNDRhMDEwNTljZTg5MDlmYzgxMTQxYjk3MGJjMzhjYyIsIm5iZiI6MTcwMjgwMTIzMS4yMDUsInN1YiI6IjY1N2VhZjRmMDcyOTFjMDdkZjNlZjIzZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.5nJEcU0w0TpoZTgi20a6mQ_ftNMQPbvmqQsjvGLENGM'
	}
});

// export const api = browser
// 	? // Клиентская конфигурация
// 	  axios.create({
// 			baseURL: "https://1116a39bcd510908.mokky.dev",
// 			timeout: 5000,
// 	  })
// 	: // Серверная конфигурация
// 	  axios.create({
// 			baseURL: "http://localhost:5173/api",
// 			timeout: 10000,
// 	  });
