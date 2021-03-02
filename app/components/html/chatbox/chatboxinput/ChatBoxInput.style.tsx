import styled from 'styled-components';

const StyledChatBoxInputWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledChatBoxInput = styled.input`
  border-top: 1px solid black;
`;

const StyledChatBoxInputButton = styled.button`
  flex-basis: auto;
  background-color: #c3c3c3;
`;

export { StyledChatBoxInputWrapper, StyledChatBoxInput, StyledChatBoxInputButton };
