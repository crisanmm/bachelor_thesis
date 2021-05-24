import React, { useState } from 'react';
import { Emitter } from 'mitt';
import { Badge, Menu, MenuItem, Typography } from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import { getAvatarURI, computeAttenderDisplayName } from '#utils';
import { useAvatar } from '#hooks';
import {
  StyledHeaderChats,
  StyledBadge,
  StyledAvatar,
  StyledHeaderChatWrapper,
  StyledHeaderChat,
  StyledIconButton,
  StyledVerticalDivider,
} from './ChatHeader.style';
import type { HeaderChatType } from '../shared';

interface ChatHeaderProps {
  emitter: Emitter;
  headerChats: HeaderChatType[];
}

const ChatHeader: React.FunctionComponent<ChatHeaderProps> = ({ emitter, headerChats }) => {
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);

  const onClickMoreVerticalButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElement(e.currentTarget);
  };

  const closeMenu = () => {
    setAnchorElement(null);
  };

  return (
    <StyledHeaderChats>
      {headerChats.map((headerChat, index) => {
        const avatar = useAvatar(headerChat.user.picture);

        return (
          <StyledHeaderChatWrapper>
            <StyledHeaderChat
              key={headerChat.user.id}
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
                    alt={`${computeAttenderDisplayName(headerChat.user)}'s avatar`}
                    src={avatar}
                  />
                </StyledBadge>
              </Badge>
              <span>{computeAttenderDisplayName(headerChat.user)}</span>
            </StyledHeaderChat>
            {!['global', 'stage'].includes(headerChat.user.id) && (
              <>
                <StyledIconButton
                  size="small"
                  selected={headerChat.selected}
                  onClick={onClickMoreVerticalButton}
                >
                  <MoreVert />
                </StyledIconButton>
                <Menu
                  anchorEl={anchorElement}
                  open={anchorElement ? true : false}
                  onClose={() => closeMenu()}
                >
                  <MenuItem
                    onClick={() => {
                      closeMenu();
                      emitter.emit(`attender-${headerChat.user.id}:avatar-clicked`, true);
                    }}
                  >
                    View profile
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      closeMenu();
                      emitter.emit('chats:close-chat', index);
                    }}
                  >
                    <Typography color="secondary">Close chat</Typography>
                  </MenuItem>
                </Menu>
              </>
            )}
            <StyledVerticalDivider />
          </StyledHeaderChatWrapper>
        );
      })}
    </StyledHeaderChats>
  );
};

export default ChatHeader;
