import React from 'react';
import StageListItem from './StageListItem';
import { StageListWrapper } from './StageList.style';
import stages from './stage_mock.json';

interface StageListProps {
  setStageId: (stageId: string) => void;
}

const StageList: React.FunctionComponent<StageListProps> = ({ setStageId }) => (
  <StageListWrapper>
    {stages.map((stage) => (
      <StageListItem key={stage.title} setStageId={setStageId} {...stage} />
    ))}
  </StageListWrapper>
);

export default StageList;
