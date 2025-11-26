// -----------------------------------------
// src/api/lecturasApi.ts
// -----------------------------------------
// Funciones CRUD y filtros para lecturas de sensor
// (/api/campo/lecturas) de centralHub.
// -----------------------------------------

import { handleApiRequest } from './apiClient';
import type { SensorLectura } from './campoTypes';
import type { ApiEnvelope, ApiListEnvelope } from './apiTypes';
import { extractListFromEnvelope } from './apiTypes';

// -----------------------------------------
// Listar lecturas con filtros opcionales
// (?lote_campo_id=, ?tipo=, ?desde=, ?hasta=)
// -----------------------------------------
export const getLecturas = async (params?: {
  lote_campo_id?: number;
  tipo?: string;
  desde?: string;
  hasta?: string;
}): Promise<SensorLectura[]> => {
  const queryParts: string[] = [];

  if (params?.lote_campo_id) {
    queryParts.push(
      `lote_campo_id=${encodeURIComponent(String(params.lote_campo_id))}`
    );
  }

  if (params?.tipo) {
    queryParts.push(`tipo=${encodeURIComponent(params.tipo)}`);
  }

  if (params?.desde) {
    queryParts.push(`desde=${encodeURIComponent(params.desde)}`);
  }

  if (params?.hasta) {
    queryParts.push(`hasta=${encodeURIComponent(params.hasta)}`);
  }

  const query = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';

  const response = await handleApiRequest<ApiListEnvelope<SensorLectura>>(
    `/campo/lecturas${query}`,
    {
      method: 'GET',
    }
  );

  const lecturas = extractListFromEnvelope<SensorLectura>(response);

  return lecturas;
};

// -----------------------------------------
// Payload para crear / actualizar lectura
// -----------------------------------------
export type SensorLecturaPayload = {
  lote_campo_id: number;
  fecha_hora: string;
  tipo: string;
  valor_num?: number | null;
  valor_texto?: string | null;
};

// -----------------------------------------
// Crear lectura de sensor
// -----------------------------------------
export const createLectura = async (
  payload: SensorLecturaPayload
): Promise<SensorLectura> => {
  const response = await handleApiRequest<ApiEnvelope<SensorLectura>>(
    '/campo/lecturas',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  );

  return response.data;
};

// -----------------------------------------
// Actualizar lectura de sensor
// -----------------------------------------
export const updateLectura = async (
  lecturaId: number,
  payload: SensorLecturaPayload
): Promise<SensorLectura> => {
  const response = await handleApiRequest<ApiEnvelope<SensorLectura>>(
    `/campo/lecturas/${lecturaId}`,
    {
      method: 'PUT',
      body: JSON.stringify(payload),
    }
  );

  return response.data;
};

// -----------------------------------------
// Eliminar lectura de sensor
// -----------------------------------------
export const deleteLectura = async (lecturaId: number): Promise<void> => {
  await handleApiRequest<unknown>(`/campo/lecturas/${lecturaId}`, {
    method: 'DELETE',
  });
};


