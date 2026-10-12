import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Shield, Waves, BookOpen, User } from 'lucide-react';

interface BottomNavProps {
  onTriggerPanic?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onTriggerPanic }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleTriggerPanic = () => {
    if (onTriggerPanic) {
      onTriggerPanic();
    } else {
      navigate('/panico');
    }
  };

  const isHome = location.pathname === '/' || location.pathname === '/app';
  const isPrevention = location.pathname.startsWith('/prevencion') || location.pathname.startsWith('/evaluar');
  const isSources = location.pathname.startsWith('/fuentes');
  const isAccount = location.pathname.startsWith('/mis-reportes');

  return (
    <nav aria-label="Navegación inferior móvil" className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-canvas-surface border-t border-border-subtle px-2 py-1.5 flex items-center justify-between shadow-lg">
      {/* 1. Botón Inicio */}
      <Link
        to="/"
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
          isHome ? 'text-sky-700 font-bold' : 'text-ink-muted hover:text-sky-600'
        }`}
      >
        <Home size={20} className={isHome ? 'text-sky-600' : 'text-ink-muted'} />
        <span className="text-[10px] mt-0.5">Inicio</span>
      </Link>

      {/* 2. Botón Prevención */}
      <Link
        to="/prevencion"
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
          isPrevention ? 'text-sky-700 font-bold' : 'text-ink-muted hover:text-sky-600'
        }`}
      >
        <Shield size={20} className={isPrevention ? 'text-sky-600' : 'text-ink-muted'} />
        <span className="text-[10px] mt-0.5">Prevención</span>
      </Link>

      {/* 3. Botón Central Sobreelevado: EMERGENCIA (Pánico Aluvión - Clic Directo) */}
      <div className="flex flex-col items-center justify-center relative -top-3 px-1">
        <button
          type="button"
          onClick={handleTriggerPanic}
          className="relative w-15 h-15 rounded-full bg-emergency-600 hover:bg-emergency-700 text-white flex flex-col items-center justify-center shadow-lg active:scale-95 transition-all select-none border-2 border-white cursor-pointer"
          aria-label="Botón de emergencia aluvión: calcular ruta de evacuación inmediata"
        >
          <Waves size={22} className="mb-0.5 text-white" />
          <span className="text-[8px] font-black uppercase tracking-tight leading-none text-white">
            ALERTA
          </span>
        </button>
        <span className="text-[9px] text-emergency-600 font-bold mt-0.5">
          Aluvión
        </span>
      </div>

      {/* 4. Botón Fuentes Oficiales */}
      <Link
        to="/fuentes"
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
          isSources ? 'text-sky-700 font-bold' : 'text-ink-muted hover:text-sky-600'
        }`}
      >
        <BookOpen size={20} className={isSources ? 'text-sky-600' : 'text-ink-muted'} />
        <span className="text-[10px] mt-0.5">Fuentes</span>
      </Link>

      {/* 5. Botón Mi Cuenta */}
      <Link
        to="/mis-reportes"
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
          isAccount ? 'text-sky-700 font-bold' : 'text-ink-muted hover:text-sky-600'
        }`}
      >
        <User size={20} className={isAccount ? 'text-sky-600' : 'text-ink-muted'} />
        <span className="text-[10px] mt-0.5">Cuenta</span>
      </Link>
    </nav>
  );
};
