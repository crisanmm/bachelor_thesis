import * as THREE from 'three';
import { useEffect, useRef } from 'react';
import { PerspectiveCamera } from '@react-three/drei';

const CameraOptions = () => {
  const perspectiveCameraRef = useRef<THREE.PerspectiveCamera>();
  useEffect(() => {
    perspectiveCameraRef.current?.lookAt(0, 0, 0);
  }, []);

  return (
    <PerspectiveCamera ref={perspectiveCameraRef} makeDefault fov={50} position={[-45, 30, 55]} />
  );
};

export default CameraOptions;
