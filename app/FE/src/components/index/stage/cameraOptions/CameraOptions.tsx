import React, { SetStateAction, useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { PerspectiveCamera } from '@react-three/drei';
import { Position } from '../shared';

interface CameraOptionsProps {
  cameraPosition: Position;
  cameraLookAt: Position;
  orbitControls: any;
  setOrbitControls: React.Dispatch<SetStateAction<any>>;
}

const CameraOptions: React.FunctionComponent<CameraOptionsProps> = ({
  cameraPosition,
  cameraLookAt,
  orbitControls,
  setOrbitControls,
}) => {
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const {
    gl: { domElement: canvasElement },
  } = useThree();

  useEffect(() => {
    cameraRef.current?.lookAt(new THREE.Vector3(...cameraLookAt));
  }, []);

  useEffect(() => {
    if (!orbitControls && cameraRef.current) {
      (async () => {
        const module = await import('three/examples/jsm/controls/OrbitControls');
        const _controls = new module.OrbitControls(cameraRef.current!, canvasElement);
        _controls.enableDamping = true;
        _controls.enablePan = false;
        _controls.target = new THREE.Vector3(...cameraLookAt);
        setOrbitControls(_controls);
      })();
    }
  }, [orbitControls]);

  useFrame(() => {
    if (orbitControls?.update) orbitControls.update();
  });

  return <PerspectiveCamera ref={cameraRef} makeDefault fov={50} position={cameraPosition} />;
};

export default CameraOptions;
