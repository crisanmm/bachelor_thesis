import Identicon from 'identicon.js';
import React, { SetStateAction, useEffect, useState } from 'react';
import murmurhash from 'murmurhash';
import { Typography, Tooltip } from '@material-ui/core';
import { StyledChooseAvatarWrapper, StyledChooseAvatar } from './ChooseAvatar.style';

const getIdenticonSrc = (email: string) => {
  const hash = murmurhash.v3(email, Math.random() * 1e5).toString(2);
  const identicon = new Identicon(hash, { format: 'png', size: 96 });
  return `data:image/png;base64,${identicon.toString()}`;
};

interface ChooseAvatarProps {
  email: string;
  avatarSrc: string | undefined;
  setAvatarSrc: React.Dispatch<SetStateAction<string | undefined>>;
}

const ChooseAvatar: React.FunctionComponent<ChooseAvatarProps> = ({
  email,
  avatarSrc,
  setAvatarSrc,
}) => {
  const [isCustomAvatarSet, setIsCustomAvatarSet] = useState<boolean>(false);

  useEffect(() => {
    if (!isCustomAvatarSet) setAvatarSrc(getIdenticonSrc(email));
  }, [email]);

  return (
    <>
      <StyledChooseAvatarWrapper>
        <Typography variant="body1" color="textPrimary" gutterBottom>
          Choose your avatar.
        </Typography>
        <Tooltip title="Upload avatar">
          <label htmlFor="avatar-upload">
            <StyledChooseAvatar alt="your avatar" src={avatarSrc} />
          </label>
        </Tooltip>
      </StyledChooseAvatarWrapper>

      <input
        id="avatar-upload"
        type="file"
        accept="image/*"
        hidden
        onChange={(e: any) => {
          setIsCustomAvatarSet(true);
          const file = e.target.files[0];
          const fileReader = new FileReader();
          fileReader.readAsDataURL(file);
          fileReader.addEventListener('load', (e: any) => {
            setAvatarSrc(e.target.result);
          });
          e.target.value = null;
        }}
      />
    </>
  );
};

export default ChooseAvatar;
