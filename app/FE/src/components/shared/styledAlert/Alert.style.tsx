import styled, { DefaultTheme } from 'styled-components';
import { useState } from 'react';
import { Snackbar } from '@material-ui/core';
import { Alert, AlertProps, AlertTitle } from '@material-ui/lab';

type StyledAlertProps = AlertProps & { theme: DefaultTheme; title: string };

const StyledAlert = styled((props: StyledAlertProps) => {
  const [open, setOpen] = useState<boolean>(true);
  const { title, children, ...otherProps } = props;

  return (
    <Snackbar anchorOrigin={{ horizontal: 'right', vertical: 'top' }} autoHideDuration={6000} open={open}>
      <Alert elevation={6} {...otherProps} onClose={() => setOpen(false)}>
        {title ? <AlertTitle>{title}</AlertTitle> : undefined}
        {children}
      </Alert>
    </Snackbar>
  );
})`
  margin: 0 auto;
  margin-top: ${({ theme }) => theme.spacing(1)}px;
  margin-bottom: ${({ theme }) => theme.spacing(1)}px;
  min-width: 250px;
`;

export default StyledAlert;
