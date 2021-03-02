import {
  StyledChatBoxInputWrapper,
  StyledChatBoxInput,
  StyledChatBoxInputButton,
} from './ChatBoxInput.style';

const ChatBoxInput = () => {
  return (
    <StyledChatBoxInputWrapper>
      <StyledChatBoxInput />
      <StyledChatBoxInputButton>{'SEND'}</StyledChatBoxInputButton>
    </StyledChatBoxInputWrapper>
  );
};

export { ChatBoxInput };
