import React, { useState } from 'react';
import { CheckCircle2, FileText, Wrench, ShieldAlert } from 'lucide-react';
import { Button } from '../Button';
import { saveSmokeTestLead } from '../../services/supabase';

interface LeadCaptureFormProps {
  evaluacionId?: string;
}

export const LeadCaptureForm: React.FC<LeadCaptureFormProps> = ({ evaluacionId }) => {
  const [nombre, setNombre] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [deseaPdf, setDeseaPdf] = useState(true);
  const [deseaAsesoria, setDeseaAsesoria] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const phoneClean = whatsapp.replace(/\D/g, '');
    if (phoneClean.length < 9) {
      setError('Por favor ingresa un número de celular/WhatsApp válido de 9 dígitos.');
      return;
    }

    if (!nombre.trim()) {
      setError('Por favor indícanos tu nombre o el de la persona de contacto.');
      return;
    }

    setLoading(true);

    const interesArray = [];
    if (deseaPdf) interesArray.push('Informe Técnico PDF');
    if (deseaAsesoria) interesArray.push('Asesoría Presencial Ingeniero');

    const result = await saveSmokeTestLead({
      evaluacion_id: evaluacionId,
      contacto: `${nombre.trim()} (${phoneClean})`,
      interes_ia: 'si',
      pregunta_comprension: interesArray.join(' + ') || 'General',
    });

    setLoading(false);

    if (result.success) {
      setSubmitted(true);
    } else {
      setError('Hubo un problema de conexión al registrar tu solicitud. Por favor intenta de nuevo.');
    }
  };

  if (submitted) {
    return (
      <div className="p-6 rounded-2xl bg-life-50 border border-life-500 text-center space-y-3">
        <CheckCircle2 className="w-10 h-10 text-life-600 mx-auto" />
        <h3 className="text-xl font-bold text-life-600">
          ¡Solicitud Registrada con Éxito!
        </h3>
        <p className="text-base text-[#0D3B66] max-w-lg mx-auto leading-relaxed">
          Hemos guardado tu solicitud. En cuanto el servicio de emisión de informes técnicos formales y peritaje esté disponible, te contactaremos a tu WhatsApp para coordinar.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl bg-canvas-surface border border-border-subtle space-y-4 text-ink-primary">
      <div className="flex items-center gap-2">
        <FileText className="w-5 h-5 text-sky-600" />
        <h3 className="text-lg font-bold text-ink-primary">
          Recibir Informe Técnico Oficial y Asesoría
        </h3>
      </div>
      <p className="text-base text-ink-muted leading-relaxed">
        ¿Deseas contar con el informe técnico formal firmado para trámites, o solicitar la inspección de un ingeniero colegiado para planificar obras de reforzamiento estructural?
      </p>

      {error && (
        <div className="p-3 rounded-xl bg-emergency-50 border border-emergency-600/30 text-emergency-600 text-sm flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-bold text-ink-primary">
              Nombre Completo:
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. Alberto García"
              required
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-canvas-surface border border-border-subtle text-base text-ink-primary focus:border-sky-600 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-bold text-ink-primary">
              WhatsApp / Teléfono Móvil:
            </label>
            <input
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="Ej. 943123456"
              required
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-canvas-surface border border-border-subtle text-base text-ink-primary focus:border-sky-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Opciones de Interés (44px touch targets) */}
        <div className="p-4 rounded-2xl bg-sky-50/70 dark:bg-canvas-glacial border border-border-subtle space-y-2">
          <label className="flex items-center gap-3 min-h-[44px] cursor-pointer text-base text-ink-primary">
            <input
              type="checkbox"
              checked={deseaPdf}
              onChange={(e) => setDeseaPdf(e.target.checked)}
              className="w-5 h-5 accent-sky-600 cursor-pointer"
            />
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-sky-600" />
              Deseo recibir el Informe Técnico en PDF con sellos normativos
            </span>
          </label>

          <label className="flex items-center gap-3 min-h-[44px] cursor-pointer text-base text-[#0D3B66]">
            <input
              type="checkbox"
              checked={deseaAsesoria}
              onChange={(e) => setDeseaAsesoria(e.target.checked)}
              className="w-5 h-5 accent-[#1E6FB5] cursor-pointer"
            />
            <span className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-[#1E6FB5]" />
              Me interesa coordinar una inspección técnica presencial de reforzamiento
            </span>
          </label>
        </div>

        <Button
          type="submit"
          disabled={loading}
          variant="primary"
          size="lg"
          fullWidth
        >
          <span>{loading ? 'Registrando solicitud...' : 'Solicitar Informe y Asesoría Técnica'}</span>
        </Button>
      </form>
    </div>
  );
};
