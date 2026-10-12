/**
 * Motor de Evaluación de Vulnerabilidad Física y Riesgo Multiamenaza
 * Basado en:
 * - Metodología AHP Saaty (CR = 1.91% < 10% validado)
 * - Manual de Evaluación de Riesgos CENEPRED (R.J. N° 112-2014-CENEPRED/J)
 * - Reglamento Nacional de Edificaciones (RNE: E.030, E.070, E.080)
 */

export type RiskLevel = 'Bajo' | 'Medio' | 'Alto' | 'Muy Alto';

export interface HardTriggerViolation {
  id: 'TRIGGER-01' | 'TRIGGER-02' | 'TRIGGER-03' | 'TRIGGER-04';
  title: string;
  normReference: string;
  description: string;
  consequence: string;
}

export interface QuestionnaireAnswers {
  // Q1: Material Estructural Predominante
  material: 'adobe' | 'pandereta' | 'king_kong' | 'concreto';
  // Q2: Confinamiento y Amarre
  confinamiento: 'sin_columnas' | 'columna_lisa' | 'dentado_sin_viga' | 'confinado_total';
  // Q3: Pisos / Altura
  pisos: '1_piso' | '2_pisos' | '3_pisos' | '4_o_mas';
  // Q4: Conservación / Humedad
  conservacion: 'base_carcomida' | 'salitre_fisuras' | 'humedad_estacional' | 'muros_secos';
  // Q5: Asistencia Técnica / Calidad Constructiva
  asistenciaTecnica: 'sin_asesoria' | 'maestro_obra' | 'planos_sin_supervision' | 'ingeniero';
  // Q6 (Opcional según perfil territorial de ciudad)
  sitioGeotecnico?: 'sitio_critico' | 'sitio_intermedio' | 'sitio_firme' | 'desconocido';
}

export interface VulnerabilityBreakdown {
  materialScore: number;
  confinementScore: number;
  heightScore: number;
  conservationScore: number;
  informalityMultiplier: number;
  rawScore: number;
  normalizedScore: number; // 0.0 to 1.0
  level: RiskLevel;
  hardTriggers: HardTriggerViolation[];
}

export type HazardStatus = 'active' | 'no_hazard' | 'insufficient_data' | 'not_applicable';

export interface HazardScores {
  aluvion?: number | null; // number (0.0 to 1.0), null (sin datos suficientes), undefined (no aplica)
  sismo?: number | null;
  movimiento_masa?: number | null;
}

export interface SpecificRisk {
  hazardScore: number | null;
  riskScore: number | null;
  level: RiskLevel | 'Sin Afectación' | 'Datos Insuficientes';
  status: HazardStatus;
  statusMessage?: string;
}

export interface MultiHazardRiskResult {
  vulnerability: VulnerabilityBreakdown;
  cityId: string;
  specificRisks: {
    aluvion?: SpecificRisk;
    sismo?: SpecificRisk;
    movimiento_masa?: SpecificRisk;
  };
  globalRiskScore: number;
  globalRiskLevel: RiskLevel;
  criticalHazard: string;
  emergencyKit: {
    category: 'Andina' | 'Costera' | 'General';
    items: string[];
  };
  mitigationRecommendations: string[];
}

// ---------------------------------------------------------------------------
// CONSTANTES MATEMÁTICAS AHP SAATY (Validadas con CR = 1.91%)
// ---------------------------------------------------------------------------

export const AHP_WEIGHTS = {
  material: 0.4729,
  confinamiento: 0.2844,
  alturaPisos: 0.1699,
  conservacion: 0.0729,
} as const;

export const LOCAL_DESCRIPTORS = {
  muy_alto: 0.5650,
  alto: 0.2622,
  medio: 0.1175,
  bajo: 0.0553,
} as const;

export const INFORMALITY_FACTORS = {
  sin_asesoria: 1.15,
  maestro_obra: 1.08,
  planos_sin_supervision: 1.00,
  ingeniero: 0.85,
} as const;

// ---------------------------------------------------------------------------
// PERFILES TERRITORIALES (Strategy Pattern)
// ---------------------------------------------------------------------------

export interface CityProfile {
  id: string;
  name: string;
  region: 'sierra' | 'costa' | 'selva';
  seismicZone: number; // Factor Z (E.030)
  soilFactorS3: number;
  supportedHazards: Array<'aluvion' | 'sismo' | 'movimiento_masa'>;
  siteQuestion: {
    id: string;
    label: string;
    helpText: string;
    options: Array<{
      value: QuestionnaireAnswers['sitioGeotecnico'];
      label: string;
      penalty: number;
    }>;
  };
  emergencyKit: {
    category: 'Andina' | 'Costera' | 'General';
    items: string[];
  };
}

