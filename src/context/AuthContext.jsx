import PropTypes from 'prop-types';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const TOKEN_STORAGE_KEY = 'authToken';

const AuthContext = createContext({
  token: null,
  setToken: () => undefined,
  signOut: () => undefined,
});

const readStoredToken = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  const storages = [window.localStorage, window.sessionStorage];

  for (const storage of storages) {
    const stored = storage.getItem(TOKEN_STORAGE_KEY);
    if (stored) {
      return stored;
    }
  }

  return null;
};

const persistToken = (token, remember) => {
  if (typeof window === 'undefined') {
    return;
  }

  const primaryStorage = remember ? window.localStorage : window.sessionStorage;
  const secondaryStorage = remember ? window.sessionStorage : window.localStorage;

  if (token) {
    primaryStorage.setItem(TOKEN_STORAGE_KEY, token);
    secondaryStorage.removeItem(TOKEN_STORAGE_KEY);
    return;
  }

  primaryStorage.removeItem(TOKEN_STORAGE_KEY);
  secondaryStorage.removeItem(TOKEN_STORAGE_KEY);
};

export const AuthProvider = ({ children }) => {
  const [token, setTokenState] = useState(() => readStoredToken());

  const setToken = useCallback((newToken, options = {}) => {
    const remember = options.remember ?? true;
    setTokenState(newToken);
    persistToken(newToken, remember);
  }, []);

  const signOut = useCallback(() => {
    setTokenState(null);
    persistToken(null, true);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const handleStorage = (event) => {
      if (event.key !== TOKEN_STORAGE_KEY) {
        return;
      }
      setTokenState(event.newValue);
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const value = useMemo(
    () => ({
      token,
      setToken,
      signOut,
    }),
    [token, setToken, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
