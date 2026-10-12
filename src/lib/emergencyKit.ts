/**
 * Estándar Canónico de Mochila para Emergencias y Combo de Supervivencia
 * Basado estrictamente en:
 * - Ley N° 29664 (SINAGERD) y D.S. N° 048-2011-PCM
 * - R.J. N° 063-2011-INDECI (Aprobación del Combo de la Supervivencia)
 * - R.J. N° 174-2021-INDECI (Directiva N° 007-2021-INDECI/10.3)
 * - Plan Familiar de Emergencia "La Seguridad Empieza en Casa" (7ma Edición 2023)
 * - Límite biomecánico máximo para 2 adultos: 8,000 gramos (8.0 kg)
 */

export type ItemCategory =
  | 'agua'
  | 'alimentos'
  | 'botiquin'
  | 'higiene'
  | 'comunicacion'
  | 'herramientas'
  | 'abrigo';

export interface BackpackItem {
  id: string;
  name: string;
  category: ItemCategory;
  quantity: string;
  specification: string;
  weightGrams: number;
  isEssentialTop8: boolean;
  justification: string;
}

export interface RegionalAddon {
  regionId: 'andino' | 'costero' | 'selva';
  regionName: string;
  threatSummary: string;
  items: BackpackItem[];
  totalWeightGrams: number;
}

export interface FamilyGroupAddon {
  groupId: 'lactantes' | 'adultos_mayores' | 'mascotas';
  groupName: string;
  items: Array<{
    name: string;
    description: string;
    phase: 'mochila_24h' | 'caja_reserva_72h';
  }>;
}

// ---------------------------------------------------------------------------
// 1. NÚCLEO NACIONAL INVARIANTE (7,044 g para 2 adultos durante 24 horas)
// ---------------------------------------------------------------------------

