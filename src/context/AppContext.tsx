'use client';

import React, { createContext, useContext } from 'react';
import { useAppStore } from '@/lib/data/store';

type AppStoreType = ReturnType<typeof useAppStore>;

const AppContext = createContext<AppStoreType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const store = useAppStore();

  return (
    <AppContext.Provider value={store}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
