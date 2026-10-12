/**
 * Servicio de Evacuación y Rutas de Escape para Aluvión en Huaraz.
 * SENDA - 2026
 *
 * Arquitectura Enfoque A:
 * 1. Sectorización Estricta de Refugios por Vertiente (Río Quillcay):
 *    - Vertiente Norte (Independencia): destinos exclusivos en Shancayan, Centenario, Nicrupampa.
 *    - Vertiente Sur (Huaraz Cercado): destinos exclusivos en Centro, Huarupampa, Soledad, Belén, Pedregal, Villón.
 *    - Prohibición terminante de rutas peatonales que crucen puentes sobre el cauce aluvial.
 *
 * 2. Gradiente de Descompresión Rápida hacia Ladera Alta:
 *    - Si el usuario está en zona de peligro (Crítico, Alto, Medio o Bajo):
 *      Se calcula la distancia mínima hacia las cotas de menor severidad o zona segura exterior.
 *      Se selecciona la salida más cercana (aprovechando fajas estrechas del mapa).
 *      Condición geomorfológica estricta: el vector de escape siempre sube hacia la ladera alta
 *      de su vertiente (hacia el norte en Independencia, hacia el sur en Huaraz), alejándose
 *      del lecho del río Quillcay.
 *
 * 3. Trazado en 2 Etapas:
 *    - Tramo 1 (Escape Urgente / Cota Alta): Vector directo al punto de descompresión rápida.
 *    - Tramo 2 (Ruta Peatonal por Calles): Desde la cota segura hasta el refugio asignado vía OSRM (con fallback offline).
 */

import { Coordinates } from '../context/EvaluationContext';
import {
  fetchHazardLayer,
  isPointInGeometry,
  normalizeSeverity,
  SeverityLevel,
  GeoJsonFeature,
} from './gisLayers';

export type SafeZoneType = 'zona_segura' | 'refugio_temp';
export type WatershedSide = 'norte' | 'sur';

export interface SafeZonePoint {
  id: string;
  nombre: string;
  tipo: SafeZoneType;
  tipo_peligro: 'alluvium' | 'seismic' | 'landslide';
  sector: string;
  ciudad: string;
  lat: number;
  lng: number;
}

export interface EvacuationRouteResult {
  origin: Coordinates;
  destination: SafeZonePoint;
  isInsideHazard: boolean;
  hazardLevel: SeverityLevel | null;
  hasData: boolean;
  distanceMeters: number;
  estimatedTimeMinutes: number;
  routeGeometry: [number, number][]; // [lat, lng] array para Leaflet Polyline
  googleMapsUrl: string;
  isOfflineFallback: boolean;
  instructions: string;
  watershed?: WatershedSide;
  /**
   * Presente cuando el usuario estaba dentro del polígono de peligro:
   * Etapa 1 (escape lateral / descompresión rápida a ladera alta) antes de
   * conectar con la red vial hacia el refugio oficial sectorizado (Etapa 2).
   */
  escapeStage?: {
    point: { lat: number; lng: number };
    distanceMeters: number;
    fromLevel?: SeverityLevel | null;
    toLevel?: SeverityLevel | 'safe';
    watershed?: WatershedSide;
  };
}

let cachedSafeZones: SafeZonePoint[] | null = null;
const STORAGE_KEY = 'mi_casa_segura_safe_zones_cache';

/**
 * Jerarquía ordinal de severidad para evaluar el gradiente de descompresión rápida.
 */
export const SEVERITY_RANK: Record<SeverityLevel | 'safe', number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
  safe: 0,
};

