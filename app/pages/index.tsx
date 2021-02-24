import Head from "next/head";
import Link from "next/link";
import * as THREE from "three";
import { useState } from "react";
import { Canvas, useFrame, useResource, useThree } from "react-three-fiber";
import { Layout } from "../components";

export default function Index() {
  return (
    <Layout>
      <Canvas style={{ minHeight: "100vh" }}>
        {(state) => {
          state.gl.setClearAlpha(0.1);
          return (
            <>
              <Controls />
              <PointLight />
              <Cube position={[3, 0, 0]} />
              <Sphere position={[-3, 0, 0]} />
            </>
          );
        }}
      </Canvas>
    </Layout>
  );
}

function PointLight() {
  const light = useResource() as any;

  return (
    <>
      <pointLight ref={light} args={[0xffffff, 1, 25]} position={[0, 0, 10]} />
      {light.current && <pointLightHelper args={[light.current, 1, 0xff0000]} />}
    </>
  );
}

function handleOnClick(e: any) {
  e.object.material.color.set(Math.random() * 0xffffff);
  e.stopPropagation();
}

function Cube({ position }: { position: [number, number, number] }) {
  const cube = useResource() as any;

  useFrame((state, delta) => {
    cube.current.rotation.x += delta;
    cube.current.rotation.y += delta;
  });

  return (
    <mesh ref={cube} position={[...position]} onClick={handleOnClick}>
      <boxBufferGeometry args={[2, 2, 2]} />
      <meshLambertMaterial />
    </mesh>
  );
}

function Sphere({ position }: { position: [number, number, number] }) {
  const sphere = useResource() as any;

  useFrame((state, delta) => {
    sphere.current.rotation.x += delta;
    sphere.current.rotation.y += delta;
  });

  return (
    <mesh ref={sphere} position={[...position]} onClick={handleOnClick}>
      <sphereBufferGeometry args={[1, 100, 100]} />
      <meshPhongMaterial />
    </mesh>
  );
}

// function replacer(key, value) {
//   if (typeof value === "object" && key != "") {
//     return undefined;
//   }
//   return value;
// }

const Controls = () => {
  const {
    camera,
    gl: { domElement: canvasElement },
  } = useThree();

  let [controls, setControls]: [any, any] = useState({});

  useFrame(() => {
    if (Object.keys(controls).length == 0) {
      (async () => {
        const module = await import("three/examples/jsm/controls/OrbitControls");
        setControls(new module.OrbitControls(camera, canvasElement));
        controls.enableDamping = true;
      })();
    } else {
      controls.enableDamping = true;
      if (controls.update) {
        controls.update();
      }
    }
  });

  return <></>;
};
