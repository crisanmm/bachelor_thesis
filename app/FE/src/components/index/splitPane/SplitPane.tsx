import React from 'react';
import { StyledSplitPane, StyledSplitPaneItem } from './SplitPane.style';

interface SplitPaneProps {
  left: React.ReactNode;
  right: React.ReactNode;
  percentage: number;
}

const SplitPane: React.FunctionComponent<SplitPaneProps> = ({ left, right, percentage }) => (
  <StyledSplitPane>
    <StyledSplitPaneItem percentage={percentage}>{left}</StyledSplitPaneItem>
    <StyledSplitPaneItem percentage={100 - percentage}>{right}</StyledSplitPaneItem>
  </StyledSplitPane>
);

export default SplitPane;
