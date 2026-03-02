export type Unit = 'lb' | 'kg';

export interface PlateStyle {
  fill: string;
  stroke: string;
  text: string;
  finish: 'matte' | 'gloss' | 'rubber' | 'calibrated';
  stripe?: { color: string; widthPct: number };
  thicknessScale: number;
  diameterScale: number;
  labelMode: 'denom' | 'denom+unit' | 'none';
}

export interface Inventory {
  plates: Record<string, number>;
  barWeight: number;
}

export interface LoadingResult {
  perSide: Array<{ denom: string; count: number }>;
  achievedTotal: number;
  delta: number;
  isExact: boolean;
  warning?: string;
}

export interface CalculatorState {
  mode: 'target' | 'build';
  targetWeight?: number;
  includeBar: boolean;
  policy: {
    allowOver: boolean;
    preferFewerPlates: boolean;
  };
}

export interface AppState {
  unit: Unit;
  inventory: Record<Unit, Inventory>;
  appearance: Record<Unit, Record<string, PlateStyle>>;
  calculator: CalculatorState;
}
