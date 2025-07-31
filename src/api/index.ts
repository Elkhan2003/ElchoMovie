// import { browser } from "$app/environment";
import axios from "axios";

export const api = axios.create({
	baseURL: "https://1116a39bcd510908.mokky.dev",
	timeout: 5000,
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
