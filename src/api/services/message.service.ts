import { AxiosError } from 'axios';
import { getApiClient } from '../apiClient';
import API_ENDPOINTS from '../endpoints';

/* ── NDJSON stream event shapes ── */
export interface StreamStartEvent {
    type: 'start';
    message: string;
    data: {
        role: string;
        content: string;
        pipeline_id: number;
        author_id: number;
        agent_name: string;
        conversation_id: number;
    };
}
export interface StreamChunkEvent {
    type: 'chunk';
    content: string;
}
export interface StreamDoneEvent {
    type: 'done';
    message: string;
    data: {
        role: string;
        content: string;
        pipeline_id: number;
        author_id: number;
        agent_name: string;
        conversation_id: number;
    };
}
export type StreamEvent = StreamStartEvent | StreamChunkEvent | StreamDoneEvent;

export default class MessageSvc {
    static client = getApiClient();

    /**
     * POST a user message and consume the NDJSON streaming response.
     * Yields parsed StreamEvents as they arrive.
     */
    static async *addStream(
        data: Record<string, unknown>,
    ): AsyncGenerator<StreamEvent> {
        const baseURL = process.env.NEXT_PUBLIC_API_URL ?? '';
        const url = `${baseURL}${API_ENDPOINTS.m_add()}`;

        const res = await fetch(url, {
            method: 'POST',
            headers: { "Content-Type": "application/json", "ngrok-skip-browser-warning": "1", },
            body: JSON.stringify(data),
        });

        if (!res.ok || !res.body) {
            throw new Error(`Stream request failed: ${res.status} ${res.statusText}`);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });

            // NDJSON: each line is a complete JSON object
            const lines = buffer.split('\n');
            buffer = lines.pop() ?? ''; // keep any incomplete last line

            for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed) continue;
                try {
                    yield JSON.parse(trimmed) as StreamEvent;
                } catch {
                    console.warn('Failed to parse stream line:', trimmed);
                }
            }
        }

        // Flush any remaining buffer content
        if (buffer.trim()) {
            try {
                yield JSON.parse(buffer.trim()) as StreamEvent;
            } catch {
                console.warn('Failed to parse final stream chunk:', buffer);
            }
        }
    }

    static async add_llm(data: Record<string, unknown> | FormData) {
        try {
            return await this.client.post(API_ENDPOINTS.m_add_llm(), data);
        } catch (error) {
            const axiosError = error as AxiosError;
            type ErrorResponse = { message?: string };
            const errData = axiosError.response?.data as ErrorResponse | undefined;
            const message = errData?.message || 'Register failed';
            throw new Error(message);
        }
    }

    static async get_all(params: { author_id: number, pipeline_id: number, page: number, limit: number, conversation_id: number }) {
        try {
            return await this.client.get(API_ENDPOINTS.m_get_all(params.author_id, params.pipeline_id, params.page, params.limit, params.conversation_id));
        } catch (error) {
            const axiosError = error as AxiosError;
            type ErrorResponse = { message?: string };
            const errData = axiosError.response?.data as ErrorResponse | undefined;
            const message = errData?.message || 'Request failed';
            throw new Error(message);
        }
    }
}
