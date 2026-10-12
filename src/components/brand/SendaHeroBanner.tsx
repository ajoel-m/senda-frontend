import React from 'react';

interface SendaHeroBannerProps {
  /** id del ancla a la que se hace scroll suave al tocar "Comenzar" */
  scrollTargetId?: string;
}

/**
 * Solo el contenido de la portada (Alertin, logo, tagline, botón). El
 * fondo (paisaje + velo) vive en HomePage.tsx como hermano de `<main>`,
 * no aquí adentro — así puede cubrir todo el ancho de la página (no solo
 * el ancho angosto de `<main>`) y desplazarse CON la página en vez de
 * quedar fijo a la ventana (eso hacía que el velo y las tarjetas de abajo
 * quedaran desalineados al hacer scroll).
 */
export const SendaHeroBanner: React.FC<SendaHeroBannerProps> = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center px-4 pt-3 pb-1">
      <img
        src="/mascots/alertin_principal.svg"
        alt="Alertin, la mascota de Senda"
        className="w-14 h-14 sm:w-16 sm:h-16 drop-shadow-md mb-1"
      />
      <h1 className="font-display text-3xl sm:text-4xl font-black text-white tracking-tight drop-shadow-md">
        Senda
      </h1>
      <p className="mt-0.5 text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-senda-nevado dark:text-senda-cielo drop-shadow-xs dark:drop-shadow-[0_1.5px_4px_rgba(0,0,0,0.95)]">
        Infórmate · Prepárate · Actúa
      </p>
    </div>
  );
};
