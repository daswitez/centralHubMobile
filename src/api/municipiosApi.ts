// -----------------------------------------
// src/api/municipiosApi.ts
// -----------------------------------------
// Módulo de funciones CRUD para el catálogo
// de Municipios de centralHub.
//
// Se apoya en:
//  - handleApiRequest<T> del módulo apiClient.
//  - El tipo Municipio definido en catalogTypes.
//
// Endpoints usados (según docs/README.md):
//  - GET    /cat/municipios          (filtros opcionales ?q=, ?departamento_id=)
//  - POST   /cat/municipios          (crear)
//  - PUT    /cat/municipios/{id}     (actualizar)
//  - DELETE /cat/municipios/{id}     (eliminar)
// -----------------------------------------

import { handleApiRequest } from './apiClient';
import type { Municipio } from './catalogTypes';

// -----------------------------------------
// 1) Listar municipios con filtros opcionales
// -----------------------------------------
// Parámetros:
//  - params?: {
//      searchText?: string;      // filtro por texto (?q=)
//      departamentoId?: number;  // filtro por departamento (?departamento_id=)
//    }
// Devuelve:
//  - Promise<Municipio[]> con la lista filtrada.
// -----------------------------------------
export const getMunicipios = async (params?: {
  searchText?: string;
  departamentoId?: number;
}): Promise<Municipio[]> => {
  // Construimos arreglo de pares clave=valor para el query string.
  const queryParts: string[] = [];

  if (params?.searchText) {
    queryParts.push(`q=${encodeURIComponent(params.searchText)}`);
  }

  if (params?.departamentoId) {
    queryParts.push(
      `departamento_id=${encodeURIComponent(String(params.departamentoId))}`
    );
  }

  // Unimos las partes solo si existen filtros.
  const query = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';

  // GET al endpoint principal de municipios.
  const municipios = await handleApiRequest<Municipio[]>(
    `/cat/municipios${query}`,
    {
      method: 'GET',
    }
  );

  // Devolvemos la lista ya filtrada.
  return municipios;
};

// -----------------------------------------
// 2) Crear un nuevo municipio
// -----------------------------------------
// Parámetros:
//  - data: {
//      departamento_id: number;
//      nombre: string;
//    }
// Devuelve:
//  - Promise<Municipio> con el registro creado.
// -----------------------------------------
export const createMunicipio = async (data: {
  departamento_id: number;
  nombre: string;
}): Promise<Municipio> => {
  // POST con el JSON esperado por el backend.
  const nuevoMunicipio = await handleApiRequest<Municipio>(
    '/cat/municipios',
    {
      method: 'POST',
      body: JSON.stringify(data),
    }
  );

  // Devolvemos el municipio recién creado.
  return nuevoMunicipio;
};

// -----------------------------------------
// 3) Actualizar un municipio existente
// -----------------------------------------
// Parámetros:
//  - id: identificador del municipio a actualizar.
//  - data: {
//      departamento_id: number;
//      nombre: string;
//    }
// Devuelve:
//  - Promise<Municipio> con el registro actualizado.
// -----------------------------------------
export const updateMunicipio = async (
  id: number,
  data: {
    departamento_id: number;
    nombre: string;
  }
): Promise<Municipio> => {
  // PUT al recurso específico de municipio.
  const updatedMunicipio = await handleApiRequest<Municipio>(
    `/cat/municipios/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    }
  );

  // Devolvemos el municipio ya actualizado.
  return updatedMunicipio;
};

// -----------------------------------------
// 4) Eliminar un municipio por id
// -----------------------------------------
// Parámetros:
//  - id: identificador del municipio a eliminar.
// Devuelve:
//  - Promise<void> (lanza ApiError si algo sale mal).
// -----------------------------------------
export const deleteMunicipio = async (id: number): Promise<void> => {
  // Ejecutamos el DELETE y dejamos que los errores se propaguen.
  await handleApiRequest<unknown>(`/cat/municipios/${id}`, {
    method: 'DELETE',
  });
};


