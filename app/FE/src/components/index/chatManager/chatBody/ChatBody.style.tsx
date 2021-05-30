import { Avatar, Button } from '@material-ui/core';
import styled from 'styled-components';

const StyledMessages = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 400px;
  overflow: scroll;
  padding: ${({ theme }) => theme.spacing(2)}px;
  padding-top: ${({ theme }) => theme.spacing(1)}px;
`;

type StyledMessageProps = {
  mine: boolean;
  _spacing: number;
};

const StyledMessage = styled.div<StyledMessageProps>`
  display: flex;
  max-width: 85%;
  flex-direction: ${({ mine }) => (mine ? 'row-reverse' : 'row')};
  align-self: ${({ mine }) => (mine ? 'flex-end' : 'flex-start')};
  margin-top: ${({ _spacing }) => _spacing}px;

  > :nth-child(2) {
    margin: auto ${({ theme }) => theme.spacing(1)}px;
  }
`;

const StyledTextMessageBody = styled.div`
  margin: auto 0;
  background: ${({ theme }) => theme.palette.background.default};
  border-radius: ${({ theme }) => theme.spacing(0.5)}px;
  padding: ${({ theme }) => theme.spacing(1)}px;

  > p {
    margin: 0;
  }
`;

const StyledShowOriginalButton = styled(Button)`
  padding: ${({ theme }) => theme.spacing(0.1)}px;
  text-transform: lowercase;
`;

const StyledImage = styled.img`
  border-radius: ${({ theme }) => theme.spacing(2)}px;

  ${({ theme }) => theme.breakpoints.down('sm')} {
    max-height: 200px;
    max-width: 200px;
  }

  max-height: 300px;
  max-width: 300px;
`;

const StyledNoMessagesAvatar = styled((props) => <Avatar alt={props.alt} src={props.src} {...props} />)`
  height: ${({ theme }) => theme.spacing(10)}px;
  width: ${({ theme }) => theme.spacing(10)}px;
  margin-bottom: ${({ theme }) => theme.spacing(1)}px;
`;

const StyledMessagesAvatar = styled((props) => <Avatar alt={props.alt} src={props.src} {...props} />)`
  cursor: pointer;
`;

export {
  StyledMessages,
  StyledMessage,
  StyledTextMessageBody,
  StyledShowOriginalButton,
  StyledImage,
  StyledNoMessagesAvatar,
  StyledMessagesAvatar,
};
