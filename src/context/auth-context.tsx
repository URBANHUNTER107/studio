'use client';

import { createContext, useContext, type ReactNode } from 'react';

// A simple context provider without loading state.
// This is sufficient for just using firestore.
const AuthContext = createContext<null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  return <AuthContext.Provider value={null}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}