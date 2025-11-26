// -----------------------------------------
// src/api/departamentosApi.ts
// -----------------------------------------
// Módulo de funciones CRUD para el catálogo
// de Departamentos de centralHub.
//
// Se apoya en:
//  - handleApiRequest<T> del módulo apiClient.
//  - El tipo Departamento definido en catalogTypes.
//
// Endpoints usados (según docs/README.md):
//  - GET    /cat/departamentos        (index, filtro opcional ?q=)
//  - POST   /cat/departamentos        (crear)
//  - PUT    /cat/departamentos/{id}   (actualizar)
//  - DELETE /cat/departamentos/{id}   (eliminar)
// -----------------------------------------

import { handleApiRequest } from './apiClient';
import type { Departamento } from './catalogTypes';
import type { ApiEnvelope, ApiListEnvelope } from './apiTypes';
import { extractListFromEnvelope } from './apiTypes';

// -----------------------------------------
// 1) Listar departamentos con filtro opcional
// -----------------------------------------
// Parámetro:
//  - searchText?: texto a buscar por nombre (?q=)
// Devuelve:
//  - Promise<Departamento[]> con la lista filtrada.
// -----------------------------------------
export const getDepartamentos = async (
  searchText?: string
): Promise<Departamento[]> => {
  // Construimos el query string solo si hay filtro.
  const query = searchText ? `?q=${encodeURIComponent(searchText)}` : '';

  // Hacemos un GET al endpoint de index de departamentos.
  // El backend devuelve un envoltorio { status, message, data }.
  const response = await handleApiRequest<ApiListEnvelope<Departamento>>(
    `/cat/departamentos${query}`,
    {
      method: 'GET',
    }
  );

  // Extraemos siempre un arreglo de departamentos (paginado o no).
  const departamentos = extractListFromEnvelope<Departamento>(response);

  return departamentos;
};

// -----------------------------------------
// 2) Crear un nuevo departamento
// -----------------------------------------
// Parámetros:
//  - nombre: nombre del departamento a crear.
// Devuelve:
//  - Promise<Departamento> con el registro creado.
// -----------------------------------------
export const createDepartamento = async (
  nombre: string
): Promise<Departamento> => {
  // Cuerpo JSON que Laravel espera según la documentación.
  const body = { nombre };

  // POST hacia el endpoint de creación de departamentos.
  // El backend devuelve un envoltorio con el modelo creado.
  const response = await handleApiRequest<ApiEnvelope<Departamento>>(
    '/cat/departamentos',
    {
      method: 'POST',
      body: JSON.stringify(body),
    }
  );

  // Devolvemos el departamento recién creado.
  return response.data;
};

// -----------------------------------------
// 3) Actualizar un departamento existente
// -----------------------------------------
// Parámetros:
//  - id: identificador del departamento a actualizar.
//  - nombre: nuevo nombre a guardar.
// Devuelve:
//  - Promise<Departamento> con el registro actualizado.
// -----------------------------------------
export const updateDepartamento = async (
  id: number,
  nombre: string
): Promise<Departamento> => {
  // Cuerpo JSON con los datos actualizados.
  const body = { nombre };

  // PUT al endpoint específico del recurso departamento.
  const response = await handleApiRequest<ApiEnvelope<Departamento>>(
    `/cat/departamentos/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(body),
    }
  );

  // Devolvemos el departamento ya actualizado.
  return response.data;
};

// -----------------------------------------
// 4) Eliminar un departamento por id
// -----------------------------------------
// Parámetros:
//  - id: identificador del departamento a eliminar.
// Devuelve:
//  - Promise<void> (lanza ApiError si algo sale mal).
// -----------------------------------------
export const deleteDepartamento = async (id: number): Promise<void> => {
  // Llamamos al endpoint DELETE; si hay error,
  // handleApiRequest lanzará un ApiError.
  await handleApiRequest<unknown>(`/cat/departamentos/${id}`, {
    method: 'DELETE',
  });

  // Si llegamos aquí, la eliminación fue exitosa.
};