export const CITY_PROFILES: Record<string, CityProfile> = {
  huaraz: {
    id: 'huaraz',
    name: 'Huaraz (Áncash)',
    region: 'sierra',
    seismicZone: 0.35,
    soilFactorS3: 1.40,
    supportedHazards: ['aluvion', 'sismo', 'movimiento_masa'],
    siteQuestion: {
      id: 'q6_huaraz_napa',
      label: '¿En la excavación de zanjas o en lluvias, brota agua subterránea a poca profundidad?',
      helpText: 'En el cono aluvial de Huaraz, el agua subterránea superficial satura el suelo y reduce su capacidad portante.',
      options: [
        { value: 'sitio_critico', label: 'Sí, a menos de 1 metro ya brota agua (napa muy superficial)', penalty: 0.10 },
        { value: 'sitio_intermedio', label: 'El suelo es húmedo, pero el agua no se empoza', penalty: 0.04 },
        { value: 'sitio_firme', label: 'El terreno es completamente seco y firme (grava densa)', penalty: 0.0 },
        { value: 'desconocido', label: 'No lo sé / No presencié la excavación', penalty: 0.03 },
      ],
    },
    emergencyKit: {
      category: 'Andina',
      items: [
        'Mantas térmicas aluminizadas (protección contra hipotermia)',
        'Pastillas potabilizadoras o cloro para agua turbia aluvial',
        'Linterna estroboscópica con baterías selladas para niebla/polvareda',
        'Silbato de emergencia de rescate y radio a pilas',
        'Botiquín para traumatismos (gasas estériles, vendas elásticas)',
      ],
    },
  },
  lima: {
    id: 'lima',
    name: 'Lima Metropolitana',
    region: 'costa',
    seismicZone: 0.45,
    soilFactorS3: 1.10,
    supportedHazards: ['sismo', 'movimiento_masa'],
    siteQuestion: {
      id: 'q6_lima_suelo',
      label: '¿Tu vivienda está construida sobre arena suelta, pircas en ladera o relleno?',
      helpText: 'En Lima, los sismos amplifican fuertemente su aceleración destructiva en arenas de duna o laderas inestables.',
      options: [
        { value: 'sitio_critico', label: 'Sobre arena suelta de duna, relleno no compactado o pirca en cerro empinado', penalty: 0.12 },
        { value: 'sitio_intermedio', label: 'Ladera moderada con muro de contención', penalty: 0.05 },
        { value: 'sitio_firme', label: 'Terreno plano y suelo consolidado (conglomerado firme)', penalty: 0.0 },
        { value: 'desconocido', label: 'No lo sé con exactitud', penalty: 0.04 },
      ],
    },
    emergencyKit: {
      category: 'Costera',
      items: [
        'Agua embotellada de reserva (mínimo 3 litros por persona)',
        'Radio portátil a dinamo/solar y baterías de repuesto',
        'Silbato de alta frecuencia y linterna LED recargable',
        'Calzado de suela gruesa y guantes de trabajo para escombros',
        'Mascarrillas antipolvo N95 / KN95',
      ],
    },
  },
};

// ---------------------------------------------------------------------------
// EVALUACIÓN DE VULNERABILIDAD FÍSICA
// ---------------------------------------------------------------------------

