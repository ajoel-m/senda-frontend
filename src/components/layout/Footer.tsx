import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, ExternalLink, Heart, ChevronDown } from 'lucide-react';
import { MountainBackdrop } from '../brand/MountainBackdrop';

export const Footer: React.FC = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <footer className="relative overflow-hidden w-full border-t border-border-subtle bg-canvas-surface text-ink-primary mt-16">
      <MountainBackdrop />

      {/* Barra siempre visible — Enlaces legales accesibles para Google OAuth y usuarios */}
      <div className="relative z-10 w-full flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5">
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 min-w-0">
          <Link to="/" className="flex items-center gap-2 shrink-0 hover:opacity-85 transition-opacity">
            <img src="/mascots/logo_alertin.svg" alt="Logo de Senda" className="w-7 h-7 rounded-lg shrink-0" />
            <span className="font-display font-black text-sm tracking-tight text-ink-primary">
              Senda
            </span>
          </Link>
          <span className="text-xs text-ink-muted hidden md:inline">
            © {new Date().getFullYear()} · Información cívica
          </span>
          <span className="text-border-subtle hidden sm:inline">|</span>
          <div className="flex items-center gap-2.5 text-xs">
            <Link to="/terminos" className="text-ink-muted hover:text-sky-700 underline font-medium transition-colors">
              Términos de Servicio
            </Link>
            <span className="text-border-subtle">·</span>
            <Link to="/privacidad" className="text-ink-muted hover:text-sky-700 underline font-medium transition-colors">
              Política de Privacidad
            </Link>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-1 text-xs font-bold text-sky-700 hover:text-sky-800 shrink-0 cursor-pointer ml-auto"
          aria-expanded={expanded}
        >
          {expanded ? 'Ocultar' : 'Más información'}
          <ChevronDown size={16} className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {expanded && (
        <div className="relative z-10 px-4 sm:px-6 pb-10">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 pt-2">
            {/* Columna 1: Identidad y Misión */}
            <div className="md:col-span-2 space-y-3">
              <p className="text-sm text-ink-muted leading-relaxed max-w-md">
                Iniciativa cívica independiente para acercar a las familias peruanas la evaluación del riesgo sísmico y aluvial en Huaraz y Lima Metropolitana, respaldada en normas técnicas oficiales del Perú.
              </p>
              <div className="flex items-center gap-2 text-xs text-ink-muted pt-1">
                <Shield size={14} className="text-sky-600" />
                <span>Datos protegidos y de libre consulta ciudadana</span>
              </div>
            </div>

            {/* Columna 2: Navegación Rápida */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-sky-700 uppercase tracking-wider block">
                Navegación
              </span>
              <ul className="space-y-1.5 text-sm">
                <li>
                  <Link to="/" className="text-ink-primary hover:text-sky-600 hover:underline">
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link to="/prevencion" className="text-ink-primary hover:text-sky-600 hover:underline">
                    Centro de Prevención
                  </Link>
                </li>
                <li>
                  <Link to="/evaluar" className="text-ink-primary hover:text-sky-600 hover:underline">
                    Mi casa
                  </Link>
                </li>
                <li>
                  <Link to="/fuentes" className="text-ink-primary hover:text-sky-600 hover:underline">
                    Bases Científicas y RNE
                  </Link>
                </li>
                <li>
                  <Link to="/empresas" className="text-ink-primary hover:text-sky-600 hover:underline">
                    Senda para Empresas
                  </Link>
                </li>
                <li>
                  <Link to="/mis-reportes" className="text-ink-primary hover:text-sky-600 hover:underline">
                    Mis Reportes Guardados
                  </Link>
                </li>
              </ul>
            </div>

            {/* Columna 3: Fuentes e Instituciones */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-sky-700 uppercase tracking-wider block">
                Instituciones de Respaldo
              </span>
              <ul className="space-y-1.5 text-xs text-ink-muted">
                <li>
                  <a
                    href="https://sigrid.cenepred.gob.pe"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-sky-600 inline-flex items-center gap-1"
                  >
                    <span>CENEPRED · SIGRID (2014-2024)</span>
                    <ExternalLink size={11} />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.gob.pe/inaigem"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-sky-600 inline-flex items-center gap-1"
                  >
                    <span>INAIGEM (Estudios Aluviales 2020)</span>
                    <ExternalLink size={11} />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.gob.pe/indeci"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-sky-600 inline-flex items-center gap-1"
                  >
                    <span>INDECI (Mochila de Emergencia)</span>
                    <ExternalLink size={11} />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.gob.pe/vivienda"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-sky-600 inline-flex items-center gap-1"
                  >
                    <span>Reglamento Nacional de Edificaciones (RNE)</span>
                    <ExternalLink size={11} />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Franja Inferior con Enlaces Legales */}
          <div className="max-w-6xl mx-auto border-t border-border-subtle mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-muted">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-center sm:text-left">
              <span>
                © {new Date().getFullYear()} Senda · Información cívica para salvar vidas en el Perú.
              </span>
              <span className="hidden sm:inline text-border-subtle">|</span>
              <Link to="/privacidad" className="hover:text-sky-600 underline font-medium">
                Política de Privacidad
              </Link>
              <span className="text-border-subtle">·</span>
              <Link to="/terminos" className="hover:text-sky-600 underline font-medium">
                Términos y Condiciones
              </Link>
            </div>
            <div className="flex items-center gap-1">
              <span>Hecho para la prevención comunitaria</span>
              <Heart size={12} className="text-emergency-600 fill-emergency-600" />
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

