/* eslint-disable no-else-return */
import * as THREE from 'three';
import React, { SetStateAction, useEffect, useRef, useState } from 'react';
import { useLoader } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import axios from 'axios';
import type { Position } from '../shared';

interface ScreenProps {
  position: Position;
  geometryArgs: ConstructorParameters<typeof THREE.PlaneGeometry>;
  fallbackImageSrc: string;
  videoSrc: string;
  isCanvasClicked: React.MutableRefObject<boolean>;
  isVideoClicked: boolean;
  setIsVideoClicked: React.Dispatch<SetStateAction<boolean>>;
  removeOrbitControlsListeners: () => void;
  addOrbitControlsListeners: () => void;
}

const Screen: React.FunctionComponent<ScreenProps> = ({
  position,
  geometryArgs,
  fallbackImageSrc,
  videoSrc,
  isVideoClicked,
  setIsVideoClicked,
  isCanvasClicked,
  removeOrbitControlsListeners,
  addOrbitControlsListeners,
}) => {
  const intervalId = useRef<number>();
  const [videoElement, setVideoElement] = useState<HTMLVideoElement>();
  const [videoTexture, setVideoTexture] = useState<THREE.VideoTexture>();
  const imageTexture = useLoader(THREE.TextureLoader, fallbackImageSrc);
  useEffect(() => {
    const setupVideo = async () => {
      const _videoElement = document.getElementById('stage-video') as HTMLVideoElement;
      if (!videoElement && _videoElement) {
        window.clearInterval(intervalId.current);
        setVideoElement(_videoElement);
        try {
          // check if videoElement has valid src,
          // if not, videoTexture will not be set and fallback imageTexture will be loaded instead
          await axios.head(_videoElement.src);
          setVideoTexture(new THREE.VideoTexture(_videoElement));
          _videoElement.volume = 1;
          await _videoElement.play();
        } catch (e) {
          console.error('🚀  -> file: Screen.tsx  -> line 39  -> e', e);
        }
        return true;
      }
      return false;
    };

    setupVideo().then((result) => {
      if (!result) intervalId.current = window.setInterval(() => setupVideo(), 125);
    });
  }, []);

  const onPointerEnter = () => {
    window.document.body.style.cursor = 'pointer';
  };

  const onPointerLeave = () => {
    window.document.body.style.cursor = 'default';
  };

  const onPointerDown = () => {
    if (videoTexture) {
      setIsVideoClicked((isVideoClicked) => {
        if (isVideoClicked) {
          // exiting video view
          videoElement!.muted = true;
          return false;
        } else {
          // entering video view
          videoElement!.muted = false;
          videoElement!
            .play()
            .then((event) => {})
            .catch((e) => {
              console.dir(videoElement!);
              console.log(e);
            });
          return true;
        }
      });
    }
  };

  useEffect(() => {
    if (isVideoClicked) {
      removeOrbitControlsListeners();
      isCanvasClicked.current = false;
    } else {
      addOrbitControlsListeners();
      isCanvasClicked.current = false;
    }
  }, [isVideoClicked]);

  console.log('🚀  -> file: Screen.tsx  -> line 115  -> position', position);
  return (
    <>
      <mesh
        position={position}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onPointerDown={onPointerDown}
      >
        <planeGeometry args={geometryArgs} />
        <meshBasicMaterial map={videoTexture || imageTexture} side={THREE.DoubleSide} />
      </mesh>
      <Html calculatePosition={() => [0, 5000, 0]}>
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          id="stage-video"
          style={{ display: 'none' }}
          src={videoSrc}
          playsInline
          loop
          muted
          crossOrigin="anonymous"
        />
      </Html>
    </>
  );
};

export default Screen;
