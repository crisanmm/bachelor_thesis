import { StyledSplitPane, StyledSplitPaneItem } from './SplitPane.style';

const SplitPane = ({ left, right, percentage }) => {
  return (
    <StyledSplitPane>
      <StyledSplitPaneItem percentage={percentage}>{left}</StyledSplitPaneItem>
      <StyledSplitPaneItem percentage={100 - percentage}>{right}</StyledSplitPaneItem>
    </StyledSplitPane>
  );
};

export default SplitPane;
