import styled, { DefaultTheme, keyframes } from 'styled-components';
import { Avatar, Paper, Badge } from '@material-ui/core';

const StyledHeaderChats = styled(({ theme, ...props }: { theme: DefaultTheme }) => (
  <Paper elevation={0} square {...props} />
))`
  min-width: 100%;
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
  border-right: 1px solid ${({ theme }) => theme.palette.divider};
  padding: 0 ${({ theme }) => theme.spacing(2)}px;

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

export { StyledHeaderChats, StyledBadge, StyledAvatar, StyledHeaderChat };
