import styled from 'styled-components';

const StyledSplitPane = styled.div`
  min-height: 90vh;
  display: flex;
  justify-content: space-evenly;
`;

interface StyledSplitPaneItemProps {
  percentage: number;
}

const StyledSplitPaneItem = styled.div<StyledSplitPaneItemProps>`
  flex-basis: ${(props) => props.percentage}%;
`;

export { StyledSplitPane, StyledSplitPaneItem };
