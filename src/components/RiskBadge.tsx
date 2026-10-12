import React from 'react';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

interface RiskBadgeProps {
  level: RiskLevel;
  label?: string;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, label }) => {
  // Paleta oficial de Semáforo No Alarmante (Andean Design System):
  // - Bajo: #3D6D4C (Verde Oliva)
  // - Medio: #C89D3C (Mostaza Cálido)
  // - Alto: #B34E36 (Terracota)
  // - Crítico: #7F1D1D (Guinda)
  const levelConfig: Record<RiskLevel, { text: string; bg: string; color: string; border: string }> = {
    low: {
      text: 'Riesgo Bajo',
      bg: '#f2f7f4',
      color: '#3D6D4C',
      border: '#3D6D4C',
    },
    medium: {
      text: 'Riesgo Medio',
      bg: '#fdfaf2',
      color: '#C89D3C',
      border: '#C89D3C',
    },
    high: {
      text: 'Riesgo Alto',
      bg: '#fdf5f3',
      color: '#B34E36',
      border: '#B34E36',
    },
    critical: {
      text: 'Zona Crítica / No Mitigable',
      bg: '#fff1f2',
      color: '#7F1D1D',
      border: '#7F1D1D',
    },
  };

  const current = levelConfig[level];

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '6px 16px',
        borderRadius: '9999px', // Estilo Senda: trazos suaves y redondeados
        fontSize: '16px',     // Base 16px accesible
        fontWeight: 700,
        backgroundColor: current.bg,
        color: current.color,
        border: `1px solid ${current.border}`,
        minHeight: '38px',
      }}
    >
      {label || current.text}
    </span>
  );
};
