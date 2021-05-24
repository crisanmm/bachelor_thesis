import * as THREE from 'three';
import { useRef } from 'react';
import { useLoader } from '@react-three/fiber';

const PlatformWall = () => {
  const texturePicture = useLoader(THREE.TextureLoader, '/images/stage1.jpg');

  // const material = useRef();
  // const textureVideo = new THREE.VideoTexture(document.querySelector('video') as HTMLVideoElement);

  return (
    <mesh position={[0, 16, -30]} rotation={[0, 0, 0]}>
      <planeBufferGeometry args={[50, 28, 8]} />
      <meshBasicMaterial map={texturePicture} side={THREE.DoubleSide} />
    </mesh>
  );
};

export default PlatformWall;
