import { Avatar, Container, Typography } from '@material-ui/core';
import React from 'react';
import { StyledContainer } from '#components/shared';
import { clamp, getAvatarAltText, getAvatarURI } from '#utils';
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
  userInformation: UserInformationType;
}

const ChatBody: React.FunctionComponent<ChatBodyProps> = ({
  headerChat,
  messages,
  userInformation,
}) => {
  if (messages.length === 0)
    return (
      <StyledMessages>
        <StyledContainer>
          <StyledAvatar
            alt={getAvatarAltText(headerChat.user.name)}
            src={getAvatarURI(headerChat.user.id)}
          />
          <Typography>
            No messages with
            {` ${headerChat.user.name} `}
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
          mine={userInformation.id === message.user.id}
          _spacing={computeSpacing(message, messages[index - 1])}
        >
          <Avatar
            alt={getAvatarAltText(
              userInformation.id === message.user.id ? userInformation.name : headerChat.user.name,
            )}
            src={getAvatarURI(
              userInformation.id === message.user.id ? userInformation.id : headerChat.user.id,
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
