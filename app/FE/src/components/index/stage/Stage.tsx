import React, { ReactNodeArray, Suspense, useContext } from 'react';
import { Canvas } from 'react-three-fiber';
import { OrbitControls } from '@components/index';
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

const SuspenseCanvas: React.FunctionComponent = ({ children, style }) => {
  const { socket, emitter } = useContext(StageContext.Context);

  if (!socket) return <span>Connecting to stage...</span>;
  return (
    <Canvas style={style} camera={{ fov: 60, position: [0, 0, 30] }}>
      <StageContext.Context.Provider value={{ socket, emitter }}>
        {children}
      </StageContext.Context.Provider>
    </Canvas>
  );
};

const Stage: React.FunctionComponent = ({ style }) => (
  <StageContext.Provider>
    <StyledCanvasWrapper>
      <SuspenseCanvas style={style}>
        <axesHelper args={[50]} />

        <OrbitControls />

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
