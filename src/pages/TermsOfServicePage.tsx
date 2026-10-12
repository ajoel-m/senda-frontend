import React from 'react';
import { Scale, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';

export const TermsOfServicePage: React.FC = () => {
  return (
    <div className="w-full bg-transparent text-ink-primary py-12 px-4 sm:px-6">
      <main className="max-w-4xl mx-auto space-y-10">
        {/* Cabecera */}
        <div className="border-b border-border-subtle pb-6 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 text-xs font-semibold tracking-wider text-sky-700 uppercase rounded-md">
            <Scale size={14} />
            <span>Condiciones de Uso del Servicio</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-ink-primary">
            Términos y Condiciones de Uso
          </h1>

          <p className="text-sm text-ink-muted">
            Marco regulatorio de acceso y uso de la plataforma cívica <strong>Senda</strong>.
            <span className="block mt-1 font-mono text-xs text-sky-700">
              Última actualización: Septiembre de 2026 · República del Perú
            </span>
          </p>
        </div>

        {/* Advertencia Legal Primaria */}
        <div className="p-6 bg-canvas-surface border-l-4 border-dawn-amber border-t border-r border-b border-border-subtle rounded-r-xl space-y-2 shadow-xs">
          <h2 className="text-base font-bold text-ink-primary flex items-center gap-2">
            <AlertTriangle size={18} className="text-[#B36A16]" />
            <span>Carácter Orientativo y No Vinculante (Aviso Importante)</span>
          </h2>
          <p className="text-sm text-ink-muted leading-relaxed">
            Los resultados, reportes y recomendaciones generados por <strong>Senda</strong> constituyen una herramienta cívica y pedagógica de <strong>diagnóstico preventivo preliminar</strong>. No reemplazan, bajo ninguna circunstancia, un peritaje técnico, estudio de mecánica de suelos o memoria de cálculo estructural suscrita por un Ingeniero Civil colegiado y habilitado conforme al Colegio de Ingenieros del Perú (CIP).
          </p>
        </div>

        {/* Secciones de Términos */}
        <section className="space-y-8 text-sm text-ink-muted leading-relaxed">
          {/* 1. Objeto y Naturaleza */}
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-ink-primary">
              1. Objeto del Servicio
            </h2>
            <p>
              <strong>Senda</strong> es una plataforma cívica de acceso libre y gratuito orientada a la democratización del conocimiento sobre la vulnerabilidad física y el peligro multirriesgo (sismos, aluviones y movimientos en masa) en zonas urbanas del Perú, con enfoque prioritario en Huaraz (Áncash) y Lima Metropolitana.
            </p>
          </div>

          {/* 2. Metodología y Fuentes Científicas */}
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-ink-primary">
              2. Metodología y Respaldo Cartográfico
            </h2>
            <p>
              El motor de cálculo emplea el Proceso de Jerarquía Analítica (AHP de Saaty) ponderando factores de vulnerabilidad física estructural frente a las capas cartográficas oficiales de entidades técnico-científicas del Estado peruano:
            </p>
            <ul className="list-disc pl-5 space-y-1 pt-1">
              <li>
                <strong className="text-ink-primary">CISMID / FIC-UNI:</strong> Mapas de Microzonificación Sísmica y Condiciones Geotécnicas (Norma Técnica E.030 Diseño Sismorresistente).
              </li>
              <li>
                <strong className="text-ink-primary">INAIGEM:</strong> Cartografía de Peligrosidad por Aluvión y Desprendimiento Glaciar en la subcuenca del Río Quillcay.
              </li>
              <li>
                <strong className="text-ink-primary">CENEPRED / SIGRID:</strong> Capas del Sistema de Información para la Gestión del Riesgo de Desastres.
              </li>
              <li>
                <strong className="text-ink-primary">Reglamento Nacional de Edificaciones (RNE):</strong> Normas E.030, E.070 (Albañilería) y E.080 (Diseño y Construcción con Adobe y Tapial).
              </li>
            </ul>
          </div>

          {/* 3. Responsabilidad del Usuario */}
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-ink-primary">
              3. Responsabilidad de la Información Declarada
            </h2>
            <p>
              El usuario es el único responsable de la exactitud de los datos ingresados en el formulario de evaluación (ubicación en el mapa, material estructural predominante, antigüedad de la construcción, estado de conservación y modificaciones sin supervisión técnica). Las discrepancias entre los datos declarados y la condición real de la vivienda alterarán el nivel de riesgo resultante.
            </p>
          </div>

          {/* 4. Autenticación y Cuentas de Usuario */}
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-ink-primary">
              4. Cuentas de Usuario y Acceso mediante Google
            </h2>
            <p>
              Para guardar el historial de evaluaciones y generar reportes oficiales en formato PDF, el usuario puede autenticarse mediante Google OAuth. El usuario es responsable de mantener la confidencialidad de su cuenta y no compartir sus credenciales con terceros no autorizados.
            </p>
          </div>

          {/* 5. Limitación de Responsabilidad */}
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-ink-primary">
              5. Exclusión de Responsabilidad Legal
            </h2>
            <p>
              Ni los autores, desarrolladores, investigadores ni las instituciones citadas asumen responsabilidad civil, penal o administrativa por decisiones de compraventa, arrendamiento, remodelación, demolición, litigios o reclamaciones de seguros basadas exclusivamente en los resultados emitidos por esta plataforma. Para trámites ante municipalidades o licencias de edificación, se debe contratar a profesionales certificados.
            </p>
          </div>

          {/* 6. Gratuidad y Licencia */}
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-ink-primary">
              6. Gratuidad y Uso Cívico
            </h2>
            <p>
              El servicio es <strong>100% gratuito</strong> para todos los ciudadanos. Queda prohibida la reventa de los informes o la explotación comercial de la plataforma sin autorización expresa por escrito de los titulares del proyecto.
            </p>
          </div>

          {/* 7. Modificaciones y Legislación Aplicable */}
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-ink-primary">
              7. Legislación y Fuero
            </h2>
            <p>
              Estos Términos y Condiciones se rigen e interpretan conforme a las leyes vigentes de la República del Perú. Cualquier controversia será sometida a la jurisdicción de los jueces y tribunales del Distrito Judicial de Lima o Áncash, según corresponda.
            </p>
          </div>
        </section>

        {/* Botón de Retorno */}
        <div className="pt-6 border-t border-border-subtle flex flex-wrap items-center justify-between gap-4">
          <Link to="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft size={16} />
              <span>Volver al Inicio</span>
            </Button>
          </Link>
          <div className="flex items-center gap-4 text-xs text-ink-muted">
            <Link to="/privacidad" className="hover:text-sky-600 underline">
              Política de Privacidad
            </Link>
            <span>·</span>
            <Link to="/fuentes" className="hover:text-sky-600 underline">
              Bases Científicas y RNE
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};
