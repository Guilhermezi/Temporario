const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export type Usuario = {
  id: number;
  nome: string;
  email: string;
  role: "USER" | "ADMIN";
};

const TOKEN_KEY = "bytrust_token";
const USER_KEY = "bytrust_user";

function isBrowser() {
  return typeof window !== "undefined";
}

export function saveToken(token: string) {
  if (!isBrowser()) return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  if (!isBrowser()) return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function saveUser(user: Usuario) {
  if (!isBrowser()) return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getStoredUser(): Usuario | null {
  if (!isBrowser()) return null;

  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as Usuario;
  } catch {
    return null;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error ?? "Erro desconhecido");
  }

  return data as T;
}

export const api = {
  auth: {
    registrar: (body: { nome: string; email: string; senha: string }) =>
      request<Usuario>("/auth/registrar", {
        method: "POST",
        body: JSON.stringify(body),
      }),

    login: (body: { email: string; senha: string }) =>
      request<{ token: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify(body),
      }),

    me: () => request<Usuario>("/auth/me"),
  },

  usuarios: {
    listar: () => request<Usuario[]>("/usuarios"),
    buscar: (id: number) => request<Usuario>(`/usuarios/${id}`),
    deletar: (id: number) =>
      request<void>(`/usuarios/${id}`, {
        method: "DELETE",
      }),
  },
};