import React, { useContext } from 'react';
import { Html } from '@react-three/drei';
import { ThemeProvider as StyledComponentsThemeProvider } from 'styled-components';
import {
  Dialog,
  Typography,
  List,
  useTheme as useMuiTheme,
  MuiThemeProvider,
  Button,
} from '@material-ui/core';
import { ContactListItem } from '#components/shared';
import { computeAttenderDisplayName } from '#utils';
import { SocketContext } from '#contexts';
import { useAvatar } from '#hooks';
import { StyledAttenderMenuWrapper, StyledAvatar } from './AttenderDialog.style';
import type { AttenderType } from '../shared';

interface AttenderDialogProps {
  isAvatarClicked: boolean;
  setIsAvatarClicked: React.Dispatch<React.SetStateAction<boolean>>;
  isMyAttender?: boolean;
}

const AttenderDialog: React.FunctionComponent<AttenderDialogProps & AttenderType> = ({
  isMyAttender,
  isAvatarClicked,
  setIsAvatarClicked,
  picture,
  id,
  email,
  emailVerified,
  givenName,
  familyName,
  customFacebook,
  customLinkedin,
  customPhone,
  customJob,
}) => {
  const { emitter } = useContext(SocketContext.Context);
  /**
   * <Html> component breaks context, therefore context is provided again
   */
  const muiTheme = useMuiTheme();

  const avatar = useAvatar(picture);

  const onClickMessageButton = () => {
    emitter.emit('chats:opened-chat', {
      picture,
      id,
      email,
      emailVerified,
      givenName,
      familyName,
      customFacebook,
      customLinkedin,
      customPhone,
      customJob,
    });
    setIsAvatarClicked(false);
  };

  return (
    <Html>
      <MuiThemeProvider theme={muiTheme}>
        <StyledComponentsThemeProvider theme={muiTheme}>
          <Dialog
            open={isAvatarClicked}
            onClose={() => setIsAvatarClicked(false)}
            PaperComponent={({ children }) => <>{children}</>}
          >
            <StyledAttenderMenuWrapper theme={muiTheme}>
              <Typography variant="h5">
                {computeAttenderDisplayName({ givenName, familyName })}
              </Typography>
              {customJob && <Typography variant="body2">{customJob}</Typography>}
              <StyledAvatar src={avatar} theme={muiTheme} />
              <List>
                <ContactListItem type="email" data={email} />
                {customFacebook && <ContactListItem type="facebook" data={customFacebook} />}
                {customLinkedin && <ContactListItem type="linkedin" data={customLinkedin} />}
                {customPhone && <ContactListItem type="phone" data={customPhone} />}
              </List>
              {!isMyAttender && (
                <Button variant="contained" color="primary" onClick={onClickMessageButton}>
                  message
                </Button>
              )}
            </StyledAttenderMenuWrapper>
          </Dialog>
        </StyledComponentsThemeProvider>
      </MuiThemeProvider>
    </Html>
  );
};

export default AttenderDialog;
