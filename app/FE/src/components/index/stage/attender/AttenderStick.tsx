import * as THREE from 'three';
import React, { useEffect, useLayoutEffect } from 'react';
import { useFrame, useResource, useUpdate } from 'react-three-fiber';
import type { Size } from './shared';
import { computeAttenderSize } from './shared';

interface AttenderStickProps {
  stickMeshRef: {
    current: THREE.Mesh;
  };
  position: [number, number, number];
  size?: Size;
  color?: string | number;
}

const AttenderStick: React.FunctionComponent<AttenderStickProps> = ({
  stickMeshRef,
  position,
  size,
  color,
}) => {
  const [stickWidth, stickHeight] = computeAttenderSize(size);
  const geometryRef = useResource<THREE.PlaneGeometry>();

  useFrame((state) => {
    const [x, y, z] = position;
    stickMeshRef.current?.position.set(x, y, z);
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
