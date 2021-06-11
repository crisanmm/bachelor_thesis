import React from 'react';
import StageListItem from './StageListItem';
import { StyledStageListWrapper } from './StageList.style';
import type { Stage as StageType } from '#types/stage';

interface StageListProps {
  stages: StageType[];
  setStage: (stage: any) => void;
}

const StageList: React.FunctionComponent<StageListProps> = ({ stages, setStage }) => (
  <StyledStageListWrapper>
    {stages.map((stage) => (
      <StageListItem key={stage.title} setStage={setStage} {...stage} />
    ))}
  </StyledStageListWrapper>
);

export default StageList;
