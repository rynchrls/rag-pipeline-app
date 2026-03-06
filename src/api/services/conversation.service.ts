import { AxiosError } from 'axios';
import { getApiClient } from '../apiClient';
import API_ENDPOINTS from '../endpoints';

export default class ConversationSvc {
    static client = getApiClient();

    static async add(data: Record<string, unknown> | FormData) {
        try {
            return await this.client.post(API_ENDPOINTS.c_add(), data);
        } catch (error) {
            const axiosError = error as AxiosError;
            type ErrorResponse = { message?: string };
            const data = axiosError.response?.data as ErrorResponse | undefined;
            const message = data?.message || 'Register failed';
            throw new Error(message);
        }
    }

    static async get(params: { author_id: number, conversation_id: number, page: number, limit: number }) {
        try {
            return await this.client.get(API_ENDPOINTS.c_get(params.author_id, params.conversation_id, params.page, params.limit));
        } catch (error) {
            const axiosError = error as AxiosError;
            type ErrorResponse = { message?: string };
            const data = axiosError.response?.data as ErrorResponse | undefined;
            const message = data?.message || 'Request failed';
            throw new Error(message);
        }
    }

    static async get_all(params: { author_id: number, page: number, limit: number }) {
        try {
            return await this.client.get(API_ENDPOINTS.c_get_all(params.author_id, params.page, params.limit));
        } catch (error) {
            const axiosError = error as AxiosError;
            type ErrorResponse = { message?: string };
            const data = axiosError.response?.data as ErrorResponse | undefined;
            const message = data?.message || 'Request failed';
            throw new Error(message);
        }
    }

    static async delete(params: { conversation_id: number, author_id: number }) {
        try {
            return await this.client.delete(API_ENDPOINTS.c_del(params.conversation_id, params.author_id));
        } catch (error) {
            const axiosError = error as AxiosError;
            type ErrorResponse = { message?: string };
            const data = axiosError.response?.data as ErrorResponse | undefined;
            const message = data?.message || 'Request failed';
            throw new Error(message);
        }
    }

}
