import React, { useState } from 'react';
import { Emitter } from 'mitt';
import { Badge, Menu, MenuItem, Typography } from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import { AttenderDialogPopUp } from '#components/index';
import { computeAttenderDisplayName } from '#utils';
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

interface HeaderChatProps {
  emitter: Emitter;
  headerChat: HeaderChatType;
  index: number;
  stageId: string;
}

const HeaderChat: React.FunctionComponent<HeaderChatProps> = ({ emitter, headerChat, index, stageId }) => {
  const [isAvatarClicked, setIsAvatarClicked] = useState(false);
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);
  const avatar = useAvatar(headerChat.user.picture);

  const onClickMoreVerticalButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElement(e.currentTarget);
  };

  const closeMenu = () => {
    setAnchorElement(null);
  };

  return (
    <>
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
        {!['global', stageId].includes(headerChat.user.id) && (
          <>
            <StyledIconButton size="small" selected={headerChat.selected} onClick={onClickMoreVerticalButton}>
              <MoreVert />
            </StyledIconButton>
            <Menu anchorEl={anchorElement} open={anchorElement ? true : false} onClose={() => closeMenu()}>
              <MenuItem
                onClick={() => {
                  closeMenu();
                  setIsAvatarClicked(true);
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
      {isAvatarClicked && (
        <AttenderDialogPopUp
          emitter={emitter}
          userAttributes={headerChat.user}
          isAvatarClicked={isAvatarClicked}
          setIsAvatarClicked={setIsAvatarClicked}
        />
      )}
    </>
  );
};

interface ChatHeaderProps {
  emitter: Emitter;
  headerChats: HeaderChatType[];
  stageId: string;
}

const ChatHeader: React.FunctionComponent<ChatHeaderProps> = ({ emitter, headerChats, stageId }) => (
  <StyledHeaderChats>
    {headerChats.map((headerChat, index) => (
      <HeaderChat key={headerChat.user.id} emitter={emitter} headerChat={headerChat} index={index} stageId={stageId} />
    ))}
  </StyledHeaderChats>
);

export default ChatHeader;
