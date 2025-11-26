// -----------------------------------------
// src/api/plantasApi.ts
// -----------------------------------------
// Funciones CRUD para el catálogo de Plantas
// (/api/cat/plantas) de centralHub.
// -----------------------------------------

import { handleApiRequest } from './apiClient';
import type { Planta } from './catalogTypes';
import type { ApiEnvelope, ApiListEnvelope } from './apiTypes';
import { extractListFromEnvelope } from './apiTypes';

// -----------------------------------------
// Listar plantas con filtro opcional (?q=)
// -----------------------------------------
export const getPlantas = async (
  searchText?: string
): Promise<Planta[]> => {
  const query = searchText ? `?q=${encodeURIComponent(searchText)}` : '';

  const response = await handleApiRequest<ApiListEnvelope<Planta>>(
    `/cat/plantas${query}`,
    {
      method: 'GET',
    }
  );

  const plantas = extractListFromEnvelope<Planta>(response);

  return plantas;
};

// -----------------------------------------
// Payload para crear / actualizar planta
// -----------------------------------------
export type PlantaPayload = {
  codigo_planta: string;
  nombre: string;
  municipio_id: number;
  direccion?: string | null;
  lat?: number | null;
  lon?: number | null;
};

// -----------------------------------------
// Crear nueva planta
// -----------------------------------------
export const createPlanta = async (
  payload: PlantaPayload
): Promise<Planta> => {
  const response = await handleApiRequest<ApiEnvelope<Planta>>(
    '/cat/plantas',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  );

  return response.data;
};

// -----------------------------------------
// Actualizar planta existente
// -----------------------------------------
export const updatePlanta = async (
  plantaId: number,
  payload: PlantaPayload
): Promise<Planta> => {
  const response = await handleApiRequest<ApiEnvelope<Planta>>(
    `/cat/plantas/${plantaId}`,
    {
      method: 'PUT',
      body: JSON.stringify(payload),
    }
  );

  return response.data;
};

// -----------------------------------------
// Eliminar planta
// -----------------------------------------
export const deletePlanta = async (plantaId: number): Promise<void> => {
  await handleApiRequest<unknown>(`/cat/plantas/${plantaId}`, {
    method: 'DELETE',
  });
};


