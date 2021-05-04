import { Paper, TextField } from '@material-ui/core';
import styled from 'styled-components';

const StyledChatFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing(1)}px;
  border-top: 1px solid ${({ theme }) => theme.palette.divider};
`;

const StyledTextField = styled(TextField)`
  .MuiOutlinedInput-input {
    padding: ${({ theme }) => theme.spacing(1.5)}px ${({ theme }) => theme.spacing(1.25)}px;
  }
`;

const StyledButtonList = styled.div`
  margin-right: ${({ theme }) => theme.spacing(1)}px;
`;

const StyledSendButton = styled.div`
  margin-left: ${({ theme }) => theme.spacing(1)}px;
`;

export { StyledChatFooter, StyledTextField, StyledButtonList, StyledSendButton };
