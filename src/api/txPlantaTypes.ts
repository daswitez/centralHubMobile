// -----------------------------------------
// src/api/txPlantaTypes.ts
// -----------------------------------------
// Tipos para transacciones del módulo Planta:
//  - Registrar lote de planta
//  - Registrar lote de salida y envío
// Estos tipos envuelven respuestas JSON del backend
// que siguen el patrón ApiEnvelope<{ ... }>.
// -----------------------------------------

import type { ApiEnvelope } from './apiTypes';

// -----------------------------------------
// Entrada de materia prima para un lote de planta
// -----------------------------------------
export type EntradaLotePlanta = {
  lote_campo_id: number;
  peso_entrada_t: number;
};

// Payload para registrar lote de planta
export type RegistrarLotePlantaPayload = {
  codigo_lote_planta: string;
  planta_id: number;
  fecha_inicio: string;
  entradas: EntradaLotePlanta[];
};

// Datos específicos devueltos al registrar lote de planta
export type RegistrarLotePlantaData = {
  codigo_lote_planta: string;
  planta_id: number;
  entradas_count: number;
};

// Respuesta completa (envoltorio + datos)
export type RegistrarLotePlantaResponse =
  ApiEnvelope<RegistrarLotePlantaData>;

// -----------------------------------------
// Payload base para registrar lote de salida
// -----------------------------------------
export type RegistrarLoteSalidaPayloadBase = {
  codigo_lote_salida: string;
  lote_planta_id: number;
  sku: string;
  peso_t: number;
  fecha_empaque: string;
};

// Campos adicionales si también se crea un envío
export type RegistrarEnvioOpcionalPayload = {
  crear_envio?: boolean;
  codigo_envio?: string;
  ruta_id?: number | null;
  transportista_id?: number | null;
  fecha_salida?: string | null;
};

// Payload completo que acepta ambos escenarios
export type RegistrarLoteSalidaEnvioPayload =
  RegistrarLoteSalidaPayloadBase & RegistrarEnvioOpcionalPayload;

// Datos específicos devueltos al registrar lote de salida / envío
export type RegistrarLoteSalidaEnvioData = {
  codigo_lote_salida: string;
  codigo_envio?: string | null;
  crear_envio: boolean;
};

// Respuesta completa (envoltorio + datos)
export type RegistrarLoteSalidaEnvioResponse =
  ApiEnvelope<RegistrarLoteSalidaEnvioData>;


