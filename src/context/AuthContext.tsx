import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signInWithGoogle: (redirectPath?: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthModalOpen: boolean;
  openAuthModal: (intendedPath?: string) => void;
  closeAuthModal: () => void;
  intendedPath: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Activo automáticamente cada vez que corres `vite dev` (import.meta.env.DEV),
// sin necesidad de crear ningún archivo .env.local. Nunca puede activarse en
// un build de producción (`vite build`), porque ahí import.meta.env.DEV
// siempre es false. Si alguien del equipo SÍ quiere probar el login real de
// Google en su máquina, puede desactivarlo poniendo VITE_SKIP_AUTH=false en
// su propio .env.local.
const DEV_AUTH_BYPASS = import.meta.env.DEV && import.meta.env.VITE_SKIP_AUTH !== 'false';

const DEV_FAKE_USER = {
  id: 'dev-bypass-user',
  email: 'dev@senda.local',
  user_metadata: { full_name: 'Cuenta de Prueba' },
} as unknown as User;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(DEV_AUTH_BYPASS ? DEV_FAKE_USER : null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(!DEV_AUTH_BYPASS);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [intendedPath, setIntendedPath] = useState<string | null>(null);

  useEffect(() => {
    if (DEV_AUTH_BYPASS) {
      // Modo de desarrollo: no llamamos a Supabase, ya "iniciamos sesión" arriba.
      console.warn(
        '[Senda] VITE_SKIP_AUTH=true: usando sesión de prueba local, sin login real de Google.'
      );
      return;
    }

    // 1. Obtener la sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    }).catch((err) => {
      console.warn('Error al verificar sesión inicial de Supabase:', err);
      setIsLoading(false);
    });

    // 2. Suscribirse a cambios en el estado de autenticación (login, logout, refresh de token)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);

      if (session?.user) {
        setIsAuthModalOpen(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async (redirectPath: string = '/evaluar') => {
    const redirectUrl = `${window.location.origin}${redirectPath}`;
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      console.error('Error al iniciar sesión con Google:', error.message);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  };

  const openAuthModal = (path: string = '/evaluar') => {
    setIntendedPath(path);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    isAuthenticated: !!user,
    signInWithGoogle,
    signOut,
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal,
    intendedPath,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};