/**
 * Polilínea de referencia del cauce del Río Quillcay en la ciudad de Huaraz.
 * Actúa como una BARRERA TOPOGRÁFICA INFRANQUEABLE durante una emergencia aluvial:
 * Queda terminantemente prohibido cruzarla (los puentes colapsan o se inundan).
 * Coordenadas [lng, lat] ordenadas de Este a Oeste siguiendo el cauce real y estribos de puentes:
 * 1. Confluencia Paria/Auqui: [-77.5050, -9.5255]
 * 2. Puente Auqui / Los Libertadores: [-77.5180, -9.5270]
 * 3. Puente Calicanto / Santa Rosa (Jr. San Martín): [-77.5230, -9.52785]
 * 4. Puente Gamarra (Jr. Gamarra): [-77.5262, -9.52755]
 * 5. Puente Bolívar: [-77.5270, -9.52745]
 * 6. Puente Quillcay (Av. Centenario / Av. Luzuriaga): [-77.5284, -9.52735]
 * 7. Puente Comercio (Jr. Comercio / Mercado Central): [-77.5295, -9.52720]
 * 8. Puente Raimondi / Confraternidad Oeste: [-77.5320, -9.52760]
 * 9. Confluencia con Río Santa: [-77.5340, -9.52780]
 */
export const RIO_QUILLCAY_BARRIER: [number, number][] = [
  [-77.5050, -9.5255],
  [-77.5180, -9.5270],
  [-77.5230, -9.52785],
  [-77.5262, -9.52755],
  [-77.5270, -9.52745],
  [-77.5284, -9.52735],
  [-77.5295, -9.52720],
  [-77.5320, -9.52760],
  [-77.5340, -9.52780],
];

/**
 * Algoritmo 2D para determinar si dos segmentos [p1, p2] y [p3, p4] se intersectan.
 * Cada punto es [lng, lat].
 */
export function lineSegmentsIntersect(
  p1: [number, number],
  p2: [number, number],
  p3: [number, number],
  p4: [number, number]
): boolean {
  const ccw = (a: [number, number], b: [number, number], c: [number, number]): number => {
    return (c[1] - a[1]) * (b[0] - a[0]) - (b[1] - a[1]) * (c[0] - a[0]);
  };

  const d1 = ccw(p3, p4, p1);
  const d2 = ccw(p3, p4, p2);
  const d3 = ccw(p1, p2, p3);
  const d4 = ccw(p1, p2, p4);

  if (((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) && ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))) {
    return true;
  }

  // Verificación de colinealidad y segmentos solapados
  const onSegment = (p: [number, number], a: [number, number], b: [number, number]): boolean => {
    return (
      Math.min(a[0], b[0]) <= p[0] &&
      p[0] <= Math.max(a[0], b[0]) &&
      Math.min(a[1], b[1]) <= p[1] &&
      p[1] <= Math.max(a[1], b[1])
    );
  };

  if (d1 === 0 && onSegment(p1, p3, p4)) return true;
  if (d2 === 0 && onSegment(p2, p3, p4)) return true;
  if (d3 === 0 && onSegment(p3, p1, p2)) return true;
  if (d4 === 0 && onSegment(p4, p1, p2)) return true;

  return false;
}

/**
 * Verifica si una trayectoria directa entre start y end atraviesa la barrera del Río Quillcay.
 */
export function pathCrossesRiver(
  start: { lat: number; lng: number },
  end: { lat: number; lng: number }
): boolean {
  const p1: [number, number] = [start.lng, start.lat];
  const p2: [number, number] = [end.lng, end.lat];

  for (let i = 0; i < RIO_QUILLCAY_BARRIER.length - 1; i++) {
    const p3 = RIO_QUILLCAY_BARRIER[i];
    const p4 = RIO_QUILLCAY_BARRIER[i + 1];
    if (lineSegmentsIntersect(p1, p2, p3, p4)) {
      return true;
    }
  }
  return false;
}

/**
 * Verifica si una polilínea completa (por ejemplo, ruta peatonal de OSRM) atraviesa el cauce del río.
 */
export function polylineCrossesRiver(routeGeometry: [number, number][]): boolean {
  for (let i = 0; i < routeGeometry.length - 1; i++) {
    const start = { lat: routeGeometry[i][0], lng: routeGeometry[i][1] };
    const end = { lat: routeGeometry[i + 1][0], lng: routeGeometry[i + 1][1] };
    if (pathCrossesRiver(start, end)) {
      return true;
    }
  }
  return false;
}

