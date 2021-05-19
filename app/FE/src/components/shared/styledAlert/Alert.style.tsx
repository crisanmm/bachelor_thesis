import styled, { DefaultTheme } from 'styled-components';
import { Container } from '@material-ui/core';
import { Alert, AlertProps, AlertTitle } from '@material-ui/lab';

type StyledAlertProps = AlertProps & { theme: DefaultTheme; title: string };

const StyledAlert = styled((props: StyledAlertProps) => {
  const { title, children, ...otherProps } = props;
  return (
    <Container maxWidth="sm">
      <Alert {...otherProps}>
        {title ? <AlertTitle>{title}</AlertTitle> : undefined}
        {children}
      </Alert>
    </Container>
  );
})`
  margin: 0 auto;
  margin-top: ${({ theme }) => theme.spacing(1)}px;
  margin-bottom: ${({ theme }) => theme.spacing(1)}px;
`;

export default StyledAlert;
