import { useState, useEffect, createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { guestAuth } from './guestAuth';
import type { GuestCredentials } from './guestAuth';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  credentials: GuestCredentials | null;
  error: string | null;
  login: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
  autoLogin?: boolean;
}

export function AuthProvider({
  children,
  autoLogin = true,
}: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [credentials, setCredentials] = useState<GuestCredentials | null>(null);
  const [error, setError] = useState<string | null>(null);

  const login = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const creds = await guestAuth.initialize();
      setCredentials(creds);
      setIsAuthenticated(true);

      console.log('Guest login successful');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      console.error('Guest login failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    guestAuth.clearCredentials();
    setCredentials(null);
    setIsAuthenticated(false);
    setError(null);
  };

  useEffect(() => {
    if (autoLogin) {
      login();
    } else {
      setIsLoading(false);
    }
  }, [autoLogin]);

  const value: AuthContextType = {
    isAuthenticated,
    isLoading,
    credentials,
    error,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAwsConfig() {
  const { isAuthenticated } = useAuth();

  return {
    getConfig: async () => {
      if (!isAuthenticated) {
        throw new Error('Not authenticated');
      }
      return await guestAuth.getAwsConfig();
    },
    getAppSyncConfig: async () => {
      if (!isAuthenticated) {
        throw new Error('Not authenticated');
      }
      return await guestAuth.getAppSyncConfig();
    },
  };
}
