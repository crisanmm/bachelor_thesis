import React, { Suspense, useContext, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ThemeProvider as StyledComponentsThemeProvider } from 'styled-components';
import { MuiThemeProvider, useTheme as useMuiTheme } from '@material-ui/core';
import { SocketContext } from '#contexts';
import type { Stage as StageType } from '#types/stage';
import CameraOptions from './cameraOptions';
import RendererOptions from './rendererOptions';
import StyledCanvasWrapper from './Stage.style';
import StageComponents from './stageComponents/StageComponents';
import { Position } from './shared';

const ForwardCanvas: React.FunctionComponent = ({ children }) => {
  const { stageSocket, emitter } = useContext(SocketContext.Context);
  const muiTheme = useMuiTheme();

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

const CAMERA_POSITION: Position = [0, 25, 75];
const CAMERA_LOOKAT: Position = [0, 15, 0];

interface StageProps {
  stage: StageType;
}

const Stage: React.FunctionComponent<StageProps> = ({ stage }) => {
  const timeoutId = useRef<number>();
  const isCanvasClicked = useRef<boolean>(false);
  const [orbitControls, setOrbitControls] = useState<any>();

  const onControlsStart = () => {
    // clear previous timeout before setting a new one
    window.clearTimeout(timeoutId.current);
    isCanvasClicked.current = true;
  };

  const onControlsEnd = () => {
    timeoutId.current = window.setTimeout(() => {
      isCanvasClicked.current = false;
    }, 4000);
  };

  const removeOrbitControlsListeners = () => {
    orbitControls.enabled = false;
    orbitControls.removeEventListener('start', onControlsStart);
    orbitControls.removeEventListener('end', onControlsEnd);
  };

  const addOrbitControlsListeners = () => {
    orbitControls.enabled = true;
    orbitControls.addEventListener('start', onControlsStart);
    orbitControls.addEventListener('end', onControlsEnd);
  };

  return (
    <StyledCanvasWrapper>
      <ForwardCanvas>
        {/* <axesHelper args={[50]} /> */}
        <RendererOptions />
        <CameraOptions
          cameraPosition={CAMERA_POSITION}
          cameraLookAt={CAMERA_LOOKAT}
          orbitControls={orbitControls}
          setOrbitControls={setOrbitControls}
        />

        <ambientLight args={[0xc3c3c3, 0.75]} />
        <directionalLight args={[0xffffff, 0.25]} />
        <pointLight args={[0xffffff, 1, 45]} position={[0, 15, 0]} />

        {orbitControls && (
          <Suspense fallback={null}>
            <StageComponents
              stage={stage}
              cameraPosition={CAMERA_POSITION}
              cameraLookAt={CAMERA_LOOKAT}
              isCanvasClicked={isCanvasClicked}
              removeOrbitControlsListeners={removeOrbitControlsListeners}
              addOrbitControlsListeners={addOrbitControlsListeners}
            />
          </Suspense>
        )}
      </ForwardCanvas>
    </StyledCanvasWrapper>
  );
};

export default Stage;
