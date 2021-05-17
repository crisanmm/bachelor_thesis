import React, { Suspense, useContext } from 'react';
import { Canvas } from 'react-three-fiber';
import { Typography } from '@material-ui/core';
import { ErrorOutline } from '@material-ui/icons';
import { CameraOptions, OrbitControls, RendererOptions } from '#components/index';
import { StyledContainer } from '#components/shared';
import { SocketContext } from '#contexts';
import { Plane, Platform, PlatformWall } from './stageComponents';
import StyledCanvasWrapper from './Stage.style';
import AttenderManager from './attenderManager';

const ForwardCanvas: React.FunctionComponent = ({ children }) => {
  const { stageSocket, emitter } = useContext(SocketContext.Context);

  // because of react-three-fiber it is necessary to provide the context again in the Canvas element
  return (
    <Canvas>
      <SocketContext.Context.Provider value={{ stageSocket, emitter }}>
        {children}
      </SocketContext.Context.Provider>
    </Canvas>
  );
};

const Stage: React.FunctionComponent = () => (
  <StyledCanvasWrapper>
    <ForwardCanvas>
      <RendererOptions />
      <CameraOptions />
      {/* <OrbitControls /> */}
      <axesHelper args={[50]} />

      <ambientLight args={[0xc3c3c3, 0.5]} />
      <Suspense fallback={null}>
        <Plane />
        <Platform />
        <PlatformWall />
        <AttenderManager />
      </Suspense>
    </ForwardCanvas>
  </StyledCanvasWrapper>
);

export default Stage;
