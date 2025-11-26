// -----------------------------------------
// src/api/txAlmacenTypes.ts
// -----------------------------------------
// Tipos para transacciones del módulo Almacén:
//  - Despachar a almacén
//  - Recepcionar envío
//  - Despachar a cliente
// -----------------------------------------

import type { ApiEnvelope } from './apiTypes';

// -----------------------------------------
// Despachar a almacén
// -----------------------------------------
export type DespacharAlmacenDetalleItem = {
  codigo_lote_salida: string;
  cantidad_t: number;
};

export type DespacharAlmacenPayload = {
  codigo_envio: string;
  transportista_id: number;
  almacen_destino_id: number;
  fecha_salida: string;
  detalle: DespacharAlmacenDetalleItem[];
};

export type DespacharAlmacenData = {
  codigo_envio: string;
};

export type DespacharAlmacenResponse = ApiEnvelope<DespacharAlmacenData>;

// -----------------------------------------
// Recepcionar envío
// -----------------------------------------
export type RecepcionarEnvioPayload = {
  codigo_envio: string;
  almacen_id: number;
  observacion?: string | null;
};

export type RecepcionarEnvioData = {
  // En muchos casos basta con mensaje; dejamos data genérico.
  ok: boolean;
};

export type RecepcionarEnvioResponse =
  ApiEnvelope<RecepcionarEnvioData | undefined>;

// -----------------------------------------
// Despachar a cliente
// -----------------------------------------
export type DespacharClienteDetalleItem = {
  codigo_lote_salida: string;
  cantidad_t: number;
};

export type DespacharClientePayload = {
  codigo_envio: string;
  almacen_origen_id: number;
  cliente_id: number;
  transportista_id: number;
  fecha_salida: string;
  detalle: DespacharClienteDetalleItem[];
};

export type DespacharClienteData = {
  codigo_envio: string;
};

export type DespacharClienteResponse = ApiEnvelope<DespacharClienteData>;


