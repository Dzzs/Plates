'use client';

import { useMemo } from 'react';
import { calculateLoading } from '@/lib/calculator';
import { useStore } from '@/store/useStore';
import { Unit } from '@/types';
import { Plate } from './Plate';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Weight } from 'lucide-react';

interface TargetCalculatorProps {
  unit: Unit;
}

export function TargetCalculator({ unit }: TargetCalculatorProps) {
  const { inventory, calculator, setCalculator, appearance } = useStore();

  const currentInventory = inventory[unit];
  const barWeight = currentInventory.barWeight;
  const currentAppearance = appearance[unit];

  const result = useMemo(() => {
    if (!calculator.targetWeight) return null;

    const effectiveTarget = calculator.includeBar
      ? calculator.targetWeight
      : calculator.targetWeight + barWeight;

    return calculateLoading(
      effectiveTarget,
      barWeight,
      currentInventory,
      calculator.policy
    );
  }, [calculator.targetWeight, calculator.includeBar, barWeight, currentInventory, calculator.policy]);

  return (
    <div className="space-y-5">
      <div className="glass-card p-5 sm:p-6 rounded-2xl space-y-4">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-primary/80 uppercase tracking-wider">
            <Weight className="w-4 h-4" />
            Target Weight ({unit})
          </label>
          <div className="relative group">
            <input
              type="number"
              step="0.5"
              min={barWeight}
              placeholder="0.0"
              value={calculator.targetWeight || ''}
              onChange={(e) => setCalculator({ targetWeight: parseFloat(e.target.value) || undefined })}
              className="w-full bg-white/5 border border-white/10 px-4 py-4 sm:px-5 sm:py-5 text-4xl sm:text-5xl font-black text-center rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all placeholder:text-white/10 text-white"
            />
            <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity" />
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl transition-colors hover:bg-white/10">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white/90">Include Bar Weight</span>
            <span className="text-xs text-white/50">{barWeight} {unit} standard bar</span>
          </div>
          <button
            onClick={() => setCalculator({ includeBar: !calculator.includeBar })}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-300 ${calculator.includeBar ? 'bg-primary shadow-[0_0_15px_rgba(64,201,255,0.4)]' : 'bg-white/10'
              }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${calculator.includeBar ? 'translate-x-7' : 'translate-x-1'
                }`}
            />
          </button>
        </div>

        {calculator.includeBar && calculator.targetWeight && calculator.targetWeight < barWeight && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="p-3 flex gap-3 text-sm font-medium text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 rounded-xl"
          >
            <Info className="w-5 h-5 shrink-0" />
            Target must be at least bar weight ({barWeight} {unit})
          </motion.div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            key="result"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="space-y-4"
          >
            <div className="glass-card p-5 sm:p-6 rounded-3xl border-primary/20 bg-primary/5">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Total Weight</p>
                  <p className="text-4xl sm:text-5xl font-black text-white tracking-tighter">
                    {result.achievedTotal}<span className="text-2xl text-primary ml-1">{unit}</span>
                  </p>
                </div>
                <div className="text-right space-y-2">
                  <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Balance</p>
                  <p className={`text-3xl font-black tracking-tight ${result.delta > 0
                      ? 'text-yellow-400'
                      : result.delta < 0
                        ? 'text-blue-400'
                        : 'text-emerald-400'
                    }`}>
                    {result.delta > 0
                      ? `-${result.delta} `
                      : result.delta < 0
                        ? `+${Math.abs(result.delta)} `
                        : 'Perfect'}
                    <span className="text-sm font-medium opacity-60">{result.delta !== 0 && unit}</span>
                  </p>
                </div>
              </div>

              {result.warning && (
                <div className="mb-5 p-3 text-sm font-medium text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 rounded-xl flex gap-3">
                  <Info className="w-5 h-5 shrink-0" />
                  {result.warning}
                </div>
              )}

              {result.perSide.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-[1px] flex-1 bg-white/10" />
                    <p className="text-xs font-bold text-white/30 uppercase tracking-[0.2em]">Per Side Loading</p>
                    <div className="h-[1px] flex-1 bg-white/10" />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {result.perSide.map(({ denom, count }) => (
                      <motion.div
                        key={denom}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex flex-col items-center gap-3 group"
                      >
                        <div className="relative">
                          <Plate
                            denom={denom}
                            unit={unit}
                            style={currentAppearance[denom] || { fill: '#333', stroke: '#444', text: '#fff', finish: 'rubber', thicknessScale: 1, diameterScale: 1, labelMode: 'denom' }}
                            size="md"
                          />
                          <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-black shadow-lg border-2 border-background"
                          >
                            {count}
                          </motion.div>
                        </div>
                        <span className="text-xs font-black text-white/60 tracking-wider">
                          {denom} {unit}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-5 text-center bg-white/5 rounded-2xl border border-dashed border-white/10">
                  <p className="text-white/30 font-medium">Empty Bar</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
