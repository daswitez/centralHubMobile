// -----------------------------------------
// src/screens/TxAlmacenScreens.tsx
// -----------------------------------------
// Pantallas para transacciones del módulo Almacén:
// 1. Despachar a Almacén (desde Planta)
// 2. Recepcionar Envío (en Almacén)
// 3. Despachar a Cliente (desde Almacén)
// -----------------------------------------

import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

import {
  despacharAlmacen,
  recepcionarEnvio,
  despacharCliente,
} from '../api/txAlmacenApi';
import type {
  DespacharAlmacenDetalleItem,
  DespacharClienteDetalleItem,
} from '../api/txAlmacenTypes';

import { getAlmacenes } from '../api/almacenesApi';
import { getClientes } from '../api/clientesApi';
import { getTransportistas } from '../api/transportistasApi';

import type { Almacen, Cliente, Transportista } from '../api/catalogTypes';

// -----------------------------------------
// Pantalla 1: Despachar a Almacén
// -----------------------------------------
export const DespacharAlmacenScreen: React.FC = () => {
  const [codigoEnvio, setCodigoEnvio] = useState('');
  const [transportistaId, setTransportistaId] = useState('');
  const [almacenDestinoId, setAlmacenDestinoId] = useState('');
  const [fechaSalida, setFechaSalida] = useState(new Date().toISOString().split('T')[0]);

  // Auxiliares
  const [transportistas, setTransportistas] = useState<Transportista[]>([]);
  const [almacenes, setAlmacenes] = useState<Almacen[]>([]);

  // Detalle dinámico
  const [detalle, setDetalle] = useState<DespacharAlmacenDetalleItem[]>([]);
  const [tempLoteSalida, setTempLoteSalida] = useState('');
  const [tempCantidad, setTempCantidad] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [transportistasData, almacenesData] = await Promise.all([
          getTransportistas(),
          getAlmacenes(),
        ]);
        setTransportistas(transportistasData);
        setAlmacenes(almacenesData);
      } catch (error) {
        console.error('Error cargando auxiliares:', error);
      }
    };
    void fetchData();
  }, []);

  const handleAddDetalle = () => {
    const cantidad = Number(tempCantidad);
    if (!tempLoteSalida || !cantidad) {
      Alert.alert('Error', 'Ingresa código de lote de salida y cantidad válida.');
      return;
    }
    setDetalle([...detalle, { codigo_lote_salida: tempLoteSalida, cantidad_t: cantidad }]);
    setTempLoteSalida('');
    setTempCantidad('');
  };

  const handleRemoveDetalle = (index: number) => {
    const newDetalle = [...detalle];
    newDetalle.splice(index, 1);
    setDetalle(newDetalle);
  };

  const handleSubmit = async () => {
    if (!codigoEnvio || !transportistaId || !almacenDestinoId || detalle.length === 0) {
      setMessage('Faltan datos obligatorios o detalle del envío.');
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      await despacharAlmacen({
        codigo_envio: codigoEnvio,
        transportista_id: Number(transportistaId),
        almacen_destino_id: Number(almacenDestinoId),
        fecha_salida: fechaSalida,
        detalle,
      });
      setMessage('Despacho a almacén registrado correctamente.');
      setCodigoEnvio('');
      setTransportistaId('');
      setAlmacenDestinoId('');
      setDetalle([]);
    } catch (error) {
      console.error(error);
      setMessage('Error al registrar despacho a almacén.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F4F6F9' }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#111827' }}>
            Despachar a Almacén
          </Text>
          <Text style={{ fontSize: 13, color: '#6B7280' }}>
            Envío desde planta hacia un almacén
          </Text>
        </View>

        {message && (
          <View style={{ padding: 12, backgroundColor: '#FEF2F2', marginBottom: 16, borderRadius: 6 }}>
            <Text style={{ color: '#991B1B' }}>{message}</Text>
          </View>
        )}

        <View style={{ backgroundColor: 'white', padding: 16, borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB' }}>
          <TextInput
            value={codigoEnvio}
            onChangeText={setCodigoEnvio}
            placeholder="Código de Envío"
            style={{ borderWidth: 1, borderColor: '#D1D5DB', padding: 8, borderRadius: 4, marginBottom: 12 }}
          />

          <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 4 }}>Transportista</Text>
          <View style={{ borderWidth: 1, borderColor: '#D1D5DB', marginBottom: 12, borderRadius: 4 }}>
            <Picker
              selectedValue={transportistaId}
              onValueChange={(itemValue) => setTransportistaId(itemValue)}
            >
              <Picker.Item label="Selecciona un transportista..." value="" />
              {transportistas.map((t) => (
                <Picker.Item
                  key={t.transportista_id}
                  label={t.nombre}
                  value={String(t.transportista_id)}
                />
              ))}
            </Picker>
          </View>

          <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 4 }}>Almacén Destino</Text>
          <View style={{ borderWidth: 1, borderColor: '#D1D5DB', marginBottom: 12, borderRadius: 4 }}>
            <Picker
              selectedValue={almacenDestinoId}
              onValueChange={(itemValue) => setAlmacenDestinoId(itemValue)}
            >
              <Picker.Item label="Selecciona almacén destino..." value="" />
              {almacenes.map((a) => (
                <Picker.Item
                  key={a.almacen_id}
                  label={a.nombre}
                  value={String(a.almacen_id)}
                />
              ))}
            </Picker>
          </View>

          <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 4 }}>Fecha Salida</Text>
          <TextInput
            value={fechaSalida}
            onChangeText={setFechaSalida}
            placeholder="Fecha Salida (YYYY-MM-DD)"
            style={{ borderWidth: 1, borderColor: '#D1D5DB', padding: 8, borderRadius: 4, marginBottom: 12 }}
          />

          <Text style={{ fontSize: 14, fontWeight: '600', marginTop: 8, marginBottom: 8 }}>Detalle (Lotes)</Text>
          
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
            <TextInput
              value={tempLoteSalida}
              onChangeText={setTempLoteSalida}
              placeholder="Cód. Lote Salida"
              style={{ flex: 1, borderWidth: 1, borderColor: '#D1D5DB', padding: 8, borderRadius: 4 }}
            />
            <TextInput
              value={tempCantidad}
              onChangeText={setTempCantidad}
              keyboardType="numeric"
              placeholder="Cant (t)"
              style={{ flex: 1, borderWidth: 1, borderColor: '#D1D5DB', padding: 8, borderRadius: 4 }}
            />
            <TouchableOpacity
              onPress={handleAddDetalle}
              style={{ backgroundColor: '#10B981', padding: 10, borderRadius: 4, justifyContent: 'center' }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>+</Text>
            </TouchableOpacity>
          </View>

          {detalle.map((item, index) => (
            <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 8, backgroundColor: '#F3F4F6', marginBottom: 4, borderRadius: 4 }}>
              <Text>{item.codigo_lote_salida} - {item.cantidad_t} t</Text>
              <TouchableOpacity onPress={() => handleRemoveDetalle(index)}>
                <Text style={{ color: '#EF4444' }}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isSaving}
            style={{
              marginTop: 16,
              backgroundColor: '#111827',
              padding: 12,
              borderRadius: 6,
              alignItems: 'center',
              opacity: isSaving ? 0.7 : 1,
            }}
          >
            <Text style={{ color: 'white', fontWeight: '600' }}>
              {isSaving ? 'Guardando...' : 'Registrar Despacho'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// -----------------------------------------
// Pantalla 2: Recepcionar Envío
// -----------------------------------------
export const RecepcionarEnvioScreen: React.FC = () => {
  const [codigoEnvio, setCodigoEnvio] = useState('');
  const [almacenId, setAlmacenId] = useState('');
  const [observacion, setObservacion] = useState('');
  
  const [almacenes, setAlmacenes] = useState<Almacen[]>([]);

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAlmacenes();
        setAlmacenes(data);
      } catch (error) {
        console.error('Error cargando almacenes:', error);
      }
    };
    void fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!codigoEnvio || !almacenId) {
      setMessage('Código de envío y ID de almacén son obligatorios.');
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      await recepcionarEnvio({
        codigo_envio: codigoEnvio,
        almacen_id: Number(almacenId),
        observacion: observacion || undefined,
      });
      setMessage('Envío recepcionado correctamente.');
      setCodigoEnvio('');
      setAlmacenId('');
      setObservacion('');
    } catch (error) {
      console.error(error);
      setMessage('Error al recepcionar envío (verifica si existe).');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F4F6F9' }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#111827' }}>
            Recepcionar Envío
          </Text>
          <Text style={{ fontSize: 13, color: '#6B7280' }}>
            Entrada de mercancía a almacén
          </Text>
        </View>

        {message && (
          <View style={{ padding: 12, backgroundColor: '#FEF2F2', marginBottom: 16, borderRadius: 6 }}>
            <Text style={{ color: '#991B1B' }}>{message}</Text>
          </View>
        )}

        <View style={{ backgroundColor: 'white', padding: 16, borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB' }}>
          <TextInput
            value={codigoEnvio}
            onChangeText={setCodigoEnvio}
            placeholder="Código de Envío a recibir"
            style={{ borderWidth: 1, borderColor: '#D1D5DB', padding: 8, borderRadius: 4, marginBottom: 12 }}
          />

          <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 4 }}>Almacén Receptor</Text>
          <View style={{ borderWidth: 1, borderColor: '#D1D5DB', marginBottom: 12, borderRadius: 4 }}>
            <Picker
              selectedValue={almacenId}
              onValueChange={(itemValue) => setAlmacenId(itemValue)}
            >
              <Picker.Item label="Selecciona almacén receptor..." value="" />
              {almacenes.map((a) => (
                <Picker.Item
                  key={a.almacen_id}
                  label={a.nombre}
                  value={String(a.almacen_id)}
                />
              ))}
            </Picker>
          </View>

          <TextInput
            value={observacion}
            onChangeText={setObservacion}
            placeholder="Observaciones (opcional)"
            multiline
            style={{ borderWidth: 1, borderColor: '#D1D5DB', padding: 8, borderRadius: 4, marginBottom: 12, height: 80 }}
          />

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isSaving}
            style={{
              marginTop: 16,
              backgroundColor: '#111827',
              padding: 12,
              borderRadius: 6,
              alignItems: 'center',
              opacity: isSaving ? 0.7 : 1,
            }}
          >
            <Text style={{ color: 'white', fontWeight: '600' }}>
              {isSaving ? 'Procesando...' : 'Recepcionar'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// -----------------------------------------
// Pantalla 3: Despachar a Cliente
// -----------------------------------------
export const DespacharClienteScreen: React.FC = () => {
  const [codigoEnvio, setCodigoEnvio] = useState('');
  const [almacenOrigenId, setAlmacenOrigenId] = useState('');
  const [clienteId, setClienteId] = useState('');
  const [transportistaId, setTransportistaId] = useState('');
  const [fechaSalida, setFechaSalida] = useState(new Date().toISOString().split('T')[0]);

  // Auxiliares
  const [almacenes, setAlmacenes] = useState<Almacen[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [transportistas, setTransportistas] = useState<Transportista[]>([]);

  // Detalle dinámico
  const [detalle, setDetalle] = useState<DespacharClienteDetalleItem[]>([]);
  const [tempLoteSalida, setTempLoteSalida] = useState('');
  const [tempCantidad, setTempCantidad] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [almacenesData, clientesData, transportistasData] = await Promise.all([
          getAlmacenes(),
          getClientes(),
          getTransportistas(),
        ]);
        setAlmacenes(almacenesData);
        setClientes(clientesData);
        setTransportistas(transportistasData);
      } catch (error) {
        console.error('Error cargando auxiliares:', error);
      }
    };
    void fetchData();
  }, []);

  const handleAddDetalle = () => {
    const cantidad = Number(tempCantidad);
    if (!tempLoteSalida || !cantidad) {
      Alert.alert('Error', 'Ingresa código de lote y cantidad válida.');
      return;
    }
    setDetalle([...detalle, { codigo_lote_salida: tempLoteSalida, cantidad_t: cantidad }]);
    setTempLoteSalida('');
    setTempCantidad('');
  };

  const handleRemoveDetalle = (index: number) => {
    const newDetalle = [...detalle];
    newDetalle.splice(index, 1);
    setDetalle(newDetalle);
  };

  const handleSubmit = async () => {
    if (!codigoEnvio || !almacenOrigenId || !clienteId || !transportistaId || detalle.length === 0) {
      setMessage('Faltan datos obligatorios o detalle del despacho.');
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      await despacharCliente({
        codigo_envio: codigoEnvio,
        almacen_origen_id: Number(almacenOrigenId),
        cliente_id: Number(clienteId),
        transportista_id: Number(transportistaId),
        fecha_salida: fechaSalida,
        detalle,
      });
      setMessage('Despacho a cliente registrado correctamente.');
      setCodigoEnvio('');
      setAlmacenOrigenId('');
      setClienteId('');
      setTransportistaId('');
      setDetalle([]);
    } catch (error) {
      console.error(error);
      setMessage('Error al registrar despacho a cliente.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F4F6F9' }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#111827' }}>
            Despachar a Cliente
          </Text>
          <Text style={{ fontSize: 13, color: '#6B7280' }}>
            Venta o salida final desde almacén
          </Text>
        </View>

        {message && (
          <View style={{ padding: 12, backgroundColor: '#FEF2F2', marginBottom: 16, borderRadius: 6 }}>
            <Text style={{ color: '#991B1B' }}>{message}</Text>
          </View>
        )}

        <View style={{ backgroundColor: 'white', padding: 16, borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB' }}>
          <TextInput
            value={codigoEnvio}
            onChangeText={setCodigoEnvio}
            placeholder="Código de Envío"
            style={{ borderWidth: 1, borderColor: '#D1D5DB', padding: 8, borderRadius: 4, marginBottom: 12 }}
          />

          <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 4 }}>Almacén Origen</Text>
          <View style={{ borderWidth: 1, borderColor: '#D1D5DB', marginBottom: 12, borderRadius: 4 }}>
            <Picker
              selectedValue={almacenOrigenId}
              onValueChange={(itemValue) => setAlmacenOrigenId(itemValue)}
            >
              <Picker.Item label="Selecciona almacén origen..." value="" />
              {almacenes.map((a) => (
                <Picker.Item
                  key={a.almacen_id}
                  label={a.nombre}
                  value={String(a.almacen_id)}
                />
              ))}
            </Picker>
          </View>

          <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 4 }}>Cliente</Text>
          <View style={{ borderWidth: 1, borderColor: '#D1D5DB', marginBottom: 12, borderRadius: 4 }}>
            <Picker
              selectedValue={clienteId}
              onValueChange={(itemValue) => setClienteId(itemValue)}
            >
              <Picker.Item label="Selecciona cliente..." value="" />
              {clientes.map((c) => (
                <Picker.Item
                  key={c.cliente_id}
                  label={c.nombre}
                  value={String(c.cliente_id)}
                />
              ))}
            </Picker>
          </View>

          <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 4 }}>Transportista</Text>
          <View style={{ borderWidth: 1, borderColor: '#D1D5DB', marginBottom: 12, borderRadius: 4 }}>
            <Picker
              selectedValue={transportistaId}
              onValueChange={(itemValue) => setTransportistaId(itemValue)}
            >
              <Picker.Item label="Selecciona transportista..." value="" />
              {transportistas.map((t) => (
                <Picker.Item
                  key={t.transportista_id}
                  label={t.nombre}
                  value={String(t.transportista_id)}
                />
              ))}
            </Picker>
          </View>

          <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 4 }}>Fecha Salida</Text>
          <TextInput
            value={fechaSalida}
            onChangeText={setFechaSalida}
            placeholder="Fecha Salida (YYYY-MM-DD)"
            style={{ borderWidth: 1, borderColor: '#D1D5DB', padding: 8, borderRadius: 4, marginBottom: 12 }}
          />

          <Text style={{ fontSize: 14, fontWeight: '600', marginTop: 8, marginBottom: 8 }}>Detalle (Lotes)</Text>
          
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
            <TextInput
              value={tempLoteSalida}
              onChangeText={setTempLoteSalida}
              placeholder="Cód. Lote"
              style={{ flex: 1, borderWidth: 1, borderColor: '#D1D5DB', padding: 8, borderRadius: 4 }}
            />
            <TextInput
              value={tempCantidad}
              onChangeText={setTempCantidad}
              keyboardType="numeric"
              placeholder="Cant (t)"
              style={{ flex: 1, borderWidth: 1, borderColor: '#D1D5DB', padding: 8, borderRadius: 4 }}
            />
            <TouchableOpacity
              onPress={handleAddDetalle}
              style={{ backgroundColor: '#10B981', padding: 10, borderRadius: 4, justifyContent: 'center' }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>+</Text>
            </TouchableOpacity>
          </View>

          {detalle.map((item, index) => (
            <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 8, backgroundColor: '#F3F4F6', marginBottom: 4, borderRadius: 4 }}>
              <Text>{item.codigo_lote_salida} - {item.cantidad_t} t</Text>
              <TouchableOpacity onPress={() => handleRemoveDetalle(index)}>
                <Text style={{ color: '#EF4444' }}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isSaving}
            style={{
              marginTop: 16,
              backgroundColor: '#111827',
              padding: 12,
              borderRadius: 6,
              alignItems: 'center',
              opacity: isSaving ? 0.7 : 1,
            }}
          >
            <Text style={{ color: 'white', fontWeight: '600' }}>
              {isSaving ? 'Guardando...' : 'Registrar Despacho'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
