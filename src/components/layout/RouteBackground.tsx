import React from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

/**
 * RouteBackground
 * 
 * Gestiona el fondo global según la categoría de la ruta y el tema (Claro / Oscuro):
 * 1. Enfoque 1 ('/', '/app', '/prevencion', '/mis-reportes'):
 *    Gradiente atmosférico dinámico con orbes de luz suave.
 * 2. Otras páginas ('/informacion', '/fuentes', '/evaluar', etc.):
 *    Fondo uniforme sobre el cual contrastan las tarjetas elevadas.
 */
export const RouteBackground: React.FC = () => {
  const { pathname } = useLocation();
  const { isDark } = useTheme();

  const isEnfoque1 =
    pathname === '/' ||
    pathname === '/app' ||
    pathname.startsWith('/panico') ||
    pathname.startsWith('/prevencion') ||
    pathname.startsWith('/mis-reportes');

  if (isEnfoque1) {
    return (
      <div
        className="pointer-events-none absolute inset-0 min-h-full w-full overflow-hidden -z-10"
        aria-hidden="true"
      >
        {/* Gradiente vertical continuo adaptable al tema */}
        <div
          className="absolute inset-0 w-full min-h-full transition-colors duration-300"
          style={{
            background: isDark
              ? 'linear-gradient(180deg, #070D18 0%, #0B1424 30%, #0F1C33 65%, #142542 100%)'
              : 'linear-gradient(180deg, #F7FAFD 0%, #EDF6FC 30%, #DFEFF9 65%, #C9E4F5 100%)',
          }}
        />

        {/* Orbe superior */}
        <div
          className={`absolute top-8 left-[10%] w-[380px] h-[380px] rounded-full blur-[60px] transition-all duration-300 ${
            isDark ? 'bg-sky-500/15' : 'bg-sky-200/25'
          }`}
        />

        {/* Orbe intermedio */}
        <div
          className={`absolute top-[42%] right-[5%] w-[480px] h-[480px] rounded-full blur-[90px] transition-all duration-300 ${
            isDark ? 'bg-sky-600/15' : 'bg-sky-300/30'
          }`}
        />

        {/* Orbe inferior */}
        <div
          className={`absolute bottom-12 left-[20%] w-[580px] h-[580px] rounded-full blur-[130px] transition-all duration-300 ${
            isDark ? 'bg-sky-400/15' : 'bg-[#7EC8F7]/35'
          }`}
        />
      </div>
    );
  }

  // Fondo uniforme adaptable para otras páginas con secciones
  return (
    <div
      className={`pointer-events-none fixed inset-0 -z-10 transition-colors duration-300 ${
        isDark ? 'bg-[#0B1322]' : 'bg-[#EDF6FC]'
      }`}
      aria-hidden="true"
    />
  );
};
