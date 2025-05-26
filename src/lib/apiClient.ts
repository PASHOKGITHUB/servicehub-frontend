// import axios, { AxiosError, AxiosResponse } from "axios";
// import Cookies from "js-cookie";

// // Set base URL to match your backend server
// const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000/api/v1';

// const ApiClient = axios.create({
//   baseURL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   withCredentials: true, // Important for cookies
// });

// // Request interceptor for auth token
// ApiClient.interceptors.request.use(
//   (config) => {
//     const token = Cookies.get('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor for handling common errors
// ApiClient.interceptors.response.use(
//   (response: AxiosResponse) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       Cookies.remove('token');
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

// export default ApiClient;