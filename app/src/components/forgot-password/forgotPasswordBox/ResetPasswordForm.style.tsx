import { Button } from '@material-ui/core';
import styled from 'styled-components';
import { StyledLink } from '@components/shared';

const StyledButton = styled(Button)`
  ${({ theme }) => `
  position: absolute;
  color: ${theme.palette.secondary.main};
  top: ${theme.spacing(1.5)}px;
  left: ${theme.spacing(1.5)}px;
  margin: 0px;
  font-weight: bold;
  `}
`;

export default StyledButton;
