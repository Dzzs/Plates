import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { z } from 'zod';
import type { Unit, PlateStyle, Inventory, CalculatorState } from '@/types';

const CURRENT_VERSION = 1;

// Default plate styles
const defaultPlateStyle = (fill: string, stroke: string): PlateStyle => ({
  fill,
  stroke,
  text: '#ffffff',
  finish: 'rubber',
  thicknessScale: 1,
  diameterScale: 1,
  labelMode: 'denom',
});

const defaultLbStyles: Record<string, PlateStyle> = {
  '1.25': defaultPlateStyle('#333333', '#555555'),
  '2.5': defaultPlateStyle('#444444', '#666666'),
  '5': defaultPlateStyle('#8B4513', '#A0522D'),
  '10': defaultPlateStyle('#228B22', '#2E8B57'),
  '25': defaultPlateStyle('#4169E1', '#1E90FF'),
  '35': defaultPlateStyle('#FFD700', '#DAA520'),
  '45': defaultPlateStyle('#DC143C', '#B22222'),
  '55': defaultPlateStyle('#333333', '#555555'),
};

const defaultKgStyles: Record<string, PlateStyle> = {
  '0.5': defaultPlateStyle('#333333', '#555555'),
  '1': defaultPlateStyle('#444444', '#666666'),
  '1.25': defaultPlateStyle('#555555', '#777777'),
  '2.5': defaultPlateStyle('#8B4513', '#A0522D'),
  '5': defaultPlateStyle('#228B22', '#2E8B57'),
  '10': defaultPlateStyle('#4169E1', '#1E90FF'),
  '15': defaultPlateStyle('#FFD700', '#DAA520'),
  '20': defaultPlateStyle('#DC143C', '#B22222'),
  '25': defaultPlateStyle('#333333', '#555555'),
};

const defaultInventory: Inventory = {
  plates: {},
  barWeight: 0,
};

// Zod schemas
const plateStyleSchema = z.object({
  fill: z.string(),
  stroke: z.string(),
  text: z.string(),
  finish: z.enum(['matte', 'gloss', 'rubber', 'calibrated']),
  stripe: z.object({ color: z.string(), widthPct: z.number() }).optional(),
  thicknessScale: z.number(),
  diameterScale: z.number(),
  labelMode: z.enum(['denom', 'denom+unit', 'none']),
});

const inventorySchema = z.object({
  plates: z.record(z.string(), z.number()),
  barWeight: z.number(),
});

const calculatorSchema = z.object({
  mode: z.enum(['target', 'build']),
  targetWeight: z.number().optional(),
  includeBar: z.boolean(),
  policy: z.object({
    allowOver: z.boolean(),
    preferFewerPlates: z.boolean(),
  }),
});

const stateSchema = z.object({
  version: z.number(),
  unit: z.enum(['lb', 'kg']),
  inventory: z.record(z.enum(['lb', 'kg']), inventorySchema),
  appearance: z.record(z.enum(['lb', 'kg']), z.record(z.string(), plateStyleSchema)),
  calculator: calculatorSchema,
});

interface StoreState {
  unit: Unit;
  inventory: Record<Unit, Inventory>;
  appearance: Record<Unit, Record<string, PlateStyle>>;
  calculator: CalculatorState;
  
  // Actions
  setUnit: (unit: Unit) => void;
  setInventory: (unit: Unit, inventory: Inventory) => void;
  updatePlateCount: (unit: Unit, denom: string, count: number) => void;
  setBarWeight: (unit: Unit, weight: number) => void;
  setAppearance: (unit: Unit, denom: string, style: PlateStyle) => void;
  updateAppearance: (unit: Unit, appearance: Record<string, PlateStyle>) => void;
  setCalculator: (calculator: Partial<CalculatorState>) => void;
  resetAll: () => void;
  resetAppearance: () => void;
}

const initialState = {
  version: CURRENT_VERSION,
  unit: 'lb' as Unit,
  inventory: {
    lb: { ...defaultInventory, barWeight: 45 },
    kg: { ...defaultInventory, barWeight: 20 },
  },
  appearance: {
    lb: defaultLbStyles,
    kg: defaultKgStyles,
  },
  calculator: {
    mode: 'target',
    includeBar: true,
    policy: {
      allowOver: false,
      preferFewerPlates: true,
    },
  } as CalculatorState,
};

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setUnit: (unit) => set({ unit }),
      
      setInventory: (unit, inventory) => set((state) => ({
        inventory: { ...state.inventory, [unit]: inventory },
      })),
      
      updatePlateCount: (unit, denom, count) => set((state) => ({
        inventory: {
          ...state.inventory,
          [unit]: {
            ...state.inventory[unit],
            plates: {
              ...state.inventory[unit].plates,
              [denom]: Math.max(0, count),
            },
          },
        },
      })),
      
      setBarWeight: (unit, weight) => set((state) => ({
        inventory: {
          ...state.inventory,
          [unit]: {
            ...state.inventory[unit],
            barWeight: weight,
          },
        },
      })),
      
      setAppearance: (unit, denom, style) => set((state) => ({
        appearance: {
          ...state.appearance,
          [unit]: {
            ...state.appearance[unit],
            [denom]: style,
          },
        },
      })),
      
      updateAppearance: (unit, appearance) => set((state) => ({
        appearance: {
          ...state.appearance,
          [unit]: appearance,
        },
      })),
      
      setCalculator: (calculator) => set((state) => ({
        calculator: { ...state.calculator, ...calculator },
      })),
      
      resetAll: () => set(initialState),
      
      resetAppearance: () => set((state) => ({
        appearance: initialState.appearance,
      })),
    }),
    {
      name: 'platecalc-storage',
      version: CURRENT_VERSION,
      migrate: (persistedState: unknown, version: number) => {
        if (version < CURRENT_VERSION) {
          return initialState;
        }
        return persistedState as typeof initialState;
      },
    }
  )
);
