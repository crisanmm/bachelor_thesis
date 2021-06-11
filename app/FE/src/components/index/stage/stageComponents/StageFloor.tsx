import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ThreeEvent, useLoader, useThree } from '@react-three/fiber';
import { useTheme } from '@material-ui/core';
import { SocketContext } from '#contexts';
import { Position } from '../shared';

interface StageFloorProps {
  position: Position;
  geometryArgs: ConstructorParameters<typeof THREE.BoxGeometry>;
}

const StageFloor: React.FunctionComponent<StageFloorProps> = ({ position, geometryArgs }) => {
  const { scene } = useThree();
  const planeGeometryRef = useRef<THREE.PlaneGeometry>();
  const meshRef = useRef<THREE.Mesh>();
  const { emitter } = useContext(SocketContext.Context);
  const theme = useTheme();
  const [objLoader, setObjLoader] = useState<THREE.Loader>();
  const [arrow, setArrow] = useState<THREE.Mesh>();

  useLayoutEffect(() => {
    planeGeometryRef.current?.translate(0, 0, -geometryArgs[2]! / 2);
  }, [arrow]);

  useEffect(() => {
    if (!objLoader) {
      import('three/examples/jsm/loaders/OBJLoader')
        .then((module) => {
          setObjLoader(new module.OBJLoader());
        })
        .catch((e) => {
          console.log('🚀  -> file: Screen.tsx  -> line 26  -> e', e);
        });
    } else {
      objLoader
        .loadAsync('/threejs/models/arrow.obj')
        .then((model: THREE.Group) => {
          const [arrow] = model.children;
          ((arrow as THREE.Mesh).material as THREE.MeshPhongMaterial).color.set(theme.palette.success.main);
          setArrow(arrow as THREE.Mesh);
        })
        .catch((e) => {
          console.log('🚀  -> file: Screen.tsx  -> line 37  -> e', e);
        });
    }
  }, [objLoader]);

  const [colorMap, normalMap, roughnessMap, aoMap] = useLoader(THREE.TextureLoader, [
    'threejs/textures/stage_floor/color.jpg',
    'threejs/textures/stage_floor/normal.jpg',
    'threejs/textures/stage_floor/roughness.jpg',
    'threejs/textures/stage_floor/ambientOcclusion.jpg',
  ]);

  const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
    // stopPropagation doesn't really work...
    e.stopPropagation();

    // only run the event if the stage plane is the only intersected object
    if (e.intersections.length === 1 && e.intersections[0].object.uuid === meshRef.current?.uuid) {
      const { x, y, z } = e.intersections[0].point;
      const mesh = new THREE.Mesh(arrow!.geometry, arrow!.material);
      mesh.scale.set(7.5, 7.5, 2.5);
      mesh.position.set(x, 3.125, z);
      mesh.rotation.x = Math.PI / 2;
      scene.add(mesh);
      emitter.emit('my-attender-position-change', [x, 0, z]);
      setTimeout(() => scene.remove(mesh), 500);
    }
  };

  if (!arrow) return <></>;

  return (
    <mesh ref={meshRef} position={position} rotation={[-Math.PI / 2, 0, 0]} onPointerDown={onPointerDown}>
      <boxGeometry ref={planeGeometryRef} args={geometryArgs} />
      <meshStandardMaterial
        side={THREE.DoubleSide}
        map={colorMap}
        normalMap={normalMap}
        roughnessMap={roughnessMap}
        aoMap={aoMap}
      />
    </mesh>
  );
};

export default StageFloor;
