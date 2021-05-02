import { useEffect, useState } from 'react';
import { useFrame, useThree } from 'react-three-fiber';

const OrbitControls = () => {
  const {
    camera,
    gl: { domElement: canvasElement },
  } = useThree();

  const [controls, setControls]: any = useState({});
  if (Object.keys(controls).length !== 0) {
    controls.enableDamping = true;
  }

  useEffect(() => {
    if (Object.keys(controls).length === 0) {
      (async () => {
        const module = await import('three/examples/jsm/controls/OrbitControls');
        setControls(new module.OrbitControls(camera, canvasElement));
      })();
    }
  });

  useFrame(() => {
    if (controls?.update) {
      controls.update();
    }
  });

  return <></>;
};

export default OrbitControls;
