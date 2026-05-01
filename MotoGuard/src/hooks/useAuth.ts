/**
 * useAuth — hook principale per autenticazione Google e Facebook.
 *
 * Uso:
 *   const { user, signInWithGoogle, signInWithFacebook, signOut, loading } = useAuth();
 */

import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import * as Google   from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import { AuthService, AuthUser, TokenStorage } from '@services/AuthService';
import Constants from 'expo-constants';

// Legge i client ID dall'app.json → extra
const GOOGLE_CLIENT_ID_EXPO  = Constants.expoConfig?.extra?.googleClientIdExpo  ?? '';
const GOOGLE_CLIENT_ID_IOS   = Constants.expoConfig?.extra?.googleClientIdIos   ?? '';
const GOOGLE_CLIENT_ID_ANDROID = Constants.expoConfig?.extra?.googleClientIdAndroid ?? '';
const GOOGLE_CLIENT_ID_WEB   = Constants.expoConfig?.extra?.googleClientIdWeb   ?? '';
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
  // Su web, se webClientId non è configurato, usiamo un valore dummy per evitare l'errore
  // Il vero controllo avviene in signInWithGoogle
  const googleWebClientId = Platform.OS === 'web' 
    ? (GOOGLE_CLIENT_ID_WEB || 'web-unconfigured') 
    : undefined;
  
  const [, googleResponse, promptGoogle] = Google.useAuthRequest({
    expoClientId:   GOOGLE_CLIENT_ID_EXPO,
    iosClientId:    GOOGLE_CLIENT_ID_IOS,
    androidClientId:GOOGLE_CLIENT_ID_ANDROID,
    webClientId:    googleWebClientId,
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
    // Su web, Google auth non è configurato
    if (Platform.OS === 'web' && !GOOGLE_CLIENT_ID_WEB) {
      setError('Google authentication is not available on web. Please use the mobile app.');
      return;
    }
    setError(null);
    await promptGoogle();
  }, [promptGoogle]);

  const signInWithFacebook = useCallback(async () => {
    // Su web, Facebook auth potrebbe anche non essere disponibile
    if (Platform.OS === 'web' && !FACEBOOK_APP_ID) {
      setError('Facebook authentication is not available on web. Please use the mobile app.');
      return;
    }
    setError(null);
    await promptFacebook();
  }, [promptFacebook]);

  const signOut = useCallback(async () => {
    await AuthService.signOut();
    setUser(null);
  }, []);

  return { user, loading, authLoading, error, signInWithGoogle, signInWithFacebook, signOut };
}
