// -----------------------------------------
// src/api/txAlmacenApi.ts
// -----------------------------------------
// Funciones para transacciones de almacén:
//  - POST /tx/almacen/despachar-al-almacen
//  - POST /tx/almacen/recepcionar-envio
//  - POST /tx/almacen/despachar-al-cliente
// -----------------------------------------

import { handleApiRequest } from './apiClient';
import type {
  DespacharAlmacenPayload,
  DespacharAlmacenResponse,
  RecepcionarEnvioPayload,
  RecepcionarEnvioResponse,
  DespacharClientePayload,
  DespacharClienteResponse,
} from './txAlmacenTypes';

// -----------------------------------------
// Despachar desde planta hacia almacén
// -----------------------------------------
export const despacharAlmacen = async (
  payload: DespacharAlmacenPayload
): Promise<DespacharAlmacenResponse> => {
  const response = await handleApiRequest<DespacharAlmacenResponse>(
    '/tx/almacen/despachar-al-almacen',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  );

  return response;
};

// -----------------------------------------
// Recepcionar envío en almacén
// -----------------------------------------
export const recepcionarEnvio = async (
  payload: RecepcionarEnvioPayload
): Promise<RecepcionarEnvioResponse> => {
  const response = await handleApiRequest<RecepcionarEnvioResponse>(
    '/tx/almacen/recepcionar-envio',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  );

  return response;
};

// -----------------------------------------
// Despachar desde almacén hacia cliente
// -----------------------------------------
export const despacharCliente = async (
  payload: DespacharClientePayload
): Promise<DespacharClienteResponse> => {
  const response = await handleApiRequest<DespacharClienteResponse>(
    '/tx/almacen/despachar-al-cliente',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  );

  return response;
};


