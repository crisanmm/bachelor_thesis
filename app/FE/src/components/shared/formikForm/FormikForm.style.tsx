import styled, { DefaultTheme } from 'styled-components';
import { Paper, Container } from '@material-ui/core';
import { Form } from 'formik';

const StyledFormWrapper = styled(({ theme, ...props }: { theme: DefaultTheme }) => (
  <Container maxWidth="sm">
    <Paper elevation={1} {...props} />
  </Container>
))`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing(2)}px;
  ${({ theme }) => theme.breakpoints.up('sm')} {
    padding: ${({ theme }) => theme.spacing(3)}px;
  }
`;

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing(1)}px;
  width: 100%;

  ${({ theme }) => theme.breakpoints.up(375)} {
    width: 280px;
  }

  & > .MuiTextField-root {
    margin-top: ${({ theme }) => theme.spacing(0.75)}px;
    margin-bottom: ${({ theme }) => theme.spacing(0.75)}px;
    width: 100%;
  }

  & > .MuiButton-root[type='submit'] {
    margin-top: ${({ theme }) => theme.spacing(3)}px;
    margin-bottom: ${({ theme }) => theme.spacing(1)}px;
  }
`;

export { StyledFormWrapper, StyledForm };
