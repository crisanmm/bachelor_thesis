import * as THREE from 'three';
import axios from 'axios';
import { ThreeEvent, useFrame, useLoader } from '@react-three/fiber';
import React, { Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useAvatar } from '#hooks';
import type { Size } from './shared';
import { computeAttenderSize } from './shared';
import type { AttenderType } from '../../shared';

interface AttenderAvatarProps {
  setIsAvatarClicked: React.Dispatch<React.SetStateAction<boolean>>;
  size?: Size;
  color?: string | number;
}

const AttenderAvatar: React.FunctionComponent<AttenderAvatarProps & AttenderType> = ({
  setIsAvatarClicked,
  position,
  picture,
  size,
  color,
}) => {
  const [, stickHeight, avatarRadius] = computeAttenderSize(size);
  const avatarMeshRef = useRef<THREE.Mesh>();
  const avatarGeometryRef = useRef<THREE.CircleGeometry>();
  const borderGeometryRef = useRef<THREE.CircleGeometry>();
  const meshRef = useRef<THREE.Mesh>();
  const texturePicture = useAvatar(picture);
  const texture = useLoader(THREE.TextureLoader, texturePicture);

  // reuse this vector in useFrame
  const [vector] = useState(() => new THREE.Vector3(...position));

  useLayoutEffect(() => {
    avatarGeometryRef.current?.translate(0, stickHeight, 0.1);
    borderGeometryRef.current?.translate(0, stickHeight, 0);
  }, []);

  useFrame((state) => {
    avatarMeshRef.current?.position.lerp(vector.set(...position), 0.025);
    avatarMeshRef.current?.lookAt(state.camera.position.x, 0, state.camera.position.z);
  });

  const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
    // stopPropagation doesn't really work...
    e.stopPropagation();

    setIsAvatarClicked(true);
  };

  const onPointerOver = () => {
    window.document.body.style.cursor = 'pointer';
  };

  const onPointerLeave = () => {
    window.document.body.style.cursor = 'default';
  };

  return (
    <group ref={avatarMeshRef}>
      <mesh
        ref={meshRef}
        onPointerDown={onPointerDown}
        onPointerOver={onPointerOver}
        onPointerLeave={onPointerLeave}
      >
        <circleGeometry ref={avatarGeometryRef} args={[avatarRadius, 32]} />
        {/* <Suspense fallback={<meshBasic}> */}
        <meshBasicMaterial map={texture} />
        {/* </Suspense> */}
      </mesh>
      <mesh>
        <circleGeometry ref={borderGeometryRef} args={[avatarRadius + avatarRadius / 10, 32]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
};

export default AttenderAvatar;
