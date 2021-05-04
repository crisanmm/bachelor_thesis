import { Avatar } from '@material-ui/core';
import React from 'react';
import { clamp } from '@utils';
import { StyledMessages, StyledMessage } from './ChatBody.style';
import type { Message, TextMessage, MediaMessage } from '../shared';

const computeSpacing = (thisMessage: Message, lastMessage: Message) => {
  if (!lastMessage) return 0;

  const secondsDifference = (thisMessage.time - lastMessage.time) / 1000;

  /**
   * spacing() function similar to React Material-UI spacing()
   * 0.25 * 8 is equal to 0.25 * theme.spacing(1)
   * 4 * 8 is equal to 4 * theme.spacing(1)
   * */
  return clamp(0.25 * 8, secondsDifference * 0.005, 4 * 8);
};

interface ChatBodyProps {
  messages: Message[];
  myId: string;
}

const ChatBody: React.FunctionComponent<ChatBodyProps> = ({ messages, myId }) => (
  <StyledMessages>
    {messages.map((message, index) => (
      <StyledMessage
        key={index}
        mine={message.user === myId}
        _spacing={computeSpacing(message, messages[index - 1])}
      >
        <Avatar alt="avatar" src="/images/avatar2.jpg" color="primary" />
        {message.type === 'text' ? (
          <span>{message.data}</span>
        ) : (
          <a href={message.data} target="_blank" rel="noreferrer">
            <img alt={(message as MediaMessage).alt} src={message.data} />
          </a>
        )}
      </StyledMessage>
    ))}
  </StyledMessages>
);

export { computeSpacing };
export default ChatBody;
