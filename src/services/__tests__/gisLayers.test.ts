import {
  normalizeSeverity,
  SEVERITY_STYLES,
  findIntersectingHazards,
} from '../gisLayers.ts';
import type { GeoJsonCollection, HazardType } from '../gisLayers.ts';

console.log('=== TEST SUITE: SERVICIO GIS Y DETECCIÓN ESPACIAL ===\n');

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  PASS: ${message}`);
  } else {
    console.error(`  FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
}

// Test 1: Normalización de severidad
assert(normalizeSeverity({ n_pel: 'Muy Alto' }) === 'critical', 'Normalización: Muy Alto -> critical');
assert(normalizeSeverity({ nivel: 'Alto' }) === 'high', 'Normalización: Alto -> high');
assert(normalizeSeverity({ id_zona: 'Zona II' }) === 'medium', 'Normalización: Zona II -> medium');
assert(normalizeSeverity({ nivel_peligro: 'low' }) === 'low', 'Normalización: low -> low');
assert(normalizeSeverity({ id_zona: 'Zona IV' }) === 'critical', 'Normalización: Zona IV -> critical');


// Test 2: Paleta sobria no alarmante (Andean Design System)
assert(SEVERITY_STYLES.critical.fill === '#7F1D1D', 'Color crítico es #7F1D1D');
assert(SEVERITY_STYLES.high.fill === '#B34E36', 'Color alto es #B34E36');
assert(SEVERITY_STYLES.medium.fill === '#C89D3C', 'Color medio es #C89D3C');
assert(SEVERITY_STYLES.low.fill === '#3D6D4C', 'Color bajo es #3D6D4C');
console.log('  PASS: Verificación de paleta sobria Luz Andina (no neón)');

// Test 3: Búsqueda espacial punto en polígono con Ray Casting
const mockCollection: GeoJsonCollection = {
  type: 'FeatureCollection',
  threat: 'alluvium_inaigem',
  features: [
    {
      type: 'Feature',
      properties: {
        tipo_amenaza: 'alluvium',
        n_pel: 'Muy Alto',
        nombre_zona: 'Faja Quillcay Central',
        fuente: 'INAIGEM',
        descripcion: 'Desborde crítico directo',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-77.530, -9.530],
            [-77.525, -9.530],
            [-77.525, -9.525],
            [-77.530, -9.525],
            [-77.530, -9.530],
          ],
        ],
      },
      bbox: [-77.530, -9.530, -77.525, -9.525],
    },
  ],
};

const collections: Record<HazardType, GeoJsonCollection | null> = {
  alluvium_inaigem: mockCollection,
  alluvium_cenepred: null,
  landslide: null,
  seismic: null,
  seismic_lima: null,
};

// Punto dentro del polígono
const insideCoords = { lat: -9.528, lng: -77.528 };
const hitsInside = findIntersectingHazards(insideCoords, collections, new Set(['alluvium_inaigem']));
assert(hitsInside.length === 1, 'hitsInside length es 1');
assert(hitsInside[0].severity === 'critical', 'hitsInside severidad es critical');
assert(hitsInside[0].zoneName === 'Faja Quillcay Central', 'hitsInside zoneName coincide');
console.log('  PASS: Punto interior detecta polígono y severidad crítica');

// Punto fuera del polígono
const outsideCoords = { lat: -9.540, lng: -77.540 };
const hitsOutside = findIntersectingHazards(outsideCoords, collections, new Set(['alluvium_inaigem']));
assert(hitsOutside.length === 0, 'hitsOutside retorna 0 afectaciones');
console.log('  PASS: Punto exterior retorna sin afectación');



console.log('\n=== RESULTADOS: TODOS LOS TESTS GIS PASARON EXITOSAMENTE ===\n');
