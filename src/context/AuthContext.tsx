import { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';

interface StoredUser extends User {
  password: string;
}

interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => string | null;
  signup: (name: string, email: string, password: string) => string | null;
  logout: () => void;
}

const USERS_KEY = 'msm_users';
const SESSION_KEY = 'msm_current_user';

function getStoredUsers(): StoredUser[] {
  return JSON.parse(localStorage.getItem(USERS_KEY) ?? '[]');
}

function saveStoredUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  });

  function login(email: string, password: string): string | null {
    const users = getStoredUsers();
    const match = users.find(u => u.email === email && u.password === password);
    if (!match) return 'Invalid email or password.';
    const { password: _, ...sessionUser } = match;
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    setUser(sessionUser);
    return null;
  }

  function signup(name: string, email: string, password: string): string | null {
    const users = getStoredUsers();
    if (users.some(u => u.email === email)) return 'An account with this email already exists.';
    const newUser: StoredUser = { id: crypto.randomUUID(), name, email, password };
    saveStoredUsers([...users, newUser]);
    const { password: _, ...sessionUser } = newUser;
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    setUser(sessionUser);
    return null;
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
