import {
  StyledChatBoxInputWrapper,
  StyledChatBoxInput,
  StyledChatBoxInputButton,
} from './ChatBoxInput.style';

const ChatBoxInput = () => (
  <StyledChatBoxInputWrapper>
    <StyledChatBoxInput />
    <StyledChatBoxInputButton>SEND</StyledChatBoxInputButton>
  </StyledChatBoxInputWrapper>
);

export default ChatBoxInput;
