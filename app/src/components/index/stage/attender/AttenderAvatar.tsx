import * as THREE from 'three';
import { useFrame, useLoader, useResource } from 'react-three-fiber';
import React, { useLayoutEffect } from 'react';
import type { Size } from './shared';
import { computeAttenderSize } from './shared';

interface AvatarProps {
  avatarMeshRef: {
    current: THREE.Mesh;
  };
  position: [number, number];
  size?: Size;
}

const Avatar: React.FunctionComponent<AvatarProps> = ({ avatarMeshRef, position, size }) => {
  const [, stickHeight, avatarRadius] = computeAttenderSize(size);
  const geometryRef = useResource<THREE.CircleGeometry>();
  const texture = useLoader(THREE.TextureLoader, '/images/avatar.jpg');

  useFrame((state) => {
    const [x, z] = position;
    avatarMeshRef.current?.position.set(x, 0.1, z);
    avatarMeshRef.current?.lookAt(state.camera.position.x, 0, state.camera.position.z);
  });

  useLayoutEffect(() => {
    geometryRef.current?.translate(0, stickHeight, 0);
  }, []);

  return (
    <mesh ref={avatarMeshRef}>
      <circleGeometry ref={geometryRef} args={[avatarRadius, 32]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
};

export default Avatar;
