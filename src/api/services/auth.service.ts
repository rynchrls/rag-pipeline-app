import { AxiosError } from 'axios';
import { getApiClient } from '../apiClient';
import API_ENDPOINTS from '../endpoints';

export default class AuthSvc {
    static client = getApiClient();

    static async register(data: Record<string, unknown>) {
        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { confirmPassword: _, ...payload } = data;
            return await this.client.post(API_ENDPOINTS.register(), payload);
        } catch (error) {
            const axiosError = error as AxiosError;
            type ErrorResponse = { message?: string };
            const data = axiosError.response?.data as ErrorResponse | undefined;
            const message = data?.message || 'Register failed';
            throw new Error(message);
        }
    }

    static async login(data: Record<string, unknown>) {
        try {
            return await this.client.post(API_ENDPOINTS.login(), data);
        } catch (error) {
            const axiosError = error as AxiosError;
            type ErrorResponse = { message?: string };
            const data = axiosError.response?.data as ErrorResponse | undefined;
            const message = data?.message || 'Login failed';
            throw new Error(message);
        }
    }
}
