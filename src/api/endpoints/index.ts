import { AuthEndpoints } from "./auth.endpoint";
import { PipelineEndpoints } from "./pipeline.endpoint"
import { MessageEndpoints } from "./message.endpoint"
import { ConversationEndpoints } from "./conversation.endpoint";

const API_ENDPOINTS = {
    ...AuthEndpoints,
    ...PipelineEndpoints,
    ...MessageEndpoints,
    ...ConversationEndpoints
};

export default API_ENDPOINTS;
