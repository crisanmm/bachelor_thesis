/* eslint-disable */
// @ts-nocheck

import Head from 'next/head';
import Link from 'next/link';
import React, { FormEvent, Suspense, useEffect, useState } from 'react';
import { Canvas, useThree, useFrame, useResource, useLoader, extend } from 'react-three-fiber';
import * as THREE from 'three';
import { Object3D, Raycaster, TextureLoader } from 'three';

import { SplitPane, ChatBox, SignUpBox, SignInBox } from '../components/html';
import { OrbitControls } from '../components/three';

const Index2 = () => {
  return (
    <>
      <SignUpBox />
      <hr />
      <SignInBox />
    </>
  );
};

const Index = () => (
  <>
    <Head>
      <title>think-in</title>
    </Head>
    <MySplitPane />
  </>
);

const MySplitPane = () => (
  <SplitPane
    percentage={20}
    left={
      <Canvas camera={{ fov: 60, position: [0, 0, 30] }}>
        <OrbitControls />

        <ambientLight args={[0xc3c3c3, 0.5]} />
        {/* <pointLight args={[0xffffff, 0.6, 50]} position={[0, 10, -25]} /> */}
        <directionalLight args={[0xffffff, 0.2]} />

        <Fog />

        {/* <MyRaycaster /> */}

        <Suspense fallback={<></>}>
          {/* <axesHelper args={[50]} /> */}
          <Platform />
          <PlatformWall />
          <Plane />
        </Suspense>

        <group position={[0, -10, 0]}>
          <mesh position={[0, 10, 0]}>
            <boxBufferGeometry />
            <meshBasicMaterial />
          </mesh>
          <mesh position={[0, 20, 0]}>
            <boxBufferGeometry />
            <meshBasicMaterial />
          </mesh>
        </group>
      </Canvas>
    }
    right={
      <>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <video src="screensaver.mp4" style={{ width: '100%', display: 'none' }} controls></video>
          <ChatBox
            personNameList={['person1', 'person2', 'person3']}
            messageList={[
              { isMessageMine: true, content: 'mesaj1' },
              { isMessageMine: false, content: 'mesaj2' },
              { isMessageMine: false, content: 'mesaj3' },
              { isMessageMine: true, content: 'mesaj4' },
              { isMessageMine: true, content: 'mesaj5' },
            ]}
          />
        </div>
      </>
    }
  />
);

const MyRaycaster = () => {
  const { scene, camera } = useThree();
  const raycaster: { current: THREE.Raycaster } = useResource();

  const mouse = new THREE.Vector2();
  // window.addEventListener('mousemove', (e) => {
  //   mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  //   mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  //   console.log(mouse);
  // });

  useFrame((state, delta) => {
    // raycaster.current?.setFromCamera({ x: 0, y: 0 }, camera);
    // raycaster.current?.set?.(
    //   camera.position,
    //   camera?.getWorldDirection(new THREE.Vector3()).normalize()
    // );
    raycaster.current?.setFromCamera(mouse, camera);
    const intersectedObjects = raycaster.current?.intersectObjects(
      scene.children,
      false,
      undefined
    );
    for (const intersectedObject of intersectedObjects) {
      (intersectedObject.object as any)?.material.color.set(0xffff00);
      // console.log(intersectedObject);
    }
  });

  return <raycaster ref={raycaster} />;
};

const Fog = () => {
  const { scene, gl } = useThree();
  scene.fog = new THREE.FogExp2(0xc3c3c3, 25e-3);
  // scene.fog = new THREE.Fog(0xc3c3c3, 10, 50);
  // console.log(gl.getClearColor());
  // gl.setClearAlpha()
  // scene.background = new THREE.Color(0xcc0000);
  return <></>;
};

const Platform = () => {
  return (
    <mesh position={[0, 1, -26]}>
      <boxBufferGeometry args={[50, 2, 8]} />
      <meshStandardMaterial color={0xcc0000} />
    </mesh>
  );
};

const PlatformWall = () => {
  const texturePicture = useLoader(THREE.TextureLoader, 'windows-xp.jpg');

  const material = useResource();
  const textureVideo = new THREE.VideoTexture(document.querySelector('video') as HTMLVideoElement);

  return (
    <mesh position={[0, 16, -30]} rotation={[0, 0, 0]}>
      <planeBufferGeometry args={[50, 28, 8]} />
      <meshBasicMaterial ref={material} map={textureVideo} side={THREE.DoubleSide} />
    </mesh>
  );
};

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

export default Index2;
