// lib/api/apiClient.ts
import axios, { AxiosInstance } from 'axios';

let clientInstance: AxiosInstance | null = null;

// Accept optional token manually
export const getApiClient = (): AxiosInstance => {
    if (!clientInstance) {
        clientInstance = axios.create({
            baseURL: process.env.NEXT_PUBLIC_API_URL,
            timeout: 60000000,
            headers: {
                "ngrok-skip-browser-warning": "1",
            },
        });

        clientInstance.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    if (typeof window !== 'undefined') {
                        window.location.href = '/login';
                    }
                }
                return Promise.reject(error);
            }
        );
    }
    return clientInstance;
};