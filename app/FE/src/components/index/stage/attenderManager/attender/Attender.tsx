import React, { Suspense, useState, useContext } from 'react';
import { AttenderType } from '../shared';
import AttenderStick from './AttenderStick';
import AttenderAvatar from './AttenderAvatar';
import AttenderName from './AttenderName';
import AttenderDialog from './AttenderDialog';
import { SocketContext } from '#contexts';

interface AttenderProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string | number;
  isMyAttender?: boolean;
}

const Attender: React.FunctionComponent<AttenderProps & AttenderType> = (props) => {
  const { emitter } = useContext(SocketContext.Context);
  const [isAvatarClicked, setIsAvatarClicked] = useState(false);

  emitter.on(`attender-${props.id}:avatar-clicked`, () => {
    setIsAvatarClicked(true);
  });

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
