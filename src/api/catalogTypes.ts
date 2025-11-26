// -----------------------------------------
// src/api/catalogTypes.ts
// -----------------------------------------
// Tipos TypeScript compartidos para los catálogos
// base del backend Laravel de centralHub.
// Incluye:
//  - Departamento
//  - Municipio
//  - VariedadPapa
// Estos tipos siguen exactamente la forma de los
// ejemplos documentados en docs/api-react-native.md.
// -----------------------------------------

// -----------------------------------------
// Departamento simple (catálogo de departamentos)
// -----------------------------------------
export type Departamento = {
  // Identificador único en la base de datos.
  id: number;
  // Nombre del departamento (ej. "Cochabamba").
  nombre: string;
  // Timestamps estándar de Laravel (opcionales).
  created_at?: string;
  updated_at?: string;
};

// -----------------------------------------
// Municipio ligado a un departamento
// -----------------------------------------
export type Municipio = {
  // Identificador único del municipio.
  id: number;
  // Relación con el catálogo de departamentos.
  departamento_id: number;
  // Nombre del municipio (ej. "Sacaba").
  nombre: string;
  // Timestamps opcionales.
  created_at?: string;
  updated_at?: string;
};

// -----------------------------------------
// Variedad de papa con rango de días de ciclo
// -----------------------------------------
export type VariedadPapa = {
  // Identificador de la variedad en la tabla.
  variedad_id: number;
  // Código corto de la variedad (ej. "WAYCHA").
  codigo_variedad: string;
  // Nombre comercial amigable (ej. "Waych'a").
  nombre_comercial: string;
  // Aptitud de la papa (ej. "Mesa", "Industria"), opcional.
  aptitud?: string | null;
  // Rango mínimo de días de ciclo, opcional.
  ciclo_dias_min?: number | null;
  // Rango máximo de días de ciclo, opcional.
  ciclo_dias_max?: number | null;
  // Timestamps opcionales.
  created_at?: string;
  updated_at?: string;
};