export function calculateVulnerability(
  answers: QuestionnaireAnswers,
  cityId: string = 'huaraz'
): VulnerabilityBreakdown {
  const hardTriggers: HardTriggerViolation[] = [];

  // Mapeo inicial de descriptores
  let descMaterial = getMaterialDescriptor(answers.material);
  let descConfinamiento = getConfinamientoDescriptor(answers.confinamiento);
  const descAltura = getAlturaDescriptor(answers.pisos, answers.material);
  const descConservacion = getConservacionDescriptor(answers.conservacion);
  const kInf = INFORMALITY_FACTORS[answers.asistenciaTecnica] ?? 1.0;

  // VERIFICACIÓN DE DISPARADORES AUTOMÁTICOS (Hard Triggers RNE)
  
  // TRIGGER-01: Adobe de 2 o más pisos (E.080 Art. 4.2)
  const isAdobeMultiStory =
    answers.material === 'adobe' &&
    (answers.pisos === '2_pisos' || answers.pisos === '3_pisos' || answers.pisos === '4_o_mas');

  if (isAdobeMultiStory) {
    hardTriggers.push({
      id: 'TRIGGER-01',
      title: 'Infracción RNE E.080: Adobe Multipiso en Zona Sísmica',
      normReference: 'Norma Técnica E.080 Diseño y Construcción con Tierra Reforzada, Art. 4.2',
      description: 'La norma prohíbe terminantemente edificaciones de adobe o tapial de 2 o más pisos en Zonas Sísmicas 3 y 4 debido a su incapacidad de soportar fuerzas cortantes en la base.',
      consequence: 'Vulnerabilidad forzada al 100% (Muy Alta). Riesgo inminente de colapso frágil ante sismo severo.',
    });
  }

  // TRIGGER-02: Ladrillo Pandereta en Muros Portantes (E.070 Art. 5.3)
  const isPanderetaBearingWall =
    answers.material === 'pandereta' &&
    (answers.pisos === '2_pisos' || answers.pisos === '3_pisos' || answers.pisos === '4_o_mas');

  if (isPanderetaBearingWall) {
    hardTriggers.push({
      id: 'TRIGGER-02',
      title: 'Infracción RNE E.070: Ladrillo Tubular Pandereta en Muros Portantes',
      normReference: 'Norma Técnica E.070 Albañilería, Art. 5.3 y Art. 2.1',
      description: 'El ladrillo tubular pandereta posee orificios laterales huecos que lo inhabilitan para recibir cargas sísmicas o de gravedad en muros portantes en Zonas 3 y 4.',
      consequence: 'Se anula el crédito de confinamiento y se penaliza la resistencia al corte. Vulnerabilidad mínima forzada en nivel Alto.',
    });
    // Penalización estricta
    descMaterial = Math.max(descMaterial, LOCAL_DESCRIPTORS.muy_alto);
    descConfinamiento = Math.max(descConfinamiento, LOCAL_DESCRIPTORS.alto);
  }

  // Si se activó TRIGGER-01, se anula la ponderación y se impone Vulnerabilidad Máxima
  if (isAdobeMultiStory) {
    return {
      materialScore: LOCAL_DESCRIPTORS.muy_alto,
      confinementScore: descConfinamiento,
      heightScore: LOCAL_DESCRIPTORS.muy_alto,
      conservationScore: descConservacion,
      informalityMultiplier: kInf,
      rawScore: LOCAL_DESCRIPTORS.muy_alto,
      normalizedScore: 1.0,
      level: 'Muy Alto',
      hardTriggers,
    };
  }

  // Cálculo ponderado base AHP Saaty
  const rawScore =
    AHP_WEIGHTS.material * descMaterial +
    AHP_WEIGHTS.confinamiento * descConfinamiento +
    AHP_WEIGHTS.alturaPisos * descAltura +
    AHP_WEIGHTS.conservacion * descConservacion;

  // Ajuste por informalidad constructiva
  let adjustedScore = rawScore * kInf;

  // Penalización por condición de sitio local (Q6)
  const profile = CITY_PROFILES[cityId] ?? CITY_PROFILES.huaraz;
  if (answers.sitioGeotecnico) {
    const opt = profile.siteQuestion.options.find((o) => o.value === answers.sitioGeotecnico);
    if (opt && opt.penalty > 0) {
      adjustedScore += opt.penalty;
    }
  }

  // Normalización a escala CENEPRED [0.0 - 1.0]
  const normalizedScore = Math.min(
    1.0,
    Math.max(0.0, normalizeToCenepredScale(adjustedScore))
  );

  const level = getRiskLevel(normalizedScore);

  return {
    materialScore: descMaterial,
    confinementScore: descConfinamiento,
    heightScore: descAltura,
    conservationScore: descConservacion,
    informalityMultiplier: kInf,
    rawScore: adjustedScore,
    normalizedScore,
    level,
    hardTriggers,
  };
}

// ---------------------------------------------------------------------------
// CÁLCULO INTEGRADO DE RIESGO MULTIAMENAZA (Peligro x Vulnerabilidad)
// ---------------------------------------------------------------------------

