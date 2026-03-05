

export interface Conversation {
    id: number,
    name: string,
    author_id: number,
    createdAt: Date,
    updatedAt: Date,
}

export interface GetConversations {
    message: string,
    data: Conversation[],
    pagination: {
        page: number,
        limit: number,
        total: number,
        has_next: boolean,
        has_prev: boolean,
    }
}