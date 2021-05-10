import React from 'react';
import { Emitter } from 'mitt';
import { getAvatarURI } from '@utils';
import { Badge } from '@material-ui/core';
import { StyledHeaderChats, StyledBadge, StyledAvatar, StyledHeaderChat } from './ChatHeader.style';
import type { HeaderChatType } from '../shared';

interface ChatHeaderProps {
  emitter: Emitter;
  headerChats: HeaderChatType[];
}

const ChatHeader: React.FunctionComponent<ChatHeaderProps> = ({ emitter, headerChats }) => (
  <StyledHeaderChats>
    {headerChats.map((headerChat, index) => (
      <StyledHeaderChat
        key={index}
        selected={headerChat.selected}
        onClick={() => emitter.emit('chats:change-chat', index)}
      >
        <Badge
          variant="dot"
          badgeContent={headerChat.notifications}
          color="secondary"
          overlap="circle"
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <StyledBadge
            variant="dot"
            overlap="circle"
            invisible={!headerChat.online}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <StyledAvatar
              alt={`${headerChat.user.name}'s avatar`}
              src={getAvatarURI(headerChat.user.id)}
            />
          </StyledBadge>
        </Badge>
        <span>{headerChat.user.name}</span>
      </StyledHeaderChat>
    ))}
  </StyledHeaderChats>
);

export default ChatHeader;
