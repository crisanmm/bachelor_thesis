import { useState, useEffect } from 'react';
import axios from 'axios';

interface UseAvatar {
  (picture: string): string;
}

/**
 * Used for providing fallback avatar.
 * @param picture Link to picture to load.
 * @returns Fallback picture followed by the intended picture if it was successfully loaded.
 */
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