export function calculateMultiHazardRisk(
  vulnerability: VulnerabilityBreakdown,
  hazards: HazardScores,
  cityId: string = 'huaraz'
): MultiHazardRiskResult {
  const profile = CITY_PROFILES[cityId] ?? CITY_PROFILES.huaraz;
  const specificRisks: MultiHazardRiskResult['specificRisks'] = {};

  let maxRiskScore = 0;
  let criticalHazard = 'Ninguno';

  // Helper para procesar una amenaza individual
  const processHazard = (
    hazardKey: 'aluvion' | 'sismo' | 'movimiento_masa',
    hazardName: string,
    rawScore: number | null | undefined,
    multiplier: number = 1.0
  ) => {
    // Si la amenaza no es soportada en la geografía de la ciudad, se omite
    if (!profile.supportedHazards.includes(hazardKey)) {
      return;
    }

    // Caso 1: Ausencia de datos cartográficos oficiales / fallo de red
    if (rawScore === null) {
      specificRisks[hazardKey] = {
        hazardScore: null,
        riskScore: null,
        level: 'Datos Insuficientes',
        status: 'insufficient_data',
        statusMessage: 'No hay datos cartográficos oficiales suficientes para este cuadrante.',
      };
      return;
    }

    // Caso 2: No provisto en los argumentos
    if (rawScore === undefined) {
      return;
    }

    // Caso 3: Sin afectación comprobada (fuera de polígono de amenaza)
    if (rawScore <= 0.001) {
      specificRisks[hazardKey] = {
        hazardScore: 0.0,
        riskScore: 0.0,
        level: 'Sin Afectación',
        status: 'no_hazard',
        statusMessage: 'Sin afectación directa registrada según la cartografía oficial.',
      };
      return;
    }

    // Caso 4: Amenaza activa (> 0)
    let effectiveVuln = vulnerability.normalizedScore;
    if (multiplier !== 1.0) {
      effectiveVuln = Math.min(1.0, effectiveVuln * multiplier);
    }
    const rScore = Math.min(1.0, rawScore * effectiveVuln);
    const lvl = getRiskLevel(rScore);

    specificRisks[hazardKey] = {
      hazardScore: rawScore,
      riskScore: rScore,
      level: lvl,
      status: 'active',
    };

    if (rScore > maxRiskScore) {
      maxRiskScore = rScore;
      criticalHazard = hazardName;
    }
  };

  // 1. Sismo
  processHazard('sismo', 'Sismo (RNE E.030)', hazards.sismo);

  // 2. Aluvión / GLOF
  let aluvionMultiplier = 1.0;
  if (
    vulnerability.materialScore === LOCAL_DESCRIPTORS.muy_alto &&
    hazards.aluvion !== null &&
    hazards.aluvion !== undefined &&
    hazards.aluvion > 0.3
  ) {
    aluvionMultiplier = 1.35; // +35% de fragilidad hidrodinámica por erosión hídrica en adobe
  }
  processHazard('aluvion', 'Aluvión / GLOF', hazards.aluvion, aluvionMultiplier);

  // 3. Movimiento en masa
  processHazard('movimiento_masa', 'Movimiento en Masa / Deslizamiento', hazards.movimiento_masa);

  const globalRiskLevel = getRiskLevel(maxRiskScore);
  const recommendations = generateMitigationRecommendations(vulnerability, globalRiskLevel, criticalHazard);

  return {
    vulnerability,
    cityId,
    specificRisks,
    globalRiskScore: maxRiskScore,
    globalRiskLevel,
    criticalHazard,
    emergencyKit: profile.emergencyKit,
    mitigationRecommendations: recommendations,
  };
}

// ---------------------------------------------------------------------------
// HELPERS Y NORMALIZADORES
// ---------------------------------------------------------------------------

function getMaterialDescriptor(material: QuestionnaireAnswers['material']): number {
  switch (material) {
    case 'adobe':
      return LOCAL_DESCRIPTORS.muy_alto;
    case 'pandereta':
      return LOCAL_DESCRIPTORS.alto;
    case 'king_kong':
      return LOCAL_DESCRIPTORS.medio;
    case 'concreto':
      return LOCAL_DESCRIPTORS.bajo;
  }
}

function getConfinamientoDescriptor(confinamiento: QuestionnaireAnswers['confinamiento']): number {
  switch (confinamiento) {
    case 'sin_columnas':
      return LOCAL_DESCRIPTORS.muy_alto;
    case 'columna_lisa':
      return LOCAL_DESCRIPTORS.alto;
    case 'dentado_sin_viga':
      return LOCAL_DESCRIPTORS.medio;
    case 'confinado_total':
      return LOCAL_DESCRIPTORS.bajo;
  }
}

