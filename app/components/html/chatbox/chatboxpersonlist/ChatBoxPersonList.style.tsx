import styled from 'styled-components';

const StyledChatBoxPersonList = styled.div`
  display: flex;
  justify-content: flex-start;
  border-bottom: 1px solid black;
  padding: 2px;
`;

const StyledChatBoxPersonListItem = styled.div`
  width: 33%;
  padding: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export {
  StyledChatBoxPersonList as StyledChatBoxList,
  StyledChatBoxPersonListItem as StyledChatBoxListItem,
};
