import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  ShieldAlert,
  Compass,
  BookOpen,
  User,
  LogIn,
  LogOut,
  AlertTriangle,
  Home,
  Sun,
  Moon,
  Type,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { DisplaySettingsModal } from '../common/DisplaySettingsModal';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [displayModalOpen, setDisplayModalOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, signOut, openAuthModal } = useAuth();
  const {
    theme,
    isDark,
    toggleTheme,
    setTheme,
    fontSize,
    setFontSize,
    fontSizeOptions,
    currentFontOption,
  } = useTheme();

  const navLinks = [
    { to: '/', label: 'Inicio', icon: Compass },
    { to: '/prevencion', label: 'Prevención', icon: ShieldAlert },
    { to: '/evaluar', label: 'Mi casa', icon: Home },
    { to: '/fuentes', label: 'Bases Científicas', icon: BookOpen },
    { to: '/mis-reportes', label: 'Mis Reportes', icon: User },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Ciudadano';
  const avatarUrl = user?.user_metadata?.avatar_url;

  return (
    <>
      <header className="w-full bg-canvas-surface border-b border-border-subtle sticky top-0 z-50 transition-colors duration-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          {/* Identidad Institucional Senda */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none">
            <img
              src="/mascots/logo_alertin.svg"
              alt="Logo de Senda"
              className="w-9 h-9 shrink-0"
            />
            <div>
              <span className="font-display text-xl font-black tracking-tight text-ink-primary block group-hover:text-sky-600 transition-colors">
                Senda
              </span>
              <span className="text-[10px] uppercase tracking-widest text-ink-muted font-bold whitespace-nowrap hidden lg:block">
                Infórmate · Prepárate · Actúa
              </span>
            </div>
          </Link>

          {/* Navegación de Escritorio */}
          <div className="hidden md:flex items-center gap-2.5">
            <nav className="flex items-center gap-1">
              {navLinks.map((link) => {
                const active = isActive(link.to);
                const Icon = link.icon;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`px-3 py-2 text-sm font-bold transition-all flex items-center gap-1.5 border-b-2 min-h-[40px] ${
                      active
                        ? 'text-sky-700 dark:text-sky-400 border-sky-600 bg-sky-50 dark:bg-sky-950/50'
                        : 'text-ink-primary border-transparent hover:text-sky-600 hover:border-border-subtle'
                    }`}
                    style={{ borderRadius: '8px 8px 0 0' }}
                  >
                    <Icon size={16} className={active ? 'text-sky-600 dark:text-sky-400' : 'text-ink-muted'} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Accesibilidad y Tema (Modo Oscuro + Tamaño de Letra) */}
            <div className="flex items-center gap-1 px-1 border-l border-border-subtle">
              <button
                type="button"
                onClick={toggleTheme}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-ink-muted hover:text-ink-primary hover:bg-canvas-glacial border border-border-subtle transition-all cursor-pointer"
                title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
                aria-label={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
              >
                {isDark ? (
                  <Sun size={17} className="text-amber-400 hover:rotate-45 transition-transform" />
                ) : (
                  <Moon size={17} className="text-sky-700 hover:-rotate-12 transition-transform" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setDisplayModalOpen(true)}
                className="h-9 px-2.5 rounded-xl text-xs font-bold text-ink-muted hover:text-ink-primary hover:bg-canvas-glacial border border-border-subtle transition-all flex items-center gap-1.5 cursor-pointer"
                title="Ajustar tamaño de letra y opciones de lectura"
                aria-label="Ajustar tamaño de letra y opciones de lectura"
              >
                <Type size={15} className="text-sky-600 dark:text-sky-400" />
                <span className="font-mono text-[11px] font-bold text-ink-primary">
                  {currentFontOption.percentage}
                </span>
              </button>
            </div>

            {/* Botón de Pánico Exclusivo para PC / Desktop */}
            <Link
              to="/panico"
              className="px-3.5 py-1.5 bg-emergency-600 hover:bg-emergency-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center gap-1.5 min-h-[38px] focus:outline-none cursor-pointer active:scale-95"
              title="Calcular ruta rápida de escape a zona segura en 0 clics"
            >
              <AlertTriangle size={15} className="text-white shrink-0" />
              <span>Pánico</span>
            </Link>

            {/* Bloque de Autenticación Escritorio */}
            <div className="pl-2 border-l border-border-subtle flex items-center gap-2">
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <Link
                    to="/mis-reportes"
                    className="flex items-center gap-2 p-1.5 hover:bg-canvas-glacial rounded-lg transition-colors"
                    title="Ver perfil y reportes"
                  >
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={displayName}
                        className="w-7 h-7 rounded-full border border-sky-600"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs font-bold">
                        {displayName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-xs font-bold text-ink-primary max-w-[100px] truncate hidden lg:inline">
                      {displayName}
                    </span>
                  </Link>

                  <button
                    type="button"
                    onClick={signOut}
                    className="p-1.5 text-ink-muted hover:text-emergency-600 transition-colors focus:outline-none"
                    title="Cerrar sesión"
                    aria-label="Cerrar sesión"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => openAuthModal()}
                  className="px-3.5 py-2 min-h-[38px] text-xs font-bold text-sky-700 dark:text-sky-300 bg-canvas-surface border border-sky-600 hover:bg-sky-600 hover:text-white rounded-xl transition-all shadow-2xs flex items-center gap-1.5"
                >
                  <LogIn size={14} />
                  <span>Ingresar</span>
                </button>
              )}
            </div>
          </div>

          {/* Controles para Móviles */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Quick theme toggle en móvil */}
            <button
              type="button"
              onClick={toggleTheme}
              className="w-10 h-10 flex items-center justify-center text-ink-primary focus:outline-none border border-border-subtle rounded-xl bg-canvas-surface"
              aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              title={isDark ? 'Modo claro' : 'Modo oscuro'}
            >
              {isDark ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
            </button>

            {/* Botón menú móvil (min 44x44px de toque) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-11 h-11 flex items-center justify-center text-ink-primary hover:text-sky-600 focus:outline-none border border-border-subtle rounded-xl bg-canvas-surface"
              aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú de navegación'}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Menú Desplegable Móvil */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border-subtle bg-canvas-surface px-4 py-3 space-y-2 animate-in slide-in-from-top-2 duration-150">
            {navLinks.map((link) => {
              const active = isActive(link.to);
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3.5 py-3 text-base font-bold rounded-xl transition-all ${
                    active
                      ? 'text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60'
                      : 'text-ink-primary hover:bg-canvas-glacial'
                  }`}
                >
                  <Icon size={18} className={active ? 'text-sky-600 dark:text-sky-400' : 'text-ink-muted'} />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {/* SECCIÓN MÓVIL: Accesibilidad y Lectura */}
            <div className="p-3 bg-canvas-glacial border border-border-subtle rounded-2xl space-y-2.5 my-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-ink-muted uppercase tracking-wider">
                  Lectura y Modo
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setDisplayModalOpen(true);
                  }}
                  className="text-xs text-sky-600 dark:text-sky-400 font-bold hover:underline"
                >
                  Más ajustes
                </button>
              </div>

              {/* Selector de modo oscuro */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`p-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                    theme === 'light'
                      ? 'bg-sky-600 text-white border-sky-600 shadow-2xs'
                      : 'bg-canvas-surface text-ink-primary border-border-subtle'
                  }`}
                >
                  <Sun size={15} />
                  <span>Claro</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`p-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                    theme === 'dark'
                      ? 'bg-sky-500 text-white border-sky-500 shadow-2xs'
                      : 'bg-canvas-surface text-ink-primary border-border-subtle'
                  }`}
                >
                  <Moon size={15} />
                  <span>Oscuro</span>
                </button>
              </div>

              {/* Selector de 4 escalas de letra */}
              <div className="space-y-1 pt-1">
                <span className="text-[11px] text-ink-muted block font-medium">
                  Tamaño de texto:
                </span>
                <div className="grid grid-cols-4 gap-1.5">
                  {fontSizeOptions.map((opt) => {
                    const active = fontSize === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setFontSize(opt.id)}
                        className={`py-1.5 px-1 rounded-xl text-xs font-bold border transition-all text-center ${
                          active
                            ? 'bg-sky-600 text-white border-sky-600 shadow-2xs'
                            : 'bg-canvas-surface text-ink-primary border-border-subtle hover:bg-canvas-glacial'
                        }`}
                        title={opt.label}
                      >
                        {opt.label.slice(0, 4)}.
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bloque de Sesión Móvil */}
            <div className="pt-2 border-t border-border-subtle">
              {isAuthenticated ? (
                <div className="flex items-center justify-between p-2">
                  <div className="flex items-center gap-2">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={displayName} className="w-8 h-8 rounded-full border border-sky-600" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs font-bold">
                        {displayName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-sm font-bold text-ink-primary truncate max-w-[150px]">{displayName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="px-3 py-1.5 text-xs text-emergency-600 border border-emergency-600 hover:bg-emergency-surface font-bold rounded-lg"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal();
                  }}
                  className="w-full min-h-[46px] px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-xs"
                >
                  <LogIn size={16} />
                  <span>Ingresar con Google</span>
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Modal interactivo de personalización de visualización */}
      <DisplaySettingsModal
        isOpen={displayModalOpen}
        onClose={() => setDisplayModalOpen(false)}
      />
    </>
  );
};
