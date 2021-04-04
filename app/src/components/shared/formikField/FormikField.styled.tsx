import styled from 'styled-components';
import { TextField } from '@material-ui/core';

const StyledTextField = styled(TextField)`
  ${({ theme }) => `
  width: 100%;
  margin-bottom: ${theme.spacing(2)}px;
`}
`;

export { StyledTextField };
