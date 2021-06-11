import styled from 'styled-components';
import { CircularProgress } from '@material-ui/core';

const StyledCircularProgress = styled((props) => (
  <div {...props}>
    <CircularProgress variant="indeterminate" />
  </div>
))`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: ${({ theme }) => theme.spacing(2)}px;
`;

export default StyledCircularProgress;
