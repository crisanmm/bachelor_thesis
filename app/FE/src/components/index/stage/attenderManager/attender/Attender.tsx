import * as THREE from 'three';
import React, { Suspense, useContext } from 'react';
import { useResource } from 'react-three-fiber';
import AttenderAvatar from './AttenderAvatar';
import AttenderStick from './AttenderStick';

interface AttenderProps {
  position: [number, number, number];
  size?: 'sm' | 'md' | 'lg';
  color?: number | string;
}

const Attender: React.FunctionComponent<AttenderProps> = (props) => {
  const stickMeshRef = useResource<THREE.Mesh>();
  const avatarMeshRef = useResource<THREE.Mesh>();
  // const socket = useContext(Socket.Context);
  // console.log('🚀  -> file: Attender.tsx  -> line 17  -> socket', socket);
  // socket.emit('ehlo', {});

  return (
    <Suspense fallback={null}>
      <AttenderStick stickMeshRef={stickMeshRef} {...props} />
      <AttenderAvatar avatarMeshRef={avatarMeshRef} {...props} />
    </Suspense>
  );
};
export default Attender;
