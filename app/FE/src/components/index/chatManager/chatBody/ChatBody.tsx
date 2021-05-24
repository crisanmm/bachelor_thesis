import { Avatar, Container, Typography } from '@material-ui/core';
import React from 'react';
import { StyledContainer } from '#components/shared';
import {
  clamp,
  computeAttenderDisplayName,
  getAvatarAltText,
  getAvatarURI,
  UserAttributes,
} from '#utils';
import { StyledMessages, StyledMessage, StyledAvatar } from './ChatBody.style';
import type {
  MessageType,
  TextMessageType,
  MediaMessageType,
  HeaderChatType,
  UserInformationType,
} from '../shared';

const computeSpacing = (thisMessage: MessageType, lastMessage: MessageType) => {
  if (!lastMessage) return 0;

  const secondsDifference = (thisMessage.time - lastMessage.time) / 1000;

  /**
   * spacing() function similar to React Material-UI spacing()
   * 1 * 8 = theme.spacing(1)
   * */
  return clamp(0.75 * 8, secondsDifference * 0.005, 6 * 8);
};

interface ChatBodyProps {
  headerChat: HeaderChatType;
  messages: MessageType[];
  myUser: UserAttributes;
}

const ChatBody: React.FunctionComponent<ChatBodyProps> = ({ headerChat, messages, myUser }) => {
  if (messages.length === 0)
    return (
      <StyledMessages>
        <StyledContainer>
          <StyledAvatar
            alt={getAvatarAltText(computeAttenderDisplayName(headerChat.user))}
            src={getAvatarURI(headerChat.user.id)}
          />
          <Typography>
            No messages with
            {` ${computeAttenderDisplayName(headerChat.user)} `}
            yet! Be the first one to interact 😁
          </Typography>
        </StyledContainer>
      </StyledMessages>
    );

  return (
    <StyledMessages>
      {messages.map((message, index) => (
        <StyledMessage
          key={index}
          mine={myUser.id === message.userInformation.id}
          _spacing={computeSpacing(message, messages[index - 1])}
        >
          <Avatar
            alt={getAvatarAltText(
              myUser.id === message.userInformation.id ? myUser.name : headerChat.user.name,
            )}
            src={getAvatarURI(
              myUser.id === message.userInformation.id ? myUser.id : headerChat.user.id,
            )}
            color="primary"
          />
          {message.type === 'text/plain' ? (
            <span>{message.data}</span>
          ) : (
            <a href={message.data} target="_blank" rel="noreferrer">
              <img alt={(message as MediaMessageType).alt} src={message.data} />
            </a>
          )}
        </StyledMessage>
      ))}
    </StyledMessages>
  );
};

export { computeSpacing };
export default ChatBody;
