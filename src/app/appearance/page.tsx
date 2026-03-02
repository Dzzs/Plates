'use client';

import { AppearanceEditor } from '@/components/AppearanceEditor';
import { UnitToggle } from '@/components/UnitToggle';
import { useStore } from '@/store/useStore';

export default function AppearancePage() {
  const { unit } = useStore();

  return (
    <main className="flex-1 bg-background">
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Appearance</h1>
          <UnitToggle />
        </header>

        <AppearanceEditor unit={unit} />
      </div>
    </main>
  );
}
