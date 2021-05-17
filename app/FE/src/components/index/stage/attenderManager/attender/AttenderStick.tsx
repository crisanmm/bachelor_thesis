import * as THREE from 'three';
import React, { useEffect, useLayoutEffect } from 'react';
import { useFrame, useResource, useUpdate } from 'react-three-fiber';
import type { Size } from './shared';
import { computeAttenderSize } from './shared';
import type { Position } from '../shared';

interface AttenderStickProps {
  stickMeshRef: {
    current: THREE.Mesh;
  };
  position: Position;
  avatar: string;
  size?: Size;
  color?: string | number;
}

const AttenderStick: React.FunctionComponent<AttenderStickProps> = ({
  stickMeshRef,
  position,
  avatar,
  size,
  color,
}) => {
  const [stickWidth, stickHeight] = computeAttenderSize(size);
  const geometryRef = useResource<THREE.PlaneGeometry>();

  useFrame((state) => {
    stickMeshRef.current?.position.lerp(new THREE.Vector3(...position), 0.025);
    stickMeshRef.current?.lookAt(state.camera.position.x, 0, state.camera.position.z);
  });

  useLayoutEffect(() => {
    geometryRef.current?.translate(0, stickHeight / 2, 0);
  }, []);

  return (
    <mesh ref={stickMeshRef}>
      <planeGeometry ref={geometryRef} args={[stickWidth, stickHeight]} />
      <meshBasicMaterial color={color} side={THREE.FrontSide} />
    </mesh>
  );
};

export default AttenderStick;