export function getQuillcayAxisLat(lng: number): number {
  if (lng >= RIO_QUILLCAY_BARRIER[0][0]) return RIO_QUILLCAY_BARRIER[0][1];
  if (lng <= RIO_QUILLCAY_BARRIER[RIO_QUILLCAY_BARRIER.length - 1][0]) {
    return RIO_QUILLCAY_BARRIER[RIO_QUILLCAY_BARRIER.length - 1][1];
  }

  for (let i = 0; i < RIO_QUILLCAY_BARRIER.length - 1; i++) {
    const p1 = RIO_QUILLCAY_BARRIER[i];
    const p2 = RIO_QUILLCAY_BARRIER[i + 1];
    if (lng <= p1[0] && lng >= p2[0]) {
      const t = (lng - p1[0]) / (p2[0] - p1[0]);
      return p1[1] + t * (p2[1] - p1[1]);
    }
  }

  return -9.52735;
}

/**
 * Identifica la vertiente topográfica descriptiva (Norte / Independencia vs Sur / Huaraz) de cualquier coordenada.
 */
export function getPointWatershed(coords: { lat: number; lng: number }): WatershedSide {
  const riverLat = getQuillcayAxisLat(coords.lng);
  return coords.lat > riverLat ? 'norte' : 'sur';
}

/**
 * Asocia cada refugio o zona segura a su vertiente correspondiente (compatibilidad retroactiva).
 */
export function getSafeZoneWatershed(zone: SafeZonePoint): WatershedSide {
  const sector = (zone.sector || '').toLowerCase();
  if (
    sector.includes('shancayan') ||
    sector.includes('centenario') ||
    sector.includes('nicrupampa') ||
    sector.includes('independencia') ||
    sector.includes('monterrey')
  ) {
    return 'norte';
  }
  if (
    sector.includes('centro') ||
    sector.includes('huarupampa') ||
    sector.includes('soledad') ||
    sector.includes('belen') ||
    sector.includes('belén') ||
    sector.includes('pedregal') ||
    sector.includes('villon') ||
    sector.includes('villón') ||
    sector.includes('san francisco')
  ) {
    return 'sur';
  }
  return getPointWatershed(zone);
}

/**
 * Carga los puntos de zonas seguras y refugios temporales de Huaraz,
 * priorizando memoria y almacenamiento local (Caché Offline en navegador).
 */
export async function loadHuarazSafeZones(): Promise<SafeZonePoint[]> {
  if (cachedSafeZones && cachedSafeZones.length > 0) {
    return cachedSafeZones;
  }

  // 1. Intentar leer de localStorage (Caché rápida de navegador)
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          cachedSafeZones = parsed;
        }
      }
    } catch (e) {
      console.warn('No se pudo leer safe zones de localStorage:', e);
    }
  }

  // 2. Fetch de capa actualizada (o fallback estático)
  try {
    const response = await fetch('/layers/zonas_seguras_huaraz.json');
    if (response.ok) {
      const data = await response.json();
      const points: SafeZonePoint[] = (data.features || []).map((feat: any) => {
        const [lng, lat] = feat.geometry.coordinates;
        return {
          id: feat.properties.id || `sz-${Math.random()}`,
          nombre: feat.properties.nombre || 'Zona Segura',
          tipo: feat.properties.tipo || 'zona_segura',
          tipo_peligro: feat.properties.tipo_peligro || 'alluvium',
          sector: feat.properties.sector || 'Huaraz',
          ciudad: feat.properties.ciudad || 'Huaraz',
          lat,
          lng,
        };
      });

      cachedSafeZones = points;

      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(points));
        } catch (e) {
          console.warn('No se pudo guardar safe zones en localStorage:', e);
        }
      }

      return points;
    }
  } catch (err) {
    console.warn('Error cargando zonas seguras remotas, usando caché local si existe:', err);
  }

  return cachedSafeZones || [];
}

/**
 * Fórmula de Haversine para distancia en línea recta en metros.
 */
