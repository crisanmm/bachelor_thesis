import React from 'react';
import { Dialog, Typography, List, Button } from '@material-ui/core';
import { Emitter } from 'mitt';
import { ContactListItem } from '#components/shared';
import { computeAttenderDisplayName, UserAttributes } from '#utils';
import { useAvatar } from '#hooks';
import { StyledAttenderMenuWrapper, StyledAvatar } from './AttenderDialogPopUp.style';

interface AttenderDialogPopUpProps {
  emitter: Emitter;
  isAvatarClicked: boolean;
  setIsAvatarClicked: React.Dispatch<React.SetStateAction<boolean>>;
  userAttributes: Omit<UserAttributes, 'token'>;
  isMyAttender?: boolean;
}

const AttenderDialogPopUp: React.FunctionComponent<AttenderDialogPopUpProps> = ({
  emitter,
  isMyAttender,
  isAvatarClicked,
  setIsAvatarClicked,
  userAttributes,
}) => {
  const {
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
  } = userAttributes;

  const avatar = useAvatar(picture);

  const onClickMessageButton = () => {
    emitter.emit('chats:opened-chat', userAttributes);
    setIsAvatarClicked(false);
  };

  return (
    <Dialog
      open={isAvatarClicked}
      onClose={() => setIsAvatarClicked(false)}
      PaperComponent={({ children }) => <>{children}</>}
    >
      <StyledAttenderMenuWrapper>
        <Typography variant="h5">{computeAttenderDisplayName({ givenName, familyName })}</Typography>
        {customJob && <Typography variant="body2">{customJob}</Typography>}
        <StyledAvatar src={avatar} />
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
  );
};

export default AttenderDialogPopUp;
