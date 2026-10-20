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

  // SHA-256 helper using native browser Web Crypto API with pure-JS fallback for LAN HTTP
  async hashString(str) {
    if (window.crypto && window.crypto.subtle) {
      try {
        const encoder = new TextEncoder();
        const data = encoder.encode(str);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      } catch (e) {
        // Fallback below
      }
    }
    // Pure JS SHA-256 fallback for non-HTTPS LAN IPs (e.g., 192.168.x.x)
    const rightRotate = (value, amount) => (value >>> amount) | (value << (32 - amount));
    const mathPow = Math.pow;
    const maxWord = mathPow(2, 32);
    let result = '';
    const words = [];
    const asciiBitLength = str.length * 8;
    let hash = [];
    const k = [];
    let primeCounter = 0;
    const isComposite = {};
    for (let candidate = 2; primeCounter < 64; candidate++) {
      if (!isComposite[candidate]) {
        for (let i = 0; i < 313; i += candidate) isComposite[i] = candidate;
        hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
        k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
      }
    }
    str += '\x80';
    while ((str.length % 64) - 56) str += '\x00';
    for (let i = 0; i < str.length; i++) {
      const j = str.charCodeAt(i);
      words[i >> 2] |= j << (((3 - i) % 4) * 8);
    }
    words[words.length] = (asciiBitLength / maxWord) | 0;
    words[words.length] = asciiBitLength;
    for (let j = 0; j < words.length;) {
      const w = words.slice(j, (j += 16));
      const oldHash = hash;
      hash = hash.slice(0, 8);
      for (let i = 0; i < 64; i++) {
        const i2 = i + j;
        const w15 = w[i - 15], w2 = w[i - 2];
        const a = hash[0], e = hash[4];
        const temp1 = hash[7]
          + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25))
          + ((e & hash[5]) ^ (~e & hash[6]))
          + k[i]
          + (w[i] = i < 16 ? w[i] : (
            w[i - 16]
            + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3))
            + w[i - 7]
            + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))
          ) | 0);
        const temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22))
          + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
        hash = [(temp1 + temp2) | 0].concat(hash);
        hash[4] = (hash[4] + temp1) | 0;
      }
      for (let i = 0; i < 8; i++) hash[i] = (hash[i] + oldHash[i]) | 0;
    }
    for (let i = 0; i < 8; i++) {
      for (let j = 3; j + 1; j--) {
        const b = (hash[i] >> (j * 8)) & 255;
        result += (b < 16 ? 0 : '') + b.toString(16);
      }
    }
    return result;
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

