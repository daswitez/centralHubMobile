// -----------------------------------------
// src/api/txPlantaApi.ts
// -----------------------------------------
// Funciones para transacciones de planta:
//  - POST /tx/planta/lote-planta
//  - POST /tx/planta/lote-salida-envio
// -----------------------------------------

import { handleApiRequest } from './apiClient';
import type {
  RegistrarLotePlantaPayload,
  RegistrarLotePlantaResponse,
  RegistrarLoteSalidaEnvioPayload,
  RegistrarLoteSalidaEnvioResponse,
} from './txPlantaTypes';

// -----------------------------------------
// Registrar lote de planta
// -----------------------------------------
export const registrarLotePlanta = async (
  payload: RegistrarLotePlantaPayload
): Promise<RegistrarLotePlantaResponse> => {
  const response = await handleApiRequest<RegistrarLotePlantaResponse>(
    '/tx/planta/lote-planta',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  );

  return response;
};

// -----------------------------------------
// Registrar lote de salida y opcionalmente un envío
// -----------------------------------------
export const registrarLoteSalidaEnvio = async (
  payload: RegistrarLoteSalidaEnvioPayload
): Promise<RegistrarLoteSalidaEnvioResponse> => {
  const response = await handleApiRequest<RegistrarLoteSalidaEnvioResponse>(
    '/tx/planta/lote-salida-envio',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  );

  return response;
};


