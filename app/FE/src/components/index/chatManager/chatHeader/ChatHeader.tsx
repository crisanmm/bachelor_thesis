import React from 'react';
import { Avatar, Divider, Box, Badge } from '@material-ui/core';
import { StyledHeaderChats, StyledBadge, StyledAvatar, StyledHeaderChat } from './ChatHeader.style';

interface ChatHeaderProps {
  headerChats: string[];
}

const ChatHeader: React.FunctionComponent<ChatHeaderProps> = ({ headerChats }) => (
  <StyledHeaderChats>
    {headerChats.map((headerChat, index) => (
      <StyledHeaderChat key={index}>
        <StyledBadge
          variant="dot"
          overlap="circle"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <StyledAvatar alt="a" src="/images/avatar.jpg" />
        </StyledBadge>
        {headerChat}
      </StyledHeaderChat>
    ))}
  </StyledHeaderChats>
);

export default ChatHeader;
