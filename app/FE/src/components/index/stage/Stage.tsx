import React, { ReactNodeArray, Suspense, useContext } from 'react';
import { Canvas } from 'react-three-fiber';
import { CameraOptions, OrbitControls, RendererOptions } from '@components/index';
import { StageContext } from '@contexts';
import StyledCanvasWrapper from './Stage.style';
import Plane from './Plane';
import Platform from './Platform';
import PlatformWall from './PlatformWall';
import AttenderManager from './attenderManager';

// const StageSuspense: React.FunctionComponent = ({ children }) => {
//   const socket = useContext(Socket.Context);
//   // console.log('🚀  -> file: Stage.tsx  -> line 13  -> socket', socket);

//   if (!socket) {
//     // console.log('here');
//     return <span>connecting to socket</span>;
//   }
//   return <>{children}</>;
// };

const SuspenseCanvas: React.FunctionComponent = ({ children }) => {
  const { socket, emitter } = useContext(StageContext.Context);

  if (!socket) return <span>Connecting to stage...</span>;
  return (
    <Canvas>
      <StageContext.Context.Provider value={{ socket, emitter }}>
        {children}
      </StageContext.Context.Provider>
    </Canvas>
  );
};

const Stage: React.FunctionComponent = () => (
  <StageContext.Provider>
    <StyledCanvasWrapper>
      <SuspenseCanvas>
        <axesHelper args={[50]} />

        <RendererOptions />
        <CameraOptions />
        {/* <OrbitControls /> */}

        <ambientLight args={[0xc3c3c3, 0.5]} />
        <Suspense fallback={null}>
          <Plane />
          <Platform />
          <PlatformWall />
          <AttenderManager />
        </Suspense>
      </SuspenseCanvas>
    </StyledCanvasWrapper>
  </StageContext.Provider>
);

export default Stage;
