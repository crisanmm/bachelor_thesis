import React, { Suspense, useState } from 'react';
import { AttenderType } from '../shared';
import AttenderStick from './AttenderStick';
import AttenderAvatar from './AttenderAvatar';
import AttenderName from './AttenderName';
import AttenderDialog from './AttenderDialog';

interface AttenderProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string | number;
  isMyAttender?: boolean;
}

const Attender: React.FunctionComponent<AttenderProps & AttenderType> = (props) => {
  const [isAvatarClicked, setIsAvatarClicked] = useState(false);

  return (
    <Suspense fallback={null}>
      <AttenderStick {...props} />
      <AttenderAvatar setIsAvatarClicked={setIsAvatarClicked} {...props} />
      <AttenderName {...props} />
      {isAvatarClicked && (
        <AttenderDialog
          isAvatarClicked={isAvatarClicked}
          setIsAvatarClicked={setIsAvatarClicked}
          {...props}
        />
      )}
    </Suspense>
  );
};
export default Attender;
