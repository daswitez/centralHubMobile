// -----------------------------------------
// src/api/catalogTypes.ts
// -----------------------------------------
// Tipos TypeScript compartidos para los catálogos
// base del backend Laravel de centralHub.
// Incluye catálogos base y catálogos extendidos:
//  - Departamento
//  - Municipio
//  - VariedadPapa
//  - Planta
//  - Cliente
//  - Transportista
//  - Almacen
// Estos tipos siguen exactamente la forma de los
// ejemplos documentados en docs/api-react-native.md
// y docs adicionales de catálogos.
// -----------------------------------------

// -----------------------------------------
// Departamento simple (catálogo de departamentos)
// -----------------------------------------
export type Departamento = {
  // Identificador único en la base de datos.
  departamento_id: number;
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
  municipio_id: number;
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

// -----------------------------------------
// Planta de proceso
// -----------------------------------------
export type Planta = {
  // Identificador de la planta en la tabla.
  planta_id: number;
  // Código corto de planta (ej. "PLT-CBB-01").
  codigo_planta: string;
  // Nombre descriptivo de la planta.
  nombre: string;
  // Municipio asociado a la planta.
  municipio_id: number;
  // Datos de localización opcionales.
  direccion?: string | null;
  lat?: number | null;
  lon?: number | null;
  // Timestamps opcionales.
  created_at?: string;
  updated_at?: string;
};

// -----------------------------------------
// Cliente (mayorista, supermercado, etc.)
// -----------------------------------------
export type Cliente = {
  // Identificador del cliente en la tabla.
  cliente_id: number;
  // Código de cliente (ej. "CLT-0001").
  codigo_cliente: string;
  // Nombre legal o comercial del cliente.
  nombre: string;
  // Tipo de cliente (ej. "MAYORISTA", "RETAIL").
  tipo: string;
  // Municipio de referencia, opcional.
  municipio_id?: number | null;
  direccion?: string | null;
  lat?: number | null;
  lon?: number | null;
  // Timestamps opcionales.
  created_at?: string;
  updated_at?: string;
};

// -----------------------------------------
// Transportista (persona o empresa)
// -----------------------------------------
export type Transportista = {
  // Identificador del transportista.
  transportista_id: number;
  // Código de transportista (ej. "TRP-01").
  codigo_transp: string;
  // Nombre del transportista o razón social.
  nombre: string;
  // Número de licencia, opcional.
  nro_licencia?: string | null;
  // Timestamps opcionales.
  created_at?: string;
  updated_at?: string;
};

// -----------------------------------------
// Almacén físico
// -----------------------------------------
export type Almacen = {
  // Identificador del almacén.
  almacen_id: number;
  // Código de almacén (ej. "ALM-01").
  codigo_almacen: string;
  // Nombre del almacén.
  nombre: string;
  // Municipio donde se encuentra.
  municipio_id: number;
  // Datos de localización opcionales.
  direccion?: string | null;
  lat?: number | null;
  lon?: number | null;
  // Timestamps opcionales.
  created_at?: string;
  updated_at?: string;
};


