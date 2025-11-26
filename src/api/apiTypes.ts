// -----------------------------------------
// src/api/apiTypes.ts
// -----------------------------------------
// Tipos genéricos para envolver respuestas JSON
// del backend Laravel de centralHub.
//
// El backend devuelve objetos con la forma:
//  {
//    status: "ok",
//    message: "texto opcional",
//    data: ... // arreglo, modelo o paginador
//  }
//
// Para índices paginados, data suele ser:
//  {
//    data: T[], // elementos
//    ...       // meta, links, etc.
//  }
//
// Este módulo ayuda a extraer siempre T[] o T
// de forma tipada para la app móvil.
// -----------------------------------------

// Envoltorio genérico de respuesta exitosa.
export type ApiEnvelope<TData> = {
  status: string;
  message?: string;
  data: TData;
};

// Envoltorio específico para listados (índices).
// data puede ser directamente T[] o un paginador
// con propiedad interna data: T[].
export type ApiListEnvelope<TItem> = ApiEnvelope<
  TItem[] | { data: TItem[] }
>;

// -----------------------------------------
// Helper: extraer siempre un arreglo T[] de
// una respuesta de listado (paginada o no).
// -----------------------------------------
export const extractListFromEnvelope = <TItem>(
  envelope: ApiListEnvelope<TItem>
): TItem[] => {
  const raw = envelope.data as unknown;

  // Caso 1: el backend devolvió directamente un arreglo.
  if (Array.isArray(raw)) {
    return raw as TItem[];
  }

  // Caso 2: el backend devolvió un paginador { data: T[], ... }.
  if (
    raw &&
    typeof raw === 'object' &&
    Array.isArray((raw as { data?: unknown }).data)
  ) {
    return (raw as { data: TItem[] }).data;
  }

  // Si nada coincide, devolvemos arreglo vacío para evitar crashes.
  return [];
};


