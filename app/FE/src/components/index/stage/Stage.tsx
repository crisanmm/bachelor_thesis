import { Suspense } from 'react';
import { Canvas } from 'react-three-fiber';
import { OrbitControls } from '@components/index';
import StyledCanvasWrapper from './Stage.style';
import Plane from './Plane';
import Platform from './Platform';
import PlatformWall from './PlatformWall';
import Attender from './attender';

const Stage = ({ style }) => (
  <StyledCanvasWrapper>
    <Canvas style={style} camera={{ fov: 60, position: [0, 0, 30] }}>
      <OrbitControls />

      <ambientLight args={[0xc3c3c3, 0.5]} />
      <Suspense fallback={null}>
        <Plane />
        <Platform />
        <PlatformWall />
        <Attender position={[5, 10]} size="sm" />
        <Attender position={[2, 8]} size="md" />
        <Attender position={[1, 15]} size="lg" />
      </Suspense>
    </Canvas>
  </StyledCanvasWrapper>
);

export default Stage;
