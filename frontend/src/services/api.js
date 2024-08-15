import axios from "axios";

/**
 * Creates an Axios instance configured with a base URL and default headers.
 * @author Robert Paronyan
 * @date August 8th, 2024
 * @description This service provides an Axios instance that can be used to make HTTP requests to the backend API.
 * @constant}
 */
const api = axios.create({
    baseURL: "http://localhost:8000",
    headers: {
        "Content-Type": "application/json"
    },
});

/**
 * Axios request interceptor to attach the Authorization header with the Bearer token.
 *
 * @function
 * @param - The Axios request configuration object.
 * @returns The modified request configuration with Authorization header.
 * @throws {Promise} Rejects with the error encountered during the request interception.
 */
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
