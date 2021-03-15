import StyledChatBox from './ChatBox.style';
import ChatBoxPersonList from './chatboxpersonlist';
import ChatBoxMessageList from './chatboxmessages';
import ChatBoxInput from './chatboxinput/ChatBoxInput';

interface ChatBoxProps {
  personNameList: Array<string>;
  messageList: Array<{ isMessageMine: boolean; content: string }>;
}

const ChatBox = ({ personNameList, messageList }: ChatBoxProps) => (
  <StyledChatBox>
    <ChatBoxPersonList personNameList={personNameList} />
    <ChatBoxMessageList messageList={messageList} />
    <ChatBoxInput />
  </StyledChatBox>
);

export default ChatBox;
