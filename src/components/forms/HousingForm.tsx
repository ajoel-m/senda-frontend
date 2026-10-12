import React, { useState } from 'react';
import {
  Home,
  Layers,
  Droplets,
  HardHat,
  MapPin,
  Building,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Wrench,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  ShieldCheck,
  Box,
  Mountain,
} from 'lucide-react';
import {
  type QuestionnaireAnswers,
  CITY_PROFILES,
} from '../../lib/riskEngine';
import { MascotGuide } from '../MascotGuide';

interface HousingFormProps {
  answers: QuestionnaireAnswers;
  cityId: string;
  onAnswersChange: (updated: QuestionnaireAnswers) => void;
  onResetAnswers?: () => void;
}

export const HousingForm: React.FC<HousingFormProps> = ({
  answers,
  cityId,
  onAnswersChange,
  onResetAnswers,
}) => {
  const currentCity = CITY_PROFILES[cityId] ?? CITY_PROFILES.huaraz;
  const [currentIdx, setCurrentIdx] = useState<number>(0);

  const updateAnswer = <K extends keyof QuestionnaireAnswers>(
    key: K,
    value: QuestionnaireAnswers[K]
  ) => {
    onAnswersChange({
      ...answers,
      [key]: value,
    });
  };

  // Preguntas parametrizadas para navegación didáctica deslizante
  const questions = [
    {
      id: 'material',
      number: 1,
      title: '¿De qué material están hechas las paredes principales?',
      desc: 'Muros maestros que sostienen el peso de los techos y pisos superiores.',
      icon: <Home className="w-5 h-5 text-sky-600" />,
      isAnswered: Boolean(answers.material),
      options: [
        {
          value: 'adobe',
          title: 'Adobe o tierra cruda',
          desc: 'Bloques de barro secado al sol, tapial, quincha o piedras con barro.',
          badge: 'Muy vulnerable ante sismos',
          badgeType: 'danger',
          icon: <Mountain className="w-5 h-5 text-amber-700 shrink-0" />,
        },
        {
          value: 'pandereta',
          title: 'Ladrillo Pandereta (huecos a los lados)',
          desc: 'Ladrillo tubular ligero. Diseñado para tabiques divisorios, no para cargar peso.',
          badge: 'Peligro si carga peso (falla frágil)',
          badgeType: 'danger',
          icon: <AlertTriangle className="w-5 h-5 text-emergency-600 shrink-0" />,
        },
        {
          value: 'king_kong',
          title: 'Ladrillo King Kong o bloque macizo',
          desc: 'Ladrillo sólido pesado con perforaciones verticales donde penetra el concreto.',
          badge: 'Apto para muros portantes',
          badgeType: 'ok',
          icon: <Layers className="w-5 h-5 text-sky-600 shrink-0" />,
        },
        {
          value: 'concreto',
          title: 'Placas macizas de concreto armado',
          desc: 'Muros vaciados íntegramente con cemento y mallas de varillas de acero.',
          badge: 'Máxima resistencia ante sismos',
          badgeType: 'ok',
          icon: <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />,
        },
      ],
      currentValue: answers.material,
      onSelect: (val: string) => updateAnswer('material', val as QuestionnaireAnswers['material']),
    },
    {
      id: 'confinamiento',
      number: 2,
      title: '¿Cómo están amarradas las paredes a las columnas?',
      desc: 'El confinamiento garantiza que la pared no se vuelque ante sismos moderados a fuertes.',
      icon: <Layers className="w-5 h-5 text-sky-600" />,
      isAnswered: Boolean(answers.confinamiento),
      options: [
        {
          value: 'sin_columnas',
          title: 'Paredes solas sin columnas ni vigas',
          desc: 'Muros largos levantados sin columnas de concreto en las esquinas ni viga solera.',
          badge: 'Peligro extremo de volteo',
          badgeType: 'danger',
          icon: <AlertOctagon className="w-5 h-5 text-emergency-600 shrink-0" />,
        },
        {
          value: 'columna_lisa',
          title: 'Columnas lisas vaciadas primero (sin trabar)',
          desc: 'Se vació la columna lisa y la pared se pegó al lado sin mechas de fierro de amarre.',
          badge: 'Riesgo de desprendimiento',
          badgeType: 'warning',
          icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
        },
        {
          value: 'dentado_sin_viga',
          title: 'Pared dentada pero sin viga solera superior',
          desc: 'Ladrillos trabados a la columna, pero falta la viga continua de concreto en el techo.',
          badge: 'Parcialmente confinado',
          badgeType: 'warning',
          icon: <Box className="w-5 h-5 text-amber-600 shrink-0" />,
        },
        {
          value: 'confinado_total',
          title: 'Confinamiento total: dentado con viga solera',
          desc: 'Muro asentado primero con dientes, y columna vaciada encima con viga de amarre.',
          badge: 'Confinamiento formal RNE E.070',
          badgeType: 'ok',
          icon: <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />,
        },
      ],
      currentValue: answers.confinamiento,
      onSelect: (val: string) => updateAnswer('confinamiento', val as QuestionnaireAnswers['confinamiento']),
    },
    {
      id: 'pisos',
      number: 3,
      title: '¿Cuántos pisos o niveles tiene la vivienda?',
      desc: 'Cada piso adicional multiplica la fuerza del sismo y la sobrecarga sobre los cimientos.',
      icon: <Building className="w-5 h-5 text-sky-600" />,
      isAnswered: Boolean(answers.pisos),
      options: [
        {
          value: '1_piso',
          title: '1 piso construido',
          desc: 'Solo planta baja. Carga de gravedad y torsión mínimas.',
          badge: 'Menor demanda sísmica',
          badgeType: 'ok',
          icon: <Home className="w-5 h-5 text-emerald-600 shrink-0" />,
        },
        {
          value: '2_pisos',
          title: '2 pisos construidos',
          desc: 'Planta baja y un piso superior habitado.',
          badge: 'Límite seguro en albañilería tradicional',
          badgeType: 'ok',
          icon: <Layers className="w-5 h-5 text-sky-600 shrink-0" />,
        },
        {
          value: '3_pisos',
          title: '3 pisos construidos',
          desc: 'Requiere columnas robustas y muros portantes macizos en el primer nivel.',
          badge: 'Demanda estructural intermedia',
          badgeType: 'warning',
          icon: <Building className="w-5 h-5 text-amber-600 shrink-0" />,
        },
        {
          value: '4_o_mas',
          title: '4 a más pisos',
          desc: 'Altamente vulnerable si no fue calculada por un ingeniero estructural.',
          badge: 'Sobrecarga crítica en autoconstrucción',
          badgeType: 'danger',
          icon: <AlertTriangle className="w-5 h-5 text-emergency-600 shrink-0" />,
        },
      ],
      currentValue: answers.pisos,
      onSelect: (val: string) => updateAnswer('pisos', val as QuestionnaireAnswers['pisos']),
    },
    {
      id: 'conservacion',
      number: 4,
      title: '¿Cuál es el estado de los muros y la humedad?',
      desc: 'La humedad debilita el barro del adobe y carcome el cemento de la albañilería.',
      icon: <Droplets className="w-5 h-5 text-sky-600" />,
      isAnswered: Boolean(answers.conservacion),
      options: [
        {
          value: 'muros_secos',
          title: 'Muros completamente secos y sanos',
          desc: 'Paredes pintadas o tarrajeadas sin manchas de humedad, sin desprendimiento ni grietas.',
          badge: 'Conservación óptima',
          badgeType: 'ok',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
        },
        {
          value: 'humedad_estacional',
          title: 'Humedad leve por lluvias o falta de pintura',
          desc: 'Manchas superficiales de agua en época de lluvias sin carcomer el ladrillo o yeso.',
          badge: 'Mantenimiento preventivo requerido',
          badgeType: 'warning',
          icon: <Droplets className="w-5 h-5 text-cyan-600 shrink-0" />,
        },
        {
          value: 'salitre_fisuras',
          title: 'Salitre visible y pintura descascarada',
          desc: 'El salitre asciende desde el piso y disuelve el mortero de cemento o barro.',
          badge: 'Deterioro de capacidad portante',
          badgeType: 'danger',
          icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
        },
        {
          value: 'base_carcomida',
          title: 'Base carcomida o rajaduras diagonales abiertas',
          desc: 'Paredes con orificios en la base por agua estancada o grietas previas sin reparar.',
          badge: 'Severamente debilitado',
          badgeType: 'danger',
          icon: <AlertOctagon className="w-5 h-5 text-emergency-600 shrink-0" />,
        },
      ],
      currentValue: answers.conservacion,
      onSelect: (val: string) => updateAnswer('conservacion', val as QuestionnaireAnswers['conservacion']),
    },
    {
      id: 'asistenciaTecnica',
      number: 5,
      title: '¿Quién dirigió la construcción de la casa?',
      desc: 'El 70% de casas autoconstruidas en el Perú no tuvieron cálculo estructural.',
      icon: <HardHat className="w-5 h-5 text-sky-600" />,
      isAnswered: Boolean(answers.asistenciaTecnica),
      options: [
        {
          value: 'ingeniero',
          title: 'Ingeniero Civil o Arquitecto colegiado',
          desc: 'Se realizaron planos estructurales, estudio de suelos y supervisión en obra.',
          badge: 'Construcción formal garantizada',
          badgeType: 'ok',
          icon: <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />,
        },
        {
          value: 'planos_sin_supervision',
          title: 'Con planos pero construida por maestro sin supervisión',
          desc: 'Había diseño profesional, pero se cambiaron fierros o mezclas durante el vaciado.',
          badge: 'Calidad constructiva media',
          badgeType: 'warning',
          icon: <HardHat className="w-5 h-5 text-amber-600 shrink-0" />,
        },
        {
          value: 'maestro_obra',
          title: 'Maestro de obra con experiencia práctica',
          desc: 'Se construyó según la costumbre del maestro sin memoria de cálculo sísmico.',
          badge: 'Autoconstrucción tradicional empírica',
          badgeType: 'warning',
          icon: <Wrench className="w-5 h-5 text-sky-700 shrink-0" />,
        },
        {
          value: 'sin_asesoria',
          title: 'Familiares o vecinos sin asesoría técnica',
          desc: 'Trabajo comunal o familiar sin planos ni supervisión calificada.',
          badge: 'Alta incertidumbre estructural',
          badgeType: 'danger',
          icon: <HelpCircle className="w-5 h-5 text-emergency-600 shrink-0" />,
        },
      ],
      currentValue: answers.asistenciaTecnica,
      onSelect: (val: string) => updateAnswer('asistenciaTecnica', val as QuestionnaireAnswers['asistenciaTecnica']),
    },
    {
      id: 'sitioGeotecnico',
      number: 6,
      title: `Condición del Suelo (${currentCity.name})`,
      desc: currentCity.siteQuestion.label,
      icon: <Mountain className="w-5 h-5 text-sky-600" />,
      isAnswered: Boolean(answers.sitioGeotecnico),
      options: currentCity.siteQuestion.options.map((opt) => {
        const isDanger = opt.penalty >= 0.10;
        const isWarning = opt.penalty > 0 && opt.penalty < 0.10;
        return {
          value: opt.value ?? 'desconocido',
          title: opt.label,
          desc: currentCity.siteQuestion.helpText,
          badge: isDanger
            ? 'Suelo blando / crítico (+10-12% riesgo)'
            : isWarning
            ? 'Suelo con humedad moderada'
            : 'Terreno firme de referencia',
          badgeType: isDanger ? 'danger' : isWarning ? 'warning' : 'ok',
          icon: isDanger ? (
            <AlertTriangle className="w-5 h-5 text-emergency-600 shrink-0" />
          ) : isWarning ? (
            <Droplets className="w-5 h-5 text-amber-600 shrink-0" />
          ) : (
            <Mountain className="w-5 h-5 text-emerald-600 shrink-0" />
          ),
        };
      }),
      currentValue: answers.sitioGeotecnico,
      onSelect: (val: string) => updateAnswer('sitioGeotecnico', val as QuestionnaireAnswers['sitioGeotecnico']),
    },
  ];

  const currentQ = questions[currentIdx];
  const totalQuestions = questions.length;
  const answeredCount = questions.filter((q) => q.isAnswered).length;

  const handleNext = () => {
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  return (
    <div className="space-y-6 text-ink-primary">
      {/* Indicador Territorial Compacto */}
      <div className="p-3.5 bg-canvas-surface border border-border-subtle rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider font-bold text-ink-muted block">
              Territorio Identificado
            </span>
            <span className="text-sm font-black text-ink-primary">
              {currentCity.name} · Zona {currentCity.seismicZone}g · {currentCity.region.toUpperCase()}
            </span>
          </div>
        </div>

        {onResetAnswers && (
          <button
            type="button"
            onClick={onResetAnswers}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-muted hover:text-emergency-600 transition-colors cursor-pointer self-start sm:self-auto"
            title="Borrar respuestas y comenzar el cuestionario desde cero"
          >
            <RotateCcw size={13} />
            <span>Borrar respuestas del paso 2</span>
          </button>
        )}
      </div>

      {/* Guía Breve de Alertin */}
      <MascotGuide
        compact
        mood="explaining"
        title="Tarjetas didácticas de evaluación"
        text="Avanza deslizando entre las tarjetas. Responde con lo que observas hoy en tu vivienda para obtener un dictamen con rigor de ingeniería."
      />

      {/* ------------------------------------------------------------------
          BARRA DE NAVEGACIÓN DIDÁCTICA <| contenidos [ ] |>
          ------------------------------------------------------------------ */}
      <div className="bg-canvas-surface border border-border-subtle rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between gap-3">
          {/* Botón Anterior <| */}
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIdx === 0}
            className={`p-2 rounded-xl border flex items-center justify-center gap-1 text-xs font-bold transition-all cursor-pointer ${
              currentIdx === 0
                ? 'opacity-40 border-border-subtle text-ink-muted cursor-not-allowed'
                : 'bg-canvas-surface hover:bg-canvas-glacial text-ink-primary border-border-subtle active:scale-95 shadow-2xs'
            }`}
            aria-label="Pregunta anterior"
          >
            <ChevronLeft size={16} />
            <span className="hidden sm:inline">Anterior</span>
          </button>

          {/* Indicador Didáctico de Tarjeta [ Pregunta X de 6 ] */}
          <div className="text-center space-y-0.5">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-sky-700 bg-sky-50 border border-sky-200 px-3 py-1 rounded-full inline-block">
              Pregunta {currentIdx + 1} de {totalQuestions}
            </span>
            <span className="text-[11px] text-ink-muted block">
              {answeredCount} de {totalQuestions} respondidas
            </span>
          </div>

          {/* Botón Siguiente |> */}
          <button
            type="button"
            onClick={handleNext}
            disabled={currentIdx === totalQuestions - 1}
            className={`p-2 rounded-xl border flex items-center justify-center gap-1 text-xs font-bold transition-all cursor-pointer ${
              currentIdx === totalQuestions - 1
                ? 'opacity-40 border-border-subtle text-ink-muted cursor-not-allowed'
                : 'bg-canvas-surface hover:bg-canvas-glacial text-ink-primary border-border-subtle active:scale-95 shadow-2xs'
            }`}
            aria-label="Pregunta siguiente"
          >
            <span className="hidden sm:inline">Siguiente</span>
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Barra Didáctica de 6 Segmentos Clicables */}
        <div className="grid grid-cols-6 gap-1.5 pt-1">
          {questions.map((q, idx) => {
            const isCurrent = idx === currentIdx;
            const isFilled = q.isAnswered;
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => setCurrentIdx(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-sky-600 ring-2 ring-sky-300'
                    : isFilled
                    ? 'bg-emerald-500 hover:bg-emerald-600'
                    : 'bg-canvas-glacial hover:bg-border-subtle'
                }`}
                title={`Ir a pregunta ${idx + 1}`}
              />
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------------
          TARJETA DIDÁCTICA ACTIVA
          ------------------------------------------------------------------ */}
      <div className="bg-canvas-surface border-2 border-sky-600/30 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5 animate-in fade-in slide-in-from-right-2 duration-200">
        {/* Encabezado de la Tarjeta */}
        <div className="flex items-start gap-3 border-b border-border-subtle pb-4">
          <div className="w-10 h-10 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center shrink-0 mt-0.5">
            {currentQ.icon}
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-ink-primary leading-snug">
              {currentQ.number}. {currentQ.title}
            </h3>
            <p className="text-xs text-ink-muted mt-1 leading-relaxed">
              {currentQ.desc}
            </p>
          </div>
        </div>

        {/* Cuadrícula de Alternativas con Íconos y Bold */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {currentQ.options.map((opt) => {
            const isSelected = currentQ.currentValue === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => currentQ.onSelect(opt.value)}
                className={`w-full min-h-[72px] p-4 text-left border-2 rounded-2xl transition-all flex flex-col justify-between cursor-pointer shadow-2xs box-border overflow-hidden group ${
                  isSelected
                    ? 'bg-sky-50/90 border-sky-600 text-ink-primary shadow-xs ring-1 ring-sky-600'
                    : 'bg-canvas-surface border-border-subtle text-ink-primary hover:border-sky-400 hover:bg-sky-50/30'
                }`}
              >
                <div className="flex items-start justify-between gap-3 w-full">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="mt-0.5 shrink-0">
                      {opt.icon}
                    </div>
                    <div>
                      {/* Alternativa con texto directo en BOLD */}
                      <span className={`text-xs sm:text-sm leading-snug break-words block ${
                        isSelected ? 'font-black text-sky-800' : 'font-extrabold text-ink-primary'
                      }`}>
                        {opt.title}
                      </span>
                      <p className="text-[11px] text-ink-muted mt-1 leading-relaxed break-words">
                        {opt.desc}
                      </p>
                    </div>
                  </div>

                  {/* Radio checkmark */}
                  <span
                    className={`w-5 h-5 shrink-0 rounded-full flex items-center justify-center border text-[11px] font-bold mt-0.5 transition-colors ${
                      isSelected
                        ? 'border-sky-600 bg-sky-600 text-white'
                        : 'border-border-subtle bg-canvas-surface text-transparent group-hover:border-sky-400'
                    }`}
                  >
                    {isSelected ? '✓' : ''}
                  </span>
                </div>

                {/* Badge de deficiencia o fortaleza técnica */}
                {opt.badge && (
                  <span
                    className={`mt-3 inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full border max-w-full break-words whitespace-normal text-left ${
                      opt.badgeType === 'danger'
                        ? 'bg-emergency-50 text-emergency-600 border-emergency-200'
                        : opt.badgeType === 'warning'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}
                  >
                    {opt.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Navegación al pie de la tarjeta didáctica */}
        <div className="pt-3 border-t border-border-subtle flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIdx === 0}
            className={`text-xs font-bold inline-flex items-center gap-1 ${
              currentIdx === 0 ? 'text-ink-muted opacity-40 cursor-not-allowed' : 'text-sky-700 hover:underline cursor-pointer'
            }`}
          >
            <ChevronLeft size={14} />
            <span>Pregunta anterior</span>
          </button>

          {currentIdx < totalQuestions - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="py-2 px-4 rounded-xl bg-ink-primary hover:bg-ink-primary/90 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-98"
            >
              <span>Siguiente pregunta</span>
              <ChevronRight size={14} />
            </button>
          ) : (
            <span className="text-xs font-bold text-emerald-700 inline-flex items-center gap-1">
              <CheckCircle2 size={14} />
              <span>Última pregunta completada</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
