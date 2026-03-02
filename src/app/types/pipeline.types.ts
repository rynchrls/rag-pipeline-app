

export interface Pipeline {
    id: number;
    title: string;
    agent_name: string;
    description: string;
    author_id: number;
    created_at: Date;
    updated_at: Date;
}

export interface PipelineStage extends Pipeline {
    email: string;
    file_names: string[];
    file_count: number;
    stage: number;
    rp_metadata: {
        chunking: {
            size: number;
            overlap: number;
            strategy: string;
            created_at: Date;
            include_metadata: boolean;
        }
    }
}

export interface GetPipelineStage extends PipelineStage {
    files: File[];

}