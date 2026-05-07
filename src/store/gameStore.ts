import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Resources = {
  wood: number;
  stone: number;
  food: number;
  gold: number;
  mana: number;
};

export type Buildings = {
  castle: number;
  farm: number;
  lumbermill: number;
  quarry: number;
  market: number;
  temple: number;
  wizardTower: number;
};

export type Population = {
  total: number;
  idle: number;
  farmers: number;
  woodcutters: number;
  miners: number;
  merchants: number;
  priests: number;
  wizards: number;
};

export type KingdomAlignment = 'Neutral' | 'Warlike' | 'Prosperous' | 'Mystic' | 'Noble' | 'Tyrannical';

interface GameState {
  kingdomName: string;
  alignment: KingdomAlignment;
  season: 'Spring' | 'Summer' | 'Autumn' | 'Winter';
  day: number;
  lastTick: number;

  resources: Resources;
  buildings: Buildings;
  population: Population;

  // Actions
  setKingdomName: (name: string) => void;
  gatherResource: (resource: keyof Resources, amount: number) => void;
  build: (building: keyof Buildings) => boolean;
  assignWorker: (job: keyof Omit<Population, 'total' | 'idle'>, amount: number) => boolean;
  gameTick: () => void;
  calcProsperityScore: () => number;
}

const BUILDING_COSTS: Record<keyof Buildings, Partial<Resources>> = {
  castle: { wood: 500, stone: 500, gold: 100 },
  farm: { wood: 50, food: 20 },
  lumbermill: { wood: 100, stone: 20 },
  quarry: { wood: 100, stone: 50 },
  market: { wood: 200, gold: 50 },
  temple: { stone: 300, gold: 100, mana: 50 },
  wizardTower: { stone: 500, mana: 200 },
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      kingdomName: 'New Kingdom',
      alignment: 'Neutral',
      season: 'Spring',
      day: 1,
      lastTick: Date.now(),

      resources: { wood: 200, stone: 100, food: 200, gold: 50, mana: 10 },
      buildings: { castle: 1, farm: 0, lumbermill: 0, quarry: 0, market: 0, temple: 0, wizardTower: 0 },
      population: { total: 5, idle: 5, farmers: 0, woodcutters: 0, miners: 0, merchants: 0, priests: 0, wizards: 0 },

      setKingdomName: (name) => set({ kingdomName: name }),

      gatherResource: (resource, amount) =>
        set((state) => ({
          resources: { ...state.resources, [resource]: state.resources[resource] + amount },
        })),

      build: (building) => {
        const state = get();
        const cost = BUILDING_COSTS[building];
        
        // Check if affordable
        for (const [res, amt] of Object.entries(cost)) {
          if (state.resources[res as keyof Resources] < (amt || 0)) return false;
        }

        // Deduct cost and increment building
        set((state) => {
          const newResources = { ...state.resources };
          for (const [res, amt] of Object.entries(cost)) {
            newResources[res as keyof Resources] -= (amt || 0);
          }
          return {
            resources: newResources,
            buildings: { ...state.buildings, [building]: state.buildings[building] + 1 },
          };
        });
        return true;
      },

      assignWorker: (job, amount) => {
        const state = get();
        if (amount > 0 && state.population.idle < amount) return false;
        if (amount < 0 && state.population[job] < Math.abs(amount)) return false;

        set((state) => ({
          population: {
            ...state.population,
            idle: state.population.idle - amount,
            [job]: state.population[job] + amount,
          },
        }));
        return true;
      },

      calcProsperityScore: () => {
        const state = get();
        return Math.floor(
          state.buildings.castle * 1000 +
          state.population.total * 50 +
          state.resources.gold * 2 +
          state.resources.mana * 5 +
          state.day * 10
        );
      },

      gameTick: () => {
        const now = Date.now();
        const state = get();
        const deltaSeconds = Math.floor((now - state.lastTick) / 1000);

        if (deltaSeconds <= 0) return;

        set((state) => {
          // Calculate production
          const foodProduced = state.population.farmers * 2 * deltaSeconds + state.buildings.farm * 1 * deltaSeconds;
          const woodProduced = state.population.woodcutters * 1 * deltaSeconds + state.buildings.lumbermill * 2 * deltaSeconds;
          const stoneProduced = state.population.miners * 1 * deltaSeconds + state.buildings.quarry * 2 * deltaSeconds;
          const goldProduced = state.population.merchants * 1 * deltaSeconds + state.buildings.market * 2 * deltaSeconds;
          const manaProduced = state.population.priests * 0.5 * deltaSeconds + state.population.wizards * 1 * deltaSeconds + state.buildings.temple * 1 * deltaSeconds + state.buildings.wizardTower * 3 * deltaSeconds;
          
          // Consumption
          const foodConsumed = state.population.total * 0.5 * deltaSeconds;

          // Population growth (simplified) if there is surplus food and house capacity (castle = 10 capacity, each other = 2)
          let newPops = 0;
          const capacity = state.buildings.castle * 10 + state.buildings.farm * 2;
          if (foodProduced > foodConsumed && state.population.total < capacity && Math.random() < 0.1 * deltaSeconds) {
            newPops = 1;
          }

          let newDay = state.day;
          let newSeason = state.season;
          
          // Advance time: 1 day = 60 seconds
          if (now - state.lastTick > 60000) {
             newDay += Math.floor(deltaSeconds/60);
             const seasons: ('Spring' | 'Summer' | 'Autumn' | 'Winter')[] = ['Spring', 'Summer', 'Autumn', 'Winter'];
             const seasonIdx = Math.floor(newDay / 30) % 4;
             newSeason = seasons[seasonIdx];
          }

          return {
            lastTick: now,
            day: newDay,
            season: newSeason,
            resources: {
              ...state.resources,
              wood: state.resources.wood + woodProduced,
              stone: state.resources.stone + stoneProduced,
              food: Math.max(0, state.resources.food + foodProduced - foodConsumed),
              gold: state.resources.gold + goldProduced,
              mana: state.resources.mana + manaProduced,
            },
            population: {
              ...state.population,
              total: state.population.total + newPops,
              idle: state.population.idle + newPops,
            }
          };
        });
      },
    }),
    {
      name: 'kingdom-storage',
    }
  )
);
