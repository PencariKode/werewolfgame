import { create } from 'zustand';
import { persist } from 'zustand/middleware'


/**
 * A custom hook using Zustand store with persistence for managing game configuration.
 * @typedef {Object} GameConfig
 * @property {string} roleCombi - The role combination setting (defaults to "default")
 * @property {Function} setRoleCombi - Function to update the role combination
 * @property {string} gameTitle - The title of the game
 * @property {Function} setGameTitle - Function to update the game title
 * @property {number} playerCount - Number of players
 * @property {Function} setPlayerCount - Function to update the player count
 * @property {Function} reset - Function to reset all values to default
 * 
 * @returns {GameConfig} Game configuration store and its methods
 */
export const useGameConfigStore = create(
    persist(
        (set) => ({
            roleCombi: "default",
            setRoleCombi: (roleCombi) => set({ roleCombi }),
            gameTitle: "",
            setGameTitle: (gameTitle) => set({ gameTitle }),
            playerCount: 7,
            setPlayerCount: (playerCount) => set({ playerCount }),
            roleConfig: {
                warga: 0,
                werewolf: 0,
                peramal: 0,
                penyihir: 0,
                pemburu: 0,
                dukun: 0,
                raja: 0,
                blackwolf: 0,
                shapeshifter: 0,
            },
            setRoleCount: (role, count) => set((state) => ({
                roleConfig: { ...state.roleConfig, [role]: count }
            })),
            setRoleConfig: (roleConfig) => set({roleConfig}) ,

            reset: () => set({
                roleCombi: "default",
                gameTitle: "",
                playerCount: 7,
                roleConfig: {
                    warga: 4,
                    werewolf: 1,
                    peramal: 1,
                    penyihir: 1,
                    pemburu: 0,
                    dukun: 0,
                    raja: 0,
                    blackwolf: 0,
                    shapeshifter: 0,
                }
            }),
        }),
        {
            name: "game-config",
            getStorage: () => localStorage,
            // serialize: (state) => JSON.stringify(state), // Serialize state
            // deserialize: (state) => JSON.parse(state), // Deserialize state
            onRehydrateStorage: (state) => {
                console.log("Game Config di-load:", state);
            },
        }
    )
)

export const useCheckRoom = create(persist(
    (set) => ({
        isJoined: false,
        setIsJoined: (isJoined) => set({ isJoined }),
        roomCode: "",
        setRoomCode: (roomCode) => set({ roomCode }),
        reset: () => set({
            isJoined: false,
            roomCode: "",
        }),
    }),
    {
        name: "checkRoom",
        getStorage: () => localStorage,
        onRehydrateStorage: (state) => {
            console.log("Check Room loaded:", state);
        },
    }
));