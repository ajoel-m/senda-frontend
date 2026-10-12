import {
  calculateVulnerability,
  calculateMultiHazardRisk,
  AHP_WEIGHTS,
  type QuestionnaireAnswers,
  type HazardScores,
} from '../riskEngine.ts';

console.log('=== TEST SUITE RIGUROSA: AUDITORÍA DE MOTOR DE RIESGO Y VALORES NULOS ===\n');

let failedTests = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  PASS: ${message}`);
  } else {
    console.error(`  FAIL: ${message}`);
    failedTests++;
  }
}

// ---------------------------------------------------------------------------
// 1. AUDITORÍA MATEMÁTICA AHP SAATY
// ---------------------------------------------------------------------------
console.log('\n--- 1. Auditoría AHP Saaty ---');
{
  const totalWeight =
    AHP_WEIGHTS.material +
    AHP_WEIGHTS.confinamiento +
    AHP_WEIGHTS.alturaPisos +
    AHP_WEIGHTS.conservacion;
  assert(Math.abs(totalWeight - 1.0) < 0.0001, `Suma de pesos AHP = ${totalWeight.toFixed(4)} (debe ser 1.0000)`);
  assert(Math.abs(AHP_WEIGHTS.material - 0.4729) < 0.0001, 'Peso material = 0.4729 (47.29%)');
  assert(Math.abs(AHP_WEIGHTS.confinamiento - 0.2844) < 0.0001, 'Peso confinamiento = 0.2844 (28.44%)');
  assert(Math.abs(AHP_WEIGHTS.alturaPisos - 0.1699) < 0.0001, 'Peso altura/pisos = 0.1699 (16.99%)');
  assert(Math.abs(AHP_WEIGHTS.conservacion - 0.0729) < 0.0001, 'Peso conservación = 0.0729 (7.29%)');
}

// ---------------------------------------------------------------------------
// 2. AUDITORÍA DE LIMA METROPOLITANA: DESCARTE DE FALSOS POSITIVOS
// ---------------------------------------------------------------------------
console.log('\n--- 2. Auditoría Lima Metropolitana: Ausencia de GLOF y Peligro Nulo ---');
{
  const formalHouseLima: QuestionnaireAnswers = {
    material: 'king_kong',
    confinamiento: 'confinado_total',
    pisos: '2_pisos',
    conservacion: 'muros_secos',
    asistenciaTecnica: 'ingeniero',
    sitioGeotecnico: 'sitio_firme',
  };

  const vuln = calculateVulnerability(formalHouseLima, 'lima');

  // Caso A: Lima en zona plana consolidada (Miraflores, San Isidro, etc.)
  // Aluvión: no aplica a Lima (supportedHazards de Lima es ['sismo', 'movimiento_masa'])
  // Movimiento en masa: 0.0 (fuera de laderas de cerros)
  // Sismo: 0.50 (Zona 4 sísmica base)
  const limaHazards: HazardScores = {
    aluvion: undefined, // no aplicable
    sismo: 0.50,
    movimiento_masa: 0.0, // no expuesto
  };

  const multiRisk = calculateMultiHazardRisk(vuln, limaHazards, 'lima');

  // Verificaciones críticas de Lima
  assert(
    multiRisk.specificRisks.aluvion === undefined,
    'En Lima, la amenaza de Aluvión/GLOF no debe ser evaluada ni listada (no aplicable)'
  );
  assert(
    multiRisk.specificRisks.movimiento_masa?.riskScore === 0.0,
    `Movimiento en masa con P=0.0 debe dar riesgo exacto 0.0% (obtenido: ${multiRisk.specificRisks.movimiento_masa?.riskScore})`
  );
  assert(
    multiRisk.specificRisks.movimiento_masa?.level === 'Sin Afectación',
    `Movimiento en masa fuera de polígono debe reportar nivel 'Sin Afectación' (obtenido: ${multiRisk.specificRisks.movimiento_masa?.level})`
  );
  assert(
    multiRisk.specificRisks.sismo?.status === 'active',
    'Peligro sísmico en Lima debe estar activo'
  );
  assert(
    multiRisk.criticalHazard.includes('Sismo'),
    `Amenaza condicionante en Lima consolidada debe ser Sismo (obtenido: ${multiRisk.criticalHazard})`
  );
}

// ---------------------------------------------------------------------------
// 3. AUDITORÍA DE TRATAMIENTO DE NULOS: "DATOS INSUFICIENTES"
// ---------------------------------------------------------------------------
console.log('\n--- 3. Auditoría de Tratamiento de Valores Nulos (Ausencia de Datos) ---');
{
  const standardHouse: QuestionnaireAnswers = {
    material: 'king_kong',
    confinamiento: 'confinado_total',
    pisos: '2_pisos',
    conservacion: 'muros_secos',
    asistenciaTecnica: 'maestro_obra',
  };
  const vuln = calculateVulnerability(standardHouse, 'huaraz');

  // Simulación: Falla de red o cuadrante sin estudio cartográfico oficial (null)
  const hazardsWithNull: HazardScores = {
    sismo: 0.50,
    aluvion: null, // Sin datos cartográficos
    movimiento_masa: 0.0, // Sin peligro
  };

  const result = calculateMultiHazardRisk(vuln, hazardsWithNull, 'huaraz');

  assert(
    result.specificRisks.aluvion?.status === 'insufficient_data',
    `Amenaza con score null debe reportar status 'insufficient_data' (obtenido: ${result.specificRisks.aluvion?.status})`
  );
  assert(
    result.specificRisks.aluvion?.level === 'Datos Insuficientes',
    `Nivel reportado debe ser 'Datos Insuficientes' (obtenido: ${result.specificRisks.aluvion?.level})`
  );
  assert(
    result.specificRisks.aluvion?.riskScore === null,
    'El score de riesgo de aluvión no debe ser inventado, debe ser null'
  );
  assert(
    !result.criticalHazard.includes('Aluvión'),
    'La amenaza crítica no puede ser una amenaza sin datos suficientes'
  );
}

// ---------------------------------------------------------------------------
// 4. AUDITORÍA CIENTÍFICA DE HARD TRIGGERS (NO SESGADOS)
// ---------------------------------------------------------------------------
console.log('\n--- 4. Calibración Científica de Hard Triggers ---');
{
  // 4.1 Adobe de 1 piso (debe ser legal bajo E.080 si tiene buen amarre)
  const adobe1Piso: QuestionnaireAnswers = {
    material: 'adobe',
    confinamiento: 'dentado_sin_viga',
    pisos: '1_piso',
    conservacion: 'muros_secos',
    asistenciaTecnica: 'maestro_obra',
  };
  const resAdobe1Piso = calculateVulnerability(adobe1Piso, 'huaraz');
  assert(
    !resAdobe1Piso.hardTriggers.some(t => t.id === 'TRIGGER-01'),
    'Adobe de 1 solo piso NO debe disparar TRIGGER-01 (permitido por E.080)'
  );
  assert(
    resAdobe1Piso.normalizedScore < 1.0,
    `Adobe de 1 piso no debe ser forzado al 100% de vulnerabilidad (obtenido: ${resAdobe1Piso.normalizedScore.toFixed(2)})`
  );

  // 4.2 Adobe de 2 pisos (Infracción E.080 Art. 4.2 confirmada)
  const adobe2Pisos: QuestionnaireAnswers = {
    ...adobe1Piso,
    pisos: '2_pisos',
  };
  const resAdobe2Pisos = calculateVulnerability(adobe2Pisos, 'huaraz');
  assert(
    resAdobe2Pisos.hardTriggers.some(t => t.id === 'TRIGGER-01'),
    'Adobe de 2 pisos DEBE disparar TRIGGER-01 por infracción taxativa a E.080'
  );
  assert(
    resAdobe2Pisos.normalizedScore === 1.0,
    'Adobe de 2 pisos debe tener vulnerabilidad normalizada al 1.0 (Muy Alto)'
  );

  // 4.3 Pandereta en 1 piso (NO debe activar Hard Trigger, carga axial baja)
  const pandereta1Piso: QuestionnaireAnswers = {
    material: 'pandereta',
    confinamiento: 'confinado_total',
    pisos: '1_piso',
    conservacion: 'muros_secos',
    asistenciaTecnica: 'ingeniero',
  };
  const resPandereta1 = calculateVulnerability(pandereta1Piso, 'lima');
  assert(
    !resPandereta1.hardTriggers.some(t => t.id === 'TRIGGER-02'),
    'Ladrillo pandereta en 1 solo piso NO debe disparar TRIGGER-02 (carga axial moderada)'
  );

  // 4.4 Pandereta en 3 pisos (Infracción E.070 Art. 5.3 confirmada)
  const pandereta3Pisos: QuestionnaireAnswers = {
    ...pandereta1Piso,
    pisos: '3_pisos',
  };
  const resPandereta3 = calculateVulnerability(pandereta3Pisos, 'lima');
  assert(
    resPandereta3.hardTriggers.some(t => t.id === 'TRIGGER-02'),
    'Ladrillo pandereta en 3 pisos DEBE disparar TRIGGER-02'
  );
  assert(
    resPandereta3.level === 'Alto' || resPandereta3.level === 'Muy Alto',
    `Pandereta en 3 pisos debe penalizarse a Alto o Muy Alto (obtenido: ${resPandereta3.level})`
  );
}

// ---------------------------------------------------------------------------
// 5. HUARAZ: VIVIENDA EN CONO SECO FUERA DE LA FAJA DE QUILLCAY
// ---------------------------------------------------------------------------
console.log('\n--- 5. Huaraz: Vivienda en Área No Inundable ---');
{
  const huarazSafeHouse: QuestionnaireAnswers = {
    material: 'king_kong',
    confinamiento: 'confinado_total',
    pisos: '2_pisos',
    conservacion: 'muros_secos',
    asistenciaTecnica: 'ingeniero',
    sitioGeotecnico: 'sitio_firme',
  };
  const vuln = calculateVulnerability(huarazSafeHouse, 'huaraz');

  // Coordenadas fuera de la mancha aluvial del río Quillcay
  const huarazOutsideHazards: HazardScores = {
    sismo: 0.50,
    aluvion: 0.0, // Verificado fuera de faja por polígono INAIGEM
    movimiento_masa: 0.0, // Terreno plano
  };

  const riskResult = calculateMultiHazardRisk(vuln, huarazOutsideHazards, 'huaraz');

  assert(
    riskResult.specificRisks.aluvion?.riskScore === 0.0,
    `Vivienda fuera de faja aluvial en Huaraz debe tener riesgo de aluvión 0.0% (obtenido: ${riskResult.specificRisks.aluvion?.riskScore})`
  );
  assert(
    riskResult.specificRisks.aluvion?.level === 'Sin Afectación',
    `Nivel de aluvión debe ser 'Sin Afectación' (obtenido: ${riskResult.specificRisks.aluvion?.level})`
  );
  assert(
    riskResult.criticalHazard.includes('Sismo'),
    `Amenaza crítica en terreno seco debe ser Sismo (obtenido: ${riskResult.criticalHazard})`
  );
}

console.log(`\n=== RESUMEN AUDITORÍA: ${failedTests === 0 ? 'TODAS LAS PRUEBAS PASARON EXITOSAMENTE (0 ERRORES)' : `${failedTests} PRUEBA(S) FALLARON`} ===`);
if (failedTests > 0) {
  throw new Error(`${failedTests} test(s) failed in audit test suite.`);
}
