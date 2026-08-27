import { useRef, useEffect, useCallback } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePlayerStore } from '../store/usePlayerStore';

/**
 * RightClickCamera — Custom camera controller:
 *  • Right-click drag: orbit camera around the player
 *  • Mouse wheel: zoom in/out
 *  • Smooth follow of the ecctrl character
 *  • Prevents default context menu on right-click
 *
 * This replaces ecctrl's built-in pointer-lock camera.
 */
const RightClickCamera = ({ orbitRef }) => {
  const { camera, gl } = useThree();
  const cameraMode = usePlayerStore((s) => s.cameraMode);

  // Camera orbit state
  const orbit = useRef({
    yaw: Math.PI,       // horizontal angle (start behind character)
    pitch: 0.4,         // vertical angle (slightly above)
    distance: 8,        // zoom distance
    targetDistance: 8,
    isDragging: false,
    lastX: 0,
    lastY: 0,
  });

  // Expose orbit ref to parent
  useEffect(() => {
    if (orbitRef) orbitRef.current = orbit.current;
  }, [orbitRef]);

  // Smooth camera position target
  const smoothTarget = useRef(new THREE.Vector3(0, 5, 0));
  const SENSITIVITY = 0.003;
  const ZOOM_SPEED = 1.2;
  const MIN_DISTANCE = 3;
  const MAX_DISTANCE = 20;
  const MIN_PITCH = -0.1;   // slightly below horizon
  const MAX_PITCH = 1.3;    // near top-down
  const FOLLOW_SMOOTHING = 0.08;

  // --- Right-click drag ---
  const handleMouseDown = useCallback((e) => {
    if (e.button === 2) {
      orbit.current.isDragging = true;
      orbit.current.lastX = e.clientX;
      orbit.current.lastY = e.clientY;
    }
  }, []);

  const handleMouseMove = useCallback((e) => {
    const o = orbit.current;
    if (!o.isDragging) return;

    const dx = e.clientX - o.lastX;
    const dy = e.clientY - o.lastY;
    o.lastX = e.clientX;
    o.lastY = e.clientY;

    o.yaw -= dx * SENSITIVITY;
    o.pitch = Math.max(MIN_PITCH, Math.min(MAX_PITCH, o.pitch + dy * SENSITIVITY));
  }, []);

  const handleMouseUp = useCallback((e) => {
    if (e.button === 2) {
      orbit.current.isDragging = false;
    }
  }, []);

  // --- Mouse wheel zoom ---
  const handleWheel = useCallback((e) => {
    const o = orbit.current;
    if (e.deltaY > 0) {
      o.targetDistance = Math.min(MAX_DISTANCE, o.targetDistance + ZOOM_SPEED);
    } else {
      o.targetDistance = Math.max(MIN_DISTANCE, o.targetDistance - ZOOM_SPEED);
    }
  }, []);

  // --- Prevent context menu on right-click ---
  const handleContextMenu = useCallback((e) => {
    e.preventDefault();
  }, []);

  // Attach event listeners
  useEffect(() => {
    const domElement = gl.domElement;

    domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    domElement.addEventListener('wheel', handleWheel, { passive: true });
    domElement.addEventListener('contextmenu', handleContextMenu);

    return () => {
      domElement.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      domElement.removeEventListener('wheel', handleWheel);
      domElement.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [gl, handleMouseDown, handleMouseMove, handleMouseUp, handleWheel, handleContextMenu]);

  // Update camera every frame
  useFrame(() => {
    // Don't control camera during cinematic mode
    if (cameraMode === 'cinematic') return;

    const o = orbit.current;
    const playerPos = usePlayerStore.getState().playerPosition;

    // Smooth zoom
    o.distance += (o.targetDistance - o.distance) * 0.1;

    // Smooth follow target (character head height)
    const target = new THREE.Vector3(playerPos[0], playerPos[1] + 1.5, playerPos[2]);
    smoothTarget.current.lerp(target, FOLLOW_SMOOTHING);

    // Calculate camera position from orbit angles
    const camX = smoothTarget.current.x + o.distance * Math.sin(o.yaw) * Math.cos(o.pitch);
    const camY = smoothTarget.current.y + o.distance * Math.sin(o.pitch);
    const camZ = smoothTarget.current.z + o.distance * Math.cos(o.yaw) * Math.cos(o.pitch);

    camera.position.set(camX, camY, camZ);
    camera.lookAt(smoothTarget.current);
  });

  return null;
};

export default RightClickCamera;
