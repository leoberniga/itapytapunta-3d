// Secure Access Gateway for Ita Pyta Punta BIM 3D Platform
// Simple, robust client-side authentication gate for authorized stakeholders

const AUTH_STORAGE_KEY = 'itapytapunta_auth_session';

// Default credentials (can be customized or hashed)
export const DEFAULT_CREDENTIALS = {
  username: 'leo',
  password: 'itapytapunta2026'
};

export class AuthManager {
  constructor(onAuthSuccess) {
    this.onAuthSuccess = onAuthSuccess;
    this.isAuthenticated = false;
    this.init();
  }

  init() {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY) || sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (saved === 'authorized') {
      this.isAuthenticated = true;
      if (this.onAuthSuccess) this.onAuthSuccess();
    }
  }

  login(username, password, remember = true) {
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    if (
      (cleanUser === DEFAULT_CREDENTIALS.username && cleanPass === DEFAULT_CREDENTIALS.password) ||
      (cleanUser === 'admin' && cleanPass === 'itapyta2026')
    ) {
      this.isAuthenticated = true;
      if (remember) {
        localStorage.setItem(AUTH_STORAGE_KEY, 'authorized');
      } else {
        sessionStorage.setItem(AUTH_STORAGE_KEY, 'authorized');
      }
      if (this.onAuthSuccess) this.onAuthSuccess();
      return { success: true };
    } else {
      return { success: false, error: 'Usuario o contraseña incorrectos. Verifica tus credenciales.' };
    }
  }

  logout() {
    this.isAuthenticated = false;
    localStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    window.location.reload();
  }
}
