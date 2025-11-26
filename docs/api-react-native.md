## Uso de los endpoints CRUD desde una app React Native

Esta guía muestra **cómo consumir los endpoints de catálogos (`/cat`) desde una app React Native**, usando `fetch` y TypeScript.

- **Backend base**: Laravel + PostgreSQL (este proyecto).
- **URL base por defecto**: `http://127.0.0.1:8000` (ajústala según tu entorno).
- **Catálogos cubiertos**:
  - Departamentos
  - Municipios
  - Variedades de papa

> Nota rápida: en emulador Android, `http://10.0.2.2:8000` apunta al host; en dispositivo físico usa la IP de tu PC (por ejemplo `http://192.168.0.10:8000`).

---

### 1) Cliente HTTP base en React Native

Ejemplo de archivo compartido `apiClient.ts` para toda la app:

```ts
// apiClient.ts
// -----------------------------------------
// Cliente HTTP reutilizable para hablar con el backend Laravel
// -----------------------------------------

// URL base del backend Laravel (cambia según tu entorno)
export const API_BASE_URL = 'http://127.0.0.1:8000';

// Tipo genérico para errores de API
export type ApiError = {
  message: string;
  status?: number;
  details?: unknown;
};

// Helper genérico para hacer requests y devolver JSON tipado
export const handleApiRequest = async <TResponse>(
  endpointPath: string,
  options: RequestInit = {}
): Promise<TResponse> => {
  // Construimos la URL completa usando la base
  const fullUrl = `${API_BASE_URL}${endpointPath}`;

  // Mezclamos opciones con cabeceras por defecto orientadas a JSON
  const mergedOptions: RequestInit = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  };

  // Lanzamos el request HTTP hacia Laravel
  const response = await fetch(fullUrl, mergedOptions);

  // Si el status no está en el rango 200-299, lanzamos error
  if (!response.ok) {
    let errorBody: unknown = undefined;
    try {
      errorBody = await response.json();
    } catch {
      // Si no se puede parsear JSON, simplemente lo dejamos como undefined
    }

    const apiError: ApiError = {
      message: `Error HTTP ${response.status}`,
      status: response.status,
      details: errorBody,
    };

    throw apiError;
  }

  // Devolvemos la respuesta ya parseada como JSON del tipo esperado
  return (await response.json()) as TResponse;
};
```

---

### 2) Tipos TypeScript para los catálogos

```ts
// catalogTypes.ts
// -----------------------------------------
// Tipos compartidos para los catálogos base
// -----------------------------------------

// Departamento simple
export type Departamento = {
  id: number;
  nombre: string;
  created_at?: string;
  updated_at?: string;
};

// Municipio ligado a un departamento
export type Municipio = {
  id: number;
  departamento_id: number;
  nombre: string;
  created_at?: string;
  updated_at?: string;
};

// Variedad de papa con rango de días de ciclo
export type VariedadPapa = {
  variedad_id: number;
  codigo_variedad: string;
  nombre_comercial: string;
  aptitud?: string | null;
  ciclo_dias_min?: number | null;
  ciclo_dias_max?: number | null;
  created_at?: string;
  updated_at?: string;
};
```

---

### 3) Endpoints de Departamentos (`/cat/departamentos`)

Del README del proyecto:

- `GET /cat/departamentos` (index, filtro `?q=`)
- `POST /cat/departamentos`
- `PUT /cat/departamentos/{id}`
- `DELETE /cat/departamentos/{id}`

> Importante: asegúrate de que el backend soporte **respuestas JSON** para peticiones con cabecera `Accept: application/json`.  
> Si por defecto devuelve vistas Blade, puedes necesitar exponer rutas API adicionales (`Route::apiResource`) que devuelvan JSON puro.

#### 3.1) Listar departamentos con filtro opcional

