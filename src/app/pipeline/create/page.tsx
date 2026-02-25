"use client";

import { useState } from "react";
import Stage1 from "./stage1";
import Stage2 from "./stage2";
import Stage3 from "./stage3";

export default function CreatePipelineWizard() {
  const [stage, setStage] = useState(1);
  const [pipelineData, setPipelineData] = useState<any>(null);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      {stage === 1 && (
        <Stage1
          onNext={(data) => {
            setPipelineData(data);
            setStage(2);
          }}
        />
      )}

      {stage === 2 && (
        <Stage2
          pipelineData={pipelineData}
          onNext={(chunkData) => {
            setPipelineData({ ...pipelineData, chunkData });
            setStage(3);
          }}
          onBack={() => setStage(1)}
        />
      )}

      {stage === 3 && (
        <Stage3 pipelineData={pipelineData} onBack={() => setStage(2)} />
      )}
    </div>
  );
}
