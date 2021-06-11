import React, { useLayoutEffect, useRef } from 'react';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { Position } from '../shared';

interface WallProps {
  position: Position;
  geometryArgs: ConstructorParameters<typeof THREE.BoxGeometry>;
}

const Wall: React.FunctionComponent<WallProps> = ({ position, geometryArgs }) => {
  const wallGeometryRef = useRef<THREE.BoxGeometry>();

  const [colorMap, normalMap, roughnessMap, aoMap] = useLoader(THREE.TextureLoader, [
    'threejs/textures/wall/color.jpg',
    'threejs/textures/wall/normal.jpg',
    'threejs/textures/wall/roughness.jpg',
    'threejs/textures/wall/ambientOcclusion.jpg',
  ]);

  useLayoutEffect(() => {
    wallGeometryRef.current?.translate(0, geometryArgs[1]! / 2, 0);
    wallGeometryRef.current?.setAttribute(
      'uv2',
      new THREE.BufferAttribute(wallGeometryRef.current?.attributes.uv.array, 2),
    );
  }, []);

  return (
    <mesh position={position}>
      <boxGeometry ref={wallGeometryRef} args={geometryArgs} />
      <meshStandardMaterial
        map={colorMap}
        normalMap={normalMap}
        roughnessMap={roughnessMap}
        aoMap={aoMap}
        aoMapIntensity={1}
      />
    </mesh>
  );
};

export default Wall;
