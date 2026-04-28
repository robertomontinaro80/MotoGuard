/**
 * AuthService — autenticazione social con Google e Facebook.
 *
 * Usa expo-auth-session per il flow OAuth su entrambe le piattaforme.
 * I token vengono salvati in SecureStore (non AsyncStorage).
 *
 * Setup richiesto:
 *  - Google: crea progetto su console.cloud.google.com, ottieni clientId
 *  - Facebook: crea app su developers.facebook.com, ottieni appId
 *  - Aggiungi i valori in app.json sotto extra.googleClientId / extra.facebookAppId
 */

import * as Google   from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import * as WebBrowser from 'expo-web-browser';
import * as SecureStore from 'expo-secure-store';
import { makeRedirectUri } from 'expo-auth-session';

// Necessario per chiudere il browser dopo il login su Android
WebBrowser.maybeCompleteAuthSession();

// ─── Tipi ──────────────────────────────────────────────────────────────────

export type AuthProvider = 'google' | 'facebook';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  provider: AuthProvider;
}

export interface AuthResult {
  success: boolean;
  user?: AuthUser;
  error?: string;
}

// ─── SecureStore keys ──────────────────────────────────────────────────────

const KEYS = {
  user:         'motoguard_auth_user',
  accessToken:  'motoguard_auth_token',
  provider:     'motoguard_auth_provider',
} as const;

// ─── Token storage ─────────────────────────────────────────────────────────

export const TokenStorage = {
  async saveUser(user: AuthUser, token: string): Promise<void> {
    await SecureStore.setItemAsync(KEYS.user,        JSON.stringify(user));
    await SecureStore.setItemAsync(KEYS.accessToken, token);
    await SecureStore.setItemAsync(KEYS.provider,    user.provider);
  },

  async getUser(): Promise<AuthUser | null> {
    try {
      const raw = await SecureStore.getItemAsync(KEYS.user);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  async getToken(): Promise<string | null> {
    return SecureStore.getItemAsync(KEYS.accessToken);
  },

  async clear(): Promise<void> {
    await SecureStore.deleteItemAsync(KEYS.user);
    await SecureStore.deleteItemAsync(KEYS.accessToken);
    await SecureStore.deleteItemAsync(KEYS.provider);
  },
};

// ─── Google userinfo ───────────────────────────────────────────────────────

async function fetchGoogleUser(accessToken: string): Promise<AuthUser> {
  const res = await fetch('https://www.googleapis.com/userinfo/v2/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error('Google userinfo failed');
  const data = await res.json();
  return {
    id:        data.id,
    name:      data.name,
    email:     data.email,
    avatarUrl: data.picture,
    provider:  'google',
  };
}

// ─── Facebook userinfo ─────────────────────────────────────────────────────

async function fetchFacebookUser(accessToken: string): Promise<AuthUser> {
  const res = await fetch(
    `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`,
  );
  if (!res.ok) throw new Error('Facebook userinfo failed');
  const data = await res.json();
  return {
    id:        data.id,
    name:      data.name,
    email:     data.email ?? '',
    avatarUrl: data.picture?.data?.url,
    provider:  'facebook',
  };
}

// ─── AuthService (stateless helper, hook-free) ─────────────────────────────

export const AuthService = {
  async getCurrentUser(): Promise<AuthUser | null> {
    return TokenStorage.getUser();
  },

  async signOut(): Promise<void> {
    await TokenStorage.clear();
  },

  async handleGoogleResponse(
    response: { type: string; authentication?: { accessToken: string } | null },
  ): Promise<AuthResult> {
    if (response.type !== 'success' || !response.authentication?.accessToken) {
      return { success: false, error: response.type === 'cancel' ? 'Annullato' : 'Autenticazione fallita' };
    }
    try {
      const user = await fetchGoogleUser(response.authentication.accessToken);
      await TokenStorage.saveUser(user, response.authentication.accessToken);
      return { success: true, user };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  async handleFacebookResponse(
    response: { type: string; params?: { access_token?: string } },
  ): Promise<AuthResult> {
    if (response.type !== 'success' || !response.params?.access_token) {
      return { success: false, error: response.type === 'cancel' ? 'Annullato' : 'Autenticazione fallita' };
    }
    try {
      const user = await fetchFacebookUser(response.params.access_token);
      await TokenStorage.saveUser(user, response.params.access_token);
      return { success: true, user };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },
};