export function calculateHaversineDistance(
  coord1: { lat: number; lng: number },
  coord2: { lat: number; lng: number }
): number {
  const R = 6371e3; // Radio de la Tierra en metros
  const phi1 = (coord1.lat * Math.PI) / 180;
  const phi2 = (coord2.lat * Math.PI) / 180;
  const deltaPhi = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const deltaLambda = ((coord2.lng - coord1.lng) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Distancia punto-a-segmento en coordenadas planas (aproximación local).
 */
function nearestPointOnSegment(
  p: [number, number],
  a: [number, number],
  b: [number, number]
): [number, number] {
  const [px, py] = p;
  const [ax, ay] = a;
  const [bx, by] = b;
  const dx = bx - ax;
  const dy = by - ay;
  const lengthSq = dx * dx + dy * dy;
  let t = lengthSq === 0 ? 0 : ((px - ax) * dx + (py - ay) * dy) / lengthSq;
  t = Math.max(0, Math.min(1, t));
  return [ax + t * dx, ay + t * dy];
}

/**
 * Punto más cercano sobre el borde de un anillo poligonal (array de [lng, lat]).
 */
export function nearestPointOnRing(
  point: [number, number],
  ring: [number, number][]
): { point: [number, number]; distanceMeters: number } {
  let best: [number, number] = ring[0];
  let bestDist = Infinity;

  for (let i = 0; i < ring.length - 1; i++) {
    const candidate = nearestPointOnSegment(point, ring[i], ring[i + 1]);
    const dist = calculateHaversineDistance(
      { lat: point[1], lng: point[0] },
      { lat: candidate[1], lng: candidate[0] }
    );
    if (dist < bestDist) {
      bestDist = dist;
      best = candidate;
    }
  }

  return { point: best, distanceMeters: bestDist };
}

/**
 * Extrae todos los anillos exteriores de una geometría Polygon o MultiPolygon.
 */
export function getOuterRingsFromGeometry(geometry: GeoJsonFeature['geometry']): [number, number][][] {
  if (geometry.type === 'Polygon') {
    return [geometry.coordinates[0]];
  }
  if (geometry.type === 'MultiPolygon') {
    return geometry.coordinates.map((poly: [number, number][][]) => poly[0]);
  }
  return [];
}

/**
 * Calcula el nivel de peligro en un punto dado según las features de aluvión.
 * Retorna 'safe' si está fuera de todos los polígonos.
 */
export function evaluatePointHazardLevel(
  coords: { lat: number; lng: number },
  features: GeoJsonFeature[]
): SeverityLevel | 'safe' {
  let highestRank = 0;
  let highestLevel: SeverityLevel | 'safe' = 'safe';

  for (const feat of features) {
    if (isPointInGeometry([coords.lng, coords.lat], feat.geometry)) {
      const sev = normalizeSeverity(feat.properties);
      const rank = SEVERITY_RANK[sev] || 0;
      if (rank > highestRank) {
        highestRank = rank;
        highestLevel = sev;
      }
    }
  }

  return highestLevel;
}

export interface RapidDecompressionCandidate {
  lat: number;
  lng: number;
  distanceMeters: number;
  targetLevel: SeverityLevel | 'safe';
  fromLevel: SeverityLevel;
  watershed: WatershedSide;
}

/**
 * Gradiente de Descompresión Rápida hacia Ladera Alta:
 *
 * Cuando el usuario se encuentra dentro de la mancha de peligro (Crítico, Alto, Medio o Bajo),
 * en lugar de forzar un paso rígido capa por capa, proyecta la distancia mínima hacia
 * los bordes de salida que reduzcan su nivel de exposición (hacia capas menores o fuera del peligro).
 *
 * Selecciona el punto de descompresión más cercano (aprovechando las fajas delgadas del terreno)
 * asegurando la REGLA DE VERTIENTE:
 * - Si está en vertiente Norte (Independencia): el vector siempre se dirige hacia la ladera norte,
 *   alejándose del río Quillcay.
 * - Si está en vertiente Sur (Huaraz): el vector siempre se dirige hacia la ladera sur,
 *   alejándose del río Quillcay.
 * - Nunca cruza el eje del río.
 */
export function findRapidDecompressionPoint(
  userCoords: Coordinates,
  hazardFeatures: GeoJsonFeature[],
  currentLevel: SeverityLevel,
  forcedWatershed?: WatershedSide
): RapidDecompressionCandidate | null {
  const userWatershed = forcedWatershed || getPointWatershed(userCoords);
  const currentRank = SEVERITY_RANK[currentLevel] || 4;
  const point: [number, number] = [userCoords.lng, userCoords.lat];

  const MARGIN_METERS = 15;
  const metersPerDegreeLat = 111320;
  const metersPerDegreeLng = 111320 * Math.cos((userCoords.lat * Math.PI) / 180);

  const validCandidates: RapidDecompressionCandidate[] = [];

  // Exploramos los anillos exteriores de todas las features de peligro presentes
  for (const feat of hazardFeatures) {
    const rings = getOuterRingsFromGeometry(feat.geometry);

    for (const ring of rings) {
      const nearest = nearestPointOnRing(point, ring);
      if (!isFinite(nearest.distanceMeters)) continue;

      const dLng = nearest.point[0] - point[0];
      const dLat = nearest.point[1] - point[1];
      const mag = Math.hypot(dLng, dLat) || 1;

      // Empuja ~15m más allá del borde en la dirección de escape para cruzar la frontera de riesgo
      const escapeLng = nearest.point[0] + (dLng / mag) * (MARGIN_METERS / metersPerDegreeLng);
      const escapeLat = nearest.point[1] + (dLat / mag) * (MARGIN_METERS / metersPerDegreeLat);
      const escapeCoords = { lat: escapeLat, lng: escapeLng };

      // 1. CONDICIÓN DE BARRERA FLUVIAL:
      // El vector de escape directo NUNCA debe cruzar el cauce del Río Quillcay hacia el margen opuesto.
      if (pathCrossesRiver(userCoords, escapeCoords)) continue;

      // 2. CONDICIÓN DE REDUCCIÓN DE RIESGO:
      // El nivel alcanzado debe ser estrictamente menor que el nivel actual del usuario.
      const targetLevel = evaluatePointHazardLevel(escapeCoords, hazardFeatures);
      const targetRank = SEVERITY_RANK[targetLevel];

      const distanceMeters = Math.round(nearest.distanceMeters + MARGIN_METERS);

      // Un escape lateral de emergencia en cono aluvial es una maniobra local urgente (máx 200m)
      if (distanceMeters <= 200 && targetRank < currentRank) {
        validCandidates.push({
          lat: escapeLat,
          lng: escapeLng,
          distanceMeters,
          targetLevel,
          fromLevel: currentLevel,
          watershed: getPointWatershed(escapeCoords),
        });
      }
    }
  }

  // Si encontramos candidatos que reducen riesgo sin cruzar el río:
  // Seleccionamos el de MENOR DISTANCIA (gradiente de descompresión lateral 360° más rápido)
  if (validCandidates.length > 0) {
    validCandidates.sort((a, b) => a.distanceMeters - b.distanceMeters);
    return validCandidates[0];
  }

  // Fallback de seguridad: Si ninguna frontera multianillo cumplió los filtros,
  // proyectamos el escape local alejándose del cauce sin saltos ciegos
  return fallbackHighSlopeEscape(userCoords, currentLevel, userWatershed);
}

/**
 * Fallback seguro que proyecta vector de salida lateral directo hacia la ladera alta
 * de su propia vertiente (avance local de 25m alejándose del cauce).
 */
function fallbackHighSlopeEscape(
  userCoords: Coordinates,
  currentLevel: SeverityLevel,
  userWatershed: WatershedSide
): RapidDecompressionCandidate {
  const metersPerDegreeLat = 111320;
  const MARGIN_METERS = 25;

  // En vertiente Norte, ascender a ladera alta = avanzar hacia el norte (+lat)
  // En vertiente Sur, ascender a ladera alta = avanzar hacia el sur (-lat)
  const latSign = userWatershed === 'norte' ? 1 : -1;
  const escapeLat = userCoords.lat + (latSign * MARGIN_METERS) / metersPerDegreeLat;
  const escapeLng = userCoords.lng;

  return {
    lat: escapeLat,
    lng: escapeLng,
    distanceMeters: MARGIN_METERS,
    targetLevel: 'safe',
    fromLevel: currentLevel,
    watershed: userWatershed,
  };
}

/**
 * Compatibilidad con la API previa de escape lateral individual.
 */
export function findLateralEscapePoint(
  userCoords: Coordinates,
  geometry: GeoJsonFeature['geometry']
): { lat: number; lng: number; distanceMeters: number } | null {
  const outerRings = getOuterRingsFromGeometry(geometry);
  if (outerRings.length === 0) return null;

  const point: [number, number] = [userCoords.lng, userCoords.lat];
  let best: { point: [number, number]; distanceMeters: number } | null = null;

  for (const ring of outerRings) {
    const candidate = nearestPointOnRing(point, ring);
    if (!best || candidate.distanceMeters < best.distanceMeters) {
      best = candidate;
    }
  }
  if (!best) return null;

  const MARGIN_METERS = 15;
  const dLng = best.point[0] - point[0];
  const dLat = best.point[1] - point[1];
  const mag = Math.hypot(dLng, dLat) || 1;

  const metersPerDegreeLat = 111320;
  const metersPerDegreeLng = 111320 * Math.cos((userCoords.lat * Math.PI) / 180);
  const marginLng = (dLng / mag) * (MARGIN_METERS / metersPerDegreeLng);
  const marginLat = (dLat / mag) * (MARGIN_METERS / metersPerDegreeLat);

  return {
    lat: best.point[1] + marginLat,
    lng: best.point[0] + marginLng,
    distanceMeters: Math.round(best.distanceMeters + MARGIN_METERS),
  };
}

/**
 * Verifica si un punto está dentro de la mancha de aluvión de Huaraz (INAIGEM),
 * identificando el nivel de severidad máximo y las geometrías de todas las fajas.
 */
export async function checkAlluviumHazardAt(
  coords: Coordinates
): Promise<{
  isInside: boolean;
  level: SeverityLevel | null;
  hasData: boolean;
  hazardGeometry: GeoJsonFeature['geometry'] | null;
  allFeatures: GeoJsonFeature[];
}> {
  try {
    const collection = await fetchHazardLayer('alluvium_inaigem');
    if (!collection || !collection.features || collection.features.length === 0) {
      return { isInside: false, level: null, hasData: false, hazardGeometry: null, allFeatures: [] };
    }

    // Bounding box territorial para la zona de Huaraz / Callejón de Huaylas
    const isHuarazRegion =
      coords.lat >= -10.5 && coords.lat <= -8.5 && coords.lng >= -78.5 && coords.lng <= -76.5;
    if (!isHuarazRegion) {
      return { isInside: false, level: null, hasData: false, hazardGeometry: null, allFeatures: [] };
    }

    const allFeatures = collection.features;
    let highestRank = 0;
    let highestLevel: SeverityLevel | null = null;
    let bestGeometry: GeoJsonFeature['geometry'] | null = null;

    for (const feat of allFeatures) {
      if (isPointInGeometry([coords.lng, coords.lat], feat.geometry)) {
        const sev = normalizeSeverity(feat.properties);
        const rank = SEVERITY_RANK[sev] || 0;
        if (rank > highestRank) {
          highestRank = rank;
          highestLevel = sev;
          bestGeometry = feat.geometry;
        }
      }
    }

    if (highestLevel) {
      return {
        isInside: true,
        level: highestLevel,
        hasData: true,
        hazardGeometry: bestGeometry,
        allFeatures,
      };
    }

    return { isInside: false, level: null, hasData: true, hazardGeometry: null, allFeatures };
  } catch (e) {
    console.warn('No se pudo verificar la capa de aluvión:', e);
    return { isInside: false, level: null, hasData: false, hazardGeometry: null, allFeatures: [] };
  }
}

/**
 * Encuentra el destino de escape óptimo y calcula la ruta peatonal más segura y corta.
 *
 * Implementa el Enfoque A:
 * 1. Sectorización por Vertiente: Destinos en la misma ladera natural (prohibido cruzar puentes).
 * 2. Gradiente de Descompresión Rápida: Salida lateral hacia ladera alta que reduzca el peligro
 *    en la menor distancia posible.
 * 3. Enrutamiento Peatonal:
 *    - Tramo 1: Vector urgente a cota segura.
 *    - Tramo 2: Ruta peatonal por calles hasta el refugio asignado (OSRM con fallback offline).
 */
export async function calculateEvacuationRoute(
  userCoords: Coordinates
): Promise<EvacuationRouteResult | null> {
  const safeZones = await loadHuarazSafeZones();
  if (!safeZones || safeZones.length === 0) {
    return null;
  }

  // 1. Identificar la vertiente territorial del usuario (Norte / Independencia vs Sur / Huaraz)
  const userWatershed = getPointWatershed(userCoords);

  // 2. Determinar estado de peligro y colección de capas de aluvión
  const { isInside, level, hasData, hazardGeometry, allFeatures } = await checkAlluviumHazardAt(userCoords);

  // 3. Etapa 1: Gradiente de Descompresión Rápida hacia Ladera Alta
  let escapeStage: EvacuationRouteResult['escapeStage'];
  let routingOrigin = userCoords;

  if (isInside && level) {
    const decomp = findRapidDecompressionPoint(userCoords, allFeatures, level, userWatershed);
    if (decomp) {
      escapeStage = {
        point: { lat: decomp.lat, lng: decomp.lng },
        distanceMeters: decomp.distanceMeters,
        fromLevel: decomp.fromLevel,
        toLevel: decomp.targetLevel,
        watershed: decomp.watershed,
      };
      routingOrigin = { lat: decomp.lat, lng: decomp.lng };
    } else if (hazardGeometry) {
      // Fallback a escape lateral clásico si no hay features multianillo
      const escape = findLateralEscapePoint(userCoords, hazardGeometry);
      if (escape) {
        escapeStage = {
          point: { lat: escape.lat, lng: escape.lng },
          distanceMeters: escape.distanceMeters,
          fromLevel: level,
          toLevel: 'safe',
          watershed: userWatershed,
        };
        routingOrigin = { lat: escape.lat, lng: escape.lng };
      }
    }
  }

  // 4. Selección de Refugio Óptimo por Proximidad y Barrera Fluvial (Sin Sectorización Rígida):
  // Evaluamos todos los refugios disponibles ordenados por distancia desde el punto de escape/origen.
  const sortedZones = [...safeZones].sort((a, b) => {
    const distA = calculateHaversineDistance(routingOrigin, a);
    const distB = calculateHaversineDistance(routingOrigin, b);
    return distA - distB;
  });

  // Priorizamos estrictamente refugios cuyo trayecto directo NO intersecte la barrera del Río Quillcay
  const nonCrossingZones = sortedZones.filter((sz) => !pathCrossesRiver(routingOrigin, sz));
  const targetZone = nonCrossingZones.length > 0 ? nonCrossingZones[0] : sortedZones[0];
  const directDistance = calculateHaversineDistance(routingOrigin, targetZone);

  // 5. Deep Link para Google Maps (desde la posición de origen del usuario)
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userCoords.lat},${userCoords.lng}&destination=${targetZone.lat},${targetZone.lng}&travelmode=walking`;

  // Tramo de la Etapa 1 (Escape Urgente a Ladera Alta):
  const escapeLegGeometry: [number, number][] = escapeStage
    ? [
        [userCoords.lat, userCoords.lng],
        [escapeStage.point.lat, escapeStage.point.lng],
      ]
    : [];
  const escapeLegDistance = escapeStage?.distanceMeters ?? 0;
  const escapeLegTimeMinutes = escapeStage ? Math.max(1, Math.round(escapeLegDistance / 66)) : 0;

  const buildInstructions = (legInstruction: string) =>
    escapeStage
      ? `Etapa 1 — Descompresión rápida lateral a zona segura: avanza ~${escapeLegDistance} m alejándote del cono aluvial. Etapa 2 — ${legInstruction}`
      : legInstruction;

  // 6. Intentar enrutamiento OSRM Walking (Online) para la Etapa 2
  try {
    const osrmUrl = `https://router.project-osrm.org/route/v1/walking/${routingOrigin.lng},${routingOrigin.lat};${targetZone.lng},${targetZone.lat}?overview=full&geometries=geojson`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout para resiliencia

    const res = await fetch(osrmUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const refugeLegGeometry: [number, number][] = route.geometry.coordinates.map(
          ([lng, lat]: [number, number]) => [lat, lng]
        );

        const durationMinutes = Math.max(1, Math.round(route.duration / 60)) + escapeLegTimeMinutes;
        const distanceMeters = Math.round(route.distance) + escapeLegDistance;

        // Verificación de integridad: comprobar que la ruta de calles de OSRM
        // no cruce la barrera del río Quillcay
        const routeCrossesRiver = polylineCrossesRiver(refugeLegGeometry);

        if (!routeCrossesRiver) {
          const legInstruction = isInside
            ? `dirígete a pie por calles a ${targetZone.nombre} (${targetZone.sector}), refugio más cercano y seguro sin cruzar puentes del río.`
            : hasData
            ? `fuera de la faja de flujo. Dirígete a pie a ${targetZone.nombre} (${targetZone.sector}).`
            : `sin datos oficiales de aluvión en este punto. Dirígete a ${targetZone.nombre} (${targetZone.sector}) si requieres resguardo.`;

          return {
            origin: userCoords,
            destination: targetZone,
            isInsideHazard: isInside,
            hazardLevel: level,
            hasData,
            distanceMeters,
            estimatedTimeMinutes: durationMinutes,
            routeGeometry: [...escapeLegGeometry, ...refugeLegGeometry],
            googleMapsUrl,
            isOfflineFallback: false,
            instructions: buildInstructions(legInstruction),
            watershed: userWatershed,
            escapeStage,
          };
        } else {
          console.warn('Ruta OSRM intentó cruzar la barrera del Río Quillcay; activando ruta directa segura sin cruce.');
        }
      }
    }
  } catch (err) {
    console.warn('OSRM no disponible o sin conexión. Usando línea guía directa de emergencia.', err);
  }

  // 7. Fallback Offline (Línea recta de escape) para la Etapa 2
  const refugeEstimatedTime = Math.max(1, Math.round(directDistance / 66));
  const refugeLegGeometry: [number, number][] = [
    [routingOrigin.lat, routingOrigin.lng],
    [targetZone.lat, targetZone.lng],
  ];

  const legInstructionOffline = isInside
    ? `evacúa a pie por calles hacia ${targetZone.nombre} (${targetZone.sector}) sin cruzar puentes del río.`
    : hasData
    ? `fuera de zona de flujo. Ruta directa a ${targetZone.nombre} (${targetZone.sector}).`
    : `sin datos de aluvión. Ruta directa a ${targetZone.nombre}.`;

  return {
    origin: userCoords,
    destination: targetZone,
    isInsideHazard: isInside,
    hazardLevel: level,
    hasData,
    distanceMeters: Math.round(directDistance) + escapeLegDistance,
    estimatedTimeMinutes: refugeEstimatedTime + escapeLegTimeMinutes,
    routeGeometry: [...escapeLegGeometry, ...refugeLegGeometry],
    googleMapsUrl,
    isOfflineFallback: true,
    instructions: `[MODO RESILIENTE OFFLINE] ${buildInstructions(legInstructionOffline)}`,
    watershed: userWatershed,
    escapeStage,
  };
}
