import { AuthEndpoints } from "./auth.endpoint";
import { PipelineEndpoints } from "./pipeline.endpoint"

const API_ENDPOINTS = {
    ...AuthEndpoints,
    ...PipelineEndpoints
};

export default API_ENDPOINTS;
