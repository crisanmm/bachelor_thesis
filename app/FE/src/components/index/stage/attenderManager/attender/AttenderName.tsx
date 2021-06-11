import * as THREE from 'three';
import React, { useRef, useState } from 'react';
import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { computeAttenderDisplayName } from '#utils';
import { computeAttenderSize } from './shared';
import type { Size } from './shared';
import type { Position, AttenderType } from '../../shared';

interface AttenderNameProps {
  size?: Size;
}

const AttenderName: React.FunctionComponent<AttenderNameProps & AttenderType> = ({
  position,
  size,
  givenName,
  familyName,
}) => {
  const [, stickHeight, avatarRadius, fontSize] = computeAttenderSize(size);
  const _position = Array.from(position) as Position;
  _position[1] = stickHeight + avatarRadius + avatarRadius * 0.4;
  const textRef = useRef<any>();

  // reuse this vector in useFrame
  const [vector] = useState(() => new THREE.Vector3(..._position));

  useFrame((state) => {
    textRef.current?.position.lerp(vector.set(..._position), 0.025);
    textRef.current?.lookAt(state.camera.position);
  });

  return (
    <Text ref={textRef} fontSize={fontSize} color="white" outlineColor="black" outlineWidth={0.075}>
      {computeAttenderDisplayName({ givenName, familyName })}
    </Text>
  );
};

export default AttenderName;
