import React, { useContext } from 'react';
import { Html } from '@react-three/drei';
import { ThemeProvider as StyledComponentsThemeProvider } from 'styled-components';
import {
  useTheme as useMuiTheme,
  MuiThemeProvider,
} from '@material-ui/core';
import { SocketContext } from '#contexts';
import { AttenderDialogPopUp } from '#components/index';
import type { AttenderType } from '../../shared';

interface AttenderDialogProps {
  isAvatarClicked: boolean;
  setIsAvatarClicked: React.Dispatch<React.SetStateAction<boolean>>;
  isMyAttender?: boolean;
}

const AttenderDialog: React.FunctionComponent<AttenderDialogProps & AttenderType> = ({
  isMyAttender,
  isAvatarClicked,
  setIsAvatarClicked,
  ...userAttributes
}) => {
  const { emitter } = useContext(SocketContext.Context);
  /**
   * <Html> component breaks context, therefore context is provided again
   */
  const muiTheme = useMuiTheme();

  return (
    <Html>
      <MuiThemeProvider theme={muiTheme}>
        <StyledComponentsThemeProvider theme={muiTheme}>
          <AttenderDialogPopUp
            emitter={emitter}
            isMyAttender={isMyAttender}
            isAvatarClicked={isAvatarClicked}
            setIsAvatarClicked={setIsAvatarClicked}
            userAttributes={userAttributes}
          />
        </StyledComponentsThemeProvider>
      </MuiThemeProvider>
    </Html>
  );
};

export default AttenderDialog;
