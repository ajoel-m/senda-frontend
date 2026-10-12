import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Crosshair, AlertTriangle, ShieldCheck, ChevronDown } from 'lucide-react';
import { Coordinates } from '../../context/EvaluationContext';
import {
  HazardType,
  SeverityLevel,
  GeoJsonCollection,
  GeoJsonFeature,
  HAZARD_LAYERS_CONFIG,
  SEVERITY_STYLES,
  normalizeSeverity,
  fetchHazardLayer,
  findIntersectingHazards,
  IntersectingHazardResult,
} from '../../services/gisLayers';
import {
  loadHuarazSafeZones,
  SafeZonePoint,
  EvacuationRouteResult,
} from '../../services/evacuationService';
import { MapLayerControls } from './MapLayerControls';

// Íconos estándar sin dependencias de bundler
const markerIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface LeafletMapProps {
  coordinates: Coordinates;
  onChangeCoordinates: (coords: Coordinates) => void;
  interactive?: boolean;
  height?: string;
  onHazardDetected?: (hazard: IntersectingHazardResult | null) => void;
  cleanMode?: boolean; // Modo limpio: sin capas de peligro ni botones de pánico superpuestos
  fadedHazards?: boolean; // Muestra polígonos de peligro con opacidad más suave/traslúcida
  externalRoute?: EvacuationRouteResult | null;
  externalActiveThreats?: Set<HazardType>;
  showBottomAlert?: boolean;
  hideInternalControls?: boolean;
  hidePanicButton?: boolean;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  coordinates,
  onChangeCoordinates,
  interactive = true,
  height = '440px',
  onHazardDetected,
  cleanMode = false,
  fadedHazards = false,
  externalRoute = null,
  externalActiveThreats,
  showBottomAlert = true,
  hideInternalControls = false,
  hidePanicButton: _hidePanicButton = false,
}) => {
  void _hidePanicButton;
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const geoJsonLayersRef = useRef<Map<HazardType, L.GeoJSON>>(new Map());

  // Estado de capas activas y severidades visibles
  const [activeThreats, setActiveThreats] = useState<Set<HazardType>>(
    externalActiveThreats ||
      (cleanMode
        ? new Set<HazardType>()
        : new Set<HazardType>(['alluvium_inaigem', 'landslide', 'seismic', 'seismic_lima']))
  );

  useEffect(() => {
    if (externalActiveThreats) {
      setActiveThreats(externalActiveThreats);
    }
  }, [externalActiveThreats]);
  const [activeSeverities, setActiveSeverities] = useState<Set<SeverityLevel>>(
    new Set<SeverityLevel>(['critical', 'high', 'medium', 'low'])
  );
  const [loadedCollections, setLoadedCollections] = useState<Record<HazardType, GeoJsonCollection | null>>({
    alluvium_inaigem: null,
    alluvium_cenepred: null,
    landslide: null,
    seismic: null,
    seismic_lima: null,
  });
  const [isLoadingLayers, setIsLoadingLayers] = useState<boolean>(true);
  const [currentHazardAlert, setCurrentHazardAlert] = useState<IntersectingHazardResult | null>(null);
  const [showHazardDetail, setShowHazardDetail] = useState(false);
  const [safeZones, setSafeZones] = useState<SafeZonePoint[]>([]);
  const [activeEvacuationRoute, setActiveEvacuationRoute] = useState<EvacuationRouteResult | null>(externalRoute);

  useEffect(() => {
    if (externalRoute !== undefined) {
      setActiveEvacuationRoute(externalRoute);
    }
  }, [externalRoute]);

  // Actualizar tamaño de Leaflet cuando cambie height
  useEffect(() => {
    if (mapRef.current) {
      const timer = setTimeout(() => {
        mapRef.current?.invalidateSize();
        if (evacuationRouteLayerRef.current) {
          mapRef.current?.fitBounds(evacuationRouteLayerRef.current.getBounds(), {
            padding: [50, 50],
            maxZoom: 17,
            animate: true,
          });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [height]);

  useEffect(() => {
    if (cleanMode) {
      setActiveThreats(new Set<HazardType>());
    } else if (externalActiveThreats) {
      setActiveThreats(new Set(externalActiveThreats));
    }
  }, [cleanMode, externalActiveThreats]);

  const safeZoneMarkersRef = useRef<L.LayerGroup | null>(null);
  const evacuationRouteLayerRef = useRef<L.Polyline | null>(null);

  // 1. Cargar las colecciones GeoJSON al montar el componente
  useEffect(() => {
    let isMounted = true;

    const loadAllLayers = async () => {
      setIsLoadingLayers(true);
      const threats = Object.keys(HAZARD_LAYERS_CONFIG) as HazardType[];
      const results: Partial<Record<HazardType, GeoJsonCollection>> = {};

      for (const threat of threats) {
        try {
          const col = await fetchHazardLayer(threat);
          if (isMounted) results[threat] = col;
        } catch (e) {
          console.warn(`Could not load layer ${threat}:`, e);
        }
      }

      if (isMounted) {
        setLoadedCollections({
          alluvium_inaigem: results.alluvium_inaigem || null,
          alluvium_cenepred: results.alluvium_cenepred || null,
          landslide: results.landslide || null,
          seismic: results.seismic || null,
          seismic_lima: results.seismic_lima || null,
        });
        setIsLoadingLayers(false);
      }

      try {
        const zones = await loadHuarazSafeZones();
        if (isMounted) setSafeZones(zones);
      } catch (err) {
        console.warn('Error cargando zonas seguras:', err);
      }
    };

    loadAllLayers();

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Evaluar intersección espacial en tiempo real cuando cambien las coordenadas o capas
  useEffect(() => {
    const hazards = findIntersectingHazards(coordinates, loadedCollections, activeThreats);
    const worst = hazards.length > 0 ? hazards[0] : null;
    setCurrentHazardAlert(worst);
    if (onHazardDetected) {
      onHazardDetected(worst);
    }
  }, [coordinates, loadedCollections, activeThreats, onHazardDetected]);

  // Función constructora del popup HTML con estilo Andean Design System
  const createPopupContent = useCallback((feature: GeoJsonFeature, threat: HazardType) => {
    const props = feature.properties;
    const severity = normalizeSeverity(props);
    const style = SEVERITY_STYLES[severity];
    const config = HAZARD_LAYERS_CONFIG[threat];

    const title = (props.nombre_zona as string) || (props.desc_cober as string) || config.title;
    const fuente = (props.fuente as string) || config.source;
    const desc = (props.descripcion as string) || (props.descripci as string) || config.description;
    const distrito = (props.distrito as string) || (props.nomb_dist as string) || 'Huaraz';

    return `
      <div style="padding: 14px; font-family: Inter, system-ui, sans-serif; min-width: 240px; max-width: 320px;">
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 8px; border-bottom: 1px solid #D6ECFB; padding-bottom: 6px;">
          <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #1E6FB5;">
            ${config.title}
          </span>
          <span style="font-size: 11px; font-weight: 700; background-color: ${style.badgeBg}; color: ${style.badgeText}; border: 1px solid ${style.badgeBorder}; padding: 2px 6px; border-radius: 9999px;">
            ${style.label}
          </span>
        </div>
        <h4 style="margin: 0 0 6px 0; font-size: 14px; font-weight: 700; color: #0D3B66; line-height: 1.3;">
          ${title}
        </h4>
        <p style="margin: 0 0 8px 0; font-size: 12px; color: #4A6C8C; line-height: 1.4;">
          ${desc}
        </p>
        <div style="font-size: 11px; color: #4A6C8C; display: flex; flex-direction: column; gap: 2px; border-top: 1px solid #D6ECFB; padding-top: 6px;">
          <div><strong>Distrito:</strong> ${distrito}</div>
          <div><strong>Fuente oficial:</strong> ${fuente}</div>
          ${
            config.isVisualOnly
              ? `<div style="margin-top: 4px; padding: 4px 6px; background-color: #D6ECFB; font-size: 10px; color: #0D3B66; border-left: 2px solid #1E6FB5;">
                  Capa visual de contraste. El cálculo oficial de riesgo de la plataforma utiliza el modelo del INAIGEM.
                </div>`
              : ''
          }
        </div>
      </div>
    `;
  }, []);


  // 3. Inicializar Leaflet Map
  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }
    if ((container as any)._leaflet_id) {
      delete (container as any)._leaflet_id;
    }

    const map = L.map(container, {
      center: [coordinates.lat, coordinates.lng],
      zoom: 15,
      zoomControl: false,
    });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: 'topright' }).addTo(map);

    const marker = L.marker([coordinates.lat, coordinates.lng], {
      icon: markerIcon,
      draggable: interactive,
    }).addTo(map);

    if (interactive) {
      marker.on('dragend', () => {
        const pos = marker.getLatLng();
        onChangeCoordinates({
          lat: Number(pos.lat.toFixed(6)),
          lng: Number(pos.lng.toFixed(6)),
          accuracy: 10,
        });
      });

      map.on('click', (e: L.LeafletMouseEvent) => {
        const newCoords: Coordinates = {
          lat: Number(e.latlng.lat.toFixed(6)),
          lng: Number(e.latlng.lng.toFixed(6)),
          accuracy: 10,
        };
        marker.setLatLng([newCoords.lat, newCoords.lng]);
        onChangeCoordinates(newCoords);
      });
    }

    markerRef.current = marker;
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
      geoJsonLayersRef.current.clear();
    };
  }, []);

  // 4. Sincronizar posición del marcador cuando cambien las coordenadas
  useEffect(() => {
    if (!mapRef.current || !markerRef.current) return;

    const currentPos = markerRef.current.getLatLng();
    const distance = Math.hypot(currentPos.lat - coordinates.lat, currentPos.lng - coordinates.lng);

    if (distance > 0.00001) {
      markerRef.current.setLatLng([coordinates.lat, coordinates.lng]);
      mapRef.current.panTo([coordinates.lat, coordinates.lng], { animate: true, duration: 0.5 });
    }
  }, [coordinates.lat, coordinates.lng]);

  // 5. Renderizar o actualizar capas coropléticas vectoriales
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const threats = Object.keys(HAZARD_LAYERS_CONFIG) as HazardType[];

    threats.forEach((threat) => {
      // Eliminar capa anterior si existe
      if (geoJsonLayersRef.current.has(threat)) {
        const oldLayer = geoJsonLayersRef.current.get(threat)!;
        map.removeLayer(oldLayer);
        geoJsonLayersRef.current.delete(threat);
      }

      // Si la amenaza está desactivada por el usuario, no agregarla
      if (!activeThreats.has(threat)) return;

      const collection = loadedCollections[threat];
      if (!collection || !collection.features.length) return;

      // Filtrar features según severidades activas
      const filteredFeatures = collection.features.filter((f) => {
        const severity = normalizeSeverity(f.properties);
        return activeSeverities.has(severity);
      });

      if (!filteredFeatures.length) return;

      const filteredCollection: any = {
        type: 'FeatureCollection',
        features: filteredFeatures,
      };

      const geoJsonLayer = L.geoJSON(filteredCollection, {
        style: (feat) => {
          const sev = normalizeSeverity((feat as any)?.properties || {});
          const style = SEVERITY_STYLES[sev];
          if (fadedHazards) {
            return {
              fillColor: style.fill,
              fillOpacity: 0.20, // Más opaco/traslúcido que en exploración para no tapar la ruta de escape
              weight: 1,
              color: style.stroke,
              opacity: 0.5,
            };
          }
          return {
            fillColor: style.fill,
            fillOpacity: style.fillOpacity,
            weight: style.strokeWidth,
            color: style.stroke,
            opacity: 0.9,
          };
        },
        onEachFeature: (feat, layer) => {
          // Bind Andean popup
          const popupHtml = createPopupContent(feat as GeoJsonFeature, threat);
          layer.bindPopup(popupHtml);

          // Efecto hover sutil
          layer.on({
            mouseover: (e) => {
              const target = e.target;
              target.setStyle({
                fillOpacity: Math.min(0.75, (target.options.fillOpacity || 0.4) + 0.18),
                weight: (target.options.weight || 1) + 1,
              });
              if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                target.bringToFront();
              }
            },
            mouseout: (e) => {
              geoJsonLayer.resetStyle(e.target);
            },
            click: (e) => {
              // Permitir hacer clic para inspeccionar el polígono y actualizar coordenadas si el usuario lo desea
              L.DomEvent.stopPropagation(e);
            },
          });
        },
      });

      geoJsonLayer.addTo(map);
      geoJsonLayersRef.current.set(threat, geoJsonLayer);
    });
  }, [loadedCollections, activeThreats, activeSeverities, createPopupContent, fadedHazards]);

  const handleToggleThreat = (threat: HazardType) => {
    setActiveThreats((prev) => {
      const next = new Set(prev);
      if (next.has(threat)) {
        next.delete(threat);
      } else {
        next.add(threat);
      }
      return next;
    });
  };

  const handleToggleSeverity = (severity: SeverityLevel) => {
    setActiveSeverities((prev) => {
      const next = new Set(prev);
      if (next.has(severity)) {
        if (next.size > 1) next.delete(severity); // Mantener al menos una visible
      } else {
        next.add(severity);
      }
      return next;
    });
  };

  // 6. Renderizar marcadores de Zonas Seguras y Refugios Temporales
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (safeZoneMarkersRef.current) {
      map.removeLayer(safeZoneMarkersRef.current);
      safeZoneMarkersRef.current = null;
    }

    // Filtrar los puntos de evacuación según las amenazas activas:
    // Un punto con tipo_peligro 'alluvium' solo se muestra si alluvium_inaigem o alluvium_cenepred están activas
    const matchingZones = safeZones.filter((sz) => {
      if (sz.tipo_peligro === 'alluvium') {
        return activeThreats.has('alluvium_inaigem') || activeThreats.has('alluvium_cenepred');
      }
      if (sz.tipo_peligro === 'seismic') {
        return activeThreats.has('seismic') || activeThreats.has('seismic_lima');
      }
      if (sz.tipo_peligro === 'landslide') {
        return activeThreats.has('landslide');
      }
      return false;
    });

    if (!matchingZones.length) return;

    const markersGroup = L.layerGroup();

    matchingZones.forEach((sz) => {
      const isRefugio = sz.tipo === 'refugio_temp';
      const bgColor = isRefugio ? '#0D3B66' : '#1E6FB5';
      const label = isRefugio ? 'Refugio' : 'Zona Segura';

      const customDivIcon = L.divIcon({
        className: 'custom-safe-zone-marker',
        html: `
          <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            width: 28px;
            height: 28px;
            background-color: ${bgColor};
            color: #FFFFFF;
            border-radius: 50%;
            border: 2px solid #FFFFFF;
            box-shadow: 0 2px 6px rgba(0,0,0,0.35);
            font-size: 14px;
          ">
            ${isRefugio ? '🏕️' : '🛡️'}
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -14],
      });

      const m = L.marker([sz.lat, sz.lng], { icon: customDivIcon });
      m.bindPopup(`
        <div style="padding: 10px; font-family: Inter, system-ui, sans-serif; min-width: 200px;">
          <div style="display: inline-block; font-size: 10px; font-weight: 700; text-transform: uppercase; background-color: ${isRefugio ? '#EBF3F5' : '#E8F3EB'}; color: ${bgColor}; padding: 2px 6px; border-radius: 9999px; margin-bottom: 4px;">
            ${label}
          </div>
          <h4 style="margin: 0 0 4px 0; font-size: 13px; font-weight: 700; color: #0D3B66;">
            ${sz.nombre}
          </h4>
          <div style="font-size: 11px; color: #4A6C8C;">
            Sector: <strong>${sz.sector}</strong> (${sz.ciudad})
          </div>
        </div>
      `);
      markersGroup.addLayer(m);
    });

    markersGroup.addTo(map);
    safeZoneMarkersRef.current = markersGroup;

    return () => {
      if (safeZoneMarkersRef.current && map) {
        map.removeLayer(safeZoneMarkersRef.current);
      }
    };
  }, [safeZones, activeThreats]);

  // 7. Renderizar Polilínea de la Ruta de Evacuación Activa
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (evacuationRouteLayerRef.current) {
      map.removeLayer(evacuationRouteLayerRef.current);
      evacuationRouteLayerRef.current = null;
    }

    if (!activeEvacuationRoute) return;

    const polyline = L.polyline(activeEvacuationRoute.routeGeometry, {
      color: activeEvacuationRoute.isOfflineFallback
        ? '#D97706'
        : activeEvacuationRoute.isInsideHazard
        ? '#E63950'
        : '#1E6FB5',
      weight: 5,
      opacity: 0.9,
      dashArray: activeEvacuationRoute.isOfflineFallback ? '8, 8' : undefined,
    }).addTo(map);

    evacuationRouteLayerRef.current = polyline;

    // Ajustar zoom para abarcar el usuario y la zona de destino
    map.fitBounds(polyline.getBounds(), {
      padding: [60, 60],
      maxZoom: 17,
      animate: true,
    });

    return () => {
      if (evacuationRouteLayerRef.current && map) {
        map.removeLayer(evacuationRouteLayerRef.current);
      }
    };
  }, [activeEvacuationRoute]);

  const handleRecenter = () => {
    if (!mapRef.current) return;
    mapRef.current.setView([coordinates.lat, coordinates.lng], 16, { animate: true });
  };

  return (
    <div className="space-y-3">
      {/* Contenedor del Mapa */}
      <div
        className="relative w-full overflow-hidden bg-canvas-surface border border-border-subtle rounded-2xl"
      >
        <div
          ref={mapContainerRef}
          style={{
            width: '100%',
            height,
            zIndex: 1,
          }}
        />

        {/* Botón de recentrado ergonómico GPS (ÚNICO elemento superpuesto permitido además de los controles de zoom + / -) */}
        <button
          type="button"
          onClick={handleRecenter}
          title="Centrar en mi ubicación"
          aria-label="Centrar en mi ubicación"
          style={{
            position: 'absolute',
            bottom: '16px',
            right: '16px',
            zIndex: 1000,
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #CBD5E1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#1E6FB5',
            transition: 'background-color 0.15s ease, transform 0.1s ease',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F7F9FC')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
        >
          <Crosshair size={22} className="text-sky-600" />
        </button>
      </div>

      {/* Alerta Espacial en Tiempo Real (Debajo del mapa) */}
      {!cleanMode && showBottomAlert && (
        <div
          className="p-3.5 border transition-colors rounded-2xl shadow-2xs"
          style={{
            backgroundColor: currentHazardAlert
              ? SEVERITY_STYLES[currentHazardAlert.severity].badgeBg
              : '#FFFFFF',
            borderColor: currentHazardAlert
              ? SEVERITY_STYLES[currentHazardAlert.severity].badgeBorder
              : '#CBD5E1',
          }}
        >
          <button
            type="button"
            onClick={() => setShowHazardDetail((v) => !v)}
            className="w-full flex items-start gap-3 text-left"
          >
            {currentHazardAlert ? (
              <AlertTriangle
                className="w-5 h-5 shrink-0 mt-0.5"
                style={{ color: SEVERITY_STYLES[currentHazardAlert.severity].stroke }}
              />
            ) : (
              <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5 text-[#1B5E20]" />
            )}

            <div className="flex-1 text-xs sm:text-sm">
              {currentHazardAlert ? (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-ink-primary">
                    Ubicación dentro de polígono de amenaza:
                  </span>
                  <span
                    className="font-bold px-2.5 py-0.5 border rounded-full text-xs"
                    style={{
                      backgroundColor: SEVERITY_STYLES[currentHazardAlert.severity].fill,
                      borderColor: SEVERITY_STYLES[currentHazardAlert.severity].stroke,
                      color: '#FFFFFF',
                    }}
                  >
                    {SEVERITY_STYLES[currentHazardAlert.severity].label}
                  </span>
                  <span className="text-ink-muted text-xs font-mono font-semibold">
                    ({currentHazardAlert.source})
                  </span>
                </div>
              ) : (
                <span className="font-bold text-ink-primary">
                  Ubicación fuera de fajas de peligro aluvial directo registradas
                </span>
              )}
            </div>

            <ChevronDown
              size={16}
              className={`shrink-0 mt-0.5 text-ink-muted transition-transform ${showHazardDetail ? 'rotate-180' : ''}`}
            />
          </button>

          {showHazardDetail && (
            <div className="mt-2 pl-8 text-xs sm:text-sm">
              {currentHazardAlert ? (
                <p className="text-ink-primary leading-relaxed">
                  {currentHazardAlert.zoneName} — {currentHazardAlert.description}
                </p>
              ) : (
                <p className="text-ink-muted leading-relaxed">
                  El punto seleccionado no interseca actualmente zonas de inundación crítica según la cartografía oficial del INAIGEM y CENEPRED.
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Controles de Capas y Leyenda Visible en Escritorio/Flujo (Solo si no está en cleanMode ni oculto) */}
      {!cleanMode && !hideInternalControls && (
        <div className="hidden sm:block">
          <MapLayerControls
            activeThreats={activeThreats}
            onToggleThreat={handleToggleThreat}
            activeSeverities={activeSeverities}
            onToggleSeverity={handleToggleSeverity}
            isLoading={isLoadingLayers}
          />
        </div>
      )}
    </div>
  );
};
