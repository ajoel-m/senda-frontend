export interface DisasterRecommendation {
  id: string;
  hazard: 'sismo' | 'aluvion' | 'deslizamiento';
  phase: 'antes' | 'durante' | 'despues';
  category: string;
  title: string;
  shortInstruction: string;
  details: string[];
  prohibitedAction?: string;
  normativeRef: string;
  badgeText?: string;
  iconType: 'shield' | 'alert' | 'home' | 'footsteps' | 'box' | 'water' | 'flame' | 'phone' | 'zap';
}

export const OFFICIAL_RECOMMENDATIONS: DisasterRecommendation[] = [
  // ----------------------------------------------------
  // SISMO: ANTES (PREVENCIÓN Y ESTRUCTURA)
  // ----------------------------------------------------
  {
    id: 'sismo-03-tanques-parapetos',
    hazard: 'sismo',
    phase: 'antes',
    category: 'Prevención en Casa',
    title: 'Asegura tanques de agua y muros de azotea',
    shortInstruction: 'Un tanque de 1000L pesa una tonelada. Debe apoyarse sobre vigas o columnas principales y estar amarrado con abrazaderas metálicas.',
    details: [
      'Los parapetos de azotea deben amarrarse con columnetas de concreto cada 2 metros para que no caigan hacia la calle.',
      'Evita colocar piscinas portátiles o acumular desmonte en el techo.',
      'No piques columnas ni muros de carga para pasar tuberías de desagüe de 4 pulgadas.'
    ],
    prohibitedAction: 'No coloques tanques sobre tabiques delgados ni dejes parapetos sueltos sin columnetas.',
    normativeRef: 'RNE E.070 Albañilería (Art. 29)',
    badgeText: 'Estructura',
    iconType: 'home'
  },
  {
    id: 'sismo-04-pandereta-alerta',
    hazard: 'sismo',
    phase: 'antes',
    category: 'Viviendas de Ladrillo',
    title: 'Alerta con ladrillo pandereta en muros de carga',
    shortInstruction: 'El ladrillo tubular (con huecos a los costados) no soporta peso en sismos. Si tu casa tiene varios pisos con este ladrillo, no construyas pisos adicionales.',
    details: [
      'La norma RNE E.070 prohíbe el ladrillo pandereta para muros portantes en Lima y la sierra sísmica.',
      'Ante un terremoto, estos muros sufren roturas violentas en "X".',
      'Requiere evaluación por un ingeniero civil colegiado para colocar refuerzos de malla o columnas de soporte.'
    ],
    prohibitedAction: 'Prohibido agregar más pisos o abrir vanos de puertas sin diseño estructural.',
    normativeRef: 'RNE E.070 (Art. 5.3 Tabla 2)',
    badgeText: 'Infracción Frecuente',
    iconType: 'alert'
  },
  {
    id: 'sismo-05-adobe-un-piso',
    hazard: 'sismo',
    phase: 'antes',
    category: 'Viviendas de Adobe',
    title: 'Prohibido construir segundo piso en casas de adobe',
    shortInstruction: 'En zonas sísmicas como Huaraz, las viviendas de adobe o tapial deben ser de un solo piso por mandato del Reglamento Nacional de Edificaciones.',
    details: [
      'Un segundo piso de tierra añade un peso excesivo que provoca el derrumbe de las paredes hacia afuera.',
      'Protege la base de los muros contra la humedad con sobrecimientos de concreto de al menos 20 cm sobre el suelo.',
      'Los aleros de techo deben ser amplios (mínimo 50 a 80 cm) para evitar que la lluvia deshaga el barro.'
    ],
    prohibitedAction: 'No levantes segundos pisos con adobe ni coloques losas pesadas de concreto sobre muros de tierra.',
    normativeRef: 'RNE E.080 Diseño con Tierra Reforzada (D.S. N° 011-2017)',
    badgeText: 'Norma E.080',
    iconType: 'home'
  },
  {
    id: 'combo-01-mochila-indeci',
    hazard: 'sismo',
    phase: 'antes',
    category: 'Mochila y Reserva',
    title: 'Mochila de Emergencia lista junto a la puerta',
    shortInstruction: 'Equipa una mochila ligera (máximo 8 kg) con agua, botiquín, linterna frontal, silbato sin bolita y abrigo adaptado a tu ciudad.',
    details: [
      'Para Huaraz: incluye mantas térmicas Mylar, gorro de lana, guantes y poncho impermeable contra el frío y la lluvia andina.',
      'Para Lima: protege documentos y alimentos en bolsas herméticas contra la humedad del mar.',
      'Usa silbatos de rescate sin bolita interna (tipo Fox 40), ya que no se traban con lodo, polvo ni congelamiento.'
    ],
    prohibitedAction: 'No cargues mochilas que superen los 8 kg por persona ni uses maletas con ruedas difíciles de maniobrar.',
    normativeRef: 'Directiva INDECI (Plan Familiar de Emergencia)',
    badgeText: 'Primeras 24h',
    iconType: 'box'
  },

  // ----------------------------------------------------
  // SISMO: DURANTE (PRIMEROS SEGUNDOS)
  // ----------------------------------------------------
  {
    id: 'sismo-01-no-escaleras',
    hazard: 'sismo',
    phase: 'durante',
    category: 'Primeros 20 Segundos',
    title: 'No bajes por las escaleras durante el sismo',
    shortInstruction: 'Si estás en un segundo piso o superior, quédate dentro y replígate en la Zona de Seguridad Interna. No uses escaleras mientras el piso se mueva.',
    details: [
      'Las escaleras actúan como bielas rígidas que concentran la fuerza del sismo, pudiendo fisurarse o desprenderse.',
      'La fuerte sacudida hace perder el equilibrio y causa caídas graves.',
      'Solo evacúa hacia la calle si estás en el primer piso con salida directa y despejada en menos de 5 segundos.'
    ],
    prohibitedAction: 'Prohibido correr por escaleras o intentar usar ascensores durante la sacudida sísmica.',
    normativeRef: 'INDECI / CISMID (Lineamientos Oficiales de Autoprotección)',
    badgeText: 'Regla Vital',
    iconType: 'alert'
  },
  {
    id: 'sismo-02-zona-segura-interna',
    hazard: 'sismo',
    phase: 'durante',
    category: 'Primeros 20 Segundos',
    title: 'Ubícate junto a columnas o muros portantes',
    shortInstruction: 'Adopta la posición de autoprotección: agáchate, cúbrete y sujétate al lado de una columna de concreto o bajo una mesa de madera maciza.',
    details: [
      'Aléjate de ventanas, espejos y muebles altos que puedan volcarse.',
      'El mito del "triángulo de la vida" no aplica a nuestras casas; colócate junto a elementos estructurales de concreto o muros trabados.',
      'Los marcos de puertas modernas no protegen si no tienen dinteles estructurales.'
    ],
    prohibitedAction: 'No te coloques bajo marcos de puertas livianas ni al costado de muebles pesados que puedan volcar.',
    normativeRef: 'RNE E.030 / INDECI (Protocolo Agacharse, Cubrirse y Sujetarse)',
    badgeText: 'Zona Segura',
    iconType: 'shield'
  },

  // ----------------------------------------------------
  // SISMO: DESPUÉS (EVACUACIÓN Y REHABILITACIÓN)
  // ----------------------------------------------------
  {
    id: 'post-sismo-01-baja-solo-fin',
    hazard: 'sismo',
    phase: 'despues',
    category: 'Evacuación Post-Sismo',
    title: 'Baja solo al terminar la sacudida',
    shortInstruction: 'Espera a que el suelo deje de moverse por completo. Desciende por escaleras en fila india, tomado del pasamanos y con mochila en ambos hombros.',
    details: [
      'Verifica el descanso de la escalera antes de pisarlo; si observas fisuras pasantes o desprendimiento, replígate de inmediato.',
      'Baja con la espalda rozando la pared de la caja de escaleras para mantener bajo el centro de gravedad.',
      'La mochila debe ir cargada sobre ambos hombros ajustada al pecho para tener ambas manos libres.'
    ],
    prohibitedAction: 'Prohibido correr o bajar gradas durante la sacudida y usar ascensores en cualquier circunstancia.',
    normativeRef: 'R.J. N° 174-2021-INDECI (Plan Familiar) / RNE Norma A.130',
    badgeText: 'Salida Segura',
    iconType: 'footsteps'
  },
  {
    id: 'post-sismo-02-no-reingreso-x',
    hazard: 'sismo',
    phase: 'despues',
    category: 'Triaje Estructural',
    title: 'No reingreses si hay grietas en X',
    shortInstruction: 'Si observas grietas diagonales pasantes en forma de X en paredes, columnas con fierros torcidos o muros inclinados, aléjate y quédate afuera.',
    details: [
      'Las grietas diagonales pasantes mayores a 1 mm cortan el ladrillo y anulan la resistencia ante una réplica inminente.',
      'El concreto desmoronado con varillas de acero expuestas y pandeadas significa que la columna ya no resiste el peso del techo.',
      'La habitabilidad definitiva solo puede ser autorizada por un ingeniero civil colegiado o brigada de Defensa Civil.'
    ],
    prohibitedAction: 'Prohibido ingresar a rescatar pertenencias o dormir en casas con rajaduras profundas en muros o columnas.',
    normativeRef: 'RNE NTE E.030 (Art. 31), NTE E.070 (Art. 29) / CISMID-UNI',
    badgeText: 'Peligro de Colapso',
    iconType: 'alert'
  },
  {
    id: 'post-sismo-03-corte-gas-luz',
    hazard: 'sismo',
    phase: 'despues',
    category: 'Prevención de Incendios',
    title: 'Corta gas y luz al salir',
    shortInstruction: 'Cierra la llave de paso de gas y baja la palanca eléctrica del tablero operando de costado con una sola mano seca.',
    details: [
      'Para gas natural, gira la palanca esférica hasta que quede perpendicular al tubo; para GLP, cierra la perilla del regulador.',
      'Si percibes olor a huevo podrido (gas mercaptano), jamás enciendas luces, fósforos, linternas comunes ni uses el celular dentro.',
      'Abre puertas y ventanas para ventilar y avisa a los Bomberos (116) desde la vía pública.'
    ],
    prohibitedAction: 'Prohibido accionar interruptores eléctricos, linternas domésticas o celulares si hay olor a gas.',
    normativeRef: 'CNE Utilización Secc. 020 / D.S. N° 027-94-EM (OSINERGMIN / CGBVP)',
    badgeText: 'Anti-Incendio',
    iconType: 'flame'
  },
  {
    id: 'post-sismo-04-cierre-agua',
    hazard: 'sismo',
    phase: 'despues',
    category: 'Salud y Agua',
    title: 'Cierra llave general de agua',
    shortInstruction: 'Cierra la llave de paso de agua potable; las tuberías de desagüe rotas en la calle pueden contaminar tu agua limpia por contrasifonaje.',
    details: [
      'La pérdida súbita de presión pública crea vacío que succiona aguas negras hacia la red domiciliaria.',
      'Apaga las bombas eléctricas de cisterna para no bombear agua contaminada a tanques elevados.',
      'Consume exclusivamente el agua embotellada de la mochila o desinféctala (hervir 3 min o 2 gotas de lejía al 5% por litro).'
    ],
    prohibitedAction: 'Prohibido beber agua directa del grifo o encender bombas de cisterna sin previa verificación técnica.',
    normativeRef: 'RNE Norma Técnica I.S.010 (D.S. N° 017-2012-VIVIENDA)',
    badgeText: 'Salud del Agua',
    iconType: 'water'
  },
  {
    id: 'post-sismo-05-linea-119',
    hazard: 'sismo',
    phase: 'despues',
    category: 'Comunicaciones',
    title: 'Comunícate marcando directo al 119',
    shortInstruction: 'Marca en un solo bloque continuo: 119 + 1 + celular para grabar tu estado en 15 segundos. Infórmate solo por Radio Nacional 103.9 FM.',
    details: [
      'Tus familiares marcan 119 + 2 + tu celular para escuchar tu mensaje de voz sin saturar la red celular.',
      'En Huaraz y Áncash con fijo: marca 119 + 1 + 43 + número fijo; en Lima: 119 + 1 + 1 + número fijo.',
      'Evita llamadas de voz celulares convencionales y el reenvío de cadenas de WhatsApp sin confirmación oficial.'
    ],
    prohibitedAction: 'Prohibido saturar las redes con llamadas de voz celular o propagar rumores de redes sociales.',
    normativeRef: 'D.S. N° 038-2019-MTC (Servicio 119) / Ley N° 29664 SINAGERD',
    badgeText: 'Red de Emergencia',
    iconType: 'phone'
  },
  {
    id: 'post-sismo-06-deten-descenso-replica',
    hazard: 'sismo',
    phase: 'despues',
    category: 'Conducta en Réplicas',
    title: 'Detén descenso si hay réplica',
    shortInstruction: 'Si una réplica te sorprende en la escalera, frena al instante, pégate a la pared y tómate del pasamanos con dos manos.',
    details: [
      'Está terminantemente prohibido correr por gradas durante el movimiento oscilatorio o trepidatorio.',
      'Pega el torso y la espalda contra el muro estructural rígido de la caja de escaleras para no perder el equilibrio.',
      'Si estás en la vía pública, ponte en cuclillas con la mochila cubriendo nuca y cabeza.'
    ],
    prohibitedAction: 'Prohibido intentar seguir corriendo escaleras abajo durante el sacudimiento de una réplica sísmica.',
    normativeRef: 'INDECI (Doctrina de Autoprotección) / CISMID-UNI',
    badgeText: 'Réplicas',
    iconType: 'alert'
  },
  {
    id: 'post-sismo-07-alejate-doble-muro',
    hazard: 'sismo',
    phase: 'despues',
    category: 'Zona Segura Externa',
    title: 'Aléjate el doble del muro',
    shortInstruction: 'En la calle, mantén una distancia del doble de la altura de cercos y paredes, y vez y media de postes eléctricos.',
    details: [
      'Según el RNE E.070, los cercos y parapetos sufren volteo rígido y proyectan ladrillos hasta a dos veces su altura (2H).',
      'Guarda una distancia mínima de 1.5 veces la altura frente a postes de concreto y cables de media tensión (1.5H).',
      'En edificios con ventanas o muros cortina de vidrio, aléjate al menos una vez la altura del edificio (1.0H).'
    ],
    prohibitedAction: 'Prohibido ubicarse bajo cables de alta tensión, ventanales de vidrio o al pie de muros sin vigas de amarre.',
    normativeRef: 'RNE NTE E.070 (Albañilería - Art. 29) / CNE Suministro',
    badgeText: 'Exclusión 2H',
    iconType: 'shield'
  },

  // ----------------------------------------------------
  // ALUVIÓN: ANTES (PREPARACIÓN)
  // ----------------------------------------------------
  {
    id: 'aluvion-00-conoce-ruta-evac',
    hazard: 'aluvion',
    phase: 'antes',
    category: 'Planificación Huaraz',
    title: 'Identifica tu ruta de escape hacia cotas altas',
    shortInstruction: 'Si resides en la cuenca del Río Quillcay o Río Seco, memoriza el camino a pie hacia Pumacayán, Nicrupampa o Pedregal Alto.',
    details: [
      'El cono aluvial de Huaraz está cartografiado oficialmente por INAIGEM y CENEPRED.',
      'Calcula con tu familia cuánto tiempo les toma llegar caminando a la zona segura más cercana.',
      'Mantén despejados los pasadizos y la puerta principal de tu vivienda en todo momento.'
    ],
    prohibitedAction: 'No planifiques evacuar en automóvil ni asumas que los pisos altos de una casa común resisten un aluvión.',
    normativeRef: 'INAIGEM / CENEPRED (Plan de Contingencia SAT-Palcacocha)',
    badgeText: 'Plan Huaraz',
    iconType: 'footsteps'
  },

  // ----------------------------------------------------
  // ALUVIÓN: DURANTE (ALERTA Y ESCAPE)
  // ----------------------------------------------------
  {
    id: 'aluvion-01-evac-horizontal',
    hazard: 'aluvion',
    phase: 'durante',
    category: 'Alerta y Escape',
    title: 'Evacúa a pie y hacia zonas altas de inmediato',
    shortInstruction: 'Si suenan las sirenas del SAT por desborde en Palcacocha, tienes de 15 a 40 minutos. Evacúa caminando en dirección perpendicular al río Quillcay.',
    details: [
      'Dirígete a las cotas seguras oficiales: Pumacayán, Soledad Alta, Pedregal (en Huaraz) o Nicrupampa y Shancayán (en Independencia).',
      'PROHIBIDO usar automóvil o mototaxi: las avenidas se congestionan en minutos y quedarías atrapado en el cono de impacto.',
      'No pierdas tiempo recogiendo artefactos ni muebles pesados; toma tu mochila de emergencia y sal.'
    ],
    prohibitedAction: 'Prohibido evacuar en autos o motos y perder tiempo recogiendo electrodomésticos o muebles.',
    normativeRef: 'CENEPRED / INAIGEM (Protocolo SAT-Palcacocha)',
    badgeText: 'Solo Huaraz',
    iconType: 'footsteps'
  },
  {
    id: 'aluvion-02-no-sotanos-puentes',
    hazard: 'aluvion',
    phase: 'durante',
    category: 'Zonas Mortales',
    title: 'Nunca te refugies en sótanos ni cruces puentes',
    shortInstruction: 'El aluvión arrastra rocas gigantescas y lodo espeso que colapsan puentes y llenan sótanos en pocos segundos.',
    details: [
      'Los sótanos y cocheras subterráneas se convierten en trampas de agua y lodo sin salida.',
      'Los puentes (como Centenario o Quillcay) actúan como represas temporales que desbordan con violencia.',
      'La evacuación vertical en casas comunes no es segura frente al impacto de detritos sobre las columnas.'
    ],
    prohibitedAction: 'Prohibido pararse en puentes a observar el río o bajar a sótanos o cocheras subterráneas.',
    normativeRef: 'INAIGEM / CENEPRED (Evaluación de Riesgo Huaraz 2020)',
    badgeText: 'Peligro Mortal',
    iconType: 'water'
  },

  // ----------------------------------------------------
  // ALUVIÓN: DESPUÉS (REFUGIO Y SEGURIDAD)
  // ----------------------------------------------------
  {
    id: 'post-aluvion-01-refugio-72h',
    hazard: 'aluvion',
    phase: 'despues',
    category: 'Zona de Refugio',
    title: 'Permanece en refugio de altura 72 horas',
    shortInstruction: 'Quédate en cotas altas (Pumacayán, Nicrupampa, Pedregal); vienen olas secundarias de lodo y rocas por el represamiento de puentes.',
    details: [
      'Los desbordes glaciares generan múltiples pulsos en las horas posteriores por la rotura paulatina de diques naturales.',
      'No desciendas al lecho del río ni intentes volver a tu casa hasta la autorización formal del COER Áncash o Defensa Civil.',
      'Mantén contacto con los brigadistas en el refugio para el empadronamiento y entrega de ayuda humanitaria.'
    ],
    prohibitedAction: 'Prohibido descender a la zona de impacto o al cauce del río antes de las 72 horas o sin orden oficial.',
    normativeRef: 'INAIGEM (Modelamiento Numérico Quillcay) / CENEPRED',
    badgeText: 'Olas Secundarias',
    iconType: 'shield'
  },
  {
    id: 'post-aluvion-02-no-fango',
    hazard: 'aluvion',
    phase: 'despues',
    category: 'Peligros Ocultos',
    title: 'No camines sobre el fango acumulado',
    shortInstruction: 'El lodo aluvial espeso oculta cables de media tensión electrificados y socavones con riesgo inminente de atrapamiento.',
    details: [
      'El fango actúa como arenas movedizas: tiene consistencia plástica densa que atrapa a personas y vehículos.',
      'Los postes derribados dejan cables eléctricos sumergidos que energizan el lodo húmedo con alto voltaje.',
      'Espera que las cuadrillas de auxilio y de Hidrandina certifiquen la desenergización total del sector.'
    ],
    prohibitedAction: 'Prohibido pisar o atravesar calles anegadas de lodo fresco sin presencia de rescatistas autorizados.',
    normativeRef: 'CNE Utilización / Directivas Hidrandina y CGBVP',
    badgeText: 'Riesgo Eléctrico',
    iconType: 'zap'
  },
  {
    id: 'post-aluvion-03-cimientos-descalzados',
    hazard: 'aluvion',
    phase: 'despues',
    category: 'Evaluación de Vivienda',
    title: 'Casa descalzada queda clausurada',
    shortInstruction: 'Si el agua lavó la tierra debajo de tus cimientos o tu casa de adobe se mojó en la base, evacúa y no vuelvas a ingresar.',
    details: [
      'El arrastre de suelo deja los cimientos suspendidos en el aire, perdiendo su soporte portante según RNE E.050.',
      'En casas de adobe o tapial, el agua disuelve la cohesión del barro; la pared puede colapsar repentinamente al secarse.',
      'Exige peritaje de un ingeniero civil antes de emprender tareas de limpieza o retiro de escombros.'
    ],
    prohibitedAction: 'Prohibido pernoctar en viviendas de adobe inundadas o con cimientos de concreto en el aire.',
    normativeRef: 'RNE NTE E.050 (Suelos) / NTE E.080 (Adobe)',
    badgeText: 'Socavación',
    iconType: 'home'
  },

  // ----------------------------------------------------
  // DESLIZAMIENTOS Y LADERAS: ANTES Y DURANTE
  // ----------------------------------------------------
  {
    id: 'deslizamiento-01-drenaje-laderas',
    hazard: 'deslizamiento',
    phase: 'antes',
    category: 'Laderas y Terrenos Húmedos',
    title: 'Controla el agua de lluvia y zanjas en pendientes',
    shortInstruction: 'Si tu casa está en cerro o ladera, construye cunetas impermeables para desviar la lluvia y evita filtraciones de desagüe en el terreno.',
    details: [
      'El agua empozada reblandece el suelo y detona deslizamientos súbitos.',
      'Los muros de contención deben tener tubos de drenaje (barbacanas) cada 2 metros para liberar la presión del agua.',
      'Vigila si aparecen grietas nuevas en el suelo o si las puertas comienzan a atascarse; son signos de movimiento del terreno.'
    ],
    prohibitedAction: 'No viertas aguas servidas hacia el talud ni cortes la falda del cerro sin muro de contención calculado.',
    normativeRef: 'RNE E.050 Suelos y Cimentaciones / CENEPRED',
    badgeText: 'Geotecnia',
    iconType: 'shield'
  },
  {
    id: 'deslizamiento-02-evac-ladera',
    hazard: 'deslizamiento',
    phase: 'durante',
    category: 'Alerta de Derrumbe',
    title: 'Evacúa en sentido lateral si el terreno cede',
    shortInstruction: 'Si escuchas estruendos o ves caída de piedras en el cerro, evacúa de inmediato hacia los costados, nunca hacia abajo en la ruta de caída.',
    details: [
      'Los flujos de lodo y desprendimientos de rocas siguen la línea de máxima pendiente.',
      'Desplázate hacia terreno firme lateral fuera del cono de descarga.',
      'Advierte a los vecinos mediante silbato o alarma comunitaria mientras evacúas.'
    ],
    prohibitedAction: 'No corras en la misma dirección pendiente abajo del deslizamiento ni regreses por pertenencias.',
    normativeRef: 'CENEPRED (Guía de Respuesta ante Movimientos en Masa)',
    badgeText: 'Respuesta Rápida',
    iconType: 'alert'
  },
  {
    id: 'post-deslizamiento-01-no-reingreso',
    hazard: 'deslizamiento',
    phase: 'despues',
    category: 'Inspección de Ladera',
    title: 'No habites viviendas con grietas en el terreno',
    shortInstruction: 'Si el suelo alrededor de tu casa presenta zanjas nuevas o la pared se separó del piso, el talud sigue en movimiento inestable.',
    details: [
      'Las lluvias posteriores pueden acelerar el derrumbe de la ladera inestable.',
      'Requiere evaluación geológica y geotécnica por especialistas de CENEPRED o el municipio.',
      'Permanece en albergues temporales hasta que se emita el informe de estabilidad de taludes.'
    ],
    prohibitedAction: 'Prohibido habitar viviendas ubicadas en laderas activas con grietas de tracción en la corona del talud.',
    normativeRef: 'RNE E.050 (Art. 34 Estabilidad de Taludes) / SIGRID',
    badgeText: 'Ladera Inestable',
    iconType: 'shield'
  }
];
