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
      .get(picture, { responseType: 'blob' })
      .then((response) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(response.data);
        fileReader.onloadend = () => {
          setAvatar(fileReader.result as string);
        };
      })
      .catch((e) => console.error('Failed loading texture picture', e));
  }, []);

  return avatar;
};

export default useAvatar;
