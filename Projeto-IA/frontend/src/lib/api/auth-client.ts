/**
 * Helpers para gerenciar o token JWT no cliente.
 * Usa localStorage (acessível em todo o app via window).
 */

const TOKEN_KEY = "bytrust_token";

export const authClient = {
  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(TOKEN_KEY, token);
    // Também seta cookie para compatibilidade
    const maxAge = 7 * 24 * 60 * 60;
    document.cookie = `bytrust_token=${token}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
  },

  clearToken(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(TOKEN_KEY);
    document.cookie = "bytrust_token=; Path=/; Max-Age=0; SameSite=Lax";
  },

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  },
};