// -----------------------------------------
// src/api/apiClient.ts
// -----------------------------------------
// Módulo base de cliente HTTP para centralHub.
// Se encarga de:
//  - Centralizar la URL base del backend Laravel.
//  - Definir un tipo de error estándar de API.
//  - Proveer un helper genérico handleApiRequest<T>
//    para hacer llamadas tipadas a los endpoints
//    de catálogos (/cat/departamentos, /cat/municipios,
//    /cat/variedades, etc.).
// El código sigue la guía de docs/api-react-native.md.
// -----------------------------------------

// URL base del backend Laravel para centralHub.
// IMPORTANTE:
//  - En emulador Android: usa http://10.0.2.2:8000
//  - En emulador iOS:     http://127.0.0.1:8000
//  - En iPhone físico:    usa la IP local de tu PC
//                         (por ejemplo http://192.168.0.10:8000)
// Ajusta la constante de abajo con la IP de tu máquina.
export const API_BASE_URL = 'http://192.168.1.23:8000';

// -----------------------------------------
// Tipo de error estándar para respuestas HTTP
// -----------------------------------------
export type ApiError = {
  // Mensaje corto y legible para mostrar en UI.
  message: string;
  // Código de estado HTTP devuelto por el backend.
  status?: number;
  // Cuerpo de error completo devuelto por el backend
  // (por ejemplo, objeto JSON con detalles de validación).
  details?: unknown;
};

// -----------------------------------------
// Helper genérico para requests al backend
// -----------------------------------------
// - endpointPath: ruta relativa (ej. "/cat/departamentos")
// - options: mismas opciones que fetch (method, headers, body, etc.)
// Devuelve siempre JSON tipado como TResponse o lanza ApiError.
// -----------------------------------------
export const handleApiRequest = async <TResponse>(
  endpointPath: string,
  options: RequestInit = {}
): Promise<TResponse> => {
  // Construimos la URL completa a partir de la base + path relativo.
  const fullUrl = `${API_BASE_URL}${endpointPath}`;

  // Mezclamos las opciones recibidas con valores por defecto
  // orientados a trabajar con JSON.
  const mergedOptions: RequestInit = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  };

  // Ejecutamos la petición HTTP contra el backend Laravel.
  const response = await fetch(fullUrl, mergedOptions);

  // Si el status HTTP no está en el rango 200-299, consideramos
  // que hubo un error y construimos un ApiError detallado.
  if (!response.ok) {
    let errorBody: unknown = undefined;

    try {
      // Intentamos parsear el JSON de error si existe.
      errorBody = await response.json();
    } catch {
      // Si no se puede parsear JSON, dejamos details como undefined.
    }

    const apiError: ApiError = {
      message: `Error HTTP ${response.status}`,
      status: response.status,
      details: errorBody,
    };

    // Lanzamos el error para que la pantalla/llamador lo maneje.
    throw apiError;
  }

  // Si la respuesta es correcta, parseamos y devolvemos el JSON
  // tipado como TResponse.
  return (await response.json()) as TResponse;
};


