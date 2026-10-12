import React from 'react';
import { MountainBackdrop } from '../components/brand/MountainBackdrop';
import {
  BookOpen,
  Scale,
  ShieldCheck,
  ExternalLink,
  Layers,
  Building,
  CheckCircle2,
} from 'lucide-react';

export const SourcesPage: React.FC = () => {
  return (
    <div className="w-full bg-transparent text-ink-primary py-12 px-4 sm:px-6 relative">
      <MountainBackdrop />
      <main className="max-w-4xl mx-auto space-y-8 relative z-10">
        {/* ------------------------------------------------------------------
            CABECERA INSTITUCIONAL Y DECLARACIÓN DE RIGOR (BLANCO)
            ------------------------------------------------------------------ */}
        <div className="bg-canvas-surface p-6 sm:p-8 rounded-2xl border border-border-subtle shadow-xs space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-sky-50 dark:bg-sky-950/60 border border-border-subtle rounded-full text-xs font-semibold text-sky-700 dark:text-sky-300 shadow-xs">
            <BookOpen size={14} className="text-sky-600" />
            <span>Transparencia Científica y Marco Legal Vigente</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-ink-primary tracking-tight">
            Bases Científicas y Sustento Normativo
          </h1>
          <p className="text-base text-ink-muted leading-relaxed">
            Ningún factor de ponderación, pregunta ni umbral de alerta en <strong>Senda</strong> es arbitrario. Todo el motor algorítmico y espacial se fundamenta estrictamente en los decretos supremos del <strong>Reglamento Nacional de Edificaciones (RNE)</strong>, en la metodología de evaluación de riesgos del <strong>CENEPRED</strong>, y en las investigaciones geocientíficas de <strong>INAIGEM</strong>, <strong>CISMID</strong> e <strong>INDECI</strong>.
          </p>
        </div>

        {/* ------------------------------------------------------------------
            1. REGLAMENTO NACIONAL DE EDIFICACIONES (RNE) (CELESTE 1)
            ------------------------------------------------------------------ */}
        <section className="bg-sky-50/70 dark:bg-canvas-surface/80 p-6 sm:p-8 rounded-2xl border border-sky-200/70 dark:border-border-subtle shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 text-xl font-bold text-ink-primary">
            <div className="p-2 rounded-xl bg-canvas-surface border border-border-subtle text-sky-600 shadow-xs">
              <Building size={22} />
            </div>
            <h2>1. Reglamento Nacional de Edificaciones (RNE)</h2>
          </div>

          <div className="space-y-5">
            {/* Norma E.030 */}
            <div className="p-6 bg-canvas-surface border border-border-subtle rounded-2xl shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <span className="font-bold text-base text-ink-primary">
                  Norma Técnica E.030: Diseño Sismorresistente
                </span>
                <span className="text-xs font-mono font-semibold bg-sky-50 text-sky-700 px-3 py-1 rounded-lg border border-border-subtle w-fit shadow-xs">
                  D.S. N° 003-2016-VIVIENDA / R.M. N° 355-2018-VIVIENDA
                </span>
              </div>
              <p className="text-sm text-ink-muted leading-relaxed">
                Establece la zonificación sísmica del territorio peruano sobre la base de la aceleración máxima horizontal del suelo con probabilidad de 10% de ser excedida en 50 años:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 bg-canvas-glacial border border-border-subtle rounded-xl space-y-1">
                  <div className="text-xs font-bold text-ink-primary">Zona 4 (Lima Metropolitana y Callao)</div>
                  <div className="text-xs text-ink-muted">
                    Factor de aceleración máxima en roca <code className="font-mono bg-canvas-surface text-ink-primary px-1.5 py-0.5 rounded font-bold border border-border-subtle">Z = 0.45g</code>. Alta sismicidad por subducción de la Placa de Nazca.
                  </div>
                </div>
                <div className="p-3.5 bg-canvas-glacial border border-border-subtle rounded-xl space-y-1">
                  <div className="text-xs font-bold text-ink-primary">Zona 3 (Huaraz y Callejón de Huaylas)</div>
                  <div className="text-xs text-ink-muted">
                    Factor de aceleración <code className="font-mono bg-canvas-surface text-ink-primary px-1.5 py-0.5 rounded font-bold border border-border-subtle">Z = 0.35g</code>. Sismicidad intraplaca continental combinada con fallas activas (Falla de la Cordillera Blanca).
                  </div>
                </div>
              </div>
              <div className="p-3.5 bg-canvas-glacial border border-border-subtle rounded-xl text-xs text-ink-muted leading-relaxed">
                <strong className="text-ink-primary">Perfiles de Suelo:</strong> Clasificados desde <code className="font-mono text-xs font-semibold text-ink-primary">S_0</code> (Roca dura) hasta <code className="font-mono text-xs font-semibold text-ink-primary">S_3</code> (Suelos blandos / rellenos) y <code className="font-mono text-xs font-semibold text-ink-primary">S_4</code> (Condiciones excepcionales), introduciendo factores de amplificación sísmica <code className="font-mono text-xs">S</code> y períodos de esquina <code className="font-mono text-xs">T_P, T_L</code>.
              </div>
            </div>

            {/* Norma E.070 */}
            <div className="p-6 bg-canvas-surface border border-border-subtle rounded-2xl shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <span className="font-bold text-base text-ink-primary">
                  Norma Técnica E.070: Albañilería
                </span>
                <span className="text-xs font-mono font-semibold bg-sky-50 text-sky-700 px-3 py-1 rounded-lg border border-border-subtle w-fit shadow-xs">
                  D.S. N° 011-2006-VIVIENDA
                </span>
              </div>
              <p className="text-sm text-ink-muted leading-relaxed">
                <strong>Prohibición terminante del ladrillo tubular (Pandereta) en muros portantes:</strong>
              </p>
              <div className="p-4 bg-canvas-glacial border-l-4 border-emergency-600 rounded-r-xl text-xs sm:text-sm text-ink-muted leading-relaxed space-y-2">
                <p className="font-bold text-emergency-600 flex items-center gap-1.5">
                  Artículos 5.3 y 11.2 del RNE E.070:
                </p>
                <p>
                  Prohíben de forma taxativa el uso de unidades de albañilería huecas o tubulares con volumen de vacíos superior al 30% (como el ladrillo pandereta comercial) para la construcción de muros de carga o portantes en edificaciones ubicadas en las Zonas Sísmicas 2, 3 y 4.
                </p>
                <p>
                  Bajo esfuerzos coplanares sísmicos, la pandereta experimenta <strong>falla por tracción diagonal explosiva y colapso frágil</strong> sin advertencia previa. La norma exige exclusivamente unidades sólidas (como el ladrillo King Kong de 18 huecos con vacíos ≤ 30%) confinadas perimetralmente con vigas y columnas de concreto armado.
                </p>
              </div>
            </div>

            {/* Norma E.080 */}
            <div className="p-6 bg-canvas-surface border border-border-subtle rounded-2xl shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <span className="font-bold text-base text-ink-primary">
                  Norma Técnica E.080: Diseño y Construcción con Tierra Reforzada (Adobe)
                </span>
                <span className="text-xs font-mono font-semibold bg-sky-50 text-sky-700 px-3 py-1 rounded-lg border border-border-subtle w-fit shadow-xs">
                  R.M. N° 121-2017-VIVIENDA
                </span>
              </div>
              <p className="text-sm text-ink-muted leading-relaxed">
                <strong>Restricción de altura y confinamiento en adobe:</strong>
              </p>
              <div className="p-4 bg-canvas-glacial border-l-4 border-sky-600 rounded-r-xl text-xs sm:text-sm text-ink-muted leading-relaxed space-y-2">
                <p className="font-bold text-sky-700">
                  Artículo 7.2 del RNE E.080:
                </p>
                <p>
                  Prohíbe terminantemente la construcción de viviendas de tierra (adobe, tapial o suelo estabilizado) de <strong>dos o más pisos</strong> en zonas de sismicidad moderada y alta (Zonas 2, 3 y 4). Las viviendas de adobe se limitan a un <strong>solo piso</strong> con altura máxima de entrepiso de 3.00 metros.
                </p>
                <p>
                  Asimismo, exige la instalación obligatoria de una viga collarín continua (madera o concreto armado) en el remate superior de los muros y refuerzo con geomallas o caña para prevenir el desprendimiento coplanar y ortogonal.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------
            2. METODOLOGÍA SAATY AHP (CENEPRED) (BLANCO)
            ------------------------------------------------------------------ */}
        <section className="bg-canvas-surface p-6 sm:p-8 rounded-2xl border border-border-subtle shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 text-xl font-bold text-ink-primary">
            <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-border-subtle text-sky-600">
              <Scale size={22} />
            </div>
            <h2>2. Metodología de Evaluación de Riesgos (CENEPRED / Saaty AHP)</h2>
          </div>

          <div className="p-6 bg-canvas-glacial border border-border-subtle rounded-2xl shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <span className="font-bold text-base text-ink-primary">
                Manual para la Evaluación de Riesgos Originados por Fenómenos Naturales (2da Versión)
              </span>
              <span className="text-xs font-mono font-semibold bg-sky-50 text-sky-700 px-3 py-1 rounded-lg border border-border-subtle w-fit shadow-xs">
                R.J. N° 112-2014-CENEPRED/J
              </span>
            </div>

            <p className="text-sm text-ink-muted leading-relaxed">
              El cálculo de la <strong>Vulnerabilidad Física ($V_f$)</strong> implementado en el motor de <em>Senda</em> aplica el método de <strong>Proceso de Análisis Jerárquico (Analytic Hierarchy Process - AHP)</strong> propuesto por Thomas L. Saaty (1980) y estandarizado oficialmente por el CENEPRED.
            </p>

            {/* Matriz Pareada y Pesos */}
            <div className="overflow-hidden border border-border-subtle rounded-xl shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-canvas-surface text-ink-primary font-bold border-b border-border-subtle">
                    <tr>
                      <th className="p-3.5">Parámetro Estructural Evaluado</th>
                      <th className="p-3.5 text-center">Peso AHP</th>
                      <th className="p-3.5">Justificación Mecánica Estructural</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle text-ink-muted bg-canvas-surface">
                    <tr className="hover:bg-canvas-glacial/60 transition-colors">
                      <td className="p-3.5 font-bold text-ink-primary">Material Estructural Predominante ($w_1$)</td>
                      <td className="p-3.5 text-center">
                        <span className="inline-block font-mono font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg border border-border-subtle">
                          47.29%
                        </span>
                      </td>
                      <td className="p-3.5">Gobernado por la capacidad dúctil de absorción de cortante basal y disipación de energía sísmica.</td>
                    </tr>
                    <tr className="hover:bg-canvas-glacial/60 transition-colors">
                      <td className="p-3.5 font-bold text-ink-primary">Sistema de Confinamiento y Amarre ($w_2$)</td>
                      <td className="p-3.5 text-center">
                        <span className="inline-block font-mono font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg border border-border-subtle">
                          28.44%
                        </span>
                      </td>
                      <td className="p-3.5">Garantiza la continuidad estructural, evitando la separación de esquinas y el volteo fuera del plano.</td>
                    </tr>
                    <tr className="hover:bg-canvas-glacial/60 transition-colors">
                      <td className="p-3.5 font-bold text-ink-primary">Altura y Número de Pisos ($w_3$)</td>
                      <td className="p-3.5 text-center">
                        <span className="inline-block font-mono font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg border border-border-subtle">
                          16.99%
                        </span>
                      </td>
                      <td className="p-3.5">Determina el período fundamental de vibración $T$, amplificación de aceleraciones en azotea y sobrecarga axil.</td>
                    </tr>
                    <tr className="hover:bg-canvas-glacial/60 transition-colors">
                      <td className="p-3.5 font-bold text-ink-primary">Estado de Conservación Física ($w_4$)</td>
                      <td className="p-3.5 text-center">
                        <span className="inline-block font-mono font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg border border-border-subtle">
                          7.29%
                        </span>
                      </td>
                      <td className="p-3.5">Pondera degradación por intemperismo, humedad por capilaridad y agrietamientos residuales en cimientos.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Demostración Matemática de Consistencia */}
            <div className="p-5 bg-canvas-surface border border-border-subtle rounded-xl space-y-3 text-xs text-ink-muted">
              <span className="font-bold text-ink-primary text-sm block">
                Comprobación de la Consistencia Matemática de la Matriz:
              </span>
              <p className="leading-relaxed">
                Para la matriz pareada 4 × 4 de juicios de expertos, el autovalor principal es <code className="font-mono text-ink-primary font-bold">λ_max = 4.0514</code>. Con un orden <code className="font-mono text-ink-primary font-bold">n = 4</code> y un índice aleatorio <code className="font-mono text-ink-primary font-bold">RI = 0.90</code>:
              </p>
              <div className="font-mono bg-canvas-glacial p-3.5 rounded-xl border border-border-subtle space-y-1.5 text-ink-primary text-xs">
                <div>CI = (λ_max - n) / (n - 1) = (4.0514 - 4) / 3 = 0.01713</div>
                <div>CR = CI / RI = 0.01713 / 0.90 = 0.01904 ≈ 1.91%</div>
              </div>
              <p className="text-xs text-life-600 font-semibold flex items-center gap-1.5 pt-1">
                <CheckCircle2 size={16} className="shrink-0" />
                <span>Relación de Consistencia: CR = 1.91% &lt; 10% (Altamente consistente y matemáticamente admisible según Saaty / CENEPRED).</span>
              </p>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------
            3. CARTOGRAFÍA Y ESTUDIOS GEOCIENTÍFICOS OFICIALES (CELESTE 2)
            ------------------------------------------------------------------ */}
        <section className="bg-sky-100/60 dark:bg-canvas-surface/80 p-6 sm:p-8 rounded-2xl border border-sky-200/80 dark:border-border-subtle shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 text-xl font-bold text-ink-primary">
            <div className="p-2 rounded-xl bg-canvas-surface border border-border-subtle text-sky-600 shadow-xs">
              <Layers size={22} />
            </div>
            <h2>3. Fuentes Cartográficas y Geocientíficas</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-canvas-surface border border-border-subtle rounded-2xl shadow-xs space-y-2 hover:border-sky-400 transition-colors">
              <div className="flex items-center gap-2 text-sm font-bold text-ink-primary">
                <ShieldCheck size={18} className="text-sky-600 shrink-0" />
                <span>INAIGEM / SDRAG (2018–2023)</span>
              </div>
              <p className="text-xs text-ink-muted leading-relaxed">
                Estudios de peligro por aluvión en la subcuenca del Río Quillcay y fajas de desborde glacial asociadas a la <strong>Laguna Palcacocha</strong> (Dirección de Investigación en Glaciares y Ecosistemas de Montaña).
              </p>
            </div>

            <div className="p-5 bg-canvas-surface border border-border-subtle rounded-2xl shadow-xs space-y-2 hover:border-sky-400 transition-colors">
              <div className="flex items-center gap-2 text-sm font-bold text-ink-primary">
                <ShieldCheck size={18} className="text-sky-600 shrink-0" />
                <span>CENEPRED / Portal SIGRID (2015–2024)</span>
              </div>
              <p className="text-xs text-ink-muted leading-relaxed">
                Catálogo nacional georreferenciado de susceptibilidad a movimientos en masa, caída de rocas, flujos de detritos (huaicos) y cartografía histórica de inundaciones.
              </p>
            </div>

            <div className="p-5 bg-canvas-surface border border-border-subtle rounded-2xl shadow-xs space-y-2 hover:border-sky-400 transition-colors">
              <div className="flex items-center gap-2 text-sm font-bold text-ink-primary">
                <ShieldCheck size={18} className="text-sky-600 shrink-0" />
                <span>CARE Perú &amp; Municipalidad de Huaraz (2014)</span>
              </div>
              <p className="text-xs text-ink-muted leading-relaxed">
                Estudio de Microzonificación Sísmica y Vulnerabilidad para los distritos de Huaraz e Independencia (Zonas II, III y IV con presencia de nivel freático somero y suelos aluviales).
              </p>
            </div>

            <div className="p-5 bg-canvas-surface border border-border-subtle rounded-2xl shadow-xs space-y-2 hover:border-sky-400 transition-colors">
              <div className="flex items-center gap-2 text-sm font-bold text-ink-primary">
                <ShieldCheck size={18} className="text-sky-600 shrink-0" />
                <span>CISMID / FIC-UNI (2012–2022)</span>
              </div>
              <p className="text-xs text-ink-muted leading-relaxed">
                Mapas de microzonificación sísmica y comportamiento dinámico del suelo para Lima Metropolitana y el Callao (amplificación sísmica en laderas y taludes de La Molina, Villa El Salvador y Chorrillos).
              </p>
            </div>
          </div>

          {/* Mochila de Emergencia INDECI */}
          <div className="p-5 bg-canvas-surface border border-border-subtle rounded-2xl shadow-xs space-y-2.5">
            <div className="flex items-center gap-2 text-sm font-bold text-ink-primary">
              <ShieldCheck size={18} className="text-life-600 shrink-0" />
              <span>INDECI: Mochila para Emergencias y Caja de Reserva</span>
            </div>
            <p className="text-xs text-ink-muted leading-relaxed">
              Normada según la <strong>Resolución Jefatural N° 088-2019-INDECI</strong>. Define el kit básico de supervivencia con un peso estandarizado de <code className="font-mono text-ink-primary font-bold bg-canvas-glacial px-1.5 py-0.5 rounded border border-border-subtle">7,044 gramos</code> calculado para 2 personas durante las primeras 24 horas críticas post-desastre, con adaptación bioclimática específica: mantas polares térmicas en zona andina y repelente/pastillas de cloro en costa.
            </p>
          </div>
        </section>

        {/* ------------------------------------------------------------------
            4. ENLACES EXTERNOS A REPOSITORIOS PÚBLICOS (BLANCO)
            ------------------------------------------------------------------ */}
        <section className="bg-canvas-surface p-6 sm:p-8 rounded-2xl border border-border-subtle shadow-xs space-y-4">
          <h3 className="font-bold text-base text-ink-primary">
            Repositorios Oficiales del Estado Peruano
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <a
              href="https://sigrid.cenepred.gob.pe"
              target="_blank"
              rel="noreferrer"
              className="p-4 bg-canvas-surface border border-border-subtle hover:border-sky-400 hover:bg-sky-50/40 hover:translate-y-[-1px] transition-all flex items-center justify-between text-ink-primary rounded-2xl group shadow-xs cursor-pointer"
            >
              <div>
                <div className="font-semibold group-hover:text-sky-700 transition-colors">Portal SIGRID - CENEPRED</div>
                <div className="text-xs text-ink-muted">Sistema de Información para la Gestión del Riesgo</div>
              </div>
              <ExternalLink size={16} className="text-sky-600 shrink-0 ml-2" />
            </a>

            <a
              href="https://www.gob.pe/inaigem"
              target="_blank"
              rel="noreferrer"
              className="p-4 bg-canvas-surface border border-border-subtle hover:border-sky-400 hover:bg-sky-50/40 hover:translate-y-[-1px] transition-all flex items-center justify-between text-ink-primary rounded-2xl group shadow-xs cursor-pointer"
            >
              <div>
                <div className="font-semibold group-hover:text-sky-700 transition-colors">INAIGEM</div>
                <div className="text-xs text-ink-muted">Instituto Nacional de Investigación en Glaciares</div>
              </div>
              <ExternalLink size={16} className="text-sky-600 shrink-0 ml-2" />
            </a>

            <a
              href="https://www.gob.pe/indeci"
              target="_blank"
              rel="noreferrer"
              className="p-4 bg-canvas-surface border border-border-subtle hover:border-sky-400 hover:bg-sky-50/40 hover:translate-y-[-1px] transition-all flex items-center justify-between text-ink-primary rounded-2xl group shadow-xs cursor-pointer"
            >
              <div>
                <div className="font-semibold group-hover:text-sky-700 transition-colors">INDECI</div>
                <div className="text-xs text-ink-muted">Instituto Nacional de Defensa Civil</div>
              </div>
              <ExternalLink size={16} className="text-sky-600 shrink-0 ml-2" />
            </a>

            <a
              href="https://www.gob.pe/vivienda"
              target="_blank"
              rel="noreferrer"
              className="p-4 bg-canvas-surface border border-border-subtle hover:border-sky-400 hover:bg-sky-50/40 hover:translate-y-[-1px] transition-all flex items-center justify-between text-ink-primary rounded-2xl group shadow-xs cursor-pointer"
            >
              <div>
                <div className="font-semibold group-hover:text-sky-700 transition-colors">Ministerio de Vivienda (MVCS)</div>
                <div className="text-xs text-ink-muted">Reglamento Nacional de Edificaciones (RNE)</div>
              </div>
              <ExternalLink size={16} className="text-sky-600 shrink-0 ml-2" />
            </a>
          </div>
        </section>
      </main>
    </div>
  );
};

