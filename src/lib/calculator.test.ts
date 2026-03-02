import { describe, it, expect } from 'vitest';
import { calculateLoading, toScaled, fromScaled } from './calculator';
import type { Inventory } from '@/types';

describe('Calculator', () => {
  describe('Scaling', () => {
    it('should convert to scaled values correctly', () => {
      expect(toScaled(1.25)).toBe(5); // 1.25 / 0.25 = 5
      expect(toScaled(45)).toBe(180); // 45 / 0.25 = 180
    });

    it('should convert from scaled values correctly', () => {
      expect(fromScaled(5)).toBe(1.25);
      expect(fromScaled(180)).toBe(45);
    });
  });

  describe('calculateLoading', () => {
    const inventory: Inventory = {
      plates: {
        '45': 4, // 2 per side
        '25': 2, // 1 per side
        '10': 4, // 2 per side
        '5': 2,  // 1 per side
      },
      barWeight: 45,
    };

    it('should calculate exact match', () => {
      const result = calculateLoading(135, 45, inventory, {
        allowOver: false,
        preferFewerPlates: true,
      });

      expect(result.achievedTotal).toBe(135);
      expect(result.delta).toBe(0);
      expect(result.isExact).toBe(true);
      expect(result.perSide).toHaveLength(1);
      expect(result.perSide[0]).toEqual({ denom: '45', count: 1 });
    });

    it('should calculate with multiple plates', () => {
      const result = calculateLoading(225, 45, inventory, {
        allowOver: false,
        preferFewerPlates: true,
      });

      expect(result.achievedTotal).toBe(225);
      expect(result.perSide).toHaveLength(1);
      expect(result.perSide[0]).toEqual({ denom: '45', count: 2 });
    });

    it('should find closest under when exact not possible', () => {
      const limitedInventory: Inventory = {
        plates: { '45': 2 }, // Only 1 per side
        barWeight: 45,
      };

      const result = calculateLoading(225, 45, limitedInventory, {
        allowOver: false,
        preferFewerPlates: true,
      });

      expect(result.achievedTotal).toBe(135); // Bar + 45 per side
      expect(result.delta).toBe(90);
    });

    it('should handle empty inventory', () => {
      const emptyInventory: Inventory = {
        plates: {},
        barWeight: 45,
      };

      const result = calculateLoading(135, 45, emptyInventory, {
        allowOver: false,
        preferFewerPlates: true,
      });

      expect(result.achievedTotal).toBe(45); // Just the bar
      expect(result.warning).toBe('No plates available');
    });

    it('should respect allowOver policy', () => {
      const inventory: Inventory = {
        plates: { '45': 4, '25': 2 },
        barWeight: 45,
      };

      // Target: 200 lb (155 lb plates needed = 77.5 per side)
      // Available: 45, 25
      // Best without over: 45 per side = 135 total
      // Best with over: 70 per side (45+25) = 185 total

      const resultUnder = calculateLoading(200, 45, inventory, {
        allowOver: false,
        preferFewerPlates: true,
      });

      const resultOver = calculateLoading(200, 45, inventory, {
        allowOver: true,
        preferFewerPlates: true,
      });

      expect(resultUnder.achievedTotal).toBeLessThan(200);
      expect(resultOver.achievedTotal).toBeGreaterThanOrEqual(200);
    });

    it('should prefer fewer plates when enabled', () => {
      const inventory: Inventory = {
        plates: { '45': 4, '10': 10 },
        barWeight: 45,
      };

      // Target: 145 lb (100 lb plates = 50 per side)
      // Option 1: 45 + 10 = 2 plates
      // Option 2: 10 * 5 = 5 plates

      const result = calculateLoading(145, 45, inventory, {
        allowOver: false,
        preferFewerPlates: true,
      });

      const plateCount = result.perSide.reduce((sum, p) => sum + p.count, 0);
      expect(plateCount).toBe(2); // Should prefer 45+10 over 5x10
    });
  });
});
