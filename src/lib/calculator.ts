import type { LoadingResult, Inventory } from '@/types';

const STEP_SIZE = 0.25;
const MAX_PER_SIDE_SCALED = 10000; // 2500 kg max per side

export function toScaled(value: number): number {
  return Math.round(value / STEP_SIZE);
}

export function fromScaled(scaled: number): number {
  return Number((scaled * STEP_SIZE).toFixed(2));
}

export function calculateLoading(
  targetTotal: number,
  barWeight: number,
  inventory: Inventory,
  options: { allowOver: boolean; preferFewerPlates: boolean }
): LoadingResult {
  const loadTotal = Math.max(targetTotal - barWeight, 0);
  const targetPerSide = loadTotal / 2;
  const targetPerSideScaled = toScaled(targetPerSide);

  // Calculate available per side
  const availablePerSide: Record<string, number> = {};
  for (const [denom, count] of Object.entries(inventory.plates)) {
    const numDenom = Number(denom);
    if (!isNaN(numDenom) && numDenom > 0) {
      availablePerSide[numDenom.toString()] = Math.floor(count / 2);
    }
  }

  // Collect valid denominations sorted by weight descending
  const denoms = Object.keys(availablePerSide)
    .map(Number)
    .filter(d => availablePerSide[d.toString()] > 0)
    .sort((a, b) => b - a);

  if (denoms.length === 0 || targetPerSideScaled <= 0) {
    return {
      perSide: [],
      achievedTotal: barWeight,
      delta: targetTotal - barWeight,
      isExact: targetTotal === barWeight,
      warning: targetPerSide <= 0 ? 'Target weight must exceed bar weight' : 'No plates available',
    };
  }

  // Bounded knapsack DP
  // dp[i] = { achievable: boolean, plateCount: number, fromDenom: string, fromCount: number }
  const dp: Array<{
    achievable: boolean;
    plateCount: number;
    prevState: number;
    addedDenom: string;
    addedCount: number;
  }> = new Array(MAX_PER_SIDE_SCALED + 1).fill(null).map(() => ({
    achievable: false,
    plateCount: Infinity,
    prevState: -1,
    addedDenom: '',
    addedCount: 0,
  }));

  dp[0] = { achievable: true, plateCount: 0, prevState: -1, addedDenom: '', addedCount: 0 };

  for (const denom of denoms) {
    const denomScaled = toScaled(denom);
    const maxCount = availablePerSide[denom.toString()];

    // Process from high to low to avoid using same plate multiple times in one iteration
    for (let current = MAX_PER_SIDE_SCALED; current >= 0; current--) {
      if (!dp[current].achievable) continue;

      for (let count = 1; count <= maxCount; count++) {
        const next = current + denomScaled * count;
        if (next > MAX_PER_SIDE_SCALED) break;

        const newPlateCount = dp[current].plateCount + count;

        if (!dp[next].achievable || newPlateCount < dp[next].plateCount) {
          dp[next] = {
            achievable: true,
            plateCount: newPlateCount,
            prevState: current,
            addedDenom: denom.toString(),
            addedCount: count,
          };
        }
      }
    }
  }

  // Find best solution
  let bestTotal = 0;
  let bestDiff = Infinity;
  let bestPlateCount = Infinity;

  for (let total = 0; total <= MAX_PER_SIDE_SCALED; total++) {
    if (!dp[total].achievable) continue;

    const diff = Math.abs(total - targetPerSideScaled);
    const isOver = total > targetPerSideScaled;

    // Skip if over and not allowed
    if (isOver && !options.allowOver) continue;

    const plateCount = dp[total].plateCount;

    // Compare: primary is minimizing diff, secondary is fewer plates if preferred
    if (diff < bestDiff ||
        (diff === bestDiff && options.preferFewerPlates && plateCount < bestPlateCount)) {
      bestTotal = total;
      bestDiff = diff;
      bestPlateCount = plateCount;
    }
  }

  if (bestDiff === Infinity) {
    return {
      perSide: [],
      achievedTotal: barWeight,
      delta: targetTotal - barWeight,
      isExact: false,
      warning: 'Cannot achieve this weight with available plates',
    };
  }

  // Reconstruct solution
  const perSide: Array<{ denom: string; count: number }> = [];
  let current = bestTotal;

  // Group by denomination
  const denomCounts: Record<string, number> = {};

  while (current > 0 && dp[current].prevState >= 0) {
    const { addedDenom, addedCount } = dp[current];
    denomCounts[addedDenom] = (denomCounts[addedDenom] || 0) + addedCount;
    current = dp[current].prevState;
  }

  for (const [denom, count] of Object.entries(denomCounts)) {
    perSide.push({ denom, count });
  }

  // Sort by weight descending
  perSide.sort((a, b) => Number(b.denom) - Number(a.denom));

  const achievedPerSide = fromScaled(bestTotal);
  const achievedTotal = barWeight + achievedPerSide * 2;
  const delta = targetTotal - achievedTotal;

  return {
    perSide,
    achievedTotal,
    delta,
    isExact: Math.abs(delta) < 0.001,
  };
}
