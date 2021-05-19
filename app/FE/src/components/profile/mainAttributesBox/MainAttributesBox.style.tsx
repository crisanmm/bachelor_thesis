import { CircularProgress } from '@material-ui/core';
import styled from 'styled-components';

const StyledCircularProgress = styled((props) => (
  <div {...props}>
    <CircularProgress variant="indeterminate" />
  </div>
))`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledButtonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  margin-top: ${({ theme }) => theme.spacing(0.5)}px;

  button {
    margin-top: ${({ theme }) => theme.spacing(0.5)}px;
    margin-bottom: ${({ theme }) => theme.spacing(0.5)}px;
  }
`;

export { StyledCircularProgress, StyledButtonsWrapper };
