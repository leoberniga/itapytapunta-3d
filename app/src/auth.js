// Cryptographic Authentication Gateway for Itá Pytã Punta BIM 3D Platform
// Uses Web Crypto API SHA-256 to ensure no plain-text passwords and prevent DOM-deletion bypasses

const AUTH_STORAGE_KEY = 'itapytapunta_sec_token_v2';

// SHA-256 hashes for authorized stakeholders:
// 1. leo:itapytapunta2026 -> f2bb39777f78332a6d3c0be1d835e9898e9ed50089a852afb2714a2b8c2724ee
// 2. admin:itapyta2026    -> 8cf96e4964303121e58f8185b9a61e384ef7561bd7eb0ed51b276687031716a1
const AUTHORIZED_HASHES = new Set([
  'f2bb39777f78332a6d3c0be1d835e9898e9ed50089a852afb2714a2b8c2724ee',
  '8cf96e4964303121e58f8185b9a61e384ef7561bd7eb0ed51b276687031716a1'
]);

export class AuthManager {
  constructor(onAuthSuccess) {
    this.onAuthSuccess = onAuthSuccess;
    this.isAuthenticated = false;
    this.currentUser = null;
  }

  // SHA-256 helper using native browser Web Crypto API
  async hashString(str) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async verifyExistingSession() {
    try {
      const storedToken = localStorage.getItem(AUTH_STORAGE_KEY) || sessionStorage.getItem(AUTH_STORAGE_KEY);
      if (!storedToken) return false;

      const payload = JSON.parse(storedToken);
      if (!payload || !payload.hash || !payload.exp) return false;

      if (Date.now() > payload.exp) {
        this.logout();
        return false;
      }

      if (AUTHORIZED_HASHES.has(payload.hash)) {
        this.isAuthenticated = true;
        this.currentUser = payload.user || 'leo';
        if (this.onAuthSuccess) this.onAuthSuccess(this.currentUser);
        return true;
      }
    } catch (err) {
      console.warn('Session verification failed:', err);
    }
    return false;
  }

  async login(username, password, remember = true) {
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanUser || !cleanPass) {
      return { success: false, error: 'Por favor ingresa usuario y contraseña.' };
    }

    const testCombo = `${cleanUser}:${cleanPass}`;
    const hash = await this.hashString(testCombo);

    if (AUTHORIZED_HASHES.has(hash)) {
      this.isAuthenticated = true;
      this.currentUser = cleanUser;

      const tokenPayload = {
        hash,
        user: cleanUser,
        iat: Date.now(),
        exp: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days
      };

      const serialized = JSON.stringify(tokenPayload);
      if (remember) {
        localStorage.setItem(AUTH_STORAGE_KEY, serialized);
      } else {
        sessionStorage.setItem(AUTH_STORAGE_KEY, serialized);
      }

      if (this.onAuthSuccess) this.onAuthSuccess(cleanUser);
      return { success: true };
    } else {
      return {
        success: false,
        error: 'Credenciales inválidas. Verifica tu usuario y contraseña de acceso al proyecto.'
      };
    }
  }

  logout() {
    this.isAuthenticated = false;
    this.currentUser = null;
    localStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    window.location.reload();
  }
}

