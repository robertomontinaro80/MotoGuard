/**
 * useAuth — hook principale per autenticazione Google e Facebook.
 *
 * Uso:
 *   const { user, signInWithGoogle, signInWithFacebook, signOut, loading } = useAuth();
 */

import { useState, useEffect, useCallback } from 'react';
import * as Google   from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import { AuthService, AuthUser, TokenStorage } from '@services/AuthService';
import Constants from 'expo-constants';

// Legge i client ID dall'app.json → extra
const GOOGLE_CLIENT_ID_EXPO  = Constants.expoConfig?.extra?.googleClientIdExpo  ?? '';
const GOOGLE_CLIENT_ID_IOS   = Constants.expoConfig?.extra?.googleClientIdIos   ?? '';
const GOOGLE_CLIENT_ID_ANDROID = Constants.expoConfig?.extra?.googleClientIdAndroid ?? '';
const FACEBOOK_APP_ID        = Constants.expoConfig?.extra?.facebookAppId        ?? '';

export interface UseAuthReturn {
  user:               AuthUser | null;
  loading:            boolean;
  authLoading:        boolean;
  error:              string | null;
  signInWithGoogle:   () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signOut:            () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user,       setUser]       = useState<AuthUser | null>(null);
  const [loading,    setLoading]    = useState(true);   // caricamento iniziale
  const [authLoading,setAuthLoading]= useState(false);  // in corso di login
  const [error,      setError]      = useState<string | null>(null);

  // ─── Google request ──────────────────────────────────────────────────────
  const [, googleResponse, promptGoogle] = Google.useAuthRequest({
    expoClientId:   GOOGLE_CLIENT_ID_EXPO,
    iosClientId:    GOOGLE_CLIENT_ID_IOS,
    androidClientId:GOOGLE_CLIENT_ID_ANDROID,
  });

  // ─── Facebook request ────────────────────────────────────────────────────
  const [, facebookResponse, promptFacebook] = Facebook.useAuthRequest({
    clientId: FACEBOOK_APP_ID,
  });

  // ─── Carica utente salvato all'avvio ─────────────────────────────────────
  useEffect(() => {
    (async () => {
      const saved = await AuthService.getCurrentUser();
      setUser(saved);
      setLoading(false);
    })();
  }, []);

  // ─── Gestisce risposta Google ─────────────────────────────────────────────
  useEffect(() => {
    if (!googleResponse) return;
    (async () => {
      setAuthLoading(true);
      setError(null);
      const result = await AuthService.handleGoogleResponse(googleResponse as any);
      if (result.success && result.user) setUser(result.user);
      else setError(result.error ?? 'Errore Google');
      setAuthLoading(false);
    })();
  }, [googleResponse]);

  // ─── Gestisce risposta Facebook ───────────────────────────────────────────
  useEffect(() => {
    if (!facebookResponse) return;
    (async () => {
      setAuthLoading(true);
      setError(null);
      const result = await AuthService.handleFacebookResponse(facebookResponse as any);
      if (result.success && result.user) setUser(result.user);
      else setError(result.error ?? 'Errore Facebook');
      setAuthLoading(false);
    })();
  }, [facebookResponse]);

  // ─── Actions ──────────────────────────────────────────────────────────────
  const signInWithGoogle = useCallback(async () => {
    setError(null);
    await promptGoogle();
  }, [promptGoogle]);

  const signInWithFacebook = useCallback(async () => {
    setError(null);
    await promptFacebook();
  }, [promptFacebook]);

  const signOut = useCallback(async () => {
    await AuthService.signOut();
    setUser(null);
  }, []);

  return { user, loading, authLoading, error, signInWithGoogle, signInWithFacebook, signOut };
}
