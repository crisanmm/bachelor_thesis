import { useState, useEffect } from 'react';
import axios from 'axios';

interface UseAvatar {
  (picture: string): string;
}

const useAvatar: UseAvatar = (picture) => {
  const [avatar, setAvatar] = useState<string>('images/fallback_avatar.jpg');

  useEffect(() => {
    axios
      .head(picture)
      .then(() => setAvatar(picture))
      .catch((e) => console.log('Failed loading texture picture', e));
  }, []);

  return avatar;
};

export default useAvatar;