function getAlturaDescriptor(
  pisos: QuestionnaireAnswers['pisos'],
  material: QuestionnaireAnswers['material']
): number {
  if (material === 'adobe' && pisos !== '1_piso') {
    return LOCAL_DESCRIPTORS.muy_alto;
  }
  switch (pisos) {
    case '4_o_mas':
      return LOCAL_DESCRIPTORS.muy_alto;
    case '3_pisos':
      return LOCAL_DESCRIPTORS.alto;
    case '2_pisos':
      return LOCAL_DESCRIPTORS.medio;
    case '1_piso':
      return LOCAL_DESCRIPTORS.bajo;
  }
}

function getConservacionDescriptor(conservacion: QuestionnaireAnswers['conservacion']): number {
  switch (conservacion) {
    case 'base_carcomida':
      return LOCAL_DESCRIPTORS.muy_alto;
    case 'salitre_fisuras':
      return LOCAL_DESCRIPTORS.alto;
    case 'humedad_estacional':
      return LOCAL_DESCRIPTORS.medio;
    case 'muros_secos':
      return LOCAL_DESCRIPTORS.bajo;
  }
}

/**
 * Normaliza el valor crudo AHP (rango base ~0.055 a 0.565 con multiplicadores)
 * a una escala estándar continua [0.0, 1.0] alineada con los 4 niveles de CENEPRED.
 */
function normalizeToCenepredScale(rawScore: number): number {
  // Puntos de corte basados en Saaty:
  // Bajo: < 0.1175
  // Medio: 0.1175 a 0.2622
  // Alto: 0.2622 a 0.4000
  // Muy Alto: >= 0.4000
  if (rawScore < 0.1175) {
    return (rawScore - 0.0553) / (0.1175 - 0.0553) * 0.25;
  } else if (rawScore < 0.2622) {
    return 0.25 + (rawScore - 0.1175) / (0.2622 - 0.1175) * 0.25;
  } else if (rawScore < 0.4000) {
    return 0.50 + (rawScore - 0.2622) / (0.4000 - 0.2622) * 0.25;
  } else {
    return Math.min(1.0, 0.75 + (rawScore - 0.4000) / (0.5650 - 0.4000) * 0.25);
  }
}

export function getRiskLevel(score: number): RiskLevel {
  if (score < 0.25) return 'Bajo';
  if (score < 0.50) return 'Medio';
  if (score < 0.75) return 'Alto';
  return 'Muy Alto';
}

function generateMitigationRecommendations(
  vulnerability: VulnerabilityBreakdown,
  riskLevel: RiskLevel,
  criticalHazard: string
): string[] {
  const recs: string[] = [];

  // Prioridad 1: Hard Triggers
  if (vulnerability.hardTriggers.length > 0) {
    for (const trigger of vulnerability.hardTriggers) {
      if (trigger.id === 'TRIGGER-01') {
        recs.push('URGENTE (RNE E.080): Desocupar o alivianar los pisos superiores de adobe. El segundo piso de tierra no resiste sismos y amenaza con aplastar la planta baja.');
      } else if (trigger.id === 'TRIGGER-02') {
        recs.push('ATENCIÓN ESTRUCTURAL (RNE E.070): Los muros de ladrillo pandereta no son portantes. Se requiere reforzar con columnas adicionales o encamisado antes de agregar más carga.');
      }
    }
  }

  // Recomendaciones por confinamiento
  if (vulnerability.confinementScore >= LOCAL_DESCRIPTORS.alto) {
    recs.push('Confinamiento deficiente: Si las paredes no están encajonadas en columnas dentadas y vigas de amarre, construya contrafuertes o columnas de confinamiento externas.');
  }

  // Recomendaciones por humedad
  if (vulnerability.conservationScore >= LOCAL_DESCRIPTORS.alto) {
    recs.push('Humedad y Salitre: Impermeabilice los sobrecimientos con aditivos hidrófugos y repare fisuras con mortero estructural antes de la temporada de lluvias.');
  }

  // Recomendaciones por amenaza crítica
  if (criticalHazard.includes('Aluvión') && (riskLevel === 'Alto' || riskLevel === 'Muy Alto')) {
    recs.push('Riesgo de Inundación Aluvial (GLOF): Su predio está en la cuenca de desborde del río Quillcay. Tenga identificada la ruta de evacuación hacia zonas altas (por encima del cauce) y no permanezca en sótanos ni primeros pisos ante alarma.');
  }

  if (recs.length === 0) {
    recs.push('Vivienda con buen estándar sismorresistente. Mantenga el mantenimiento periódico de pintura y drenajes pluviales.');
  }

  return recs;
}
