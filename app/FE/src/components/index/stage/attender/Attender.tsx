import * as THREE from 'three';
import React, { Suspense, useLayoutEffect } from 'react';
import { useResource } from 'react-three-fiber';
import AttenderAvatar from './AttenderAvatar';
import AttenderStick from './AttenderStick';

interface AttenderProps {
  position: [number, number];
  size?: 'sm' | 'md' | 'lg';
}

const Attender: React.FunctionComponent<AttenderProps> = ({ position, size }) => {
  const stickMeshRef = useResource<THREE.Mesh>();
  const avatarMeshRef = useResource<THREE.Mesh>();

  return (
    <Suspense fallback={null}>
      <AttenderStick stickMeshRef={stickMeshRef} position={position} size={size} />
      <AttenderAvatar avatarMeshRef={avatarMeshRef} position={position} size={size} />
    </Suspense>
  );
};
export default Attender;
