import { AuthService, TokenStorage } from '../AuthService';

jest.mock('expo-secure-store', () => ({
  setItemAsync:    jest.fn().mockResolvedValue(undefined),
  getItemAsync:    jest.fn().mockResolvedValue(null),
  deleteItemAsync: jest.fn().mockResolvedValue(undefined),
}));
jest.mock('expo-auth-session/providers/google',   () => ({ useAuthRequest: jest.fn(() => [null, null, jest.fn()]) }));
jest.mock('expo-auth-session/providers/facebook', () => ({ useAuthRequest: jest.fn(() => [null, null, jest.fn()]) }));
jest.mock('expo-auth-session', () => ({ makeRedirectUri: jest.fn(() => 'motoguard://redirect') }));
jest.mock('expo-web-browser', () => ({ maybeCompleteAuthSession: jest.fn() }));

import * as SecureStore from 'expo-secure-store';

// ─── TokenStorage ──────────────────────────────────────────────────────────

describe('TokenStorage', () => {
  const mockUser = { id: '1', name: 'Mario', email: 'mario@test.it', provider: 'google' as const };

  it('saves user to SecureStore', async () => {
    await TokenStorage.saveUser(mockUser, 'token-abc');
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
      'motoguard_auth_user', JSON.stringify(mockUser),
    );
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('motoguard_auth_token', 'token-abc');
  });

  it('returns null if no user stored', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(null);
    const user = await TokenStorage.getUser();
    expect(user).toBeNull();
  });

  it('returns parsed user if stored', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(JSON.stringify(mockUser));
    const user = await TokenStorage.getUser();
    expect(user?.email).toBe('mario@test.it');
  });

  it('clears all keys on clear()', async () => {
    await TokenStorage.clear();
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledTimes(3);
  });
});

// ─── handleGoogleResponse ─────────────────────────────────────────────────

describe('AuthService.handleGoogleResponse', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        id: 'g123', name: 'Mario Rossi', email: 'mario@gmail.com', picture: 'http://pic.jpg',
      }),
    });
  });

  it('returns success with google user on valid response', async () => {
    const response = { type: 'success', authentication: { accessToken: 'gtoken' } };
    const result = await AuthService.handleGoogleResponse(response as any);
    expect(result.success).toBe(true);
    expect(result.user?.provider).toBe('google');
    expect(result.user?.email).toBe('mario@gmail.com');
  });

  it('returns error when type is cancel', async () => {
    const result = await AuthService.handleGoogleResponse({ type: 'cancel' } as any);
    expect(result.success).toBe(false);
    expect(result.error).toBe('Annullato');
  });

  it('returns error on missing accessToken', async () => {
    const result = await AuthService.handleGoogleResponse({ type: 'success', authentication: null } as any);
    expect(result.success).toBe(false);
  });

  it('returns error when fetch throws', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
    const response = { type: 'success', authentication: { accessToken: 'bad-token' } };
    const result = await AuthService.handleGoogleResponse(response as any);
    expect(result.success).toBe(false);
    expect(result.error).toContain('Network error');
  });
});

// ─── handleFacebookResponse ───────────────────────────────────────────────

describe('AuthService.handleFacebookResponse', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        id: 'fb456', name: 'Lucia Bianchi', email: 'lucia@fb.com',
        picture: { data: { url: 'http://fb-pic.jpg' } },
      }),
    });
  });

  it('returns success with facebook user', async () => {
    const response = { type: 'success', params: { access_token: 'fbtoken' } };
    const result = await AuthService.handleFacebookResponse(response as any);
    expect(result.success).toBe(true);
    expect(result.user?.provider).toBe('facebook');
    expect(result.user?.name).toBe('Lucia Bianchi');
    expect(result.user?.avatarUrl).toBe('http://fb-pic.jpg');
  });

  it('returns error when type is cancel', async () => {
    const result = await AuthService.handleFacebookResponse({ type: 'cancel' } as any);
    expect(result.success).toBe(false);
    expect(result.error).toBe('Annullato');
  });

  it('returns error on missing access_token', async () => {
    const result = await AuthService.handleFacebookResponse({ type: 'success', params: {} } as any);
    expect(result.success).toBe(false);
  });
});

// ─── signOut ──────────────────────────────────────────────────────────────

describe('AuthService.signOut', () => {
  it('clears token storage', async () => {
    const clearSpy = jest.spyOn(TokenStorage, 'clear').mockResolvedValueOnce();
    await AuthService.signOut();
    expect(clearSpy).toHaveBeenCalledTimes(1);
  });
});
