import Head from 'next/head';
import Link from 'next/link';
import React, { Suspense, useEffect, useState } from 'react';
import { Canvas, useThree, useFrame, useResource, useLoader } from 'react-three-fiber';
import * as THREE from 'three';
import { TextureLoader } from 'three';

import { Layout, SplitPane, ChatBox } from '../components/html';
import { OrbitControls } from '../components/three';

const Index = () => {
  return (
    <>
      <Head>
        <title>think-in</title>
      </Head>
      <Layout>
        <SplitPane
          percentage={60}
          left={
            <Canvas camera={{ fov: 60, position: [0, 0, 30] }}>
              <OrbitControls />

              <ambientLight args={[0xc3c3c3, 0.5]} />
              {/* <pointLight args={[0xffffff, 0.6, 50]} position={[0, 10, -25]} /> */}
              <directionalLight args={[0xffffff, 0.2]} />

              <Suspense fallback={<></>}>
                <axesHelper args={[50]} />
                <Platform />
                <PlatformWall />
                <Plane />
              </Suspense>
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
                <video src='screensaver.mp4' style={{ width: '100%' }} controls></video>
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
      </Layout>
    </>
  );
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
  const textureVideo = new THREE.VideoTexture(document.querySelector('video'));

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

export default Index;
