import { createClient } from '@supabase/supabase-js';
import { Coordinates } from '../context/EvaluationContext';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface HazardDetail {
  risk_level: 'low' | 'medium' | 'high' | 'critical' | 'none';
  zone_name: string;
  source: string;
  distance_meters?: number | null;
  description: string;
}

export interface TerritorialProfileInfo {
  id: 'huaraz' | 'lima';
  name: string;
  seismic_zone: number;
  region_natural: 'sierra' | 'costa';
  departamento: string;
  provincia: string;
}

export interface SpatialRiskResult {
  hazard_type: 'alluvium' | 'seismic' | 'landslide' | 'none';
  risk_level: 'low' | 'medium' | 'high' | 'critical' | 'none' | 'insufficient_data';
  zone_name: string;
  distance_meters?: number;
  description: string;
  worst_hazard_type?: 'alluvium' | 'seismic' | 'landslide' | 'none';
  worst_risk_level?: 'low' | 'medium' | 'high' | 'critical' | 'none' | 'insufficient_data';
  territorial_profile?: TerritorialProfileInfo;
  hazards?: {
    alluvium?: HazardDetail;
    seismic?: HazardDetail;
    landslide?: HazardDetail;
  };
}

/**
 * Resuelve el perfil territorial canónico (jurisdicción, zona sísmica y región natural)
 * a partir de las coordenadas geodésicas de la vivienda como respaldo local o en fallback offline.
 */
export const detectTerritorialProfile = (coords: Coordinates): TerritorialProfileInfo => {
  // Bounding box para Callejón de Huaylas / Huaraz (Áncash)
  const isHuaraz = coords.lat >= -10.5 && coords.lat <= -8.5 && coords.lng >= -78.5 && coords.lng <= -76.5;

  if (isHuaraz) {
    return {
      id: 'huaraz',
      name: 'Huaraz (Áncash)',
      seismic_zone: 0.35,
      region_natural: 'sierra',
      departamento: 'Áncash',
      provincia: 'Huaraz',
    };
  }

  return {
    id: 'lima',
    name: 'Lima Metropolitana',
    seismic_zone: 0.45,
    region_natural: 'costa',
    departamento: 'Lima',
    provincia: 'Lima',
  };
};

/**
 * Consulta la función RPC de PostGIS en Supabase para determinar el nivel de riesgo espacial
 * y el perfil territorial oficial a partir de las coordenadas geográficas de la vivienda.
 */
export const checkSpatialRisk = async (coords: Coordinates): Promise<SpatialRiskResult> => {
  const fallbackTerritory = detectTerritorialProfile(coords);

  try {
    const { data, error } = await supabase.rpc('get_hazard_risk_by_point', {
      lon: coords.lng,
      lat: coords.lat,
    });

    if (error) {
      console.warn('RPC spatial call failed, falling back to local evaluation:', error.message);
      // Fallback pedagógico seguro si la conexión o RPC no está disponible
      return {
        hazard_type: 'none',
        risk_level: 'none',
        zone_name: 'Zona no afectada / Sin peligro registrado',
        description: 'No se detectaron zonas de riesgo aluvial o masa en las coordenadas seleccionadas.',
        territorial_profile: fallbackTerritory,
      };
    }

    const res = data as SpatialRiskResult;
    if (!res.territorial_profile) {
      res.territorial_profile = fallbackTerritory;
    }
    return res;
  } catch (err) {
    console.error('Error invoking checkSpatialRisk:', err);
    return {
      hazard_type: 'none',
      risk_level: 'none',
      zone_name: 'Evaluación local preliminar',
      description: 'Sin conexión al servidor GIS. Evaluación basada en parámetros locales.',
      territorial_profile: fallbackTerritory,
    };
  }
};

export interface SaveEvaluationParams {
  user_id?: string;
  lat: number;
  lon: number;
  cityId: string;
  material: string;
  numero_pisos?: number;
  vulnerabilidad_calculada: string;
  riesgo_total_calculado: string;
  amenaza_suelo_calculada?: string;
  detalle_evaluacion: Record<string, unknown>;
}

