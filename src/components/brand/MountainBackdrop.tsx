import React from 'react';

/**
 * Fondo decorativo sutil (BG_montañas.svg subido por Amy) para las pestañas
 * que no son Inicio: Prevención, Fuentes, Cuenta. Se coloca fijo detrás del
 * contenido con opacidad baja para no competir con las tarjetas ni el
 * texto. Puramente visual — el contenedor padre debe tener `relative` y su
 * contenido `relative z-10` para quedar por encima.
 */
export const MountainBackdrop: React.FC = () => (
  <div
    className="fixed inset-0 -z-10 bg-cover bg-center opacity-[0.07] pointer-events-none"
    style={{ backgroundImage: "url('/assets/bg-montanas.svg')" }}
    aria-hidden="true"
  />
);
