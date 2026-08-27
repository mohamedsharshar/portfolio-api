import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

import { allLandmarks } from './data/projects';

const PORTFOLIO_DATA = allLandmarks.map(lm => ({
  id: lm.id,
  type: lm.landmarkType === 'camp' ? 'campfire' :
        lm.landmarkType === 'lighthouse' ? 'tower' :
        lm.landmarkType === 'training_ground' ? 'ruins' :
        lm.landmarkType === 'shrine' ? 'torii' :
        lm.landmarkType === 'hearth' ? 'campfire' :
        'obelisk',
  title: lm.name + (lm.subtitle ? ` - ${lm.subtitle}` : ''),
  description: lm.description,
  tags: lm.tech || (lm.skills ? lm.skills.map(s => s.name) : ['Contact', 'Info']),
  linkText: lm.link ? 'View Project' : 'Explore',
  link: lm.link,
  color: lm.color || '#ffcc00',
  position: lm.position
}));

export default function App() {
  const mountRef = useRef(null);
  const [isStarted, setIsStarted] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [activeLandmark, setActiveLandmark] = useState(null);
  const [discoveredIds, setDiscoveredIds] = useState(new Set());
  
  // Game state refs to access inside the Three.js animation loop without stale closures
  const stateRef = useRef({
    isStarted: false,
    isInteracting: false,
    activeLandmark: null,
    movement: { forward: false, backward: false, left: false, right: false },
    mouse: { x: 0, y: 0 },
    discoveredIds: new Set(),
    cooldownId: null // FIX: prevents infinite re-triggering of the same landmark
  });

  // Keep stateRef synced with React state
  useEffect(() => {
    stateRef.current.isStarted = isStarted;
    stateRef.current.isInteracting = isInteracting;
    stateRef.current.activeLandmark = activeLandmark;
    stateRef.current.discoveredIds = discoveredIds;
  }, [isStarted, isInteracting, activeLandmark, discoveredIds]);

  const triggerInteraction = (landmark) => {
    setIsInteracting(true);
    setActiveLandmark(landmark);
    setDiscoveredIds(prev => new Set(prev).add(landmark.id));
    stateRef.current.cooldownId = landmark.id; // Lock this landmark
    
    if (document.pointerLockElement) {
      document.exitPointerLock();
    }
  };

  const closeInteraction = () => {
    setIsInteracting(false);
    setActiveLandmark(null);
    // Request pointer lock directly on user click (removing setTimeout prevents browser blocking)
    document.body.requestPointerLock().catch(err => console.warn("Pointer lock prevented", err));
  };

  const startGame = () => {
    setIsStarted(true);
    document.body.requestPointerLock().catch(err => console.warn("Pointer lock prevented", err));
  };

  // --- THREE.JS ENGINE SETUP ---
  useEffect(() => {
    if (!mountRef.current) return;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#cc7744');
    scene.fog = new THREE.FogExp2('#cc7744', 0.015);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    
    // FIX: Fallback to standard shadow map to avoid warnings in newer Three.js versions
    renderer.shadowMap.type = THREE.PCFShadowMap; 
    
    mountRef.current.appendChild(renderer.domElement);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight('#ffeebb', 0.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight('#ffaa55', 1);
    dirLight.position.set(100, 100, -50);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 500;
    dirLight.shadow.camera.left = -100;
    dirLight.shadow.camera.right = 100;
    dirLight.shadow.camera.top = 100;
    dirLight.shadow.camera.bottom = -100;
    scene.add(dirLight);

    // --- Terrain ---
    const terrainGeo = new THREE.PlaneGeometry(200, 200, 64, 64);
    terrainGeo.rotateX(-Math.PI / 2);
    const positions = terrainGeo.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const z = positions.getZ(i);
      const distFromCenter = Math.sqrt(x * x + z * z);
      let y = 0;
      if (distFromCenter > 10) {
        y = Math.sin(x * 0.05) * Math.cos(z * 0.05) * 5;
        y += Math.sin(x * 0.1) * 2;
        y += Math.pow(distFromCenter / 50, 2) * 2; 
      }
      positions.setY(i, y);
    }
    terrainGeo.computeVertexNormals();
    const terrainMat = new THREE.MeshStandardMaterial({ color: '#3d4c35', flatShading: true, roughness: 0.9, metalness: 0.1 });
    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    terrain.receiveShadow = true;
    scene.add(terrain);

    const waterGeo = new THREE.PlaneGeometry(300, 300);
    waterGeo.rotateX(-Math.PI / 2);
    const waterMat = new THREE.MeshStandardMaterial({ color: '#1ca3ec', transparent: true, opacity: 0.6, roughness: 0.1, metalness: 0.8 });
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.position.y = -2;
    scene.add(water);

    // Helper to get terrain Y
    const getTerrainHeight = (x, z) => {
      const distFromCenter = Math.sqrt(x * x + z * z);
      if (distFromCenter > 10) {
        let y = Math.sin(x * 0.05) * Math.cos(z * 0.05) * 5;
        y += Math.sin(x * 0.1) * 2;
        y += Math.pow(distFromCenter / 50, 2) * 2;
        return y;
      }
      return 0;
    };

    // --- Player ---
    const player = new THREE.Group();
    player.position.set(0, 10, 0);
    scene.add(player);

    const bodyGeo = new THREE.ConeGeometry(0.8, 2, 8);
    bodyGeo.translate(0, 1, 0); 
    const bodyMat = new THREE.MeshStandardMaterial({ color: '#eeeeee', flatShading: true });
    const playerBody = new THREE.Mesh(bodyGeo, bodyMat);
    playerBody.castShadow = true;
    
    const headGeo = new THREE.SphereGeometry(0.5, 8, 8);
    const headMat = new THREE.MeshStandardMaterial({ color: '#222222', flatShading: true });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 2.2;
    head.castShadow = true;

    const scarfGeo = new THREE.TorusGeometry(0.5, 0.15, 4, 8);
    scarfGeo.rotateX(Math.PI / 2);
    const scarfMat = new THREE.MeshStandardMaterial({ color: '#d4af37' });
    const scarf = new THREE.Mesh(scarfGeo, scarfMat);
    scarf.position.y = 2;

    player.add(playerBody, head, scarf);

    // --- Landmarks ---
    const landmarks = [];
    const buildObelisk = (group, color) => {
      const stoneMat = new THREE.MeshStandardMaterial({ color: '#666666', flatShading: true });
      const base = new THREE.Mesh(new THREE.BoxGeometry(3, 1, 3), stoneMat); base.position.y = 0.5; base.castShadow = true;
      const pillar = new THREE.Mesh(new THREE.BoxGeometry(1.5, 6, 1.5), stoneMat); pillar.position.y = 4; pillar.castShadow = true;
      const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(1), new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.5 }));
      crystal.position.y = 8; crystal.userData.isFloating = true;
      group.add(base, pillar, crystal);
    };
    
    const buildCampfire = (group, color) => {
      const logMat = new THREE.MeshStandardMaterial({ color: '#4a3728' });
      for(let i=0; i<3; i++) {
        const log = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1.5, 6), logMat);
        log.rotation.x = Math.PI/2; log.rotation.z = (i * Math.PI/1.5); log.position.y = 0.2; log.castShadow = true;
        group.add(log);
      }
      const fire = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1.5, 4), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.8 }));
      fire.position.y = 1; fire.userData.isFire = true; group.add(fire);
    };

    const buildTorii = (group, color) => {
      const woodMat = new THREE.MeshStandardMaterial({ color: '#8b3a3a' });
      const c1 = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 6, 8), woodMat); c1.position.set(-2, 3, 0); c1.castShadow = true;
      const c2 = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 6, 8), woodMat); c2.position.set(2, 3, 0); c2.castShadow = true;
      const b1 = new THREE.Mesh(new THREE.BoxGeometry(6, 0.6, 0.6), woodMat); b1.position.y = 5.5; b1.castShadow = true;
      const b2 = new THREE.Mesh(new THREE.BoxGeometry(7, 0.8, 0.8), woodMat); b2.position.y = 6.2; b2.rotation.z = 0.05; b2.castShadow = true;
      const b3 = b2.clone(); b3.rotation.z = -0.05;
      group.add(c1, c2, b1, b2, b3);
    };

    const buildRuins = (group, color) => {
      const stoneMat = new THREE.MeshStandardMaterial({ color: '#777777', flatShading: true });
      for(let i=0; i<5; i++) {
        const h = 2 + Math.random() * 3;
        const p = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, h, 6), stoneMat);
        p.position.set((Math.random()-0.5)*6, h/2, (Math.random()-0.5)*6);
        p.rotation.set((Math.random()-0.5)*0.5, 0, (Math.random()-0.5)*0.5); p.castShadow = true;
        group.add(p);
      }
      const rune = new THREE.Mesh(new THREE.BoxGeometry(1.5, 2, 0.5), new THREE.MeshStandardMaterial({ color: '#444444', emissive: color, emissiveIntensity: 0.2 }));
      rune.position.y = 1; rune.castShadow = true; group.add(rune);
    };

    const buildTower = (group, color) => {
      const stoneMat = new THREE.MeshStandardMaterial({ color: '#555555', flatShading: true });
      const base = new THREE.Mesh(new THREE.CylinderGeometry(3, 3.5, 4, 8), stoneMat); base.position.y = 2; base.castShadow = true;
      const mid = new THREE.Mesh(new THREE.CylinderGeometry(2, 3, 6, 8), stoneMat); mid.position.y = 7; mid.castShadow = true;
      const top = new THREE.Mesh(new THREE.SphereGeometry(1.5, 8, 8), new THREE.MeshBasicMaterial({ color }));
      top.position.y = 11; top.userData.isPulsing = true;
      group.add(base, mid, top);
    };

    PORTFOLIO_DATA.forEach(data => {
      const group = new THREE.Group();
      group.position.set(data.position[0], getTerrainHeight(data.position[0], data.position[2]), data.position[2]);
      
      switch(data.type) {
        case 'campfire': buildCampfire(group, data.color); break;
        case 'obelisk': buildObelisk(group, data.color); break;
        case 'torii': buildTorii(group, data.color); break;
        case 'ruins': buildRuins(group, data.color); break;
        case 'tower': buildTower(group, data.color); break;
        default: buildObelisk(group, data.color);
      }

      const light = new THREE.PointLight(data.color, 1, 15);
      light.position.y = 3;
      group.add(light);
      group.userData = data;
      scene.add(group);
      landmarks.push(group);
    });

    // --- Decorations ---
    const treeMat = new THREE.MeshStandardMaterial({ color: '#2d4c1e', flatShading: true });
    const trunkMat = new THREE.MeshStandardMaterial({ color: '#4a3728', flatShading: true });
    const rockMat = new THREE.MeshStandardMaterial({ color: '#666666', flatShading: true });

    for(let i=0; i<50; i++) {
        const x = (Math.random() - 0.5) * 180;
        const z = (Math.random() - 0.5) * 180;
        const h = getTerrainHeight(x, z);
        
        if (h < 0 || Math.sqrt(x*x + z*z) < 15) continue;

        if (Math.random() > 0.3) {
            const tree = new THREE.Group();
            const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 1, 5), trunkMat); trunk.position.y = 0.5; trunk.castShadow = true;
            const leaves = new THREE.Mesh(new THREE.ConeGeometry(1.5, 3, 5), treeMat); leaves.position.y = 2.5; leaves.castShadow = true;
            const leaves2 = new THREE.Mesh(new THREE.ConeGeometry(1.2, 2.5, 5), treeMat); leaves2.position.y = 4;
            tree.add(trunk, leaves, leaves2);
            tree.position.set(x, h, z);
            tree.rotation.y = Math.random() * Math.PI;
            const s = 0.8 + Math.random() * 0.6; tree.scale.set(s,s,s);
            scene.add(tree);
        } else {
            const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(Math.random() * 1 + 0.5), rockMat);
            rock.position.set(x, h + 0.2, z);
            rock.rotation.set(Math.random(), Math.random(), Math.random());
            rock.castShadow = true;
            scene.add(rock);
        }
    }

    // --- Inputs & Controls ---
    const handleKeyDown = (e) => {
      switch (e.code) {
        case 'KeyW': case 'ArrowUp': stateRef.current.movement.forward = true; break;
        case 'KeyS': case 'ArrowDown': stateRef.current.movement.backward = true; break;
        case 'KeyA': case 'ArrowLeft': stateRef.current.movement.left = true; break;
        case 'KeyD': case 'ArrowRight': stateRef.current.movement.right = true; break;
        default: break;
      }
    };
    const handleKeyUp = (e) => {
      switch (e.code) {
        case 'KeyW': case 'ArrowUp': stateRef.current.movement.forward = false; break;
        case 'KeyS': case 'ArrowDown': stateRef.current.movement.backward = false; break;
        case 'KeyA': case 'ArrowLeft': stateRef.current.movement.left = false; break;
        case 'KeyD': case 'ArrowRight': stateRef.current.movement.right = false; break;
        default: break;
      }
    };
    
    const handleMouseMove = (e) => {
      if (document.pointerLockElement && !stateRef.current.isInteracting) {
        stateRef.current.mouse.x -= e.movementX * 0.005;
        stateRef.current.mouse.y -= e.movementY * 0.005;
        stateRef.current.mouse.y = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, stateRef.current.mouse.y));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', handleMouseMove);
    
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // --- Game Loop Variables ---
    let velocityY = 0;
    const gravity = 0.5; // Adjusted for delta time
    const playerHeight = 2;
    const cameraRadius = 15;
    const cameraHeightOffset = 5;
    let cameraLookTarget = new THREE.Vector3();
    let animationFrameId;
    
    // FIX: Add delta time for smooth movement on all refresh rates
    const clock = new THREE.Clock();
    const moveSpeedUnitsPerSec = 15; 

    // --- Main Loop ---
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1); // Max delta of 0.1s to prevent huge jumps

      if (stateRef.current.isStarted) {
        
        // Animations
        const time = Date.now() * 0.003;
        landmarks.forEach(group => {
            group.children.forEach(child => {
                if(child.userData.isFloating) { child.position.y = 8 + Math.sin(time) * 0.5; child.rotation.y += 1 * delta; }
                if(child.userData.isFire) { const s = 1 + Math.sin(time * 5) * 0.1; child.scale.set(s,s,s); }
                if(child.userData.isPulsing) { child.material.opacity = 0.5 + Math.sin(time * 2) * 0.5; child.material.transparent = true; }
            });
        });

        // Movement or Interaction Camera
        if (stateRef.current.isInteracting && stateRef.current.activeLandmark) {
          const lData = stateRef.current.activeLandmark;
          const targetPos = new THREE.Vector3(lData.position[0], getTerrainHeight(lData.position[0], lData.position[2]), lData.position[2]);
          const dir = targetPos.clone().normalize();
          const camOffset = new THREE.Vector3(0, 5, 10);
          if (dir.lengthSq() > 0.1) camOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.atan2(dir.x, dir.z));
          
          const finalCamPos = targetPos.clone().add(camOffset);
          const finalLookAt = targetPos.clone().add(new THREE.Vector3(0, 3, 0));

          camera.position.lerp(finalCamPos, 0.05);
          cameraLookTarget.lerp(finalLookAt, 0.05);
          camera.lookAt(cameraLookTarget);

        } else {
          // Normal Movement
          const forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), stateRef.current.mouse.x);
          const right = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), stateRef.current.mouse.x);
          const moveVec = new THREE.Vector3(0, 0, 0);

          if (stateRef.current.movement.forward) moveVec.add(forward);
          if (stateRef.current.movement.backward) moveVec.sub(forward);
          if (stateRef.current.movement.left) moveVec.sub(right);
          if (stateRef.current.movement.right) moveVec.add(right);

          if (moveVec.lengthSq() > 0) {
            moveVec.normalize().multiplyScalar(moveSpeedUnitsPerSec * delta);
            player.position.add(moveVec);
            
            const targetAngle = Math.atan2(-moveVec.x, -moveVec.z);
            const diff = targetAngle - playerBody.rotation.y;
            const normalizedDiff = Math.atan2(Math.sin(diff), Math.cos(diff));
            
            // Smooth rotation adjustment
            playerBody.rotation.y += normalizedDiff * (10 * delta);
            playerBody.position.y = (playerHeight / 2) + Math.abs(Math.sin(Date.now() * 0.01)) * 0.2;
          } else {
            playerBody.position.y = playerHeight / 2;
          }

          // Terrain Collision
          const terrainY = getTerrainHeight(player.position.x, player.position.z);
          if (player.position.y > terrainY) {
            velocityY -= gravity * delta * 60; // scale gravity relative to 60fps
            player.position.y += velocityY * delta * 60;
            if (player.position.y < terrainY) {
              player.position.y = terrainY;
              velocityY = 0;
            }
          } else {
            player.position.y = terrainY;
            velocityY = 0;
          }

          // Camera Follow
          const offset = new THREE.Vector3(
            cameraRadius * Math.sin(stateRef.current.mouse.x) * Math.cos(stateRef.current.mouse.y),
            cameraRadius * Math.sin(stateRef.current.mouse.y) + cameraHeightOffset,
            cameraRadius * Math.cos(stateRef.current.mouse.x) * Math.cos(stateRef.current.mouse.y)
          );
          const desiredPos = player.position.clone().add(offset);
          const camTerrainY = getTerrainHeight(desiredPos.x, desiredPos.z);
          if (desiredPos.y < camTerrainY + 1) desiredPos.y = camTerrainY + 1;

          // Make camera follow smoother
          camera.position.lerp(desiredPos, 10 * delta);
          const targetLook = player.position.clone().add(new THREE.Vector3(0, playerHeight, 0));
          cameraLookTarget.lerp(targetLook, 15 * delta);
          camera.lookAt(cameraLookTarget);

          // Interaction Trigger Check (with Fix for infinite loop)
          let isNearAnyLandmark = false;
          for (let i = 0; i < landmarks.length; i++) {
            if (player.position.distanceTo(landmarks[i].position) < 7) {
              isNearAnyLandmark = true;
              const lmId = landmarks[i].userData.id;
              
              // Only trigger if it's not the one we just interacted with
              if (stateRef.current.cooldownId !== lmId) {
                triggerInteraction(landmarks[i].userData);
              }
              break;
            }
          }
          
          // Reset cooldown if we walked away from everything
          if (!isNearAnyLandmark && stateRef.current.cooldownId) {
            // Require walking a bit further away (e.g. distance > 10) to reset fully
            let isCompletelyAway = true;
            for (let i = 0; i < landmarks.length; i++) {
                if (player.position.distanceTo(landmarks[i].position) < 10) {
                    isCompletelyAway = false;
                    break;
                }
            }
            if (isCompletelyAway) {
                stateRef.current.cooldownId = null;
            }
          }
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // --- UI Inject Fonts ---
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Lora:ital,wght@0,400;0,700;1,400&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  return (
    <div className="w-screen h-screen bg-black overflow-hidden select-none relative font-serif">
      
      {/* Vanilla Three.js Container */}
      <div ref={mountRef} className="absolute inset-0 z-0"></div>

      {/* Crosshair */}
      {isStarted && !isInteracting && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white/50 rounded-full z-10 pointer-events-none"></div>
      )}

      {/* Intro Screen */}
      {!isStarted && (
        <div className="absolute inset-0 bg-[#0f0a05]/90 flex flex-col items-center justify-center text-[#f4e8d3] text-center transition-opacity duration-1000 z-50">
          <h1 className="text-5xl md:text-6xl mb-4 text-[#d4af37]" style={{ textShadow: '0 0 20px rgba(212,175,55,0.5)', fontFamily: "'Cinzel', serif" }}>
            Traveler's Log
          </h1>
          <p className="text-lg md:text-xl max-w-2xl px-6 mb-8 leading-relaxed">
            A journey through projects and experiences.<br/><br/>
            Use <strong className="text-[#d4af37]">WASD</strong> or Arrow Keys to move. Use <strong className="text-[#d4af37]">Mouse</strong> to look around. Approach landmarks to uncover their stories.
          </p>
          <button 
            onClick={startGame}
            className="border-2 border-[#d4af37] text-[#d4af37] px-8 py-4 uppercase tracking-widest text-lg hover:bg-[#d4af37] hover:text-[#2c2116] transition-all duration-300 shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] cursor-pointer"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Begin Journey
          </button>
        </div>
      )}

      {/* HUD (Always visible after start, unless intro is showing) */}
      {isStarted && (
        <div className="absolute top-6 left-6 text-[#f4e8d3]/80 drop-shadow-md z-20 pointer-events-none">
          <div className="italic text-sm mb-2 opacity-70">W A S D to move | Mouse to look</div>
          <div className="text-xl border-b border-[#d4af37]/50 pb-1" style={{ fontFamily: "'Cinzel', serif" }}>
            Discoveries: <span className="text-[#d4af37] font-bold">{discoveredIds.size}</span> / {PORTFOLIO_DATA.length}
          </div>
        </div>
      )}

      {/* Interaction Panel (The Scroll) */}
      <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center">
        <div 
          className={`relative bg-[#f4e8d3] w-[90%] max-w-[500px] p-10 rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_0_40px_rgba(200,170,120,0.3)] border-2 border-[#c8aa78] text-[#2c2116] transition-all duration-500 transform ${isInteracting ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 translate-y-8 scale-95'}`}
        >
          {/* Scroll structural accents */}
          <div className="absolute left-[-10px] right-[-10px] h-[15px] bg-[#a67c52] rounded-full top-[-10px] shadow-md"></div>
          <div className="absolute left-[-10px] right-[-10px] h-[15px] bg-[#a67c52] rounded-full bottom-[-10px] shadow-md"></div>

          <button 
            onClick={closeInteraction}
            className="absolute top-4 right-4 text-3xl text-[#2c2116] opacity-50 hover:opacity-100 transition-opacity leading-none cursor-pointer"
          >
            &times;
          </button>

          <h2 className="text-3xl text-center mb-4 text-[#5c3a21] border-b border-[#5c3a21]/30 pb-4" style={{ fontFamily: "'Cinzel', serif" }}>
            {activeLandmark?.title}
          </h2>
          
          <p className="text-lg leading-relaxed mb-6">
            {activeLandmark?.description}
          </p>

          <div className="flex flex-wrap gap-3 justify-center mb-8">
            {activeLandmark?.tags.map(tag => (
              <span key={tag} className="text-xs px-3 py-1 border border-[#2c2116] rounded-full uppercase tracking-wider font-semibold" style={{ fontFamily: "'Cinzel', serif" }}>
                {tag}
              </span>
            ))}
          </div>

          <button 
            onClick={(e) => {
              if (activeLandmark?.link && activeLandmark.link !== '#') {
                window.open(activeLandmark.link, '_blank');
              }
              closeInteraction(); 
            }}
            className="w-full block text-center bg-[#5c3a21] text-[#f4e8d3] py-3 tracking-widest font-bold rounded-sm hover:bg-[#3e2615] transition-colors cursor-pointer"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            {activeLandmark?.linkText || 'View Project'}
          </button>
        </div>
      </div>
    </div>
  );
}