```ts
// departamentosApi.ts
// -----------------------------------------
// Funciones CRUD para Departamentos
// -----------------------------------------

import { handleApiRequest } from './apiClient';
import type { Departamento } from './catalogTypes';

// Lista departamentos, con filtro opcional por nombre (?q=)
export const getDepartamentos = async (
  searchText?: string
): Promise<Departamento[]> => {
  // Construimos el query string solo si hay filtro
  const query = searchText ? `?q=${encodeURIComponent(searchText)}` : '';

  // Hacemos un GET al endpoint de index
  const departamentos = await handleApiRequest<Departamento[]>(
    `/cat/departamentos${query}`,
    {
      method: 'GET',
    }
  );

  // Devolvemos la lista de departamentos tipada
  return departamentos;
};
```

#### 3.2) Crear un departamento

```ts
// Crea un nuevo departamento enviando JSON al backend
export const createDepartamento = async (
  nombre: string
): Promise<Departamento> => {
  // Cuerpo JSON que Laravel espera según el README
  const body = { nombre };

  // POST hacia el endpoint de creación
  const nuevoDepartamento = await handleApiRequest<Departamento>(
    '/cat/departamentos',
    {
      method: 'POST',
      body: JSON.stringify(body),
    }
  );

  // Devolvemos el departamento creado
  return nuevoDepartamento;
};
```

#### 3.3) Actualizar un departamento

```ts
// Actualiza un departamento existente usando su id
export const updateDepartamento = async (
  id: number,
  nombre: string
): Promise<Departamento> => {
  // Cuerpo de datos actualizado
  const body = { nombre };

  // PUT al endpoint específico del recurso
  const updatedDepartamento = await handleApiRequest<Departamento>(
    `/cat/departamentos/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(body),
    }
  );

  // Devolvemos el departamento ya actualizado
  return updatedDepartamento;
};
```

#### 3.4) Eliminar un departamento

```ts
// Elimina un departamento por id
export const deleteDepartamento = async (id: number): Promise<void> => {
  // Llamamos al endpoint DELETE; si hay error lanzará desde handleApiRequest
  await handleApiRequest<unknown>(`/cat/departamentos/${id}`, {
    method: 'DELETE',
  });

  // Si llegamos aquí la eliminación fue exitosa
};
```

---

### 4) Endpoints de Municipios (`/cat/municipios`)

Del README del proyecto:

- `GET /cat/municipios` (filtros: `?q=`, `?departamento_id=`)
- `POST /cat/municipios`
- `PUT /cat/municipios/{id}`
- `DELETE /cat/municipios/{id}`

JSON esperado:

```json
{
  "departamento_id": 1,
  "nombre": "Cochabamba"
}
```

#### 4.1) Listar municipios por filtro de texto y/o departamento

```ts
// municipiosApi.ts
// -----------------------------------------
// Funciones CRUD para Municipios
// -----------------------------------------

import { handleApiRequest } from './apiClient';
import type { Municipio } from './catalogTypes';

