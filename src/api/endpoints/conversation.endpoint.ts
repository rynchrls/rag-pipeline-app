export interface ConversationEndpoints {
    c_add: () => string
    c_get: (author_id: number, conversation_id: number, page: number, limit: number) => string
    c_get_all: (author_id: number, page: number, limit: number) => string
    c_del: (conversation_id: number, author_id: number) => string
}

export const ConversationEndpoints: ConversationEndpoints = {
    c_add: () => '/api/v1/conversations',
    c_get: (author_id: number, conversation_id: number, page: number, limit: number) => `/api/v1/conversations?author_id=${author_id}&conversation_id=${conversation_id}&page=${page}&limit=${limit}`,
    c_get_all: (author_id: number, page: number, limit: number) => `/api/v1/conversations/all?author_id=${author_id}&page=${page}&limit=${limit}`,
    c_del: (conversation_id: number, author_id: number) => `/api/v1/conversations/${conversation_id}?author_id=${author_id}`,
}