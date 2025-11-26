// -----------------------------------------
// src/api/transportistasApi.ts
// -----------------------------------------
// Funciones CRUD para el catálogo de Transportistas
// (/api/cat/transportistas) de centralHub.
// -----------------------------------------

import { handleApiRequest } from './apiClient';
import type { Transportista } from './catalogTypes';
import type { ApiEnvelope, ApiListEnvelope } from './apiTypes';
import { extractListFromEnvelope } from './apiTypes';

// -----------------------------------------
// Listar transportistas con filtro opcional (?q=)
// -----------------------------------------
export const getTransportistas = async (
  searchText?: string
): Promise<Transportista[]> => {
  const query = searchText ? `?q=${encodeURIComponent(searchText)}` : '';

  const response = await handleApiRequest<ApiListEnvelope<Transportista>>(
    `/cat/transportistas${query}`,
    {
      method: 'GET',
    }
  );

  const transportistas = extractListFromEnvelope<Transportista>(response);

  return transportistas;
};

// -----------------------------------------
// Payload para crear / actualizar transportista
// -----------------------------------------
export type TransportistaPayload = {
  codigo_transp: string;
  nombre: string;
  nro_licencia?: string | null;
};

// -----------------------------------------
// Crear nuevo transportista
// -----------------------------------------
export const createTransportista = async (
  payload: TransportistaPayload
): Promise<Transportista> => {
  const response = await handleApiRequest<ApiEnvelope<Transportista>>(
    '/cat/transportistas',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  );

  return response.data;
};

// -----------------------------------------
// Actualizar transportista existente
// -----------------------------------------
export const updateTransportista = async (
  transportistaId: number,
  payload: TransportistaPayload
): Promise<Transportista> => {
  const response = await handleApiRequest<ApiEnvelope<Transportista>>(
    `/cat/transportistas/${transportistaId}`,
    {
      method: 'PUT',
      body: JSON.stringify(payload),
    }
  );

  return response.data;
};

// -----------------------------------------
// Eliminar transportista
// -----------------------------------------
export const deleteTransportista = async (
  transportistaId: number
): Promise<void> => {
  await handleApiRequest<unknown>(`/cat/transportistas/${transportistaId}`, {
    method: 'DELETE',
  });
};


