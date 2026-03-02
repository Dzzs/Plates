'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TargetCalculator } from '@/components/TargetCalculator';
import { BuildCalculator } from '@/components/BuildCalculator';
import { InventoryEditor } from '@/components/InventoryEditor';
import { UnitToggle } from '@/components/UnitToggle';
import { useStore } from '@/store/useStore';
import { motion } from 'framer-motion';

export default function Home() {
  const { unit, calculator, setCalculator } = useStore();

  return (
    <main className="flex-1 min-h-screen bg-background selection:bg-primary/30">
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-orange-500 rounded-full blur-[120px]" />
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 sm:py-8 relative z-10">
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass rounded-2xl border border-white/10 p-4 sm:p-5 mb-5 sm:mb-6 flex items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tighter text-white leading-none mb-1">
              PLATE<span className="text-primary">CALC</span>
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/35">Fast Loading Engine</p>
          </div>
          <div className="glass p-1 rounded-xl shadow-xl shrink-0">
            <UnitToggle />
          </div>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.6fr)_minmax(320px,1fr)] gap-4 sm:gap-6">
          <section className="glass-card rounded-3xl p-4 sm:p-6 border-white/10">
            <Tabs
              value={calculator.mode}
              onValueChange={(value) => setCalculator({ mode: value as 'target' | 'build' })}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 h-12 bg-white/5 border border-white/10 rounded-xl p-1 mb-4">
                <TabsTrigger
                  value="target"
                  className="text-[11px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all"
                >
                  Target Weight
                </TabsTrigger>
                <TabsTrigger
                  value="build"
                  className="text-[11px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all"
                >
                  Build Load
                </TabsTrigger>
              </TabsList>

              <TabsContent value="target" className="mt-0 focus-visible:outline-none">
                <TargetCalculator unit={unit} />
              </TabsContent>

              <TabsContent value="build" className="mt-0 focus-visible:outline-none">
                <BuildCalculator unit={unit} />
              </TabsContent>
            </Tabs>
          </section>

          <section className="hidden lg:block lg:sticky lg:top-6">
            <div className="glass-card rounded-3xl p-4 border-white/10 max-h-[calc(100vh-3rem)] overflow-y-auto">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Inventory</h2>
                <div className="h-px flex-1 bg-white/10" />
              </div>
              <InventoryEditor unit={unit} compact />
            </div>
          </section>
        </div>

        <section className="lg:hidden mt-4">
          <details className="glass-card rounded-2xl border-white/10 p-4">
            <summary className="list-none cursor-pointer flex items-center gap-3">
              <h2 className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em]">
                Inventory & Setup
              </h2>
              <div className="h-px flex-1 bg-white/10" />
            </summary>
            <div className="mt-4 pt-4 border-t border-white/10">
              <InventoryEditor unit={unit} compact />
            </div>
          </details>
        </section>

        <footer className="mt-6 text-center">
          <p className="text-[10px] font-black text-white/15 uppercase tracking-widest">
            Engineered for Strength • {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </main>
  );
}
