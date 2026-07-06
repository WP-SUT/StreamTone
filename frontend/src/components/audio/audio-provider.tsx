// src/app/layout.tsx or a component that wraps your app
'use client';

import { usePlayerStore } from '@/store/player-store';
import { useEffect } from 'react';

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const initAudio = usePlayerStore(state => state.initAudio);
  
  useEffect(() => {
    initAudio();
  }, [initAudio]);
  
  return <>{children}</>;
}
