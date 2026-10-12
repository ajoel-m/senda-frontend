import {
  calculateVulnerability,
  calculateMultiHazardRisk,
  AHP_WEIGHTS,
  type QuestionnaireAnswers,
} from '../riskEngine.ts';

console.log('=== TEST SUITE: MOTOR DE RIESGO AHP Y DISPARADORES RNE ===\n');

let failedTests = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  PASS: ${message}`);
  } else {
    console.error(`  FAIL: ${message}`);
    failedTests++;
  }
}

// TEST 1: Sum of AHP weights must equal 1.0
{
  const totalWeight =
    AHP_WEIGHTS.material +
    AHP_WEIGHTS.confinamiento +
    AHP_WEIGHTS.alturaPisos +
    AHP_WEIGHTS.conservacion;
  const isCloseToOne = Math.abs(totalWeight - 1.0) < 0.0001;
  assert(isCloseToOne, `Suma de pesos AHP Saaty = ${totalWeight.toFixed(4)} (debe ser 1.0000)`);
}

// TEST 2: Hard Trigger 01 - Adobe >= 2 stories (RNE E.080 Art. 4.2)
{
  const adobe2Floors: QuestionnaireAnswers = {
    material: 'adobe',
    confinamiento: 'confinado_total', // Incluso si estuviera confinado, adobe >= 2 pisos está prohibido
    pisos: '2_pisos',
    conservacion: 'muros_secos',
    asistenciaTecnica: 'ingeniero',
  };

  const result = calculateVulnerability(adobe2Floors, 'huaraz');
  assert(result.normalizedScore === 1.0, 'Adobe 2 pisos debe forzar vulnerabilidad normalizada al 100% (1.0)');
  assert(result.level === 'Muy Alto', 'Adobe 2 pisos debe categorizarse en nivel Muy Alto');
  assert(
    result.hardTriggers.some((t) => t.id === 'TRIGGER-01'),
    'Debe activar explícitamente TRIGGER-01 por infracción a RNE E.080'
  );
}

// TEST 3: Hard Trigger 02 - Ladrillo pandereta en muros portantes >= 2 pisos (RNE E.070 Art. 5.3)
{
  const pandereta3Floors: QuestionnaireAnswers = {
    material: 'pandereta',
    confinamiento: 'confinado_total',
    pisos: '3_pisos',
    conservacion: 'muros_secos',
    asistenciaTecnica: 'maestro_obra',
  };

  const result = calculateVulnerability(pandereta3Floors, 'huaraz');
  assert(
    result.hardTriggers.some((t) => t.id === 'TRIGGER-02'),
    'Pandereta en 3 pisos debe activar TRIGGER-02 por infracción a RNE E.070'
  );
  assert(
    result.level === 'Alto' || result.level === 'Muy Alto',
    `Pandereta multialtura debe penalizarse a nivel Alto o Muy Alto (obtenido: ${result.level})`
  );
}

// TEST 4: Formal concrete house - Engineered (Should be Bajo)
{
  const formalHouse: QuestionnaireAnswers = {
    material: 'concreto',
    confinamiento: 'confinado_total',
    pisos: '1_piso',
    conservacion: 'muros_secos',
    asistenciaTecnica: 'ingeniero',
  };

  const result = calculateVulnerability(formalHouse, 'huaraz');
  assert(result.level === 'Bajo', `Casa formal de concreto debe dar nivel Bajo (obtenido: ${result.level})`);
  assert(result.hardTriggers.length === 0, 'No debe disparar ninguna infracción');
  assert(result.normalizedScore < 0.25, `Score normalizado (${result.normalizedScore}) debe ser < 0.25`);
}

// TEST 5: Multi-hazard risk calculation with GLOF and Seismic hazard
{
  const informalHouse: QuestionnaireAnswers = {
    material: 'adobe',
    confinamiento: 'sin_columnas',
    pisos: '1_piso', // 1 piso no dispara trigger 1
    conservacion: 'base_carcomida',
    asistenciaTecnica: 'sin_asesoria',
    sitioGeotecnico: 'sitio_critico',
  };

  const vuln = calculateVulnerability(informalHouse, 'huaraz');
  assert(vuln.level === 'Muy Alto', 'Adobe informal 1 piso con base carcomida debe dar Muy Alto');

  const multiRisk = calculateMultiHazardRisk(
    vuln,
    { sismo: 0.85, aluvion: 0.90, movimiento_masa: 0.20 },
    'huaraz'
  );

  assert(multiRisk.globalRiskLevel === 'Muy Alto', 'Riesgo multiamenaza debe ser Muy Alto');
  assert(multiRisk.criticalHazard.includes('Aluvión'), 'Amenaza crítica debe ser Aluvión');
  assert(multiRisk.emergencyKit.category === 'Andina', 'Kit debe ser de categoría Andina para Huaraz');
  assert(multiRisk.mitigationRecommendations.length > 0, 'Debe generar recomendaciones de mitigación');
}

console.log(`\n=== RESULTADOS: ${failedTests === 0 ? 'TODOS LOS TESTS PASARON EXITOSAMENTE' : `${failedTests} TESTS FALLARON`} ===`);
if (failedTests > 0) {
  throw new Error(`${failedTests} test(s) failed in riskEngine test suite.`);
}
