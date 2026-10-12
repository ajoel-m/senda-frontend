import React from 'react';
import { Shield, Lock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="w-full bg-transparent text-ink-primary py-12 px-4 sm:px-6">
      <main className="max-w-3xl mx-auto space-y-8">
        {/* Cabecera */}
        <div className="border-b border-border-subtle pb-6 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 text-xs font-semibold tracking-wider text-sky-700 uppercase rounded-md">
            <Lock size={14} />
            <span>Marco Legal y Protección de Datos</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-ink-primary">
            Política de Privacidad y Tratamiento de Datos
          </h1>

          <p className="text-sm text-ink-muted">
            Conforme a la Ley N° 29733 (Ley de Protección de Datos Personales del Perú) y su Reglamento D.S. N° 003-2013-JUS.
            <span className="block mt-1 font-mono text-xs text-sky-700">
              Última actualización: Septiembre de 2026 · Ámbito: Perú
            </span>
          </p>
        </div>

        {/* Resumen de Compromiso */}
        <div className="p-6 bg-canvas-surface border-l-4 border-sky-600 border-t border-r border-b border-border-subtle rounded-r-xl space-y-2 shadow-xs">
          <h2 className="text-base font-bold text-ink-primary flex items-center gap-2">
            <Shield size={18} className="text-sky-600" />
            <span>Nuestro Compromiso de Privacidad Cívica</span>
          </h2>
          <p className="text-sm text-ink-muted leading-relaxed">
            Senda es una plataforma científica y cívica abierta orientada a la reducción del riesgo de desastres en el Perú. <strong>No comercializamos, no transferimos ni lucramos con los datos personales ni la ubicación de las viviendas evaluadas</strong>.
          </p>
        </div>

        {/* Secciones Legales */}
        <section className="space-y-8 text-sm text-ink-muted leading-relaxed">
          {/* 1. Responsable del Tratamiento */}
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-ink-primary">
              1. Responsable del Tratamiento de los Datos
            </h2>
            <p>
              La plataforma <strong>Senda</strong> es operada por un equipo de investigación en ingeniería civil, geotecnia y tecnologías cívicas de datos, en coordinación con iniciativas abiertas de resiliencia comunitaria en Huaraz y Lima Metropolitana.
            </p>
          </div>

          {/* 2. Datos Recopilados */}
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-ink-primary">
              2. Datos Recopilados y Finalidad
            </h2>
            <p>
              Recopilamos únicamente la información técnica y de identidad estrictamente necesaria para generar su dictamen estructural:
            </p>
            <ul className="list-disc pl-5 space-y-1 pt-1">
              <li>
                <strong className="text-ink-primary">Coordenadas Geográficas de la Vivienda:</strong> Utilizadas exclusivamente para cruzar la ubicación con las capas cartográficas oficiales del CISMID (Microzonificación sísmica), INAIGEM (Peligrosidad de aluvión) y CENEPRED (Movimientos en masa).
              </li>
              <li>
                <strong className="text-ink-primary">Parámetros Constructivos Declarados:</strong> Materialidad predominante, número de pisos, presencia de columnas de confinamiento y conservación de muros, conforme a las normas E.030, E.070 y E.080 del Reglamento Nacional de Edificaciones (RNE).
              </li>
              <li>
                <strong className="text-ink-primary">Datos de Autenticación de Google OAuth:</strong> Nombre, dirección de correo electrónico e identificador único de usuario provisto por Google con el único propósito de resguardar su historial de reportes y permitirle descargar su dictamen en PDF desde cualquier dispositivo.
              </li>
            </ul>
          </div>

          {/* 3. Consentimiento y Google OAuth */}
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-ink-primary">
              3. Autenticación mediante Google OAuth
            </h2>
            <p>
              Al utilizar el botón "Continuar con Google", usted autoriza a la plataforma a recibir su perfil básico (nombre, correo y foto de perfil pública) directamente de los servidores de Google Identity Services. Senda no accede a sus contraseñas, correos privados, contactos ni archivos de Google Drive.
            </p>
          </div>

          {/* 4. Anonimización y Fines Estadísticos */}
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-ink-primary">
              4. Anonimización para Políticas Públicas de Prevención
            </h2>
            <p>
              Los resultados de vulnerabilidad podrán ser analizados de manera <strong>estrictamente disociada y anonimizada</strong> (sin nombres ni correos asociados) para generar mapas barriales de riesgo sísmico y aluvial, con el fin de orientar a municipalidades y entidades de defensa civil en obras de mitigación y defensas ribereñas.
            </p>
          </div>

          {/* 5. Derechos ARCO */}
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-ink-primary">
              5. Ejercicio de Derechos ARCO (Acceso, Rectificación, Cancelación y Oposición)
            </h2>
            <p>
              De conformidad con la Ley N° 29733, usted tiene derecho a acceder a sus evaluaciones registradas, solicitar la corrección de cualquier dato inexacto o la eliminación total de sus reportes de nuestra base de datos. Para ejercer estos derechos, puede eliminar sus diagnósticos directamente desde el panel "Mis Reportes" o contactarnos a través de los canales cívicos de la plataforma.
            </p>
          </div>

          {/* 6. Seguridad de la Información */}
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-ink-primary">
              6. Seguridad y Almacenamiento
            </h2>
            <p>
              La infraestructura tecnológica opera con almacenamiento en la nube de alta seguridad y bases de datos relacionales PostgreSQL con políticas estrictas de seguridad a nivel de fila (Row Level Security - RLS) y cifrado en tránsito (TLS/SSL). Solo usted puede leer y gestionar los diagnósticos vinculados a su cuenta autenticada.
            </p>
          </div>
        </section>

        {/* Botón de Regreso */}
        <div className="pt-6 border-t border-border-subtle flex justify-between items-center">
          <Link to="/">
            <Button variant="outline" size="md">
              <ArrowLeft size={16} className="mr-2" />
              <span>Volver al Inicio</span>
            </Button>
          </Link>

          <Link to="/terminos">
            <Button variant="primary" size="md">
              <span>Ver Términos y Condiciones</span>
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};
