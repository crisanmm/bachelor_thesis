import { useEffect, useState } from 'react';
import type { Stage as StageType } from '#types/stage';

interface useStageTuple extends Array<any> {
  0: StageType | null;
  1: (stage: StageType) => void;
}

interface useStageType {
  (): useStageTuple;
}

const useStage: useStageType = () => {
  const [stage, _setStage] = useState<StageType>(() => {
    // Make sure this is only run on browser
    if (typeof window !== 'undefined') return JSON.parse(localStorage.getItem('stage')!);
    return null;
  });

  const setStage = (stage: StageType) => {
    // Make sure this is only run on browser
    if (typeof window !== 'undefined') _setStage(stage);
  };

  useEffect(() => {
    // Make sure this is only run on browser
    if (typeof window !== 'undefined' && localStorage.getItem('stage') !== JSON.stringify(stage)) {
      localStorage.setItem('stage', JSON.stringify(stage) as string);
      window.location.reload();
    }
  }, [stage]);

  return [stage, setStage as (stage: StageType) => void];
};

export default useStage;
