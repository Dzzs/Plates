'use client';

import { useMemo, useState } from 'react';
import { useStore } from '@/store/useStore';
import { Unit } from '@/types';
import { Plus, Minus, Trash2, Layers } from 'lucide-react';
import { Plate } from './Plate';
import { motion, AnimatePresence } from 'framer-motion';

const defaultPlates = {
  lb: [1.25, 2.5, 5, 10, 25, 35, 45, 55],
  kg: [0.5, 1, 1.25, 2.5, 5, 10, 15, 20, 25],
};

interface BuildCalculatorProps {
  unit: Unit;
}

export function BuildCalculator({ unit }: BuildCalculatorProps) {
  const { inventory, appearance } = useStore();
  const [selectedPlates, setSelectedPlates] = useState<Record<string, number>>({});

  const currentInventory = inventory[unit];
  const currentAppearance = appearance[unit];
  const barWeight = currentInventory.barWeight;

  const availableDenoms = useMemo(() => {
    return defaultPlates[unit].filter(d => (currentInventory.plates[d] || 0) > 0);
  }, [currentInventory.plates, unit]);

  const { perSideTotal, totalWeight } = useMemo(() => {
    let perSide = 0;
    for (const [denom, count] of Object.entries(selectedPlates)) {
      perSide += Number(denom) * count;
    }
    return {
      perSideTotal: perSide,
      totalWeight: barWeight + perSide * 2,
    };
  }, [selectedPlates, barWeight]);

  const addPlate = (denom: number) => {
    const maxAvailable = currentInventory.plates[denom] || 0;
    const currentCount = selectedPlates[denom] || 0;
    const perSideAvailable = Math.floor(maxAvailable / 2);

    if (currentCount < perSideAvailable) {
      setSelectedPlates(prev => ({
        ...prev,
        [denom]: (prev[denom] || 0) + 1,
      }));
    }
  };

  const removePlate = (denom: number) => {
    const currentCount = selectedPlates[denom] || 0;
    if (currentCount > 0) {
      const newCount = currentCount - 1;
      if (newCount === 0) {
        const { [denom]: _, ...rest } = selectedPlates;
        setSelectedPlates(rest);
      } else {
        setSelectedPlates(prev => ({
          ...prev,
          [denom]: newCount,
        }));
      }
    }
  };

  const clearAll = () => setSelectedPlates({});

  return (
    <div className="space-y-5">
      <div className="glass-card p-5 sm:p-6 rounded-3xl border-primary/20 bg-primary/5 text-center relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Layers className="w-24 h-24 rotate-12" />
        </div>

        <p className="text-xs font-bold text-white/40 uppercase tracking-[0.3em] mb-3">Loaded Weight</p>
        <p className="text-5xl sm:text-6xl font-black text-white tracking-tighter mb-3">
          {totalWeight}<span className="text-3xl text-primary ml-2">{unit}</span>
        </p>
        <div className="flex items-center justify-center gap-3 text-sm font-bold text-white/60 bg-white/5 py-2.5 px-5 rounded-2xl w-fit mx-auto border border-white/5">
          <span>Bar: {barWeight}</span>
          <div className="w-[1px] h-4 bg-white/10" />
          <span>Plates: {perSideTotal * 2} {unit}</span>
        </div>
      </div>

      {availableDenoms.length === 0 ? (
        <div className="py-16 text-center glass-card rounded-3xl border-dashed">
          <Layers className="w-12 h-12 text-white/10 mx-auto mb-4" />
          <p className="text-xl font-black text-white/50 mb-2">Inventory Empty</p>
          <p className="text-sm text-white/30">Add plates in settings to start building</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-[1px] flex-1 bg-white/10" />
            <p className="text-xs font-bold text-white/30 uppercase tracking-[0.2em]">Add Plates Per Side</p>
            <div className="h-[1px] flex-1 bg-white/10" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {availableDenoms.map(denom => {
              const count = selectedPlates[denom] || 0;
              const maxAvailable = Math.floor((currentInventory.plates[denom] || 0) / 2);
              const style = currentAppearance[denom] || { fill: '#333', stroke: '#444', text: '#fff', finish: 'rubber', thicknessScale: 1, diameterScale: 1, labelMode: 'denom' };

              return (
                <motion.div
                  key={denom}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <Plate
                      denom={denom}
                      unit={unit}
                      style={style}
                      size="sm"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="text-base font-black text-white tracking-tight">{denom} {unit}</span>
                      <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
                        {count} / {maxAvailable} Available
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-white/5 p-1 rounded-xl border border-white/5">
                    <button
                      onClick={() => removePlate(denom)}
                      disabled={count === 0}
                      className="p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-all hover:scale-110 active:scale-90"
                    >
                      <Minus className="w-4 h-4 text-white" />
                    </button>

                    <span className="w-7 text-center text-lg font-black text-primary">{count}</span>

                    <button
                      onClick={() => addPlate(denom)}
                      disabled={count >= maxAvailable}
                      className="p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-all hover:scale-110 active:scale-90"
                    >
                      <Plus className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      <AnimatePresence>
        {Object.keys(selectedPlates).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="pt-6"
          >
            <button
              onClick={clearAll}
              className="flex items-center gap-2 mx-auto px-8 py-4 text-xs font-black uppercase tracking-widest text-red-400 bg-red-400/5 hover:bg-red-400/10 border border-red-400/20 rounded-2xl transition-all hover:scale-105 active:scale-95"
            >
              <Trash2 className="w-4 h-4" />
              Reset Selection
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
