// -----------------------------------------
// src/api/variedadesApi.ts
// -----------------------------------------
// Módulo de funciones CRUD para el catálogo
// de Variedades de papa de centralHub.
//
// Se apoya en:
//  - handleApiRequest<T> del módulo apiClient.
//  - El tipo VariedadPapa definido en catalogTypes.
//
// Endpoints usados (según docs/README.md):
//  - GET    /cat/variedades          (index, filtro opcional ?q= por código/nombre)
//  - POST   /cat/variedades          (crear)
//  - PUT    /cat/variedades/{id}     (actualizar)
//  - DELETE /cat/variedades/{id}     (eliminar)
// -----------------------------------------

import { handleApiRequest } from './apiClient';
import type { VariedadPapa } from './catalogTypes';

// -----------------------------------------
// 1) Listar variedades de papa con filtro opcional
// -----------------------------------------
// Parámetros:
//  - searchText?: string  // texto para buscar por código o nombre (?q=)
// Devuelve:
//  - Promise<VariedadPapa[]> con la lista filtrada.
// -----------------------------------------
export const getVariedades = async (
  searchText?: string
): Promise<VariedadPapa[]> => {
  // Agregamos el query solo si hay texto de búsqueda.
  const query = searchText ? `?q=${encodeURIComponent(searchText)}` : '';

  // GET al endpoint principal de variedades.
  const variedades = await handleApiRequest<VariedadPapa[]>(
    `/cat/variedades${query}`,
    {
      method: 'GET',
    }
  );

  // Devolvemos las variedades obtenidas.
  return variedades;
};

// -----------------------------------------
// 2) Payload para crear una nueva variedad
// -----------------------------------------
// Este tipo refleja el JSON permitido por el backend:
// {
//   "codigo_variedad": "WAYCHA",
//   "nombre_comercial": "Waych'a",
//   "aptitud": "Mesa",
//   "ciclo_dias_min": 110,
//   "ciclo_dias_max": 140
// }
// -----------------------------------------
export type CreateVariedadPayload = {
  codigo_variedad: string;
  nombre_comercial: string;
  aptitud?: string | null;
  ciclo_dias_min?: number | null;
  ciclo_dias_max?: number | null;
};

// -----------------------------------------
// 3) Crear una nueva variedad de papa
// -----------------------------------------
// Parámetros:
//  - payload: CreateVariedadPayload con los datos de la variedad.
// Devuelve:
//  - Promise<VariedadPapa> con la variedad creada.
// -----------------------------------------
export const createVariedad = async (
  payload: CreateVariedadPayload
): Promise<VariedadPapa> => {
  // POST al endpoint de creación de variedades.
  const nuevaVariedad = await handleApiRequest<VariedadPapa>(
    '/cat/variedades',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  );

  // Devolvemos la variedad ya registrada.
  return nuevaVariedad;
};

// -----------------------------------------
// 4) Payload para actualizar una variedad
// -----------------------------------------
// Reutiliza los mismos campos que el payload de creación.
// -----------------------------------------
export type UpdateVariedadPayload = CreateVariedadPayload;

// -----------------------------------------
// 5) Actualizar una variedad existente
// -----------------------------------------
// Parámetros:
//  - id: identificador de la variedad a actualizar.
//  - payload: UpdateVariedadPayload con los datos nuevos.
// Devuelve:
//  - Promise<VariedadPapa> con la variedad actualizada.
// -----------------------------------------
export const updateVariedad = async (
  id: number,
  payload: UpdateVariedadPayload
): Promise<VariedadPapa> => {
  // PUT con el cuerpo JSON actualizado.
  const updatedVariedad = await handleApiRequest<VariedadPapa>(
    `/cat/variedades/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(payload),
    }
  );

  // Devolvemos la variedad ya modificada.
  return updatedVariedad;
};

// -----------------------------------------
// 6) Eliminar una variedad por id
// -----------------------------------------
// Parámetros:
//  - id: identificador de la variedad a eliminar.
// Devuelve:
//  - Promise<void> (lanza ApiError si algo sale mal).
// -----------------------------------------
export const deleteVariedad = async (id: number): Promise<void> => {
  // DELETE directo al recurso; errores se manejan vía excepciones.
  await handleApiRequest<unknown>(`/cat/variedades/${id}`, {
    method: 'DELETE',
  });
};


