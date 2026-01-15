import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabaseExternal } from '@/lib/supabase-external';
import type { Cuenta, UsuarioAdmin, MiembroCuenta } from '@/types/database';

interface CuentaContextType {
  cuenta: Cuenta | null;
  setCuenta: (cuenta: Cuenta | null) => void;
  usuario: UsuarioAdmin | null;
  setUsuario: (usuario: UsuarioAdmin | null) => void;
  miembro: MiembroCuenta | null;
  setMiembro: (miembro: MiembroCuenta | null) => void;
  isLoading: boolean;
  logout: () => void;
}

const CuentaContext = createContext<CuentaContextType | undefined>(undefined);

export const CuentaProvider = ({ children }: { children: ReactNode }) => {
  const [cuenta, setCuenta] = useState<Cuenta | null>(null);
  const [usuario, setUsuario] = useState<UsuarioAdmin | null>(null);
  const [miembro, setMiembro] = useState<MiembroCuenta | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Cargar datos de sesión desde localStorage
    const storedCuenta = localStorage.getItem('cuenta');
    const storedUsuario = localStorage.getItem('usuario');
    const storedMiembro = localStorage.getItem('miembro');
    
    if (storedCuenta) setCuenta(JSON.parse(storedCuenta));
    if (storedUsuario) setUsuario(JSON.parse(storedUsuario));
    if (storedMiembro) setMiembro(JSON.parse(storedMiembro));
    
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Persistir en localStorage cuando cambian
    if (cuenta) {
      localStorage.setItem('cuenta', JSON.stringify(cuenta));
    } else {
      localStorage.removeItem('cuenta');
    }
  }, [cuenta]);

  useEffect(() => {
    if (usuario) {
      localStorage.setItem('usuario', JSON.stringify(usuario));
    } else {
      localStorage.removeItem('usuario');
    }
  }, [usuario]);

  useEffect(() => {
    if (miembro) {
      localStorage.setItem('miembro', JSON.stringify(miembro));
    } else {
      localStorage.removeItem('miembro');
    }
  }, [miembro]);

  const logout = () => {
    setCuenta(null);
    setUsuario(null);
    setMiembro(null);
    localStorage.removeItem('cuenta');
    localStorage.removeItem('usuario');
    localStorage.removeItem('miembro');
  };

  return (
    <CuentaContext.Provider value={{ 
      cuenta, 
      setCuenta, 
      usuario, 
      setUsuario, 
      miembro,
      setMiembro,
      isLoading, 
      logout 
    }}>
      {children}
    </CuentaContext.Provider>
  );
};

export const useCuenta = () => {
  const context = useContext(CuentaContext);
  if (context === undefined) {
    throw new Error('useCuenta must be used within a CuentaProvider');
  }
  return context;
};
