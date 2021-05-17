import * as THREE from 'three';
import { useFrame, useLoader, useResource } from 'react-three-fiber';
import React, { useLayoutEffect } from 'react';
import type { Size } from './shared';
import { computeAttenderSize } from './shared';
import type { Position } from '../shared';

interface AvatarProps {
  avatarMeshRef: {
    current: THREE.Mesh;
  };
  position: Position;
  avatar: string;
  size?: Size;
  color?: string | number;
}

const Avatar: React.FunctionComponent<AvatarProps> = ({
  avatarMeshRef,
  position,
  avatar,
  size,
  color,
}) => {
  const [, stickHeight, avatarRadius] = computeAttenderSize(size);
  const avatarGeometryRef = useResource<THREE.CircleGeometry>();
  const borderGeometryRef = useResource<THREE.CircleGeometry>();
  const texture = useLoader(THREE.TextureLoader, avatar);

  useFrame((state) => {
    avatarMeshRef.current?.position.lerp(new THREE.Vector3(...position), 0.025);
    avatarMeshRef.current?.lookAt(state.camera.position.x, 0, state.camera.position.z);
  });

  useLayoutEffect(() => {
    avatarGeometryRef.current?.translate(0, stickHeight, 0.1);
    borderGeometryRef.current?.translate(0, stickHeight, 0);
  }, []);

  return (
    <group ref={avatarMeshRef}>
      <mesh>
        <circleGeometry ref={avatarGeometryRef} args={[avatarRadius, 32]} />
        <meshBasicMaterial map={texture} />
      </mesh>
      <mesh>
        <circleGeometry ref={borderGeometryRef} args={[avatarRadius + avatarRadius / 10, 32]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
};

export default Avatar;
