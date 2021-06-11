import styled from 'styled-components';

const StyledStageListWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: stretch;
  flex-wrap: nowrap;
  overflow: scroll;
  padding: ${({ theme }) => theme.spacing(1)}px;
  margin-bottom: ${({ theme }) => theme.spacing(4)}px;
  margin-left: auto;
  margin-right: auto;

  ${({ theme }) => theme.breakpoints.up('lg')} {
    max-width: ${({ theme }) => theme.breakpoints.values.lg}px;
  }
`;

export { StyledStageListWrapper };
