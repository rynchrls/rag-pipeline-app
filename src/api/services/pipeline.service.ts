import { AxiosError } from 'axios';
import { getApiClient } from '../apiClient';
import API_ENDPOINTS from '../endpoints';

export default class PipelineSvc {
    static client = getApiClient();

    static async add(data: Record<string, unknown> | FormData) {
        try {
            return await this.client.post(API_ENDPOINTS.add(), data);
        } catch (error) {
            const axiosError = error as AxiosError;
            type ErrorResponse = { message?: string };
            const data = axiosError.response?.data as ErrorResponse | undefined;
            const message = data?.message || 'Register failed';
            throw new Error(message);
        }
    }

    static async update(data: Record<string, unknown> | FormData) {
        try {
            return await this.client.put(API_ENDPOINTS.update(), data);
        } catch (error) {
            const axiosError = error as AxiosError;
            type ErrorResponse = { message?: string };
            const data = axiosError.response?.data as ErrorResponse | undefined;
            const message = data?.message || 'Update failed';
            throw new Error(message);
        }
    }

    static async get(params: { id: string, author_id: number }) {
        try {
            return await this.client.get(`${API_ENDPOINTS.get()}?id=${params.id}&author_id=${params.author_id}`);
        } catch (error) {
            const axiosError = error as AxiosError;
            type ErrorResponse = { message?: string };
            const data = axiosError.response?.data as ErrorResponse | undefined;
            const message = data?.message || 'Request failed';
            throw new Error(message);
        }
    }

}