// Lista municipios filtrando opcionalmente por texto y/o departamento
export const getMunicipios = async (params?: {
  searchText?: string;
  departamentoId?: number;
}): Promise<Municipio[]> => {
  // Construimos arreglo de pares clave=valor para el query string
  const queryParts: string[] = [];

  if (params?.searchText) {
    queryParts.push(`q=${encodeURIComponent(params.searchText)}`);
  }

  if (params?.departamentoId) {
    queryParts.push(`departamento_id=${encodeURIComponent(
      String(params.departamentoId)
    )}`);
  }

  // Unimos las partes solo si existen filtros
  const query = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';

  // GET al endpoint principal de municipios
  const municipios = await handleApiRequest<Municipio[]>(
    `/cat/municipios${query}`,
    {
      method: 'GET',
    }
  );

  // Devolvemos la lista ya filtrada
  return municipios;
};
```

#### 4.2) Crear un municipio

```ts
// Crea un municipio nuevo ligándolo a un departamento
export const createMunicipio = async (data: {
  departamento_id: number;
  nombre: string;
}): Promise<Municipio> => {
  // POST con el JSON esperado por el backend
  const nuevoMunicipio = await handleApiRequest<Municipio>(
    '/cat/municipios',
    {
      method: 'POST',
      body: JSON.stringify(data),
    }
  );

  // Devolvemos el municipio recién creado
  return nuevoMunicipio;
};
```

#### 4.3) Actualizar un municipio

```ts
// Actualiza un municipio existente
export const updateMunicipio = async (
  id: number,
  data: {
    departamento_id: number;
    nombre: string;
  }
): Promise<Municipio> => {
  // PUT al recurso específico de municipio
  const updatedMunicipio = await handleApiRequest<Municipio>(
    `/cat/municipios/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    }
  );

  // Devolvemos el municipio ya actualizado
  return updatedMunicipio;
};
```

#### 4.4) Eliminar un municipio

```ts
// Borra un municipio por su identificador
export const deleteMunicipio = async (id: number): Promise<void> => {
  // Ejecutamos el DELETE y dejamos que los errores se propaguen
  await handleApiRequest<unknown>(`/cat/municipios/${id}`, {
    method: 'DELETE',
  });
};
```

---

### 5) Endpoints de Variedades de papa (`/cat/variedades`)

Del README del proyecto:

- `GET /cat/variedades` (index, filtro `?q=` por código/nombre)
- `POST /cat/variedades`
- `PUT /cat/variedades/{id}`
- `DELETE /cat/variedades/{id}`

JSON esperado:

```json
{
  "codigo_variedad": "WAYCHA",
  "nombre_comercial": "Waych'a",
  "aptitud": "Mesa",
  "ciclo_dias_min": 110,
  "ciclo_dias_max": 140
}
```

#### 5.1) Listar variedades de papa con filtro

```ts
// variedadesApi.ts
// -----------------------------------------
// Funciones CRUD para Variedades de papa
// -----------------------------------------

import { handleApiRequest } from './apiClient';
import type { VariedadPapa } from './catalogTypes';

// Lista variedades filtrando por código o nombre (?q=)
export const getVariedades = async (
  searchText?: string
): Promise<VariedadPapa[]> => {
  // Agregamos el query solo si hay texto de búsqueda
  const query = searchText ? `?q=${encodeURIComponent(searchText)}` : '';

  // GET al endpoint principal de variedades
  const variedades = await handleApiRequest<VariedadPapa[]>(
    `/cat/variedades${query}`,
    {
      method: 'GET',
    }
  );

  // Devolvemos las variedades obtenidas
  return variedades;
};
```

#### 5.2) Crear variedad de papa

```ts
// Estructura de datos permitida por el backend al crear una variedad
export type CreateVariedadPayload = {
  codigo_variedad: string;
  nombre_comercial: string;
  aptitud?: string | null;
  ciclo_dias_min?: number | null;
  ciclo_dias_max?: number | null;
};

// Crea una nueva variedad enviando el JSON esperado
export const createVariedad = async (
  payload: CreateVariedadPayload
): Promise<VariedadPapa> => {
  // POST al endpoint de creación de variedades
  const nuevaVariedad = await handleApiRequest<VariedadPapa>(
    '/cat/variedades',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  );

  // Devolvemos la variedad ya registrada
  return nuevaVariedad;
};
```

#### 5.3) Actualizar variedad de papa

```ts
// Reutilizamos el mismo payload de creación para actualizar
export type UpdateVariedadPayload = CreateVariedadPayload;

// Actualiza una variedad existente usando su id
export const updateVariedad = async (
  id: number,
  payload: UpdateVariedadPayload
): Promise<VariedadPapa> => {
  // PUT con el cuerpo JSON actualizado
  const updatedVariedad = await handleApiRequest<VariedadPapa>(
    `/cat/variedades/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(payload),
    }
  );

  // Devolvemos la variedad ya modificada
  return updatedVariedad;
};
```

#### 5.4) Eliminar variedad de papa

```ts
// Elimina una variedad por identificador
export const deleteVariedad = async (id: number): Promise<void> => {
  // DELETE directo al recurso; errores se manejan vía excepciones
  await handleApiRequest<unknown>(`/cat/variedades/${id}`, {
    method: 'DELETE',
  });
};
```

---

### 6) Ejemplo de pantalla React Native consumiendo `/cat/variedades`

Ejemplo sencillo de pantalla que:

- Lista variedades de papa.
- Permite buscar por código/nombre.
- Muestra mensajes de carga y error.

```tsx
// VariedadesScreen.tsx
// -----------------------------------------
// Pantalla de ejemplo que consume el endpoint /cat/variedades
// -----------------------------------------

