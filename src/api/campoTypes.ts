// -----------------------------------------
// src/api/campoTypes.ts
// -----------------------------------------
// Tipos para recursos del módulo Campo:
//  - Productor
//  - LoteCampo
//  - SensorLectura
// Estos tipos siguen la documentación de los
// endpoints /campo/* usados por centralHub.
// -----------------------------------------

// -----------------------------------------
// Productor agrícola
// -----------------------------------------
export type Productor = {
  // Identificador del productor en la tabla.
  productor_id: number;
  // Código único de productor (ej. "PRD-001").
  codigo_productor: string;
  // Nombre del productor (persona o asociación).
  nombre: string;
  // Municipio al que está asociado.
  municipio_id: number;
  // Teléfono de contacto, opcional.
  telefono?: string | null;
  // Timestamps opcionales.
  created_at?: string;
  updated_at?: string;
};

// -----------------------------------------
// Lote de campo (siembra / cosecha)
// -----------------------------------------
export type LoteCampo = {
  // Identificador del lote de campo.
  lote_campo_id: number;
  // Código de lote de campo (ej. "LC-ALT-001").
  codigo_lote_campo: string;
  // Referencia al productor.
  productor_id: number;
  // Referencia a la variedad de papa.
  variedad_id: number;
  // Superficie del lote en hectáreas.
  superficie_ha: number;
  // Fecha de siembra (ISO string).
  fecha_siembra: string;
  // Fecha de cosecha, opcional.
  fecha_cosecha?: string | null;
  // Humedad de suelo promedio, opcional.
  humedad_suelo_pct?: number | null;
  // Timestamps opcionales.
  created_at?: string;
  updated_at?: string;
};

// -----------------------------------------
// Lectura de sensor asociada a un lote
// -----------------------------------------
export type SensorLectura = {
  // Identificador de la lectura.
  sensor_lectura_id: number;
  // Lote de campo al que pertenece la lectura.
  lote_campo_id: number;
  // Fecha y hora de la lectura (ISO string).
  fecha_hora: string;
  // Tipo de lectura (ej. "HUMEDAD", "TEMP").
  tipo: string;
  // Valor numérico opcional.
  valor_num?: number | null;
  // Valor textual opcional.
  valor_texto?: string | null;
  // Timestamps opcionales.
  created_at?: string;
  updated_at?: string;
};


