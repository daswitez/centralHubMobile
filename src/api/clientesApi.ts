// -----------------------------------------
// src/api/clientesApi.ts
// -----------------------------------------
// Funciones CRUD para el catálogo de Clientes
// (/api/cat/clientes) de centralHub.
// -----------------------------------------

import { handleApiRequest } from './apiClient';
import type { Cliente } from './catalogTypes';
import type { ApiEnvelope, ApiListEnvelope } from './apiTypes';
import { extractListFromEnvelope } from './apiTypes';

// -----------------------------------------
// Listar clientes con filtro opcional (?q=)
// -----------------------------------------
export const getClientes = async (
  searchText?: string
): Promise<Cliente[]> => {
  const query = searchText ? `?q=${encodeURIComponent(searchText)}` : '';

  const response = await handleApiRequest<ApiListEnvelope<Cliente>>(
    `/cat/clientes${query}`,
    {
      method: 'GET',
    }
  );

  const clientes = extractListFromEnvelope<Cliente>(response);

  return clientes;
};

// -----------------------------------------
// Payload para crear / actualizar cliente
// -----------------------------------------
export type ClientePayload = {
  codigo_cliente: string;
  nombre: string;
  tipo: string;
  municipio_id?: number | null;
  direccion?: string | null;
  lat?: number | null;
  lon?: number | null;
};

// -----------------------------------------
// Crear nuevo cliente
// -----------------------------------------
export const createCliente = async (
  payload: ClientePayload
): Promise<Cliente> => {
  const response = await handleApiRequest<ApiEnvelope<Cliente>>(
    '/cat/clientes',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  );

  return response.data;
};

// -----------------------------------------
// Actualizar cliente existente
// -----------------------------------------
export const updateCliente = async (
  clienteId: number,
  payload: ClientePayload
): Promise<Cliente> => {
  const response = await handleApiRequest<ApiEnvelope<Cliente>>(
    `/cat/clientes/${clienteId}`,
    {
      method: 'PUT',
      body: JSON.stringify(payload),
    }
  );

  return response.data;
};

// -----------------------------------------
// Eliminar cliente
// -----------------------------------------
export const deleteCliente = async (clienteId: number): Promise<void> => {
  await handleApiRequest<unknown>(`/cat/clientes/${clienteId}`, {
    method: 'DELETE',
  });
};


