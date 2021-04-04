import styled, { DefaultTheme } from 'styled-components';
import { Paper, Container } from '@material-ui/core';
import { Alert, AlertProps } from '@material-ui/lab';
import { Form } from 'formik';

const StyledFormWrapper = styled(({ theme, ...props }: { theme: DefaultTheme }) => (
  <Container maxWidth="sm">
    <Paper elevation={1} {...props} />
  </Container>
))`
  ${({ theme }) => `
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: ${theme.spacing(2)}px;
  margin: 0 auto;
`}
`;

const StyledFormHeading = styled.h2`
  ${({ theme }) => `
  margin-bottom: ${theme.spacing(1)}px;
`}
`;

const StyledFormDescription = styled.span`
  ${({ theme }) => `
  text-align: center;
  margin-bottom: ${theme.spacing(2)}px;
`}
`;

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  & > * {
    margin: ${({ theme }) => theme.spacing(1)}px 0px;
  }
`;

const StyledAlert = styled((props: AlertProps & { theme: DefaultTheme }) => (
  <Container maxWidth="sm">
    <Alert {...props} />
  </Container>
))`
  margin: 0 auto;
  margin-top: ${({ theme }) => theme.spacing(2)}px;
`;

export { StyledFormWrapper, StyledFormHeading, StyledFormDescription, StyledForm, StyledAlert };
