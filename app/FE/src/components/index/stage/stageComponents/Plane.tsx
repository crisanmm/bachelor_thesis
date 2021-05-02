import { useContext } from 'react';
import * as THREE from 'three';
import { useResource, useThree } from 'react-three-fiber';
import { SocketContext } from '@contexts';

const Plane = () => {
  const { scene } = useThree();
  const planeGeometry = useResource<THREE.PlaneGeometry>();
  const { emitter } = useContext(SocketContext.Context);
  //   planeGeometry.current?.translate(5, 0, 0);

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      onClick={(e) => {
        const { x, y, z } = e.intersections[0].point;
        const geometry = new THREE.SphereGeometry(1, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0x00fff00 });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, 0, z);
        scene.add(mesh);
        emitter.emit('my-attender-position-change', [x, y, z]);
        setTimeout(() => scene.remove(mesh), 500);
      }}
    >
      <planeGeometry ref={planeGeometry} args={[50, 60]} />
      <meshStandardMaterial color={0x006994} side={THREE.DoubleSide} />
    </mesh>
  );
};

export default Plane;
