import { useContext, useRef } from 'react';
import * as THREE from 'three';
import { ThreeEvent, useThree } from '@react-three/fiber';
import { SocketContext } from '#contexts';

const Plane = () => {
  const { scene } = useThree();
  const planeGeometryRef = useRef<THREE.PlaneGeometry>();
  const meshRef = useRef<THREE.Mesh>();
  const { emitter } = useContext(SocketContext.Context);
  //   planeGeometryRef.current?.translate(5, 0, 0);

  const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
    // stopPropagation doesn't really work...
    e.stopPropagation();

    // only run the event if the stage plane is the only intersected object
    if (
      e.intersections.length === 1 &&
      e.intersections[0].object.uuid === meshRef.current?.uuid
    ) {
      const { x, y, z } = e.intersections[0].point;
      const geometry = new THREE.SphereGeometry(1, 32, 32);
      const material = new THREE.MeshBasicMaterial({ color: 0x00fff00 });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, 0, z);
      scene.add(mesh);
      emitter.emit('my-attender-position-change', [x, y, z]);
      setTimeout(() => scene.remove(mesh), 500);
    }
  };

  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2, 0, 0]}
      onPointerDown={onPointerDown}
    >
      <planeGeometry ref={planeGeometryRef} args={[50, 60]} />
      <meshStandardMaterial color={0x006994} side={THREE.DoubleSide} />
    </mesh>
  );
};

export default Plane;
