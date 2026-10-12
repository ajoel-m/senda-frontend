import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Square,
  Scale,
  Sparkles,
  ListFilter,
  ShieldCheck,
  MapPin,
  Archive,
  ChevronDown,
  ChevronUp,
  Droplets,
  Utensils,
  Wrench,
  HeartPulse,
  Radio,
  Shirt,
  Sparkle,
} from 'lucide-react';
import {
  REGIONAL_ADDONS,
  RESERVE_BOX_SPECIFICATION,
  MAX_ALLOWABLE_BACKPACK_WEIGHT_GRAMS,
  type BackpackItem,
  type ItemCategory,
} from '../../lib/emergencyKit';
import { fetchEmergencyKit } from '../../services/emergencyKitService';

interface EmergencyKitViewProps {
  cityId?: string; // 'huaraz' | 'lima'
}

export const EmergencyKitView: React.FC<EmergencyKitViewProps> = ({
  cityId = 'huaraz',
}) => {
  const [viewMode, setViewMode] = useState<'quick' | 'detailed' | 'reserve'>('quick');
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | 'todas'>('todas');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [dynamicItems, setDynamicItems] = useState<BackpackItem[]>([]);
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

  const regionKey = cityId === 'lima' ? 'costero' : 'andino';
  const regionalAddon = REGIONAL_ADDONS[regionKey] || REGIONAL_ADDONS.andino;

  // Cargar artículos dinámicos desde Supabase con fallback local
  useEffect(() => {
    let isMounted = true;
    fetchEmergencyKit(cityId).then((res) => {
      if (isMounted) {
        setDynamicItems(res.items);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [cityId]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('mi_casa_segura_kit_checklist');
      if (saved) {
        setCheckedItems(JSON.parse(saved));
      }
    } catch {
      // Ignorar modo incógnito
    }
  }, []);

  const toggleCheck = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = { ...checkedItems, [id]: !checkedItems[id] };
    setCheckedItems(updated);
    try {
      localStorage.setItem('mi_casa_segura_kit_checklist', JSON.stringify(updated));
    } catch {
      // Ignorar
    }
  };

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedItemId((prev) => (prev === id ? null : id));
  };

  const activeItems = dynamicItems.length > 0
    ? dynamicItems
    : [...regionalAddon.items];

  const quickItems: BackpackItem[] = activeItems
    .filter((item) => item.isEssentialTop8)
    .slice(0, 8);

  const totalBackpackWeight = activeItems.reduce((sum, item) => sum + item.weightGrams, 0);
  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const quickCheckedCount = quickItems.filter((it) => checkedItems[it.id]).length;

  const filteredItems = selectedCategory === 'todas'
    ? activeItems
    : activeItems.filter((item) => item.category === selectedCategory);

  const renderItemCategoryIcon = (category: string) => {
    switch (category) {
      case 'agua':
        return <Droplets size={13} className="text-cyan-600 shrink-0" />;
      case 'alimentos':
        return <Utensils size={13} className="text-amber-600 shrink-0" />;
      case 'botiquin':
        return <HeartPulse size={13} className="text-emergency-600 shrink-0" />;
      case 'comunicacion':
        return <Radio size={13} className="text-sky-600 shrink-0" />;
      case 'abrigo':
        return <Shirt size={13} className="text-indigo-600 shrink-0" />;
      case 'higiene':
      default:
        return <Sparkle size={13} className="text-teal-600 shrink-0" />;
    }
  };

  return (
    <div className="space-y-4 text-ink-primary">
      {/* ------------------------------------------------------------------
          1. CABECERA LIMPIA Y RESPONSIVA
          ------------------------------------------------------------------ */}
      <div className="border-b border-border-subtle pb-3.5 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-sky-50 text-sky-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-ink-primary">
                Mochila de Emergencia (24 Horas)
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-ink-muted">
                <MapPin className="w-3.5 h-3.5 text-sky-600" />
                <span>Zona {regionalAddon.regionName} (2 personas)</span>
              </div>
            </div>
          </div>

          {/* Badge de masa y límite */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-canvas-glacial rounded-lg border border-border-subtle text-xs">
            <Scale className="w-3.5 h-3.5 text-sky-600" />
            <span className="font-semibold text-ink-primary">~{(totalBackpackWeight / 1000).toFixed(1)} kg</span>
            <span className="text-ink-muted">(máx. {MAX_ALLOWABLE_BACKPACK_WEIGHT_GRAMS / 1000} kg)</span>
          </div>
        </div>

        {/* Barra de progreso rápida de preparación */}
        <div className="pt-1">
          <div className="flex justify-between text-xs text-ink-muted mb-1">
            <span>
              Progreso del kit:{' '}
              <strong className="text-sky-700">
                {viewMode === 'quick'
                  ? `${quickCheckedCount} de ${quickItems.length} esenciales listos`
                  : `${checkedCount} de ${activeItems.length} artículos`}
              </strong>
            </span>
            <span className="font-bold text-sky-700">
              {Math.round(
                ((viewMode === 'quick'
                  ? quickCheckedCount / quickItems.length
                  : checkedCount / (activeItems.length || 1))) * 100
              )}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-border-subtle rounded-full overflow-hidden">
            <div
              className="h-full bg-sky-600 rounded-full transition-all duration-300"
              style={{
                width: `${
                  (viewMode === 'quick'
                    ? (quickCheckedCount / quickItems.length) * 100
                    : (checkedCount / (activeItems.length || 1)) * 100)
                }%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------
          2. NAVEGADOR DE PESTAÑAS RESPONSIVO (TIPO PILLS)
          ------------------------------------------------------------------ */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-canvas-glacial rounded-xl text-xs font-semibold border border-border-subtle">
        <button
          type="button"
          onClick={() => setViewMode('quick')}
          className={`py-2 px-1 text-center rounded-lg transition-all truncate flex items-center justify-center gap-1 cursor-pointer ${
            viewMode === 'quick'
              ? 'bg-canvas-surface text-sky-700 shadow-2xs font-bold border border-border-subtle'
              : 'text-ink-muted hover:text-ink-primary'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 shrink-0 text-sky-600" />
          <span className="truncate">Top 8 Esenciales</span>
        </button>

        <button
          type="button"
          onClick={() => setViewMode('detailed')}
          className={`py-2 px-1 text-center rounded-lg transition-all truncate flex items-center justify-center gap-1 cursor-pointer ${
            viewMode === 'detailed'
              ? 'bg-canvas-surface text-sky-700 shadow-2xs font-bold border border-border-subtle'
              : 'text-ink-muted hover:text-ink-primary'
          }`}
        >
          <ListFilter className="w-3.5 h-3.5 shrink-0 text-sky-600" />
          <span className="truncate">Todo el Kit</span>
        </button>

        <button
          type="button"
          onClick={() => setViewMode('reserve')}
          className={`py-2 px-1 text-center rounded-lg transition-all truncate flex items-center justify-center gap-1 cursor-pointer ${
            viewMode === 'reserve'
              ? 'bg-canvas-surface text-sky-700 shadow-2xs font-bold border border-border-subtle'
              : 'text-ink-muted hover:text-ink-primary'
          }`}
        >
          <Archive className="w-3.5 h-3.5 shrink-0 text-sky-600" />
          <span className="truncate">Caja Reserva</span>
        </button>
      </div>

      {/* ------------------------------------------------------------------
          3. VISTA RÁPIDA: TOP 8 ESENCIALES
          ------------------------------------------------------------------ */}
      {viewMode === 'quick' && (
        <div className="space-y-2.5">
          <p className="text-xs text-ink-muted">
            Toca cada artículo para marcarlo como preparado en tu casa:
          </p>

          <div className="space-y-2">
            {quickItems.map((item) => {
              const isChecked = Boolean(checkedItems[item.id]);
              const isExpanded = expandedItemId === item.id;

              return (
                <div
                  key={item.id}
                  onClick={(e) => toggleCheck(item.id, e)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer select-none ${
                    isChecked
                      ? 'bg-life-50 border-life-600/30 text-ink-primary'
                      : 'bg-canvas-surface border-border-subtle text-ink-primary hover:border-sky-400'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="flex items-start gap-2.5 flex-1 min-w-0">
                      <div className="mt-0.5 shrink-0 text-sky-600">
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-life-600" />
                        ) : (
                          <Square className="w-4 h-4 text-ink-muted" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="p-1 bg-canvas-glacial rounded-md border border-border-subtle inline-flex shrink-0">
                            {renderItemCategoryIcon(item.category)}
                          </span>
                          <span
                            className={`text-xs sm:text-sm font-semibold leading-tight ${
                              isChecked ? 'line-through text-ink-muted' : 'text-ink-primary'
                            }`}
                          >
                            {item.name}
                          </span>
                          <span className="text-[10px] text-ink-muted bg-canvas-glacial px-1.5 py-0.2 rounded font-mono border border-border-subtle">
                            {item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Botón sutil para expandir detalles */}
                    <button
                      type="button"
                      onClick={(e) => toggleExpand(item.id, e)}
                      className="p-1 text-ink-muted hover:text-sky-600 shrink-0 cursor-pointer"
                      title="Ver detalles técnicos"
                    >
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </div>

                  {/* Detalle desplegable opcional */}
                  {isExpanded && (
                    <div className="mt-2.5 pt-2 border-t border-border-subtle text-xs text-ink-muted space-y-1">
                      <div>
                        <strong className="text-ink-primary">Especificación:</strong> {item.specification} ({item.weightGrams} g)
                      </div>
                      <div>
                        <strong className="text-ink-primary">Función:</strong> {item.justification}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------
          4. VISTA DETALLADA: INVENTARIO COMPLETO RESPONSIVO
          ------------------------------------------------------------------ */}
      {viewMode === 'detailed' && (
        <div className="space-y-3">
          {/* Filtros horizontales compactos */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {[
              { id: 'todas', label: 'Todas' },
              { id: 'agua', label: 'Agua' },
              { id: 'alimentos', label: 'Alimentos' },
              { id: 'botiquin', label: 'Botiquín' },
              { id: 'comunicacion', label: 'Comunicación' },
              { id: 'abrigo', label: 'Abrigo' },
              { id: 'higiene', label: 'Higiene' },
            ].map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id as ItemCategory | 'todas')}
                  className={`py-1 px-2.5 rounded-lg border text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-sky-600 text-white border-sky-600'
                      : 'bg-canvas-surface text-ink-muted border-border-subtle hover:bg-canvas-glacial'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
            {filteredItems.map((item) => {
              const isChecked = Boolean(checkedItems[item.id]);
              return (
                <div
                  key={item.id}
                  onClick={(e) => toggleCheck(item.id, e)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                    isChecked
                      ? 'bg-life-50 border-life-600/30 text-ink-primary'
                      : 'bg-canvas-surface border-border-subtle hover:border-sky-400'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="shrink-0 text-sky-600">
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-life-600" />
                      ) : (
                        <Square className="w-4 h-4 text-ink-muted" />
                      )}
                    </div>
                    <span className="p-1 bg-canvas-glacial rounded-md border border-border-subtle inline-flex shrink-0">
                      {renderItemCategoryIcon(item.category)}
                    </span>
                    <div className="min-w-0 flex-1 truncate">
                      <span
                        className={`text-xs font-semibold truncate block ${
                          isChecked ? 'line-through text-ink-muted' : 'text-ink-primary'
                        }`}
                      >
                        {item.name}
                      </span>
                      <span className="text-[10px] text-ink-muted truncate block">
                        {item.quantity} · {item.specification}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-ink-muted shrink-0 bg-canvas-glacial px-1.5 py-0.5 rounded border border-border-subtle">
                    {item.weightGrams} g
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------
          5. VISTA CAJA DE RESERVA (DÍAS 2 AL 4)
          ------------------------------------------------------------------ */}
      {viewMode === 'reserve' && (
        <div className="p-4 bg-canvas-glacial border border-border-subtle rounded-2xl space-y-3 text-xs">
          <div>
            <h4 className="font-bold text-sm text-ink-primary">
              Caja de Reserva para el Hogar (Días 2 al 4)
            </h4>
            <p className="text-xs text-ink-muted mt-0.5 leading-relaxed">
              Almacenar en un lugar fresco y protegido para después del evento adverso:
            </p>
          </div>

          <div className="p-3 bg-canvas-surface border border-border-subtle rounded-xl space-y-1">
            <span className="font-bold text-sky-700 flex items-center gap-1.5">
              <Droplets size={16} className="text-sky-600" />
              <span>Agua Potable Extra:</span>
            </span>
            <p className="text-ink-muted leading-relaxed">
              <strong className="text-ink-primary">{RESERVE_BOX_SPECIFICATION.waterLiters}</strong> para bebida e higiene mientras se restablece el servicio.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="p-3 bg-canvas-surface border border-border-subtle rounded-xl space-y-1.5">
              <span className="font-bold text-ink-primary flex items-center gap-1.5">
                <Utensils size={15} className="text-sky-600" />
                <span>Alimentos no perecibles:</span>
              </span>
              <ul className="space-y-1 list-disc pl-4 text-ink-muted text-[11px]">
                {RESERVE_BOX_SPECIFICATION.foodExtended.map((it, idx) => (
                  <li key={idx}>{it}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 bg-canvas-surface border border-border-subtle rounded-xl space-y-1.5">
              <span className="font-bold text-ink-primary flex items-center gap-1.5">
                <Wrench size={15} className="text-sky-600" />
                <span>Herramientas y abrigo:</span>
              </span>
              <ul className="space-y-1 list-disc pl-4 text-ink-muted text-[11px]">
                {RESERVE_BOX_SPECIFICATION.logisticsExtended.map((it, idx) => (
                  <li key={idx}>{it}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
