import { AxiosError } from 'axios';
import { getApiClient } from '../apiClient';
import API_ENDPOINTS from '../endpoints';

export default class MessageSvc {
    static client = getApiClient();

    static async add(data: Record<string, unknown> | FormData) {
        try {
            return await this.client.post(API_ENDPOINTS.m_add(), data);
        } catch (error) {
            const axiosError = error as AxiosError;
            type ErrorResponse = { message?: string };
            const data = axiosError.response?.data as ErrorResponse | undefined;
            const message = data?.message || 'Register failed';
            throw new Error(message);
        }
    }

    static async add_llm(data: Record<string, unknown> | FormData) {
        try {
            return await this.client.post(API_ENDPOINTS.m_add_llm(), data);
        } catch (error) {
            const axiosError = error as AxiosError;
            type ErrorResponse = { message?: string };
            const data = axiosError.response?.data as ErrorResponse | undefined;
            const message = data?.message || 'Register failed';
            throw new Error(message);
        }
    }

    static async get_all(params: { author_id: number, pipeline_id: number, page: number, limit: number, conversation_id: number }) {
        try {
            return await this.client.get(API_ENDPOINTS.m_get_all(params.author_id, params.pipeline_id, params.page, params.limit, params.conversation_id));
        } catch (error) {
            const axiosError = error as AxiosError;
            type ErrorResponse = { message?: string };
            const data = axiosError.response?.data as ErrorResponse | undefined;
            const message = data?.message || 'Request failed';
            throw new Error(message);
        }
    }

}