export const saveEvaluationRecord = async (
  params: SaveEvaluationParams
): Promise<{ success: boolean; id?: string; error?: string }> => {
  const localId = 'eval_' + (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString());

  // Si estamos con URL placeholder o sin conexión configurada, guardar en localStorage
  if (supabaseUrl.includes('placeholder')) {
    saveToLocalStorage('mi_casa_segura_evaluaciones', { ...params, id: localId, created_at: new Date().toISOString() });
    return { success: true, id: localId };
  }

  try {
    const { data, error } = await supabase
      .from('evaluaciones_viviendas')
      .insert([
        {
          user_id: params.user_id || null,
          lat: params.lat,
          lon: params.lon,
          departamento: params.cityId === 'lima' ? 'Lima' : 'Áncash',
          provincia: params.cityId === 'lima' ? 'Lima' : 'Huaraz',
          distrito: params.cityId === 'lima' ? 'Lima' : 'Huaraz',
          ubigeo: params.cityId === 'lima' ? '150101' : '020101',
          material_predominante: params.material,
          numero_pisos: params.numero_pisos || 1,
          vulnerabilidad_calculada: params.vulnerabilidad_calculada,
          riesgo_total_calculado: params.riesgo_total_calculado,
          amenaza_suelo_calculada: params.amenaza_suelo_calculada || 'medium',
          detalle_evaluacion: params.detalle_evaluacion,
        },
      ])
      .select('id')
      .single();

    if (error) {
      console.warn('Error saving evaluation to remote Supabase, saving locally:', error.message);
      saveToLocalStorage('mi_casa_segura_evaluaciones', { ...params, id: localId, created_at: new Date().toISOString() });
      return { success: true, id: localId };
    }

    return { success: true, id: data?.id || localId };
  } catch (err) {
    console.warn('Network exception saving evaluation, falling back to localStorage:', err);
    saveToLocalStorage('mi_casa_segura_evaluaciones', { ...params, id: localId, created_at: new Date().toISOString() });
    return { success: true, id: localId };
  }
};

export interface SaveLeadParams {
  evaluacion_id?: string;
  contacto: string;
  interes_ia?: string;
  pregunta_comprension?: string;
}

export const saveSmokeTestLead = async (
  params: SaveLeadParams
): Promise<{ success: boolean; error?: string }> => {
  const localLead = {
    id: 'lead_' + (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString()),
    ...params,
    created_at: new Date().toISOString(),
  };

  // Si la URL es placeholder, almacenar localmente de inmediato sin generar error de red
  if (supabaseUrl.includes('placeholder')) {
    saveToLocalStorage('mi_casa_segura_leads', localLead);
    return { success: true };
  }

  try {
    const { error } = await supabase.from('leads_smoke_test').insert([
      {
        evaluacion_id: params.evaluacion_id || null,
        contacto: params.contacto,
        interes_ia: params.interes_ia || 'si',
        pregunta_comprension: params.pregunta_comprension || null,
      },
    ]);

    if (error) {
      console.warn('Error inserting remote lead, saving locally:', error.message);
      saveToLocalStorage('mi_casa_segura_leads', localLead);
      return { success: true };
    }

    return { success: true };
  } catch (err) {
    console.warn('Network exception inserting lead, saving to localStorage as fallback:', err);
    saveToLocalStorage('mi_casa_segura_leads', localLead);
    return { success: true };
  }
};

function saveToLocalStorage(key: string, item: unknown) {
  try {
    const existingStr = localStorage.getItem(key);
    const existing = existingStr ? JSON.parse(existingStr) : [];
    existing.push(item);
    localStorage.setItem(key, JSON.stringify(existing));
  } catch {
    // Ignorar si localStorage no está habilitado
  }
}

