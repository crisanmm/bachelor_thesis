import styled from 'styled-components';
import { Avatar } from '@material-ui/core';

const StyledChooseAvatarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing(1)}px;
`;

const StyledChooseAvatar = styled(Avatar)`
  // change size
  height: ${({ theme }) => theme.spacing(15)}px;
  width: ${({ theme }) => theme.spacing(15)}px;

  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.create('filter')};

  :hover {
    filter: blur(0.5px) brightness(85%);
  }
`;

const StyledChooseAvatarLabel = styled.label`
  z-index: -1;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export { StyledChooseAvatarWrapper, StyledChooseAvatar, StyledChooseAvatarLabel };
