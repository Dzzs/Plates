'use client';

import { useStore } from '@/store/useStore';
import { Unit, PlateStyle } from '@/types';
import { ArrowLeft, Paintbrush, Sliders, Palette } from 'lucide-react';
import Link from 'next/link';
import { Plate } from './Plate';
import { motion } from 'framer-motion';

const defaultPlates = {
  lb: [1.25, 2.5, 5, 10, 25, 35, 45, 55],
  kg: [0.5, 1, 1.25, 2.5, 5, 10, 15, 20, 25],
};

const finishOptions = ['matte', 'gloss', 'rubber', 'calibrated'] as const;

interface AppearanceEditorProps {
  unit: Unit;
}

export function AppearanceEditor({ unit }: AppearanceEditorProps) {
  const { appearance, setAppearance } = useStore();
  const currentAppearance = appearance[unit];

  const updateStyle = (denom: string, updates: Partial<PlateStyle>) => {
    const current = currentAppearance[denom] || {
      fill: '#666666',
      stroke: '#888888',
      text: '#ffffff',
      finish: 'rubber',
      thicknessScale: 1,
      diameterScale: 1,
      labelMode: 'denom',
    };
    setAppearance(unit, denom, { ...current, ...updates });
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-black text-white/50 hover:text-white transition-colors uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" />
          Calculator
        </Link>
        <button
          onClick={() => window.location.reload()} // Quick reset to defaults if needed
          className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-white/40 transition-colors"
        >
          Reset All
        </button>
      </div>

      <div className="flex items-center gap-5">
        <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20 shadow-[0_0_20px_rgba(64,201,255,0.1)]">
          <Paintbrush className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter">Plate Designer</h1>
          <p className="text-xs font-bold text-white/30 uppercase tracking-[0.3em]">Visual Calibration • {unit.toUpperCase()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {defaultPlates[unit].map((denom, index) => {
          const style = currentAppearance[denom] || {
            fill: '#666666',
            stroke: '#888888',
            text: '#ffffff',
            finish: 'rubber',
            thicknessScale: 1,
            diameterScale: 1,
            labelMode: 'denom',
          };

          return (
            <motion.div
              key={denom}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card p-8 rounded-3xl space-y-8 group transition-all hover:bg-white/5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-8">
                <div className="relative shrink-0 group-hover:scale-105 transition-transform duration-500">
                  <Plate
                    denom={denom}
                    unit={unit}
                    style={style}
                    size="lg"
                  />
                  <div className="absolute inset-0 rounded-full shadow-[0_0_40px_rgba(0,0,0,0.5)] pointer-events-none" />
                </div>

                <div className="flex-1 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-black text-white tracking-widest">{denom} <span className="text-primary">{unit}</span></h2>
                      <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] mt-1">Plate Identity</p>
                    </div>
                    <div className="p-2 bg-white/5 rounded-xl border border-white/10">
                      <Sliders className="w-4 h-4 text-white/40" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">Main Fill</label>
                      <div className="flex items-center gap-3 bg-white/5 p-2 rounded-xl border border-white/10">
                        <input
                          type="color"
                          value={style.fill}
                          onChange={(e) => updateStyle(denom.toString(), { fill: e.target.value })}
                          className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent"
                        />
                        <span className="text-[10px] font-mono text-white/40 uppercase">{style.fill}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">Outer Rim</label>
                      <div className="flex items-center gap-3 bg-white/5 p-2 rounded-xl border border-white/10">
                        <input
                          type="color"
                          value={style.stroke}
                          onChange={(e) => updateStyle(denom.toString(), { stroke: e.target.value })}
                          className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent"
                        />
                        <span className="text-[10px] font-mono text-white/40 uppercase">{style.stroke}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">Markings</label>
                      <div className="flex items-center gap-3 bg-white/5 p-2 rounded-xl border border-white/10">
                        <input
                          type="color"
                          value={style.text}
                          onChange={(e) => updateStyle(denom.toString(), { text: e.target.value })}
                          className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent"
                        />
                        <span className="text-[10px] font-mono text-white/40 uppercase">{style.text}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">Texture</label>
                      <select
                        value={style.finish}
                        onChange={(e) => updateStyle(denom.toString(), { finish: e.target.value as PlateStyle['finish'] })}
                        className="w-full bg-white/5 px-3 py-3 text-[10px] font-black uppercase tracking-widest border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/50 text-white transition-all"
                      >
                        {finishOptions.map((f) => (
                          <option key={f} value={f} className="bg-zinc-900 text-white">
                            {f}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