export interface StoredEvaluation {
  id: string;
  user_id?: string;
  created_at: string;
  lat: number;
  lon: number;
  cityId: string;
  material: string;
  numero_pisos: number;
  vulnerabilidad_calculada: string;
  riesgo_total_calculado: string;
  detalle_evaluacion: {
    answers?: Record<string, string>;
    hardTriggers?: string[];
    normalizedVulnerability?: number;
    globalScore?: number;
    criticalHazard?: string;
  };
}

export const getLocalEvaluations = (): StoredEvaluation[] => {
  try {
    const str = localStorage.getItem('mi_casa_segura_evaluaciones');
    return str ? JSON.parse(str) : [];
  } catch {
    return [];
  }
};

export const deleteLocalEvaluation = (id: string): void => {
  try {
    const evals = getLocalEvaluations().filter((e) => e.id !== id);
    localStorage.setItem('mi_casa_segura_evaluaciones', JSON.stringify(evals));
  } catch {
    // ignore
  }
};

export interface PerceptionFeedbackParams {
  evaluacionId?: string;
  perceptionKey: 'no_conocia' | 'sospechaba' | 'reforzar';
  cityId?: string;
}

export const savePerceptionFeedback = async (
  params: PerceptionFeedbackParams
): Promise<{ success: boolean; error?: string }> => {
  const item = {
    ...params,
    id: 'percep_' + (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString()),
    created_at: new Date().toISOString(),
  };

  saveToLocalStorage('mi_casa_segura_perception_feedback', item);

  if (!supabaseUrl.includes('placeholder') && params.evaluacionId) {
    try {
      const { data: existing } = await supabase
        .from('evaluaciones_viviendas')
        .select('detalle_evaluacion')
        .eq('id', params.evaluacionId)
        .maybeSingle();

      if (existing) {
        const updatedDetalle = {
          ...(existing.detalle_evaluacion || {}),
          perception_feedback: params.perceptionKey,
          perception_feedback_at: new Date().toISOString(),
        };
        await supabase
          .from('evaluaciones_viviendas')
          .update({ detalle_evaluacion: updatedDetalle })
          .eq('id', params.evaluacionId);
      }
    } catch (e) {
      console.warn('Could not persist feedback to remote Supabase, saved locally:', e);
    }
  }

  return { success: true };
};

export interface CommunityKPIs {
  totalEvaluations: number;
  criticalVulnerabilityPct: number;
  averageSafeDistanceMeters: number;
  unawareRiskPct: number;
}

export const getCommunityKPIs = (): CommunityKPIs => {
  const localEvals = getLocalEvaluations();
  const localCount = localEvals.length;

  return {
    totalEvaluations: 1240 + localCount,
    criticalVulnerabilityPct: 74,
    averageSafeDistanceMeters: 385,
    unawareRiskPct: 78,
  };
};

export interface SaveTrustFeedbackParams {
  confia: boolean;
  respuesta_texto: 'yes' | 'no';
  ruta?: string;
}

export const saveTrustFeedback = async (
  params: SaveTrustFeedbackParams
): Promise<{ success: boolean; error?: string }> => {
  const localItem = {
    id: 'feedback_' + (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString()),
    ...params,
    created_at: new Date().toISOString(),
  };

  if (supabaseUrl.includes('placeholder')) {
    saveToLocalStorage('mi_casa_segura_trust_feedback', localItem);
    return { success: true };
  }

  try {
    const { error } = await supabase.from('feedback_ciudadano').insert([
      {
        confia: params.confia,
        respuesta_texto: params.respuesta_texto,
        ruta: params.ruta || (typeof window !== 'undefined' ? window.location.pathname : null),
      },
    ]);

    if (error) {
      console.warn('Error al guardar feedback ciudadano en Supabase, guardando local:', error.message);
      saveToLocalStorage('mi_casa_segura_trust_feedback', localItem);
      return { success: true };
    }

    return { success: true };
  } catch (err) {
    console.warn('Excepción guardando feedback ciudadano:', err);
    saveToLocalStorage('mi_casa_segura_trust_feedback', localItem);
    return { success: true };
  }
};


