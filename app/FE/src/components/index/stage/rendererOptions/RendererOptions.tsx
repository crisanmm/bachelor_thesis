import { useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

const RendererOptions = () => {
  const { gl } = useThree();
  gl.setPixelRatio(window.devicePixelRatio);
  return <></>;
};

export default RendererOptions;
