export interface Coordinates {
  lat: number;
  lng: number;
  accuracy?: number;
}

export type HazardType =
  | 'alluvium_inaigem'
  | 'alluvium_cenepred'
  | 'landslide'
  | 'seismic'
  | 'seismic_lima';
export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';

export interface HazardLayerConfig {
  id: HazardType;
  title: string;
  source: string;
  description: string;
  filePath: string;
  defaultVisible: boolean;
  isVisualOnly?: boolean;
}

export interface HazardFeatureProperties {
  tipo_amenaza?: string;
  nivel_peligro?: string;
  n_pel?: string;
  nivel?: string;
  id_zona?: string;
  nombre_zona?: string;
  fuente?: string;
  descripcion?: string;
  distrito?: string;
  provincia?: string;
  departamento?: string;
  ubigeo?: string;
  v_pel?: number;
  [key: string]: unknown;
}

export interface GeoJsonFeature {
  type: 'Feature';
  properties: HazardFeatureProperties;
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: any;
  };
  bbox?: [number, number, number, number]; // [minLng, minLat, maxLng, maxLat]
}

export interface GeoJsonCollection {
  type: 'FeatureCollection';
  threat?: HazardType;
  count?: number;
  features: GeoJsonFeature[];
}

export const HAZARD_LAYERS_CONFIG: Record<HazardType, HazardLayerConfig> = {
  alluvium_inaigem: {
    id: 'alluvium_inaigem',
    title: 'Peligro de Aluvión (Huaraz - INAIGEM)',
    source: 'INAIGEM',
    description: 'Zonas del río Quillcay expuestas a desborde de agua o lodo en caso de lluvias extremas o avalanchas.',
    filePath: '/layers/aluvion_inaigem_huaraz.json',
    defaultVisible: true,
    isVisualOnly: false,
  },
  alluvium_cenepred: {
    id: 'alluvium_cenepred',
    title: 'Peligro de Aluvión Referencial (CENEPRED)',
    source: 'CENEPRED',
    description: 'Sectores urbanos con antecedentes históricos de inundación en Huaraz.',
    filePath: '/layers/aluvion_cenepred_huaraz.json',
    defaultVisible: false,
    isVisualOnly: true,
  },
  landslide: {
    id: 'landslide',
    title: 'Deslizamientos y Huaicos',
    source: 'CENEPRED / SIGRID',
    description: 'Laderas y quebradas propensas a caída de piedras, derrumbes o flujos de lodo.',
    filePath: '/layers/deslizamientos_huaraz.json',
    defaultVisible: true,
  },
  seismic: {
    id: 'seismic',
    title: 'Calidad de Suelo y Sismos (Huaraz)',
    source: 'CENEPRED / CISMID',
    description: 'Comportamiento del suelo en Huaraz: identifica terrenos blandos que aumentan el remezón durante un sismo.',
    filePath: '/layers/microzonificacion_huaraz.json',
    defaultVisible: true,
  },
  seismic_lima: {
    id: 'seismic_lima',
    title: 'Calidad de Suelo y Sismos (Lima)',
    source: 'CISMID',
    description: 'Comportamiento del suelo en Lima: detecta arenas y rellenos donde los temblores se sienten con mayor fuerza.',
    filePath: '/layers/microzonificacion_lima.json',
    defaultVisible: true,
  },
};



/**
 * Normaliza cualquier denominación institucional de peligro a los 4 niveles canónicos.
 */
export const normalizeSeverity = (props: HazardFeatureProperties): SeverityLevel => {
  const candidates = [
    props.nivel_peligro,
    props.n_pel,
    props.nivel,
    props.id_zona,
    props.nombre_zona,
  ]
    .filter(Boolean)
    .map((s) => String(s).toLowerCase().trim());

  for (const val of candidates) {
    if (
      val.includes('muy alto') ||
      val.includes('critico') ||
      val.includes('zona v') ||
      val.includes('zona 5') ||
      val.includes('zona iv') ||
      val.includes('zona 4') ||
      val.includes('critical')
    ) {
      return 'critical';
    }
    if (val.includes('alto') || val.includes('zona iii') || val.includes('zona 3') || val.includes('high')) {
      return 'high';
    }
    if (val.includes('medio') || val.includes('zona ii') || val.includes('zona 2') || val.includes('medium')) {
      return 'medium';
    }
    if (val.includes('bajo') || val.includes('zona i') || val.includes('zona 1') || val.includes('low')) {
      return 'low';
    }
  }

  return 'medium';
};

/**
 * Estilos sobrios no alarmantes acordes al Andean Design System
 */
export const SEVERITY_STYLES: Record<
  SeverityLevel,
  {
    fill: string;
    stroke: string;
    fillOpacity: number;
    strokeWidth: number;
    label: string;
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
  }
> = {
  critical: {
    fill: '#7F1D1D',
    stroke: '#5C1414',
    fillOpacity: 0.50,
    strokeWidth: 1.5,
    label: 'Muy Alto / Crítico',
    badgeBg: '#FBEAE8',
    badgeText: '#7F1D1D',
    badgeBorder: '#F5C2BC',
  },
  high: {
    fill: '#B34E36',
    stroke: '#8F3B27',
    fillOpacity: 0.42,
    strokeWidth: 1.2,
    label: 'Alto',
    badgeBg: '#FDF2EE',
    badgeText: '#B34E36',
    badgeBorder: '#F6CFBE',
  },
  medium: {
    fill: '#C89D3C',
    stroke: '#A6802E',
    fillOpacity: 0.38,
    strokeWidth: 1.0,
    label: 'Medio',
    badgeBg: '#FEF7EA',
    badgeText: '#8D6519',
    badgeBorder: '#F7DEAF',
  },
  low: {
    fill: '#3D6D4C',
    stroke: '#2D5239',
    fillOpacity: 0.32,
    strokeWidth: 1.0,
    label: 'Bajo',
    badgeBg: '#EEF6F0',
    badgeText: '#285235',
    badgeBorder: '#BDDECA',
  },
};

