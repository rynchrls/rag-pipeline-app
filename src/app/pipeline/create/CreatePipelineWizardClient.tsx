"use client";

import { useState, useEffect, useCallback } from "react";
import Stage1 from "@/app/components/stage1";
import Stage2 from "@/app/components/stage2";
import Stage3 from "@/app/components/stage3";
import { GetPipelineStage, PipelineStage } from "@/app/types/pipeline.types";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/app/store/auth";
import PipelineSvc from "@/api/services/pipeline.service";
import { useRouter } from "next/navigation";
import Stage4 from "@/app/components/stage4";

export default function CreatePipelineWizard() {
  const searchParams = useSearchParams();
  const initialStage = parseInt(searchParams.get("stage") || "1");
  const id = searchParams.get("id");
  const { user } = useAuth();
  const [stage, setStage] = useState(initialStage);
  const [pipelineData, setPipelineData] = useState<
    PipelineStage | null | GetPipelineStage
  >(null);
  const [files, setFiles] = useState<File[]>([]);
  const router = useRouter();

  const onBack = useCallback(() => {
    setStage(stage - 1);
  }, [stage]);

  useEffect(() => {
    if (id && user?.id) {
      PipelineSvc.get({ id, author_id: user.id })
        .then((response) => {
          const data = response.data as GetPipelineStage;
          setPipelineData(data);
          setFiles(data.files);
        })
        .catch((error) => {
          console.error("Failed to fetch pipeline:", error);
        });
    }
  }, [id, onBack, user.id]);

  useEffect(() => {
    if (id && user?.id) {
      PipelineSvc.get({ id, author_id: user.id })
        .then((response) => {
          const data = response.data as GetPipelineStage;
          setPipelineData(data);
          setFiles(data.files);
          setStage(data.stage);
          router.push(`/pipeline/create?stage=${data.stage}&id=${data.id}`);
        })
        .catch((error) => {
          console.error("Failed to fetch pipeline:", error);
        });
    }
  }, [id, user?.id, router]);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      {stage === 1 && (
        <Stage1
          pipelineData={pipelineData}
          files={files}
          setFiles={setFiles}
          onNext={(data) => {
            setPipelineData(data);
            setStage(2);
          }}
        />
      )}

      {stage === 2 && (
        <Stage2
          pipelineData={pipelineData}
          onNext={(chunkData: PipelineStage | null | GetPipelineStage) => {
            setPipelineData(chunkData);
            setStage(3);
          }}
          onBack={onBack}
        />
      )}

      {stage === 3 && (
        <Stage3 pipelineData={pipelineData} onBack={() => setStage(2)} />
      )}

      {stage === 4 && <Stage4 pipelineData={pipelineData} />}
    </div>
  );
}
