import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { usePlayerStore } from '../store/usePlayerStore';
import gsap from 'gsap';

/**
 * CameraRig — handles two modes:
 *  'follow'    — smooth third-person follow of the player character
 *  'cinematic' — GSAP tweens camera to a fixed angle defined per landmark
 */
const CameraRig = ({ characterRef }) => {
  const { camera } = useThree();
  const activeQuest = usePlayerStore((s) => s.activeQuest);
  const cameraMode = usePlayerStore((s) => s.cameraMode);
  const setCameraMode = usePlayerStore((s) => s.setCameraMode);

  // Store the current tween so we can kill it on mode change
  const tweenRef = useRef(null);
  const isTransitioningRef = useRef(false);
  const followOffsetRef = useRef(new THREE.Vector3(0, 5, 9));
  const lookAtRef = useRef(new THREE.Vector3(0, 1, 0));

  // When activeQuest changes → trigger cinematic if quest opens
  useEffect(() => {
    if (activeQuest && activeQuest.cinematicCamera) {
      setCameraMode('cinematic');

      const { position: cp, target: ct } = activeQuest.cinematicCamera;
      // Base position on the landmark's world position
      const [lx, ly, lz] = activeQuest.position;
      const worldPos = {
        x: lx + cp[0] - activeQuest.position[0],
        y: cp[1],
        z: lz + cp[2] - activeQuest.position[2],
      };
      const worldTarget = new THREE.Vector3(
        lx + ct[0] - activeQuest.position[0],
        ct[1],
        lz + ct[2] - activeQuest.position[2],
      );

      isTransitioningRef.current = true;

      // Kill previous tween
      if (tweenRef.current) tweenRef.current.kill();

      tweenRef.current = gsap.to(camera.position, {
        x: lx + (cp[0] - activeQuest.position[0]),
        y: cp[1],
        z: lz + (cp[2] - activeQuest.position[2]),
        duration: 1.8,
        ease: 'power3.inOut',
        onUpdate: () => {
          lookAtRef.current.lerp(worldTarget, 0.08);
          camera.lookAt(lookAtRef.current);
        },
        onComplete: () => {
          isTransitioningRef.current = false;
        },
      });
    } else if (!activeQuest) {
      // Quest closed → smoothly return to follow mode
      setCameraMode('follow');
      isTransitioningRef.current = false;
      if (tweenRef.current) tweenRef.current.kill();
    }
  }, [activeQuest, camera, setCameraMode]);

  useFrame(() => {
    if (cameraMode !== 'follow' || isTransitioningRef.current) return;
    if (!characterRef?.current) return;

    try {
      const charPos = characterRef.current.translation();
      if (!charPos) return;

      const target = new THREE.Vector3(charPos.x, charPos.y + 1, charPos.z);
      const desired = target.clone().add(followOffsetRef.current);

      // Smooth camera follow with easing
      camera.position.lerp(desired, 0.06);

      // Smooth look-at
      lookAtRef.current.lerp(target, 0.08);
      camera.lookAt(lookAtRef.current);
    } catch (e) {
      // character not yet ready
    }
  });

  return null;
};

export default CameraRig;
