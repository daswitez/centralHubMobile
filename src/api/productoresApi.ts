// -----------------------------------------
// src/api/productoresApi.ts
// -----------------------------------------
// Funciones CRUD para Productores
// (/api/campo/productores) de centralHub.
// -----------------------------------------

import { handleApiRequest } from './apiClient';
import type { Productor } from './campoTypes';
import type { ApiEnvelope, ApiListEnvelope } from './apiTypes';
import { extractListFromEnvelope } from './apiTypes';

// -----------------------------------------
// Listar productores con filtro opcional (?q=)
// -----------------------------------------
export const getProductores = async (
  searchText?: string
): Promise<Productor[]> => {
  const query = searchText ? `?q=${encodeURIComponent(searchText)}` : '';

  const response = await handleApiRequest<ApiListEnvelope<Productor>>(
    `/campo/productores${query}`,
    {
      method: 'GET',
    }
  );

  const productores = extractListFromEnvelope<Productor>(response);

  return productores;
};

// -----------------------------------------
// Payload para crear / actualizar productor
// -----------------------------------------
export type ProductorPayload = {
  codigo_productor: string;
  nombre: string;
  municipio_id: number;
  telefono?: string | null;
};

// -----------------------------------------
// Crear productor
// -----------------------------------------
export const createProductor = async (
  payload: ProductorPayload
): Promise<Productor> => {
  const response = await handleApiRequest<ApiEnvelope<Productor>>(
    '/campo/productores',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  );

  return response.data;
};

// -----------------------------------------
// Actualizar productor
// -----------------------------------------
export const updateProductor = async (
  productorId: number,
  payload: ProductorPayload
): Promise<Productor> => {
  const response = await handleApiRequest<ApiEnvelope<Productor>>(
    `/campo/productores/${productorId}`,
    {
      method: 'PUT',
      body: JSON.stringify(payload),
    }
  );

  return response.data;
};

// -----------------------------------------
// Eliminar productor
// -----------------------------------------
export const deleteProductor = async (
  productorId: number
): Promise<void> => {
  await handleApiRequest<unknown>(`/campo/productores/${productorId}`, {
    method: 'DELETE',
  });
};


