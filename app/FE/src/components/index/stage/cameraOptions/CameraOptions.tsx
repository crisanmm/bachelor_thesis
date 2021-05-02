import * as THREE from 'three';
import { useEffect, useState } from 'react';
import { useFrame, useThree } from 'react-three-fiber';

const CameraOptions = () => {
  const camera = useThree().camera as THREE.PerspectiveCamera;
  camera.fov = 50;
  camera.position.set(-45, 30, 55);
  camera.lookAt(0, 0, 0);
  return <></>;
};

export default CameraOptions;
