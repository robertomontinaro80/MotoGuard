/**
 * AuthContext — fornisce lo stato auth a tutta l'app.
 * Avvolge <App> in modo che qualsiasi schermata possa accedere all'utente.
 */

import React, { createContext, useContext } from 'react';
import { useAuth, UseAuthReturn } from '@hooks/useAuth';

const AuthContext = createContext<UseAuthReturn | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

/** Hook per leggere lo stato auth da qualsiasi componente. */
export function useAuthContext(): UseAuthReturn {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used inside <AuthProvider>');
  return ctx;
}
