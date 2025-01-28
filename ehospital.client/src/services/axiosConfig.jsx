import React from 'react';
import axios from "axios";

import { apiConfig } from "./apiConfig";



// Configure Axios defaults
axios.defaults.baseURL = apiConfig.BASE_URL;

 // Sets up Axios interceptors for request and response handling.
 // Add the token to the headerrs for every single request made in the website
 // Handles 401 errors by refreshing the access token and retrying the request.

export const setupAxiosInterceptors = () => {
    // Add the token to the headerrs for every single request made in the website
    axios.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem("accessToken");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // Handle if there is a 401 error so it refreshes the token using the refresh token
    axios.interceptors.response.use(
        (response) => {
            // if there is no problem with the response, return it
            return response;
        },
        async (error) => {
            const originalRequest = error.config;

            // if the error is (Unauthorized) which is when the token is expired
            if (
                error.response &&
                error.response.status === 401 &&
                !originalRequest._retry
            ) {
                // Mark this request so we know we've already retried it
                originalRequest._retry = true;

                try {
                    // Attempt to refresh the token
                    const newAccessToken = await refreshToken();

                    localStorage.setItem("accessToken", newAccessToken);

                    // Update the header for the request
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                    // send the request again with the new token
                    return axios(originalRequest);
                } catch (refreshError) {
                    // If token refresh fails, Delete tokens and navigate to login
                    console.error("Token refresh failed:", refreshError);
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("refreshToken");
                    window.location.href = "/login";
                    return Promise.reject(refreshError);
                }
            }

            return Promise.reject(error);
        }
    );
};

// Refreshes the access token using the refresh token.

const refreshToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
        throw new Error("No refresh token available.");
    }

    try {
        const response = await axios.post(`${apiConfig.REFRESH_TOKEN_URL}`, {
            refreshToken,
        });

        if (response.status === 200 && response.data.accessToken) {
            return response.data.accessToken;
        } else {
            throw new Error("Failed to refresh token.");
        }
    } catch (error) {
        console.error("Refresh token request failed:", error);
        throw error;
    }
};

export default setupAxiosInterceptors;
