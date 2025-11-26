// -----------------------------------------
// src/api/lotesCampoApi.ts
// -----------------------------------------
// Funciones CRUD para Lotes de campo
// (/api/campo/lotes) de centralHub.
// -----------------------------------------

import { handleApiRequest } from './apiClient';
import type { LoteCampo } from './campoTypes';
import type { ApiEnvelope, ApiListEnvelope } from './apiTypes';
import { extractListFromEnvelope } from './apiTypes';

// -----------------------------------------
// Listar lotes de campo con filtro opcional (?q=)
// -----------------------------------------
export const getLotesCampo = async (
  searchText?: string
): Promise<LoteCampo[]> => {
  const query = searchText ? `?q=${encodeURIComponent(searchText)}` : '';

  const response = await handleApiRequest<ApiListEnvelope<LoteCampo>>(
    `/campo/lotes${query}`,
    {
      method: 'GET',
    }
  );

  const lotes = extractListFromEnvelope<LoteCampo>(response);

  return lotes;
};

// -----------------------------------------
// Payload para crear / actualizar lote de campo
// -----------------------------------------
export type LoteCampoPayload = {
  codigo_lote_campo: string;
  productor_id: number;
  variedad_id: number;
  superficie_ha: number;
  fecha_siembra: string;
  fecha_cosecha?: string | null;
  humedad_suelo_pct?: number | null;
};

// -----------------------------------------
// Crear lote de campo
// -----------------------------------------
export const createLoteCampo = async (
  payload: LoteCampoPayload
): Promise<LoteCampo> => {
  const response = await handleApiRequest<ApiEnvelope<LoteCampo>>(
    '/campo/lotes',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  );

  return response.data;
};

// -----------------------------------------
// Actualizar lote de campo
// -----------------------------------------
export const updateLoteCampo = async (
  loteId: number,
  payload: LoteCampoPayload
): Promise<LoteCampo> => {
  const response = await handleApiRequest<ApiEnvelope<LoteCampo>>(
    `/campo/lotes/${loteId}`,
    {
      method: 'PUT',
      body: JSON.stringify(payload),
    }
  );

  return response.data;
};

// -----------------------------------------
// Eliminar lote de campo
// -----------------------------------------
export const deleteLoteCampo = async (loteId: number): Promise<void> => {
  await handleApiRequest<unknown>(`/campo/lotes/${loteId}`, {
    method: 'DELETE',
  });
};