import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type { VariedadPapa } from './catalogTypes';
import { getVariedades } from './variedadesApi';

// Componente principal de pantalla de variedades
export const VariedadesScreen: React.FC = () => {
  // Estado local para lista de variedades
  const [variedades, setVariedades] = useState<VariedadPapa[]>([]);
  // Estado para el texto de búsqueda
  const [searchText, setSearchText] = useState<string>('');
  // Estado de carga mientras pedimos datos
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // Estado de mensaje de error, si ocurre
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Función que dispara la carga de datos desde el backend
  const handleLoadVariedades = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Llamamos a la API con el filtro actual
      const data = await getVariedades(searchText);
      // Actualizamos estado con los resultados
      setVariedades(data);
    } catch (error) {
      // Si algo falla, mostramos un mensaje genérico
      setErrorMessage('No se pudieron cargar las variedades.');
      console.error('Error cargando variedades:', error);
    } finally {
      // Quitamos el indicador de carga siempre al final
      setIsLoading(false);
    }
  };

  // Cargar al entrar por primera vez en la pantalla
  useEffect(() => {
    handleLoadVariedades();
  }, []);

  // Render simple de cada fila de variedad
  const renderVariedadItem = ({ item }: { item: VariedadPapa }) => {
    return (
      <View
        style={{
          paddingVertical: 8,
          borderBottomWidth: 1,
          borderColor: '#e5e5e5',
        }}
      >
        <Text style={{ fontWeight: '600' }}>
          {item.codigo_variedad} - {item.nombre_comercial}
        </Text>
        {item.aptitud ? (
          <Text style={{ color: '#555' }}>Aptitud: {item.aptitud}</Text>
        ) : null}
        <Text style={{ color: '#777', fontSize: 12 }}>
          Ciclo (días): {item.ciclo_dias_min ?? '-'} -{' '}
          {item.ciclo_dias_max ?? '-'}
        </Text>
      </View>
    );
  };

  // UI principal de la pantalla
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 16 }}>
        {/* Campo de búsqueda */}
        <TextInput
          placeholder="Buscar por código o nombre..."
          value={searchText}
          onChangeText={setSearchText}
          style={{
            borderWidth: 1,
            borderColor: '#000',
            paddingHorizontal: 12,
            paddingVertical: 8,
            marginBottom: 12,
          }}
        />

        {/* Botón para recargar resultados con el filtro actual */}
        <TouchableOpacity
          onPress={handleLoadVariedades}
          style={{
            backgroundColor: '#000',
            paddingVertical: 10,
            alignItems: 'center',
            marginBottom: 12,
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '600' }}>Buscar</Text>
        </TouchableOpacity>

        {/* Indicador de carga */}
        {isLoading ? <ActivityIndicator size="small" color="#000" /> : null}

        {/* Mensaje de error si algo salió mal */}
        {errorMessage ? (
          <Text style={{ color: 'red', marginBottom: 8 }}>{errorMessage}</Text>
        ) : null}

        {/* Lista de variedades */}
        <FlatList
          data={variedades}
          keyExtractor={(item) => String(item.variedad_id)}
          renderItem={renderVariedadItem}
        />
      </View>
    </SafeAreaView>
  );
};
```

---

### 7) Resumen

- Usa `handleApiRequest` como helper central para **todas las llamadas** a `/cat/departamentos`, `/cat/municipios` y `/cat/variedades`.
- Mantén los **tipos TypeScript** (`Departamento`, `Municipio`, `VariedadPapa`) en un archivo común y separa cada grupo de endpoints en su propio módulo (`departamentosApi.ts`, `municipiosApi.ts`, `variedadesApi.ts`).
- Desde tus pantallas de React Native, llama a estas funciones y maneja estados de **carga, error y datos** como en `VariedadesScreen`.