export const CORE_NATIONAL_ITEMS: BackpackItem[] = [
  // Agua
  {
    id: 'core_agua',
    name: 'Agua de mesa embotellada',
    category: 'agua',
    quantity: '4 botellas (2.0 L total)',
    specification: 'Envases PET virgen de 500 ml con tapa sellada de fábrica.',
    weightGrams: 2080,
    isEssentialTop8: true,
    justification: 'Balance hídrico crítico (1 L/adulto). Fraccionado para evitar contaminación del stock.',
  },
  // Alimentos
  {
    id: 'core_conserva',
    name: 'Conserva de pescado (atún/caballa)',
    category: 'alimentos',
    quantity: '2 latas (170 g c/u)',
    specification: 'Envase metálico con abre fácil (pull-tab) en agua o aceite.',
    weightGrams: 400,
    isEssentialTop8: true,
    justification: 'Aporte proteico denso (~30 g proteína/lata) sin requerir cocción ni agua.',
  },
  {
    id: 'core_barras',
    name: 'Barras energéticas / de cereal',
    category: 'alimentos',
    quantity: '4 unidades (40 g c/u)',
    specification: 'Carbohidratos complejos y electrolitos en envoltorio termosellado.',
    weightGrams: 160,
    isEssentialTop8: false,
    justification: 'Mantenimiento de la glucemia ante esfuerzo motor continuado.',
  },
  {
    id: 'core_chocolate',
    name: 'Chocolate para consumo directo',
    category: 'alimentos',
    quantity: '2 tabletas (50 g c/u)',
    specification: 'Mínimo 50% cacao, sellado en aluminio estanco.',
    weightGrams: 100,
    isEssentialTop8: false,
    justification: 'Termogénesis rápida y estabilización neuroquímica ante estrés agudo.',
  },
  {
    id: 'core_galletas',
    name: 'Galletas de soda / agua',
    category: 'alimentos',
    quantity: '2 paquetes (80 g c/u)',
    specification: 'Hidratos de carbono de baja osmolaridad en empaque metalizado.',
    weightGrams: 160,
    isEssentialTop8: false,
    justification: 'Mitiga náuseas por estrés postraumático y aporta sodio básico.',
  },
  // Botiquín
  {
    id: 'core_gasas',
    name: 'Gasas hidrófilas estériles',
    category: 'botiquin',
    quantity: '10 sobres (10x10 cm)',
    specification: 'Algodón quirúrgico en empaque individual de papel grado médico.',
    weightGrams: 60,
    isEssentialTop8: false,
    justification: 'Compresión hemostática de heridas por vidrios o mampostería.',
  },
  {
    id: 'core_vendas',
    name: 'Vendas elásticas de crepé',
    category: 'botiquin',
    quantity: '2 rollos de 4" y 2 de 3"',
    specification: 'Algodón y elastano con broches de fijación.',
    weightGrams: 120,
    isEssentialTop8: false,
    justification: 'Inmovilización articular de esguinces y sujeción de apósitos.',
  },
  {
    id: 'core_clorhexidina',
    name: 'Clorhexidina solución al 2%',
    category: 'botiquin',
    quantity: '1 frasco (100 ml)',
    specification: 'Envase plástico irrompible con dosificador en spray/gotero.',
    weightGrams: 115,
    isEssentialTop8: true,
    justification: 'Antiséptico de amplio espectro no citotóxico. No quema tejidos como el alcohol.',
  },
  {
    id: 'core_alcohol',
    name: 'Alcohol medicinal 70°',
    category: 'botiquin',
    quantity: '1 envase (120 ml)',
    specification: 'Frasco PEAD con tapón de seguridad antifuga.',
    weightGrams: 125,
    isEssentialTop8: false,
    justification: 'Desinfección de instrumental y manos intactas (no en lecho de herida abierta).',
  },
  {
    id: 'core_paracetamol',
    name: 'Paracetamol 500 mg (Venta Libre)',
    category: 'botiquin',
    quantity: '1 blíster (10 tabletas)',
    specification: 'Empaque blíster termosellado de aluminio (DIGEMID).',
    weightGrams: 10,
    isEssentialTop8: false,
    justification: 'Analgésico y antipirético de primera línea sin riesgo de sangrado.',
  },
  {
    id: 'core_ibuprofeno',
    name: 'Ibuprofeno 400 mg (Venta Libre)',
    category: 'botiquin',
    quantity: '1 blíster (10 tabletas)',
    specification: 'Empaque blíster termosellado contra humedad (DIGEMID).',
    weightGrams: 12,
    isEssentialTop8: false,
    justification: 'Antiinflamatorio para contusiones musculoesqueléticas agudas.',
  },
  {
    id: 'core_tijera',
    name: 'Tijera de extricación / trauma',
    category: 'botiquin',
    quantity: '1 unidad (15-18 cm)',
    specification: 'Acero inoxidable grado médico, filo aserrado con punta roma.',
    weightGrams: 60,
    isEssentialTop8: false,
    justification: 'Corte veloz de ropa gruesa o calzado para exponer zonas lesionadas.',
  },
  {
    id: 'core_guantes_nitrilo',
    name: 'Guantes de nitrilo descartables',
    category: 'botiquin',
    quantity: '6 pares (M y L)',
    specification: 'Nitrilo sin polvo, alta resistencia a punción.',
    weightGrams: 55,
    isEssentialTop8: false,
    justification: 'Bioseguridad universal frente a sangre y fluidos corporales.',
  },
  {
    id: 'core_termometro',
    name: 'Termómetro digital clínico',
    category: 'botiquin',
    quantity: '1 unidad',
    specification: 'Pantalla LCD con alarma de fiebre y estuche rígido.',
    weightGrams: 35,
    isEssentialTop8: false,
    justification: 'Detección precoz de hipotermia o cuadros febriles agudos.',
  },
  // Comunicación e Iluminación
  {
    id: 'core_radio',
    name: 'Radiorreceptor portátil AM/FM',
    category: 'comunicacion',
    quantity: '1 unidad',
    specification: 'Receptor analógico ultracompacto con antena metálica.',
    weightGrams: 120,
    isEssentialTop8: true,
    justification: 'Único medio para sintonizar alertas oficiales ante caída de telefonía móvil.',
  },
  {
    id: 'core_linterna',
    name: 'Linterna frontal de cabeza LED',
    category: 'comunicacion',
    quantity: '1 unidad',
    specification: 'LED Cree 150-250 lm, modos alto/medio/estroboscópico, banda elástica.',
    weightGrams: 85,
    isEssentialTop8: true,
    justification: 'Iluminación continua manteniendo ambas manos libres durante la marcha nocturna.',
  },
  {
    id: 'core_pilas',
    name: 'Pilas alcalinas de repuesto',
    category: 'comunicacion',
    quantity: '2 juegos (4 AAA y 2 AA)',
    specification: 'Baterías alcalinas selladas en blíster de fábrica.',
    weightGrams: 80,
    isEssentialTop8: false,
    justification: 'Autonomía garantizada de 72 horas para radio y linterna.',
  },
  {
    id: 'core_silbato',
    name: 'Silbato náutico de rescate',
    category: 'comunicacion',
    quantity: '2 unidades',
    specification: 'Silbato sin bola móvil (pealess), plástico ABS, >100 dB.',
    weightGrams: 30,
    isEssentialTop8: false,
    justification: 'Señalización acústica bajo escombros; se escucha sin fatiga respiratoria.',
  },
  {
    id: 'core_libreta',
    name: 'Libreta impermeable y marcador',
    category: 'comunicacion',
    quantity: '1 libreta + 1 plumón',
    specification: 'Papel tratado resistente al agua y marcador indeleble negro.',
    weightGrams: 65,
    isEssentialTop8: false,
    justification: 'Registro de triaje, horas de medicación y mensajes en puntos de escape.',
  },
  // Herramientas y Seguridad
  {
    id: 'core_navaja',
    name: 'Navaja multifunción con bloqueo',
    category: 'herramientas',
    quantity: '1 unidad',
    specification: 'Acero inoxidable: hoja de corte, abrelatas, destornillador y punzón.',
    weightGrams: 170,
    isEssentialTop8: false,
    justification: 'Corte de cuerdas, manipulación mecánica y apertura de suministros.',
  },
  {
    id: 'core_cuerda',
    name: 'Cuerda de polietileno/poliéster',
    category: 'herramientas',
    quantity: '1 tramo (7 m, 6 mm)',
    specification: 'Cuerda trenzada multifilamento, carga de rotura >250 kgf.',
    weightGrams: 140,
    isEssentialTop8: false,
    justification: 'Fijación de cargas, armado de toldos o sujeción en pendientes leves.',
  },
  {
    id: 'core_cinta',
    name: 'Cinta multipropósito (Duct Tape)',
    category: 'herramientas',
    quantity: '1 rollo (10 m)',
    specification: 'Tela laminada con caucho de alta adhesividad (2 pulgadas ancho).',
    weightGrams: 115,
    isEssentialTop8: false,
    justification: 'Reparación de calzado, sellado de micas o fijación de tablillas.',
  },
  {
    id: 'core_guantes_maniobra',
    name: 'Guantes de maniobra / descarne',
    category: 'herramientas',
    quantity: '1 par',
    specification: 'Cuero descarne/carnaza de alta resistencia al corte y abrasión.',
    weightGrams: 160,
    isEssentialTop8: false,
    justification: 'Protección manual contra clavos, fierros retorcidos y concreto rugoso.',
  },
  {
    id: 'core_mascarillas',
    name: 'Mascarillas N95 / KN95',
    category: 'herramientas',
    quantity: '4 unidades',
    specification: 'Mascarilla de 4 pliegues con clip nasal metálico moldeable.',
    weightGrams: 30,
    isEssentialTop8: false,
    justification: 'Filtrado de polvo de demolición de ladrillo/adobe y aerosoles biológicos.',
  },
  {
    id: 'core_dinero',
    name: 'Dinero en efectivo fraccionado',
    category: 'herramientas',
    quantity: 'S/ 100 en monedas y billetes',
    specification: 'Monedas de S/ 1, S/ 2, S/ 5 y billetes de S/ 10 y S/ 20.',
    weightGrams: 70,
    isEssentialTop8: false,
    justification: 'Transacciones inmediatas ante caída de pasarelas digitales, Yape y POS.',
  },
  // Abrigo
  {
    id: 'core_manta_mylar',
    name: 'Mantas térmicas aluminizadas (Mylar)',
    category: 'abrigo',
    quantity: '2 unidades',
    specification: 'Mylar de 12 micras (2.10 x 1.40 m), reflectante infrarrojo.',
    weightGrams: 100,
    isEssentialTop8: true,
    justification: 'Retiene hasta el 90% del calor metabólico. Profilaxis contra shock e hipotermia.',
  },
  {
    id: 'core_manta_polar',
    name: 'Manta polar sintética compacta',
    category: 'abrigo',
    quantity: '1 unidad',
    specification: 'Microfibra polar (1.20 x 1.60 m) comprimida al vacío.',
    weightGrams: 340,
    isEssentialTop8: false,
    justification: 'Aislamiento convectivo para pernocta sobre piso frío.',
  },
  {
    id: 'core_muda_ropa',
    name: 'Mudas de cambio transpirable',
    category: 'abrigo',
    quantity: '2 mudas completas',
    specification: 'Camiseta sintética, ropa interior y calcetines en bolsa Ziploc.',
    weightGrams: 450,
    isEssentialTop8: false,
    justification: 'Reemplazo de ropa mojada por lluvia/sudor, evitando pérdida calórica.',
  },
  // Higiene
  {
    id: 'core_gel',
    name: 'Gel antibacterial antiséptico 70%',
    category: 'higiene',
    quantity: '1 frasco (120 ml)',
    specification: 'Etanol al 70% con dosificador a presión.',
    weightGrams: 130,
    isEssentialTop8: false,
    justification: 'Desinfección de manos ante corte total de agua potable.',
  },
  {
    id: 'core_papel_higienico',
    name: 'Papel higiénico prensado compacto',
    category: 'higiene',
    quantity: '1 rollo sin tubo central',
    specification: 'Empacado herméticamente en bolsa sellada.',
    weightGrams: 110,
    isEssentialTop8: false,
    justification: 'Saneamiento individual para prevenir brotes entéricos en campamentos.',
  },
  {
    id: 'core_toallitas',
    name: 'Toallitas húmedas sin alcohol',
    category: 'higiene',
    quantity: '1 paquete (40-50 unidades)',
    specification: 'Hipoalergénicas con tapa plástica resellable.',
    weightGrams: 190,
    isEssentialTop8: false,
    justification: 'Limpieza mecánica de lodo y polvo de escombros en ausencia de agua.',
  },
];

