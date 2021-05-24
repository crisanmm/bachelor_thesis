import styled, { DefaultTheme, keyframes } from 'styled-components';
import { MoreVert } from '@material-ui/icons';
import { Avatar, Paper, Badge, IconButton } from '@material-ui/core';

const StyledHeaderChats = styled(({ theme, ...props }: { theme: DefaultTheme }) => (
  <Paper elevation={0} square {...props} />
))`
  width: 100%;
  /* min-width: 100%; */
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  overflow: scroll;

  height: ${({ theme }) => theme.spacing(6)}px;
  border-radius: ${({ theme }) => theme.spacing(0.5)}px 0 0 0;
  border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
`;

const StyledBadge = styled(Badge)`
  .MuiBadge-badge {
    background-color: rgb(68, 183, 0);
    color: rgb(68, 183, 0);
    box-shadow: 0 0 0 2px ${({ theme }) => theme.palette.background.paper};
    &::after {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      animation: ${keyframes`
        from {  
            transform: scale(0.8);
            opacity: 1;
        }
        to {
            transform: scale(2);
            opacity: 0;
        }
      `} 1.2s infinite ease-in-out;
      border: 1px solid currentColor;
      content: '';
    }
  }
`;

const StyledAvatar = styled((props) => <Avatar alt={props.alt} src={props.src} {...props} />)`
  height: ${({ theme }) => theme.spacing(3)}px;
  width: ${({ theme }) => theme.spacing(3)}px;
  margin-right: ${({ theme }) => theme.spacing(1)}px;
`;

const StyledHeaderChatWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: stretch;
`;

interface StyledHeaderChatProps {
  selected: boolean;
}

const StyledHeaderChat = styled.div<StyledHeaderChatProps>`
  cursor: pointer;
  display: flex;
  max-width: 250px;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  background-color: ${({ selected, theme }) => {
    if (selected) return theme.palette.action.selected;
    return theme.palette.background.default;
  }};
  padding: 0 ${({ theme }) => theme.spacing(1.5)}px;

  transition: background-color ${({ theme }) => theme.transitions.duration.shortest}ms
    ${({ theme }) => theme.transitions.easing.easeInOut};

  > span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .MuiBadge-anchorOriginTopRightCircle {
    right: 28%;
    top: 18%;
  }

  .MuiBadge-anchorOriginBottomRightCircle {
    right: 28%;
    bottom: 22%;
  }
`;

interface StyledIconButtonProps {
  selected: boolean;
}

const StyledIconButton = styled(IconButton)<StyledIconButtonProps>`
  border-radius: 0;
  background-color: ${({ selected, theme }) => {
    if (selected) return theme.palette.action.selected;
    return theme.palette.background.default;
  }};
`;

const StyledVerticalDivider = styled.div`
  border-right: 1px solid ${({ theme }) => theme.palette.divider};
`;

export {
  StyledHeaderChats,
  StyledBadge,
  StyledAvatar,
  StyledHeaderChatWrapper,
  StyledHeaderChat,
  StyledIconButton,
  StyledVerticalDivider,
};
