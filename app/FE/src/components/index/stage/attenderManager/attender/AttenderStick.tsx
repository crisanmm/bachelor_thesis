import * as THREE from 'three';
import React, { useState, useRef, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Size } from './shared';
import { computeAttenderSize } from './shared';
import type { AttenderType } from '../shared';

interface AttenderStickProps {
  size?: Size;
  color?: string | number;
}

const AttenderStick: React.FunctionComponent<AttenderStickProps & AttenderType> = ({
  position,
  size,
  color,
}) => {
  const stickMeshRef = useRef<THREE.Mesh>();
  const [stickWidth, stickHeight] = computeAttenderSize(size);
  const geometryRef = useRef<THREE.PlaneGeometry>();

  // reuse this vector in useFrame
  const [vector] = useState(() => new THREE.Vector3(...position));

  useLayoutEffect(() => {
    geometryRef.current?.translate(0, stickHeight / 2, 0);
  }, []);

  useFrame((state) => {
    stickMeshRef.current?.position.lerp(vector.set(...position), 0.025);
    stickMeshRef.current?.lookAt(state.camera.position.x, 0, state.camera.position.z);
  });

  return (
    <mesh ref={stickMeshRef}>
      <planeGeometry ref={geometryRef} args={[stickWidth, stickHeight]} />
      <meshBasicMaterial color={color} side={THREE.FrontSide} />
    </mesh>
  );
};

export default AttenderStick;
