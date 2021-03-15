import { StyledChatBoxMessageList, StyledChatBoxMessageListItem } from './ChatBoxMessageList.style';

interface ChatBoxMessageListProps {
  messageList: Array<{ isMessageMine: boolean; content: string }>;
}

const ChatBoxMessageList = ({ messageList }: ChatBoxMessageListProps) => (
  <StyledChatBoxMessageList>
    {messageList.map((message, index) => (
      <StyledChatBoxMessageListItem
        key={index}
        alignSelf={message.isMessageMine ? 'flex-end' : 'flex-start'}
      >
        {message.content}
      </StyledChatBoxMessageListItem>
    ))}
  </StyledChatBoxMessageList>
);

export default ChatBoxMessageList;
