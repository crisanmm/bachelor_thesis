import { Divider, Paper } from '@material-ui/core';
import styled from 'styled-components';

const StyledMessages = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  max-height: 600px;
  overflow: scroll;
  padding: 0 ${({ theme }) => theme.spacing(1)}px;
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

  > span {
    margin: auto 0;
    background: ${({ theme }) => theme.palette.background.default};
    border-radius: ${({ theme }) => theme.spacing(0.5)}px;
    padding: ${({ theme }) => theme.spacing(1)}px;
  }

  > a img {
    border-radius: ${({ theme }) => theme.spacing(2)}px;
    max-height: 400px;
  }
`;

export { StyledMessages, StyledMessage };
