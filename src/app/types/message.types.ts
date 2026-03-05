

export interface BaseMessage {
    id?: number,
    role: string,
    content: string,
    pipeline_id: number,
    author_id: number,
    agent_name: string,
    createdAt?: Date,
    updatedAt?: Date,
}


export interface GetMessages {
    message: string,
    data: BaseMessage[],
    pagination: {
        page: number,
        limit: number,
        total: number,
        has_next: boolean,
        has_prev: boolean,
    }
}
