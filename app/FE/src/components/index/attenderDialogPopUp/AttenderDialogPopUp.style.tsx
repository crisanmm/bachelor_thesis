import styled from 'styled-components';
import { Paper, Avatar } from '@material-ui/core';

const StyledAttenderMenuWrapper = styled(Paper)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ theme }) => theme.spacing(2)}px;
`;

const StyledAvatar = styled(Avatar)`
  margin: ${({ theme }) => theme.spacing(1)}px;
  // change size
  height: ${({ theme }) => theme.spacing(10)}px;
  width: ${({ theme }) => theme.spacing(10)}px;
`;

export { StyledAttenderMenuWrapper, StyledAvatar };
