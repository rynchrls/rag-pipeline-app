export interface PipelineEndpoints {
    add: () => string
    get: () => string
    update: () => string
}


export const PipelineEndpoints: PipelineEndpoints = {
    add: () => '/api/v1/pipelines',
    get: () => '/api/v1/pipelines',
    update: () => '/api/v1/pipelines'
}