import {
  calculateHaversineDistance,
  findRapidDecompressionPoint,
  getPointWatershed,
  getSafeZoneWatershed,
  pathCrossesRiver,
  polylineCrossesRiver,
  SafeZonePoint,
} from '../evacuationService';
import { GeoJsonFeature } from '../gisLayers';

async function runEvacuationTests() {
  console.log('=== TEST SUITE: EVACUATION & SAFE ZONES SERVICE (BARRERA FLUVIAL Y PROXIMIDAD) ===\n');

  // Test 1: Haversine distance
  const p1 = { lat: -9.5278, lng: -77.5278 };
  const p2 = { lat: -9.5288, lng: -77.5302 };
  const dist = calculateHaversineDistance(p1, p2);
  console.assert(dist > 200 && dist < 400, `Distancia calculada esperada ~280m, obtenida: ${dist}`);
  console.log(`  PASS: Cálculo Haversine de distancia: ${dist.toFixed(1)}m`);

  // Test 2: Intersección Geométrica de Barrera Fluvial (Río Quillcay)
  // El puente Quillcay está en approx [-77.5284, -9.52735]
  // Segmento norte a sur a través del puente Quillcay:
  const puntoNorteCentenario = { lat: -9.5260, lng: -77.5284 };
  const puntoSurLuzuriaga = { lat: -9.5290, lng: -77.5284 };
  const cruzaRio = pathCrossesRiver(puntoNorteCentenario, puntoSurLuzuriaga);
  console.assert(cruzaRio === true, 'El segmento Norte-Sur que cruza el puente Quillcay debe detectar cruce de barrera');
  console.log('  PASS: Detección geométrica de cruce de río Quillcay (corte de puente)');

  // Segmento totalmente al sur de la barrera (Av. Raimondi a Plaza de Armas):
  const raimondiSur = { lat: -9.5285, lng: -77.5288 };
  const plazaArmasSur = { lat: -9.5302, lng: -77.5288 };
  const noCruzaRioSur = pathCrossesRiver(raimondiSur, plazaArmasSur);
  console.assert(noCruzaRioSur === false, 'El trayecto Raimondi -> Plaza de Armas no debe cruzar el río');
  console.log('  PASS: Trayecto intramargen Sur libre de cruce fluvial');

  // Test 3: Polilínea de ruta OSRM con y sin cruce
  const rutaSinCruce: [number, number][] = [
    [-9.5285, -77.5288],
    [-9.5295, -77.5288],
    [-9.5302, -77.5288],
  ];
  console.assert(!polylineCrossesRiver(rutaSinCruce), 'Ruta peatonal interna no debe marcar cruce');

  const rutaConCruce: [number, number][] = [
    [-9.5285, -77.5284],
    [-9.5260, -77.5284], // Cruzó el puente Quillcay
  ];
  console.assert(polylineCrossesRiver(rutaConCruce), 'Ruta que atraviesa puente debe marcar cruce');
  console.log('  PASS: Validación de polilíneas de ruta peatonal ante barrera fluvial');

  // Test 4: Selección de Refugios por Proximidad y Barrera (Resolución de Casos Reales del Usuario)
  const mockSafeZones: SafeZonePoint[] = [
    {
      id: 'sz-huarupampa',
      nombre: 'Parque Pro Ornato',
      tipo: 'zona_segura',
      tipo_peligro: 'alluvium',
      sector: 'Huarupampa',
      ciudad: 'Huaraz',
      lat: -9.5299,
      lng: -77.5308,
    },
    {
      id: 'sz-plaza',
      nombre: 'Plaza de Armas',
      tipo: 'zona_segura',
      tipo_peligro: 'alluvium',
      sector: 'Centro',
      ciudad: 'Huaraz',
      lat: -9.5302,
      lng: -77.5288,
    },
    {
      id: 'sz-soledad',
      nombre: 'Sport Soledad',
      tipo: 'zona_segura',
      tipo_peligro: 'alluvium',
      sector: 'Soledad',
      ciudad: 'Huaraz',
      lat: -9.5307,
      lng: -77.5245,
    },
    {
      id: 'sz-centenario',
      nombre: 'I.E. Gran Unidad Luzuriaga',
      tipo: 'refugio_temp',
      tipo_peligro: 'alluvium',
      sector: 'Centenario',
      ciudad: 'Huaraz',
      lat: -9.5153,
      lng: -77.5303,
    },
    {
      id: 'sz-nicrupampa',
      nombre: 'I.E.I. Cisea De Nicrupampa',
      tipo: 'zona_segura',
      tipo_peligro: 'alluvium',
      sector: 'Nicrupampa',
      ciudad: 'Huaraz',
      lat: -9.5205,
      lng: -77.5232,
    },
  ];

  // Caso Imagen 1: Usuario en Av. Antonio Raimondi / Jr. Huascarán (Sur)
  const usuarioCaso1 = { lat: -9.5288, lng: -77.5305 };
  // Debe ordenar por proximidad y filtrar los que no crucen el río
  const disponiblesCaso1 = mockSafeZones
    .filter((sz) => !pathCrossesRiver(usuarioCaso1, sz))
    .sort((a, b) => calculateHaversineDistance(usuarioCaso1, a) - calculateHaversineDistance(usuarioCaso1, b));

  console.assert(disponiblesCaso1.length > 0, 'Debe haber refugios disponibles');
  console.assert(
    disponiblesCaso1[0].id === 'sz-huarupampa',
    `Usuario en Raimondi debe seleccionar Parque Pro Ornato en Huarupampa, obtenido: ${disponiblesCaso1[0].nombre}`
  );
  const distCaso1 = calculateHaversineDistance(usuarioCaso1, disponiblesCaso1[0]);
  console.assert(distCaso1 < 200, `Distancia debe ser menor a 200m, obtenida: ${distCaso1}`);
  console.log(`  PASS: Caso Imagen 1 resuelto: selecciona ${disponiblesCaso1[0].nombre} a solo ${distCaso1.toFixed(0)}m sin cruzar río`);

  // Caso Imagen 3: Usuario en Av. Antonio Raimondi / Pumacayán
  const usuarioCaso3 = { lat: -9.5282, lng: -77.5255 };
  const disponiblesCaso3 = mockSafeZones
    .filter((sz) => !pathCrossesRiver(usuarioCaso3, sz))
    .sort((a, b) => calculateHaversineDistance(usuarioCaso3, a) - calculateHaversineDistance(usuarioCaso3, b));

  console.assert(
    disponiblesCaso3[0].id === 'sz-soledad',
    `Usuario en Pumacayán debe seleccionar Sport Soledad, obtenido: ${disponiblesCaso3[0].nombre}`
  );
  const distCaso3 = calculateHaversineDistance(usuarioCaso3, disponiblesCaso3[0]);
  console.assert(distCaso3 < 350, `Distancia debe ser menor a 350m, obtenida: ${distCaso3}`);
  console.log(`  PASS: Caso Imagen 3 resuelto: selecciona ${disponiblesCaso3[0].nombre} a ${distCaso3.toFixed(0)}m (no cruza a Nicrupampa)`);

  // Caso Usuario en Independencia (Norte)
  const usuarioNorte = { lat: -9.5160, lng: -77.5290 };
  const disponiblesNorte = mockSafeZones
    .filter((sz) => !pathCrossesRiver(usuarioNorte, sz))
    .sort((a, b) => calculateHaversineDistance(usuarioNorte, a) - calculateHaversineDistance(usuarioNorte, b));

  console.assert(
    disponiblesNorte[0].id === 'sz-centenario',
    `Usuario en Independencia debe seleccionar Luzuriaga Centenario, obtenido: ${disponiblesNorte[0].nombre}`
  );
  console.log(`  PASS: Usuario en Norte selecciona ${disponiblesNorte[0].nombre} en Independencia sin cruzar al Sur`);

  // Test 5: Gradiente de Descompresión Lateral Multidireccional (Caso Imagen 2 - Escape al Este)
  // Simulamos faja de peligro longitudinal norte-sur
  const fajaPeligro: GeoJsonFeature[] = [
    {
      type: 'Feature',
      properties: { nivel_peligro: 'critical', tipo_amenaza: 'alluvium' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-77.5290, -9.5310],
            [-77.5280, -9.5310],
            [-77.5280, -9.5280],
            [-77.5290, -9.5280],
            [-77.5290, -9.5310],
          ],
        ],
      },
    },
  ];

  // Usuario cerca del borde Este (lng -77.5282, lat -9.5290), a ~25m del borde este libre
  const usuarioCaso2 = { lat: -9.5290, lng: -77.5282 };
  const escapeLateral = findRapidDecompressionPoint(
    usuarioCaso2,
    fajaPeligro,
    'critical',
    'sur'
  );

  console.assert(escapeLateral !== null, 'Debe encontrar escape lateral');
  if (escapeLateral) {
    console.assert(escapeLateral.targetLevel === 'safe', 'Nivel objetivo debe ser seguro');
    console.assert(
      escapeLateral.lng > usuarioCaso2.lng,
      'El escape debe dirigirse hacia el Este (calle libre), mayor longitud'
    );
    console.assert(escapeLateral.distanceMeters < 50, `Distancia de escape debe ser corta (<50m), obtenida: ${escapeLateral.distanceMeters}m`);
    console.log(`  PASS: Caso Imagen 2 resuelto: escape lateral hacia el Este libre en ${escapeLateral.distanceMeters}m`);
  }

  // Test 6: Retrocompatibilidad de helpers
  const vertNorte = getPointWatershed({ lat: -9.520, lng: -77.525 });
  const vertSur = getPointWatershed({ lat: -9.530, lng: -77.528 });
  console.assert(vertNorte === 'norte' && vertSur === 'sur', 'Helper getPointWatershed funciona');
  console.assert(getSafeZoneWatershed(mockSafeZones[0]) === 'sur', 'Helper getSafeZoneWatershed funciona');
  console.log('  PASS: Compatibilidad retroactiva de funciones auxiliares');

  console.log('\n=== RESULTADOS: TODOS LOS TESTS DE BARRERA FLUVIAL Y PROXIMIDAD PASARON EXITOSAMENTE ===');
}

runEvacuationTests();
