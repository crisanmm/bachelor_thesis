import * as THREE from 'three';
import { useResource } from 'react-three-fiber';

const Plane = () => {
  const planeGeometry: any = useResource();
  //   planeGeometry.current?.translate(5, 0, 0);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <planeBufferGeometry ref={planeGeometry} args={[50, 60]} />
      <meshStandardMaterial color={0x006994} side={THREE.DoubleSide} />
    </mesh>
  );
};

export default Plane;
