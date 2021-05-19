import styled from 'styled-components';
import { Divider } from '@material-ui/core';

const StyledDivider = styled(Divider)`
  width: 100%;
  margin: ${({ theme }) => theme.spacing(1)}px;
`;

export { StyledDivider };