export const CORE_NATIONAL_WEIGHT_GRAMS = 7044; // ~7.04 kg (Morral vacío incluido)
export const MAX_ALLOWABLE_BACKPACK_WEIGHT_GRAMS = 8000; // 8.0 kg límite INDECI

// ---------------------------------------------------------------------------
// 2. MÓDULOS REGIONALES PERSONALIZADOS
// ---------------------------------------------------------------------------

export const REGIONAL_ADDONS: Record<string, RegionalAddon> = {
  andino: {
    regionId: 'andino',
    regionName: 'Sierra Alta / Huaraz y Valles Interandinos',
    threatSummary: 'Frío extremo nocturno (<0°C), aluvión/GLOF con agua turbia y polvo denso de adobe colapsado.',
    totalWeightGrams: 585,
    items: [
      {
        id: 'reg_and_filtro',
        name: 'Microfiltro mecánico de membrana (0.1 μm)',
        category: 'agua',
        quantity: '1 unidad cilíndrica',
        specification: 'Fibra hueca portátil, retención de turbidez, Giardia y Cryptosporidium.',
        weightGrams: 65,
        isEssentialTop8: true,
        justification: 'Obligatorio en Huaraz: el agua aluvial supera 1,000 NTU e inutiliza el cloro si no se filtra antes.',
      },
      {
        id: 'reg_and_pastillas',
        name: 'Pastillas potabilizadoras NaDCC',
        category: 'agua',
        quantity: '1 blíster (20 tabletas)',
        specification: 'Dicloroisocianurato de Sodio (8.5 mg) para 1 litro c/u.',
        weightGrams: 10,
        isEssentialTop8: false,
        justification: 'Desinfección bactericida de agua filtrada post-aluvión.',
      },
      {
        id: 'reg_and_guantes',
        name: 'Guantes térmicos cortavientos',
        category: 'abrigo',
        quantity: '2 pares',
        specification: 'Microfibra polar gruesa cortavientos.',
        weightGrams: 120,
        isEssentialTop8: true,
        justification: 'Preservan motricidad fina en manos bajo heladas nocturnas andinas.',
      },
      {
        id: 'reg_and_chullo',
        name: 'Gorro de lana / chullo andino',
        category: 'abrigo',
        quantity: '2 unidades',
        specification: 'Tejido denso con cobertura ótica y frontal completa.',
        weightGrams: 90,
        isEssentialTop8: false,
        justification: 'Evita disipación calórica craneal (hasta 30% del calor corporal).',
      },
      {
        id: 'reg_and_gafas',
        name: 'Gafas de policarbonato selladas',
        category: 'herramientas',
        quantity: '2 unidades',
        specification: 'Ventilación indirecta y sello perimetral de silicona.',
        weightGrams: 70,
        isEssentialTop8: false,
        justification: 'Protección ocular ante polvo abrasivo de adobe o ceniza volcánica.',
      },
      {
        id: 'reg_and_linterna_ambar',
        name: 'Linterna estroboscópica con selector ámbar',
        category: 'comunicacion',
        quantity: '1 unidad',
        specification: 'LED táctica de 300 lm con luz ámbar/amarilla.',
        weightGrams: 120,
        isEssentialTop8: false,
        justification: 'La luz ámbar penetra niebla densa de montaña y polvaredas aluviales.',
      },
      {
        id: 'reg_and_poncho',
        name: 'Poncho impermeable de PVC con capucha',
        category: 'abrigo',
        quantity: '2 unidades',
        specification: 'Vinilo grueso termosellado hasta la rodilla.',
        weightGrams: 110,
        isEssentialTop8: false,
        justification: 'Barrera contra lluvia torrencial serrana y viento helado.',
      },
    ],
  },
  costero: {
    regionId: 'costero',
    regionName: 'Costa y Litoral (Lima Metropolitana y Callao)',
    threatSummary: 'Sismo Mw >8.5, tsunami en <20 min, escombros densos de concreto y deshidratación costera.',
    totalWeightGrams: 520,
    items: [
      {
        id: 'reg_cos_silbato',
        name: 'Silbato náutico de grado marino (>115 dB)',
        category: 'comunicacion',
        quantity: '2 unidades',
        specification: 'Silbato pealess para agua salada de penetración sónica extrema.',
        weightGrams: 35,
        isEssentialTop8: true,
        justification: 'Señal acústica para evacuación vertical rápida audible sobre sirenas y maquinaria.',
      },
      {
        id: 'reg_cos_plantillas',
        name: 'Plantillas de protección anticlavo de Kevlar',
        category: 'herramientas',
        quantity: '2 pares adaptables',
        specification: 'Lámina flexible de aramida resistente a perforación.',
        weightGrams: 180,
        isEssentialTop8: true,
        justification: 'Protección de la planta del pie ante vidrios, clavos y fierros en carrera de escape.',
      },
      {
        id: 'reg_cos_hidratacion',
        name: 'Bolsa flexible de hidratación (1.0 L extra)',
        category: 'agua',
        quantity: '1 unidad plegable',
        specification: 'TPU libre de BPA con boquilla sellable, ultra ligera.',
        weightGrams: 65,
        isEssentialTop8: false,
        justification: 'Capacidad hídrica extra sin peso estático para marchas áridas costeras.',
      },
      {
        id: 'reg_cos_sales',
        name: 'Sales electrolíticas solubles',
        category: 'agua',
        quantity: '4 sobres individuales',
        specification: 'Fórmula oral de sodio, potasio y glucosa de rápida absorción.',
        weightGrams: 60,
        isEssentialTop8: false,
        justification: 'Prevención de golpe de calor y calambres durante evacuación a cerros bajo sol costero.',
      },
      {
        id: 'reg_cos_gafas',
        name: 'Gafas de seguridad antiempañe',
        category: 'herramientas',
        quantity: '2 unidades',
        specification: 'Policarbonato óptico claro con revestimiento hidrófobo.',
        weightGrams: 65,
        isEssentialTop8: false,
        justification: 'Protección contra niebla salina y aerosoles cáusticos de cemento pulverizado.',
      },
      {
        id: 'reg_cos_mascarilla',
        name: 'Mascarilla certificada P100 / N95',
        category: 'herramientas',
        quantity: '2 unidades',
        specification: 'Filtro para polvos de demolición de concreto armado y sílice.',
        weightGrams: 45,
        isEssentialTop8: false,
        justification: 'Filtrado de polvo de concreto en microcentros urbanos densos.',
      },
      {
        id: 'reg_cos_baston',
        name: 'Bastón telescópico plegable de marcha',
        category: 'herramientas',
        quantity: '1 unidad',
        specification: 'Aleación duraluminio 7075 con traba rápida.',
        weightGrams: 70,
        isEssentialTop8: false,
        justification: 'Estabilidad al subir taludes, acantilados o escaleras de evacuación vertical.',
      },
    ],
  },
  selva: {
    regionId: 'selva',
    regionName: 'Selva / Amazonía y Zonas Tropicales',
    threatSummary: 'Inundaciones fluviales, lluvias torrenciales, calor húmedo y vectores de Dengue y Malaria.',
    totalWeightGrams: 560,
    items: [
      {
        id: 'reg_sel_repelente',
        name: 'Repelente de insectos DEET 30%',
        category: 'higiene',
        quantity: '1 frasco (150 ml)',
        specification: 'Spray dérmico con DEET al 30% o Icaridina al 20%.',
        weightGrams: 160,
        isEssentialTop8: true,
        justification: 'Barrera química crítica contra Aedes (Dengue) y Anopheles (Malaria) tras inundación.',
      },
      {
        id: 'reg_sel_mosquitero',
        name: 'Mosquitero individual de tul tratado',
        category: 'abrigo',
        quantity: '2 unidades',
        specification: 'Tul fino de poliéster (>156 orificios/pulgada²).',
        weightGrams: 140,
        isEssentialTop8: true,
        justification: 'Aislamiento físico pasivo durante el reposo en refugios abiertos.',
      },
      {
        id: 'reg_sel_drybag',
        name: 'Bolsa seca estanca sumergible (Dry Bag)',
        category: 'herramientas',
        quantity: '1 unidad (10 L)',
        specification: 'PVC reforzado con cierre por enrollamiento (norma IPX6/IPX8).',
        weightGrams: 120,
        isEssentialTop8: false,
        justification: 'Garantiza flotabilidad y estanqueidad total de medicinas y víveres si la mochila cae al río.',
      },
      {
        id: 'reg_sel_sales',
        name: 'Sales de Rehidratación Oral (SRO - OMS)',
        category: 'agua',
        quantity: '4 sobres individuales',
        specification: 'Fórmula de osmolaridad reducida para hidratación rápida.',
        weightGrams: 60,
        isEssentialTop8: false,
        justification: 'Reposición hidroelectrolítica ante sudoración profusa y diarreas en calor húmedo.',
      },
      {
        id: 'reg_sel_poncho',
        name: 'Poncho impermeable de vinilo sellado',
        category: 'abrigo',
        quantity: '2 unidades',
        specification: 'Cobertura completa contra lluvia torrencial amazónica.',
        weightGrams: 80,
        isEssentialTop8: false,
        justification: 'Previene afecciones respiratorias agudas por exposición prolongada al agua.',
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// 3. CAJA DE RESERVA (DÍAS 2 AL 4 / 72 HORAS COMPLEMENTARIAS)
// ---------------------------------------------------------------------------

export const RESERVE_BOX_SPECIFICATION = {
  targetDays: 'Días 2 al 4 (72 horas de sostenimiento domiciliario)',
  storageGuidelines: 'Contenedor rígido hermético (plástico o cartón reforzado) ubicado en lugar fresco, seco y protegido de caídas.',
  waterLiters: '12 a 16 litros (bidones sellados de 4L u 8L, calculados a 2-2.5 L/persona/día)',
  foodExtended: [
    'Latas adicionales de atún, caballa, sardina o pollo (6 a 8 unidades)',
    'Menestras en conserva o pre-cocidas (frijoles, garbanzos)',
    'Arroz, fideos y sopas de cocción rápida (si se cuenta con cocinilla)',
    'Frutos secos (maní, pasas, almendras) y galletas dulces/saladas',
  ],
  logisticsExtended: [
    'Cocinilla portátil de gas para campamento y cartuchos de gas sellados',
    'Olla pequeña de aluminio y utensilios plásticos resistentes',
    'Bidón plegable para acarreo de agua de camión cisterna municipal',
    'Pala plegable de trinchera y plástico de polietileno grueso (toldo)',
  ],
};
