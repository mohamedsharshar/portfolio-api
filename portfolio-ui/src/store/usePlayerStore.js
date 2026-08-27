import { create } from 'zustand';

export const usePlayerStore = create((set, get) => ({
  // Player position (updated every frame)
  playerPosition: [0, 5, 0],
  setPlayerPosition: (pos) => set({ playerPosition: pos }),

  // Active quest (the landmark panel currently shown)
  activeQuest: null,
  setActiveQuest: (quest) => set({ activeQuest: quest }),

  // Discovered quests (persists across session)
  discoveredQuests: [],
  discoverQuest: (id) =>
    set((state) =>
      state.discoveredQuests.includes(id)
        ? state
        : { discoveredQuests: [...state.discoveredQuests, id] }
    ),

  // Camera mode: 'follow' = normal third-person, 'cinematic' = locked to landmark angle
  cameraMode: 'follow',
  setCameraMode: (mode) => set({ cameraMode: mode }),

  // Cooldown to prevent re-triggering same quest while inside radius
  questCooldowns: {},
  setQuestCooldown: (id, timestamp) =>
    set((state) => ({
      questCooldowns: { ...state.questCooldowns, [id]: timestamp },
    })),
  isQuestOnCooldown: (id) => {
    const cooldowns = get().questCooldowns;
    const lastTime = cooldowns[id] || 0;
    return Date.now() - lastTime < 30000; // 30 seconds cooldown
  },

  // UI state
  showMiniMap: false,
  toggleMiniMap: () => set((state) => ({ showMiniMap: !state.showMiniMap })),

  isMoving: false,
  setIsMoving: (moving) => set({ isMoving: moving }),

  currentTerrain: 'grass', // 'grass' | 'stone' | 'wood'
  setCurrentTerrain: (terrain) => set({ currentTerrain: terrain }),

  // Interaction state
  interactMode: false,
  setInteractMode: (mode) => set({ interactMode: mode }),
}));