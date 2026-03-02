'use client';

import { useStore } from '@/store/useStore';
import { Unit } from '@/types';
import { Plus, Minus, Palette, Dumbbell, Info } from 'lucide-react';
import Link from 'next/link';
import { Plate } from './Plate';
import { motion } from 'framer-motion';

const defaultPlates = {
  lb: [1.25, 2.5, 5, 10, 25, 35, 45, 55],
  kg: [0.5, 1, 1.25, 2.5, 5, 10, 15, 20, 25],
};

interface InventoryEditorProps {
  unit: Unit;
  compact?: boolean;
}

export function InventoryEditor({ unit, compact = false }: InventoryEditorProps) {
  const { inventory, updatePlateCount, setBarWeight, appearance } = useStore();
  const currentInventory = inventory[unit];
  const currentAppearance = appearance[unit];

  const handleBarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setBarWeight(unit, value);
    }
  };

  return (
    <div className={compact ? 'space-y-6' : 'space-y-10'}>
      <div className={`glass-card rounded-3xl relative overflow-hidden group ${compact ? 'p-4 space-y-4' : 'p-8 space-y-8'}`}>
        <div className="flex items-center gap-3">
          <div className={`bg-primary/10 rounded-2xl border border-primary/20 ${compact ? 'p-2' : 'p-3'}`}>
            <Dumbbell className={compact ? 'w-5 h-5 text-primary' : 'w-6 h-6 text-primary'} />
          </div>
          <div>
            <h3 className={`${compact ? 'text-base' : 'text-xl'} font-black text-white tracking-tight`}>Barbell Weight</h3>
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Global configuration</p>
          </div>
        </div>

        <div className="relative group/input">
          <label className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-black text-white/20 uppercase tracking-widest transition-opacity group-focus-within/input:opacity-0">
            {unit}
          </label>
          <input
            type="number"
            step="0.5"
            min="0"
            value={currentInventory.barWeight}
            onChange={handleBarChange}
            className={`w-full bg-white/5 border border-white/10 text-center rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-white font-black ${compact ? 'px-4 py-3 text-3xl' : 'px-6 py-6 text-4xl'}`}
          />
        </div>

        <Link
          href="/appearance"
          className={`flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground rounded-xl hover:scale-[1.01] active:scale-[0.99] transition-all font-black uppercase tracking-widest text-[11px] shadow-[0_0_20px_rgba(64,201,255,0.3)] ${compact ? 'px-4 py-3' : 'px-6 py-4'}`}
        >
          <Palette className="w-4 h-4" />
          Customize Visuals
        </Link>
      </div>

      <div className={compact ? 'space-y-4' : 'space-y-6'}>
        <div className="flex items-center gap-3">
          <div className={`bg-white/5 rounded-xl border border-white/10 ${compact ? 'p-2.5' : 'p-3'}`}>
            <span className={compact ? 'text-base' : 'text-xl'}>⚖️</span>
          </div>
          <div>
            <h3 className={`${compact ? 'text-base' : 'text-xl'} font-black text-white tracking-tight`}>Plate Inventory</h3>
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Total units available</p>
          </div>
        </div>

        <div className={`grid ${compact ? 'grid-cols-2 gap-2.5' : 'grid-cols-1 sm:grid-cols-2 gap-4'}`}>
          {defaultPlates[unit].map((denom) => {
            const count = currentInventory.plates[denom] || 0;
            const style = currentAppearance[denom] || {
              fill: '#333',
              stroke: '#444',
              text: '#fff',
              finish: 'rubber',
              thicknessScale: 1,
              diameterScale: 1,
              labelMode: 'denom',
            };

            return (
              <motion.div
                key={denom}
                className={`glass-card rounded-2xl group transition-all hover:bg-white/5 ${compact ? 'p-3' : 'p-4'}`}
              >
                <div className={`flex ${compact ? 'flex-col items-start gap-2' : 'items-center justify-between gap-3'}`}>
                  <div className="flex items-center gap-3">
                    <Plate denom={denom} unit={unit} style={style} size="sm" />
                    <div className="flex flex-col">
                      <span className={`${compact ? 'text-sm' : 'text-lg'} font-black text-white tracking-tight`}>
                        {denom} {unit}
                      </span>
                      <span className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">Plate</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/5">
                    <button
                      onClick={() => updatePlateCount(unit, denom.toString(), count - 1)}
                      disabled={count <= 0}
                      className="p-1.5 rounded-md hover:bg-white/10 disabled:opacity-10 disabled:cursor-not-allowed transition-all"
                    >
                      <Minus className="w-4 h-4 text-white" />
                    </button>

                    <span className={`${compact ? 'w-6 text-sm' : 'w-8 text-base'} text-center font-black text-white`}>
                      {count}
                    </span>

                    <button
                      onClick={() => updatePlateCount(unit, denom.toString(), count + 1)}
                      className="p-1.5 rounded-md hover:bg-white/10 transition-all"
                    >
                      <Plus className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className={`bg-primary/5 border border-primary/10 rounded-xl flex gap-3 ${compact ? 'p-4' : 'p-6'}`}>
          <Info className="w-5 h-5 text-primary shrink-0" />
          <p className="text-[11px] font-semibold text-white/50 leading-relaxed">
            <span className="text-primary font-black uppercase tracking-wider mr-1">Pro Tip:</span>
            Counts are individual plates, and loading math automatically uses balanced pairs.
          </p>
        </div>
      </div>
    </div>
  );
}
