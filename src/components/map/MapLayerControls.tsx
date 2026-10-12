import React from 'react';
import { Waves, Activity, Mountain } from 'lucide-react';
import { HazardType, SeverityLevel } from '../../services/gisLayers';

interface MapLayerControlsProps {
  activeThreats: Set<HazardType>;
  onToggleThreat: (threat: HazardType) => void;
  activeSeverities?: Set<SeverityLevel>;
  onToggleSeverity?: (severity: SeverityLevel) => void;
  isLoading?: boolean;
}

export const MapLayerControls: React.FC<MapLayerControlsProps> = ({
  activeThreats,
  onToggleThreat,
  isLoading = false,
}) => {
  const isAluvion = activeThreats.has('alluvium_inaigem') || activeThreats.has('alluvium_cenepred');
  const isSismo = activeThreats.has('seismic') || activeThreats.has('seismic_lima');
  const isDeslizamiento = activeThreats.has('landslide');

  const toggleAluvion = () => {
    onToggleThreat('alluvium_inaigem');
  };

  const toggleSismo = () => {
    const hasSeismic = activeThreats.has('seismic') || activeThreats.has('seismic_lima');
    if (hasSeismic) {
      if (activeThreats.has('seismic')) onToggleThreat('seismic');
      if (activeThreats.has('seismic_lima')) onToggleThreat('seismic_lima');
    } else {
      onToggleThreat('seismic');
      onToggleThreat('seismic_lima');
    }
  };

  const toggleDeslizamiento = () => {
    onToggleThreat('landslide');
  };

  return (
    <div className="bg-canvas-surface border border-border-subtle rounded-2xl p-3 shadow-xs">
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs font-bold text-ink-primary uppercase tracking-wider">
          Peligros en el mapa
        </span>
        {isLoading && (
          <span className="text-[11px] text-sky-700 animate-pulse font-medium">
            Cargando...
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {/* 1. Aluvión */}
        <button
          type="button"
          onClick={toggleAluvion}
          className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            isAluvion
              ? 'bg-sky-600 border-sky-600 text-white shadow-2xs'
              : 'bg-canvas-glacial border-border-subtle text-ink-muted hover:text-ink-primary hover:bg-sky-50'
          }`}
        >
          <Waves size={15} />
          <span>Aluvión</span>
        </button>

        {/* 2. Sismo */}
        <button
          type="button"
          onClick={toggleSismo}
          className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            isSismo
              ? 'bg-sky-600 border-sky-600 text-white shadow-2xs'
              : 'bg-canvas-glacial border-border-subtle text-ink-muted hover:text-ink-primary hover:bg-sky-50'
          }`}
        >
          <Activity size={15} />
          <span>Sismo</span>
        </button>

        {/* 3. Deslizamiento */}
        <button
          type="button"
          onClick={toggleDeslizamiento}
          className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            isDeslizamiento
              ? 'bg-sky-600 border-sky-600 text-white shadow-2xs'
              : 'bg-canvas-glacial border-border-subtle text-ink-muted hover:text-ink-primary hover:bg-sky-50'
          }`}
        >
          <Mountain size={15} />
          <span>Deslizamiento</span>
        </button>
      </div>
    </div>
  );
};
