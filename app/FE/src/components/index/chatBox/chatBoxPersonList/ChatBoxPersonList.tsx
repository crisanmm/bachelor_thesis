import { StyledChatBoxList, StyledChatBoxListItem } from './ChatBoxPersonList.style';

interface ChatBoxPersonListProps {
  personNameList: Array<string>;
}
const ChatBoxPersonList = ({ personNameList }: ChatBoxPersonListProps) => (
  <StyledChatBoxList>
    {personNameList.map((personName, index) => (
      <StyledChatBoxListItem key={index}>{personName}</StyledChatBoxListItem>
    ))}
  </StyledChatBoxList>
);

export default ChatBoxPersonList;
