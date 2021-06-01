import { useEffect, useState } from 'react';

interface useStageIdTuple extends Array<any> {
  0: string | null;
  1: (stageId: string) => void;
}

interface useStageIdType {
  (): useStageIdTuple;
}

const useStageId: useStageIdType = () => {
  const [stageId, _setStageId] = useState(() => {
    // Make sure this is only run on browser
    if (typeof window !== 'undefined') return localStorage.getItem('stageId');
    return null;
  });

  const setStageId = (stageId: string) => {
    // Make sure this is only run on browser
    if (typeof window !== 'undefined') _setStageId(stageId);
  };
  console.log('🚀  -> file: useStageId.tsx  -> line 21  -> stageId', stageId);

  useEffect(() => {
    // Make sure this is only run on browser
    if (typeof window !== 'undefined' && localStorage.getItem('stageId') !== stageId) {
      localStorage.setItem('stageId', stageId as string);
      window.location.reload();
    }
  }, [stageId]);

  return [stageId, setStageId as (stageId: string) => void];
};

export default useStageId;
