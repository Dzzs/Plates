'use client';

import { useStore } from '@/store/useStore';
import { Unit } from '@/types';

export function UnitToggle() {
  const { unit, setUnit } = useStore();
  
  const units: Unit[] = ['lb', 'kg'];
  
  return (
    <div className="inline-flex bg-muted rounded-lg p-1 shadow-sm">
      {units.map((u) => (
        <button
          key={u}
          onClick={() => setUnit(u)}
          className={`px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
            unit === u
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {u.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
