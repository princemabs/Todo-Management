import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api';

const EditorAuthContext = createContext(null);

export function EditorAuthProvider({ children }) {
  const [isEditor, setIsEditor] = useState(false);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const { isEditor: ok } = await api.auth.me();
      setIsEditor(ok);
    } catch {
      setIsEditor(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(async (username, password) => {
    await api.auth.login({ username, password });
    setIsEditor(true);
  }, []);

  const logout = useCallback(async () => {
    await api.auth.logout();
    setIsEditor(false);
  }, []);

  const value = useMemo(
    () => ({ isEditor, loading, login, logout, refresh }),
    [isEditor, loading, login, logout, refresh]
  );

  return <EditorAuthContext.Provider value={value}>{children}</EditorAuthContext.Provider>;
}

export function useEditorAuth() {
  const ctx = useContext(EditorAuthContext);
  if (!ctx) throw new Error('useEditorAuth must be used within EditorAuthProvider');
  return ctx;
}
