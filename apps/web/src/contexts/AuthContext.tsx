import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { User } from 'firebase/auth';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { AuthSession, createCustomerSession } from '../services/authService';
import { isCustomerApiConfigured } from '../services/customerApi';

export interface CustomerProfile {
  id: string;
  firebaseUid: string;
  phoneNumber: string;
  fullName: string;
  avatarUrl?: string;
  status: 'ACTIVE' | 'BLOCKED';
}

export interface AuthContextValue {
  user: User | null;
  session: AuthSession | null;
  profile: CustomerProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (user: User) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const SESSION_KEY = 'customer_session';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<AuthSession | null>(() => {
    try {
      const stored = sessionStorage.getItem(SESSION_KEY);
      return stored ? (JSON.parse(stored) as AuthSession) : null;
    } catch {
      return null;
    }
  });
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const restoreSessionRef = useRef(false);

  const restoreSession = useCallback(async (currentUser: User) => {
    if (restoreSessionRef.current) return;
    restoreSessionRef.current = true;

    try {
      const newSession = await createCustomerSession(currentUser);
      setSession(newSession);
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
    } catch {
      setSession(null);
      sessionStorage.removeItem(SESSION_KEY);
    } finally {
      restoreSessionRef.current = false;
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        if (isCustomerApiConfigured) {
          await restoreSession(currentUser);
        }
      } else {
        setUser(null);
        setSession(null);
        setProfile(null);
        sessionStorage.removeItem(SESSION_KEY);
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, [restoreSession]);

  const login = useCallback(async (currentUser: User) => {
    if (!isCustomerApiConfigured) {
      setUser(currentUser);
      return;
    }
    const newSession = await createCustomerSession(currentUser);
    setSession(newSession);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
    setUser(currentUser);
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    setSession(null);
    setProfile(null);
    sessionStorage.removeItem(SESSION_KEY);
    await signOut(auth);
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    session,
    profile,
    isLoading,
    isAuthenticated: user !== null && session !== null,
    login,
    logout,
  }), [user, session, profile, isLoading, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
