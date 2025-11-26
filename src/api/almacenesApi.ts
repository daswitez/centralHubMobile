// -----------------------------------------
// src/api/almacenesApi.ts
// -----------------------------------------
// Funciones CRUD para el catálogo de Almacenes
// (/api/cat/almacenes) de centralHub.
// -----------------------------------------

import { handleApiRequest } from './apiClient';
import type { Almacen } from './catalogTypes';
import type { ApiEnvelope, ApiListEnvelope } from './apiTypes';
import { extractListFromEnvelope } from './apiTypes';

// -----------------------------------------
// Listar almacenes con filtro opcional (?q=)
// -----------------------------------------
export const getAlmacenes = async (
  searchText?: string
): Promise<Almacen[]> => {
  const query = searchText ? `?q=${encodeURIComponent(searchText)}` : '';

  const response = await handleApiRequest<ApiListEnvelope<Almacen>>(
    `/cat/almacenes${query}`,
    {
      method: 'GET',
    }
  );

  const almacenes = extractListFromEnvelope<Almacen>(response);

  return almacenes;
};

// -----------------------------------------
// Payload para crear / actualizar almacén
// -----------------------------------------
export type AlmacenPayload = {
  codigo_almacen: string;
  nombre: string;
  municipio_id: number;
  direccion?: string | null;
  lat?: number | null;
  lon?: number | null;
};

// -----------------------------------------
// Crear nuevo almacén
// -----------------------------------------
export const createAlmacen = async (
  payload: AlmacenPayload
): Promise<Almacen> => {
  const response = await handleApiRequest<ApiEnvelope<Almacen>>(
    '/cat/almacenes',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  );

  return response.data;
};

// -----------------------------------------
// Actualizar almacén existente
// -----------------------------------------
export const updateAlmacen = async (
  almacenId: number,
  payload: AlmacenPayload
): Promise<Almacen> => {
  const response = await handleApiRequest<ApiEnvelope<Almacen>>(
    `/cat/almacenes/${almacenId}`,
    {
      method: 'PUT',
      body: JSON.stringify(payload),
    }
  );

  return response.data;
};

// -----------------------------------------
// Eliminar almacén
// -----------------------------------------
export const deleteAlmacen = async (almacenId: number): Promise<void> => {
  await handleApiRequest<unknown>(`/cat/almacenes/${almacenId}`, {
    method: 'DELETE',
  });
};


