export interface PipelineEndpoints {
    add: () => string
    get: () => string
    update: () => string
    get_all: (author_id: number, page: number, limit: number, search: string) => string
    del: () => string
}


export const PipelineEndpoints: PipelineEndpoints = {
    add: () => '/api/v1/pipelines',
    get: () => '/api/v1/pipelines',
    update: () => '/api/v1/pipelines',
    get_all: (author_id: number, page: number, limit: number, search: string) => `/api/v1/pipelines/all?author_id=${author_id}&page=${page}&limit=${limit}&search=${search}`,
    del: () => '/api/v1/pipelines'
}