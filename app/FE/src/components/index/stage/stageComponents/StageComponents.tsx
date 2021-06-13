/* eslint-disable no-else-return */
import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useTheme } from '@material-ui/core';
import { useWindowWidth } from '@react-hook/window-size';
import type { Stage as StageType } from '#types/stage';
import type { Position } from '../shared';
import StageFloor from './StageFloor';
import Screen from './Screen';
import Wall from './Wall';
import AttenderManager from '../attenderManager';

const WIDTH = 45;
const HEIGHT = 30;
const DEPTH = 1;
const Z_FIGHTING_OFFSET = 0.05;

const STAGEFLOOR_POSITION: Position = [0, 0, 0];
const STAGEFLOOR_GEOMETRY_ARGS: ConstructorParameters<typeof THREE.BoxGeometry> = [WIDTH * 0.9, HEIGHT * 2, DEPTH * 2];

const SCREEN_POSITION: Position = [0, HEIGHT * 1.25, -HEIGHT];
const SCREEN_GEOMETRY_ARGS: ConstructorParameters<typeof THREE.PlaneGeometry> = [WIDTH, WIDTH / (16 / 9)];

const WALL_POSITION: Position = [
  SCREEN_POSITION[0],
  -STAGEFLOOR_GEOMETRY_ARGS[2]!,
  SCREEN_POSITION[2] - DEPTH / 2 - Z_FIGHTING_OFFSET,
];
const WALL_GEOMETRY_ARGS: ConstructorParameters<typeof THREE.BoxGeometry> = [
  SCREEN_GEOMETRY_ARGS[0],
  SCREEN_GEOMETRY_ARGS[1]! + SCREEN_POSITION[1] - SCREEN_GEOMETRY_ARGS[1]! / 2 + STAGEFLOOR_GEOMETRY_ARGS[2]!,
  DEPTH,
];

const FINAL_CAMERA_POSITION: Position = [0, SCREEN_POSITION[1], 0];
const LERP_ALPHA: number = 0.04;

interface StageComponentsProps {
  stage: StageType;
  cameraPosition: Position;
  cameraLookAt: Position;
  isCanvasClicked: React.MutableRefObject<boolean>;
  removeOrbitControlsListeners: () => void;
  addOrbitControlsListeners: () => void;
}

const StageComponents: React.FunctionComponent<StageComponentsProps> = ({
  stage,
  cameraPosition,
  cameraLookAt,
  isCanvasClicked,
  removeOrbitControlsListeners,
  addOrbitControlsListeners,
}) => {
  const theme = useTheme();
  const windowWidth = useWindowWidth();
  const [isVideoClicked, setIsVideoClicked] = useState<boolean>(false);

  // reuse these vectors in useFrame
  const [screenPosition] = useState(new THREE.Vector3(...SCREEN_POSITION));
  const [initialCameraPosition] = useState(new THREE.Vector3(...cameraPosition));
  const [finalCameraPosition, setFinalCameraPosition] = useState(new THREE.Vector3(...FINAL_CAMERA_POSITION));
  const [initialCameraLookAt] = useState(new THREE.Vector3(...cameraLookAt));
  const [cameraLookAtPosition] = useState(new THREE.Vector3(...cameraLookAt));

  useEffect(() => {
    if (windowWidth < theme.breakpoints.values.sm) {
      setFinalCameraPosition(new THREE.Vector3(FINAL_CAMERA_POSITION[0], FINAL_CAMERA_POSITION[1], 15));
    } else if (windowWidth < theme.breakpoints.values.md) {
      setFinalCameraPosition(new THREE.Vector3(FINAL_CAMERA_POSITION[0], FINAL_CAMERA_POSITION[1], 10));
    } else if (windowWidth < theme.breakpoints.values.lg) {
      setFinalCameraPosition(new THREE.Vector3(FINAL_CAMERA_POSITION[0], FINAL_CAMERA_POSITION[1], 7.5));
    } else {
      setFinalCameraPosition(new THREE.Vector3(FINAL_CAMERA_POSITION[0], FINAL_CAMERA_POSITION[1], 5));
    }
  }, [windowWidth]);

  useFrame(({ camera }) => {
    if (!isCanvasClicked.current)
      if (isVideoClicked) {
        camera.position.lerp(finalCameraPosition, LERP_ALPHA);
        camera.lookAt(cameraLookAtPosition.lerp(screenPosition, LERP_ALPHA));
      } else {
        camera.position.lerp(initialCameraPosition, LERP_ALPHA);
        camera.lookAt(cameraLookAtPosition.lerp(initialCameraLookAt, LERP_ALPHA));
      }
  });

  return (
    <>
      <StageFloor position={STAGEFLOOR_POSITION} geometryArgs={STAGEFLOOR_GEOMETRY_ARGS} />
      <Wall position={WALL_POSITION} geometryArgs={WALL_GEOMETRY_ARGS} />
      <Screen
        position={SCREEN_POSITION}
        geometryArgs={SCREEN_GEOMETRY_ARGS}
        imageSrc={stage.imageLink}
        videoSrc={stage.videoLink}
        isVideoClicked={isVideoClicked}
        setIsVideoClicked={setIsVideoClicked}
        isCanvasClicked={isCanvasClicked}
        removeOrbitControlsListeners={removeOrbitControlsListeners}
        addOrbitControlsListeners={addOrbitControlsListeners}
      />
      <AttenderManager />
    </>
  );
};

export default StageComponents;
