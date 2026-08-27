import { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { usePlayerStore } from '../store/usePlayerStore';
import gsap from 'gsap';

/**
 * CameraRig — ONLY activates for cinematic mode.
 * Normal follow camera is handled entirely by ecctrl.
 * When a quest opens → GSAP tweens to the landmark's cinematic angle.
 * When closed → ecctrl takes back control automatically.
 */
const CameraRig = () => {
  const { camera } = useThree();
  const activeQuest = usePlayerStore((s) => s.activeQuest);
  const setCameraMode = usePlayerStore((s) => s.setCameraMode);

  const tweenRef = useRef(null);
  const savedPositionRef = useRef(null);

  useEffect(() => {
    if (activeQuest && activeQuest.cinematicCamera) {
      // Save current camera position so we can restore it
      savedPositionRef.current = camera.position.clone();

      setCameraMode('cinematic');

      const { position: cp, target: ct } = activeQuest.cinematicCamera;
      const [lx, , lz] = activeQuest.position;

      // World-space cinematic position: landmark origin + offset
      const targetPos = new THREE.Vector3(
        lx + (cp[0] - activeQuest.position[0]),
        cp[1],
        lz + (cp[2] - activeQuest.position[2])
      );
      const lookTarget = new THREE.Vector3(
        lx + (ct[0] - activeQuest.position[0]),
        ct[1],
        lz + (ct[2] - activeQuest.position[2])
      );

      // Kill any running tween
      if (tweenRef.current) tweenRef.current.kill();

      tweenRef.current = gsap.to(camera.position, {
        x: targetPos.x,
        y: targetPos.y,
        z: targetPos.z,
        duration: 1.8,
        ease: 'power3.inOut',
        onUpdate: () => {
          camera.lookAt(lookTarget);
        },
      });
    } else if (!activeQuest) {
      // Quest closed — kill tween, camera snaps back to ecctrl control
      if (tweenRef.current) {
        tweenRef.current.kill();
        tweenRef.current = null;
      }
      setCameraMode('follow');
      // ecctrl will immediately take over camera again — no manual restore needed
    }
  }, [activeQuest, camera, setCameraMode]);

  return null;
};

export default CameraRig;
