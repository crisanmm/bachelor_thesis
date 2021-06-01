import React, { Suspense, useContext } from 'react';
import { Canvas } from '@react-three/fiber';
import { ThemeProvider as StyledComponentsThemeProvider } from 'styled-components';
import { Typography, MuiThemeProvider, useTheme as useMuiTheme } from '@material-ui/core';
import { ErrorOutline } from '@material-ui/icons';
import { CameraOptions, OrbitControls, RendererOptions } from '#components/index';
import { StyledContainer } from '#components/shared';
import { SocketContext } from '#contexts';
import { Plane, Platform, PlatformWall } from './stageComponents';
import StyledCanvasWrapper from './Stage.style';
import AttenderManager from './attenderManager';

const ForwardCanvas: React.FunctionComponent = ({ children }) => {
  const { stageSocket, emitter } = useContext(SocketContext.Context);
  const muiTheme = useMuiTheme();
  console.log('🚀  -> file: Stage.tsx  -> line 15  -> stageSocket', (stageSocket?.auth as any).stageId);

  // because of the way react/react-three-fiber works it is necessary
  // to provide the context again in the Canvas element
  return (
    <Canvas>
      <MuiThemeProvider theme={muiTheme}>
        <StyledComponentsThemeProvider theme={muiTheme}>
          <SocketContext.Context.Provider value={{ stageSocket, emitter }}>{children}</SocketContext.Context.Provider>
        </StyledComponentsThemeProvider>
      </MuiThemeProvider>
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
      <directionalLight args={[0xffffff, 0.1]} />
      <pointLight args={[0xffffff, 0.75, 30]} position={[0, 15, 0]} />

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
