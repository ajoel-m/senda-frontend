import { supabase } from './supabase';
import {
  CORE_NATIONAL_ITEMS,
  REGIONAL_ADDONS,
  type BackpackItem,
} from '../lib/emergencyKit';

export interface DynamicEmergencyKitResponse {
  region: string;
  items: BackpackItem[];
  totalWeightGrams: number;
  source: 'database' | 'canonical_fallback';
}

/**
 * Obtiene el catálogo de artículos de la mochila de emergencias para una región
 * intentando primero la base de datos Supabase y recurriendo de forma transparente
 * al núcleo canónico de TypeScript si la red o las credenciales no están disponibles.
 */
export const fetchEmergencyKit = async (
  cityId: string = 'huaraz'
): Promise<DynamicEmergencyKitResponse> => {
  const regionKey = cityId === 'lima' ? 'costero' : 'andino';

  try {
    const { data, error } = await supabase.rpc('get_emergency_kit_by_region', {
      p_region: regionKey,
    });

    if (!error && data && Array.isArray(data.items) && data.items.length > 0) {
      return {
        region: data.region || regionKey,
        items: data.items,
        totalWeightGrams: data.totalWeightGrams || 0,
        source: 'database',
      };
    }
  } catch (err) {
    console.warn('Fallback a catálogo canónico local INDECI:', err);
  }

  // Fallback offline / canónico local auditado
  const regional = REGIONAL_ADDONS[regionKey] || REGIONAL_ADDONS.andino;
  const fallbackItems = [...CORE_NATIONAL_ITEMS, ...regional.items];
  const totalWeight = fallbackItems.reduce((acc, it) => acc + it.weightGrams, 0);

  return {
    region: regionKey,
    items: fallbackItems,
    totalWeightGrams: totalWeight,
    source: 'canonical_fallback',
  };
};
