import styled, { DefaultTheme } from 'styled-components';
import { Snackbar } from '@material-ui/core';
import { Alert, AlertProps, AlertTitle } from '@material-ui/lab';

type StyledAlertProps = AlertProps & { theme: DefaultTheme; title: string };

const StyledAlert = styled((props: StyledAlertProps) => {
  const { title, children, ...otherProps } = props;
  return (
    <Snackbar anchorOrigin={{ horizontal: 'right', vertical: 'top' }} autoHideDuration={6000} open>
      <Alert elevation={6} {...otherProps}>
        {title ? <AlertTitle>{title}</AlertTitle> : undefined}
        {children}
      </Alert>
    </Snackbar>
  );
})`
  margin: 0 auto;
  margin-top: ${({ theme }) => theme.spacing(1)}px;
  margin-bottom: ${({ theme }) => theme.spacing(1)}px;
`;

export default StyledAlert;
