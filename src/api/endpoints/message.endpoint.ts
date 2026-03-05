export interface MessageEndpoints {
    m_add: () => string
    m_add_llm: () => string
    m_get_all: (author_id: number, pipeline_id: number, page: number, limit: number, conversation_id: number) => string
}

export const MessageEndpoints: MessageEndpoints = {
    m_add: () => '/api/v1/messages',
    m_add_llm: () => '/api/v1/messages/llm',
    m_get_all: (author_id: number, pipeline_id: number, page: number, limit: number, conversation_id: number) => `/api/v1/messages/all?author_id=${author_id}&pipeline_id=${pipeline_id}&conversation_id=${conversation_id}&page=${page}&limit=${limit}`,
}