// Cache en memoria para evitar descargas duplicadas
const layerCache = new Map<string, GeoJsonCollection>();

function computeBoundingBox(geom: GeoJsonFeature['geometry']): [number, number, number, number] {
  let minLng = Infinity;
  let minLat = Infinity;
  let maxLng = -Infinity;
  let maxLat = -Infinity;

  function traverse(coords: any) {
    if (typeof coords[0] === 'number') {
      const lng = coords[0];
      const lat = coords[1];
      if (lng < minLng) minLng = lng;
      if (lng > maxLng) maxLng = lng;
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
    } else {
      for (const item of coords) {
        traverse(item);
      }
    }
  }

  traverse(geom.coordinates);
  return [minLng, minLat, maxLng, maxLat];
}

/**
 * Carga y cachea la colección GeoJSON de una capa de amenaza.
 */
export const fetchHazardLayer = async (threat: HazardType): Promise<GeoJsonCollection> => {
  const config = HAZARD_LAYERS_CONFIG[threat];
  if (!config) throw new Error(`Unknown threat type: ${threat}`);

  if (layerCache.has(threat)) {
    return layerCache.get(threat)!;
  }

  try {
    const response = await fetch(config.filePath);
    if (!response.ok) {
      throw new Error(`Failed to load ${config.filePath}: HTTP ${response.status}`);
    }
    const collection: GeoJsonCollection = await response.json();

    // Pre-calcular bounding box para búsqueda espacial instantánea
    collection.features.forEach((feature) => {
      feature.bbox = computeBoundingBox(feature.geometry);
    });

    layerCache.set(threat, collection);
    return collection;
  } catch (error) {
    console.error(`Error loading hazard layer [${threat}]:`, error);
    return { type: 'FeatureCollection', threat, features: [] };
  }
};

/**
 * Algoritmo de Ray Casting para detección exacta punto en polígono (2D)
 */
function pointInPolygonRing(point: [number, number], ring: [number, number][]): boolean {
  const x = point[0];
  const y = point[1];
  let inside = false;

  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0];
    const yi = ring[i][1];
    const xj = ring[j][0];
    const yj = ring[j][1];

    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }

  return inside;
}

export function isPointInGeometry(point: [number, number], geom: GeoJsonFeature['geometry']): boolean {
  if (geom.type === 'Polygon') {
    if (!pointInPolygonRing(point, geom.coordinates[0])) return false;
    for (let i = 1; i < geom.coordinates.length; i++) {
      if (pointInPolygonRing(point, geom.coordinates[i])) return false; // punto en orificio interior
    }
    return true;
  } else if (geom.type === 'MultiPolygon') {
    for (const poly of geom.coordinates) {
      if (pointInPolygonRing(point, poly[0])) {
        let insideHole = false;
        for (let i = 1; i < poly.length; i++) {
          if (pointInPolygonRing(point, poly[i])) {
            insideHole = true;
            break;
          }
        }
        if (!insideHole) return true;
      }
    }
  }
  return false;
}

export interface IntersectingHazardResult {
  threat: HazardType;
  severity: SeverityLevel;
  feature: GeoJsonFeature;
  title: string;
  source: string;
  zoneName: string;
  description: string;
}

/**
 * Evalúa si un par de coordenadas (lat, lng) interseca algún polígono de las capas activas.
 */
export const findIntersectingHazards = (
  coords: Coordinates,
  loadedCollections: Record<HazardType, GeoJsonCollection | null>,
  activeThreats: Set<HazardType>
): IntersectingHazardResult[] => {
  const point: [number, number] = [coords.lng, coords.lat];
  const results: IntersectingHazardResult[] = [];

  for (const threat of activeThreats) {
    const config = HAZARD_LAYERS_CONFIG[threat];
    // Excluir capas de contraste visual del cálculo del motor de riesgo (usar solo INAIGEM para aluvión)
    if (config?.isVisualOnly) continue;

    const collection = loadedCollections[threat];
    if (!collection || !collection.features.length) continue;

    for (const feature of collection.features) {
      if (feature.bbox) {
        const [minLng, minLat, maxLng, maxLat] = feature.bbox;
        if (point[0] < minLng || point[0] > maxLng || point[1] < minLat || point[1] > maxLat) {
          continue; // descartar rápidamente por fuera de bounding box
        }
      }

      if (isPointInGeometry(point, feature.geometry)) {
        const severity = normalizeSeverity(feature.properties);
        const config = HAZARD_LAYERS_CONFIG[threat];
        results.push({
          threat,
          severity,
          feature,
          title: config.title,
          source: (feature.properties.fuente as string) || config.source,
          zoneName:
            (feature.properties.nombre_zona as string) ||
            (feature.properties.desc_cober as string) ||
            (feature.properties.localidad as string) ||
            `Zona de peligro ${severity}`,
          description:
            (feature.properties.descripcion as string) ||
            (feature.properties.descripci as string) ||
            config.description,
        });
        break; // un resultado por tipo de amenaza es suficiente
      }
    }
  }

  // Ordenar de mayor a menor severidad
  const severityRank: Record<SeverityLevel, number> = { critical: 4, high: 3, medium: 2, low: 1 };
  results.sort((a, b) => severityRank[b.severity] - severityRank[a.severity]);

  return results;
};
