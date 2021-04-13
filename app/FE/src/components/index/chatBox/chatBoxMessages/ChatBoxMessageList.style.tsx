import styled from 'styled-components';

const StyledChatBoxMessageList = styled.div`
  display: flex;
  flex-direction: column;
  padding: 5px;
  min-height: 200px;
`;

interface StyledChatBoxMessageListItemProps {
  alignSelf: 'flex-start' | 'flex-end';
}

const StyledChatBoxMessageListItem = styled.div<StyledChatBoxMessageListItemProps>`
  align-self: ${(props) => props.alignSelf};
  padding: 2px;
  margin: 1px;
`;

export { StyledChatBoxMessageList, StyledChatBoxMessageListItem };
