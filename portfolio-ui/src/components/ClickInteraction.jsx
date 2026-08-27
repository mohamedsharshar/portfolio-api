import { useRef, useCallback, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePlayerStore } from '../store/usePlayerStore';
import { allLandmarks } from '../data/projects';

/**
 * ClickInteraction — Left-click on landmarks to interact.
 * Also handles E/Q/R key interactions:
 *   E = Interact with nearest landmark
 *   Q = Quick close active quest panel
 *   R = Reset camera to default angle
 *
 * Uses raycasting to detect which object the user clicked on.
 */
const INTERACT_DISTANCE = 8; // Max distance for E-key interaction

const ClickInteraction = ({ cameraOrbitRef }) => {
  const { camera, scene, gl } = useThree();
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());

  const setActiveQuest = usePlayerStore((s) => s.setActiveQuest);
  const setQuestCooldown = usePlayerStore((s) => s.setQuestCooldown);

  // --- Left-click raycast interaction ---
  const handleClick = useCallback((e) => {
    // Only respond to left mouse button
    if (e.button !== 0) return;

    const rect = gl.domElement.getBoundingClientRect();
    mouse.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.current.setFromCamera(mouse.current, camera);
    const intersects = raycaster.current.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
      // Walk up the scene graph from hit object to find a landmark group
      let hit = intersects[0].object;
      let depth = 0;
      while (hit && depth < 10) {
        // Check if this group corresponds to a landmark position
        if (hit.position) {
          const landmark = allLandmarks.find((lm) => {
            const dx = Math.abs(hit.position.x - lm.position[0]);
            const dz = Math.abs(hit.position.z - lm.position[2]);
            return dx < 4 && dz < 4 && Math.abs(hit.position.y - lm.position[1]) < 2;
          });
          if (landmark) {
            const playerPos = usePlayerStore.getState().playerPosition;
            const dist = Math.sqrt(
              (playerPos[0] - landmark.position[0]) ** 2 +
              (playerPos[2] - landmark.position[2]) ** 2
            );
            // Only interact if player is close enough
            if (dist < INTERACT_DISTANCE) {
              setActiveQuest(landmark);
              usePlayerStore.getState().discoverQuest(landmark.id);
              return;
            }
          }
        }
        hit = hit.parent;
        depth++;
      }
    }
  }, [camera, scene, gl, setActiveQuest]);

  // --- Keyboard interactions: E, Q, R ---
  const handleKeyDown = useCallback((e) => {
    const key = e.key.toLowerCase();

    // E = Interact with nearest landmark
    if (key === 'e') {
      const playerPos = usePlayerStore.getState().playerPosition;
      const activeQuest = usePlayerStore.getState().activeQuest;
      if (activeQuest) return; // Already viewing a quest

      let nearest = null;
      let nearestDist = INTERACT_DISTANCE;

      allLandmarks.forEach((lm) => {
        const dist = Math.sqrt(
          (playerPos[0] - lm.position[0]) ** 2 +
          (playerPos[2] - lm.position[2]) ** 2
        );
        if (dist < nearestDist) {
          nearestDist = dist;
          nearest = lm;
        }
      });

      if (nearest) {
        setActiveQuest(nearest);
        usePlayerStore.getState().discoverQuest(nearest.id);
      }
    }

    // Q = Quick close quest panel
    if (key === 'q') {
      const activeQuest = usePlayerStore.getState().activeQuest;
      if (activeQuest) {
        setQuestCooldown(activeQuest.id, Date.now());
        setActiveQuest(null);
      }
    }

    // R = Reset camera angle
    if (key === 'r' && cameraOrbitRef?.current) {
      cameraOrbitRef.current.yaw = Math.PI;
      cameraOrbitRef.current.pitch = 0.4;
      cameraOrbitRef.current.targetDistance = 8;
    }
  }, [setActiveQuest, setQuestCooldown, cameraOrbitRef]);

  useEffect(() => {
    gl.domElement.addEventListener('click', handleClick);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      gl.domElement.removeEventListener('click', handleClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gl, handleClick, handleKeyDown]);

  return null;
};

export default ClickInteraction;
