// -----------------------------------------
// src/screens/TxPlantaScreens.tsx
// -----------------------------------------
// Pantallas para transacciones del módulo Planta:
// 1. Registrar Lote Planta (Entrada de materia prima)
// 2. Registrar Lote Salida (Producto terminado y envío opcional)
// -----------------------------------------

import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Switch,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

import { registrarLotePlanta, registrarLoteSalidaEnvio } from '../api/txPlantaApi';
import type { EntradaLotePlanta } from '../api/txPlantaTypes';

import { getPlantas } from '../api/plantasApi';
import { getLotesCampo } from '../api/lotesCampoApi';
import { getTransportistas } from '../api/transportistasApi';

import type { Planta } from '../api/catalogTypes';
import type { LoteCampo } from '../api/campoTypes';
import type { Transportista } from '../api/catalogTypes';

// -----------------------------------------
// Pantalla 1: Registrar Lote Planta
// -----------------------------------------
export const RegistrarLotePlantaScreen: React.FC = () => {
  const [codigoLote, setCodigoLote] = useState('');
  const [plantaId, setPlantaId] = useState('');
  const [fechaInicio, setFechaInicio] = useState(new Date().toISOString().split('T')[0]);
  
  // Listas auxiliares
  const [plantas, setPlantas] = useState<Planta[]>([]);
  const [lotesCampo, setLotesCampo] = useState<LoteCampo[]>([]);

  // Lista dinámica de entradas (materia prima)
  const [entradas, setEntradas] = useState<EntradaLotePlanta[]>([]);
  
  // Estado para el formulario de agregar entrada
  const [tempLoteCampoId, setTempLoteCampoId] = useState('');
  const [tempPeso, setTempPeso] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [plantasData, lotesData] = await Promise.all([
          getPlantas(),
          getLotesCampo(),
        ]);
        setPlantas(plantasData);
        setLotesCampo(lotesData);
      } catch (error) {
        console.error('Error cargando datos auxiliares:', error);
      }
    };
    void fetchData();
  }, []);

  const handleAddEntrada = () => {
    const loteId = Number(tempLoteCampoId);
    const peso = Number(tempPeso);

    if (!loteId || !peso) {
      Alert.alert('Error', 'Selecciona un lote de campo y peso válidos.');
      return;
    }

    setEntradas([...entradas, { lote_campo_id: loteId, peso_entrada_t: peso }]);
    setTempLoteCampoId('');
    setTempPeso('');
  };

  const handleRemoveEntrada = (index: number) => {
    const newEntradas = [...entradas];
    newEntradas.splice(index, 1);
    setEntradas(newEntradas);
  };

  const handleSubmit = async () => {
    if (!codigoLote || !plantaId || entradas.length === 0) {
      setMessage('Faltan datos obligatorios o entradas de materia prima.');
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      await registrarLotePlanta({
        codigo_lote_planta: codigoLote,
        planta_id: Number(plantaId),
        fecha_inicio: fechaInicio,
        entradas,
      });
      setMessage('Lote de planta registrado correctamente.');
      setCodigoLote('');
      setPlantaId('');
      setEntradas([]);
    } catch (error) {
      console.error(error);
      setMessage('Error al registrar el lote de planta.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F4F6F9' }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#111827' }}>
            Registrar Lote de Planta
          </Text>
          <Text style={{ fontSize: 13, color: '#6B7280' }}>
            Entrada de materia prima a proceso
          </Text>
        </View>

        {message && (
          <View style={{ padding: 12, backgroundColor: '#FEF2F2', marginBottom: 16, borderRadius: 6 }}>
            <Text style={{ color: '#991B1B' }}>{message}</Text>
          </View>
        )}

        <View style={{ backgroundColor: 'white', padding: 16, borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB' }}>
          <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 4 }}>Código Lote Planta</Text>
          <TextInput
            value={codigoLote}
            onChangeText={setCodigoLote}
            placeholder="Ej. LP-2023-001"
            style={{ borderWidth: 1, borderColor: '#D1D5DB', padding: 8, borderRadius: 4, marginBottom: 12 }}
          />

          <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 4 }}>Planta</Text>
          <View style={{ borderWidth: 1, borderColor: '#D1D5DB', marginBottom: 12, borderRadius: 4 }}>
            <Picker
              selectedValue={plantaId}
              onValueChange={(itemValue) => setPlantaId(itemValue)}
            >
              <Picker.Item label="Selecciona una planta..." value="" />
              {plantas.map((p) => (
                <Picker.Item
                  key={p.planta_id}
                  label={`${p.nombre} (${p.codigo_planta})`}
                  value={String(p.planta_id)}
                />
              ))}
            </Picker>
          </View>

          <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 4 }}>Fecha Inicio</Text>
          <TextInput
            value={fechaInicio}
            onChangeText={setFechaInicio}
            placeholder="YYYY-MM-DD"
            style={{ borderWidth: 1, borderColor: '#D1D5DB', padding: 8, borderRadius: 4, marginBottom: 12 }}
          />

          <Text style={{ fontSize: 14, fontWeight: '600', marginTop: 8, marginBottom: 8 }}>Entradas (Materia Prima)</Text>
          
          <View style={{ marginBottom: 12 }}>
             <View style={{ borderWidth: 1, borderColor: '#D1D5DB', marginBottom: 8, borderRadius: 4 }}>
              <Picker
                selectedValue={tempLoteCampoId}
                onValueChange={(itemValue) => setTempLoteCampoId(itemValue)}
              >
                <Picker.Item label="Selecciona Lote Campo..." value="" />
                {lotesCampo.map((l) => (
                  <Picker.Item
                    key={l.lote_campo_id}
                    label={`${l.codigo_lote_campo} (${l.superficie_ha} ha)`}
                    value={String(l.lote_campo_id)}
                  />
                ))}
              </Picker>
            </View>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TextInput
                value={tempPeso}
                onChangeText={setTempPeso}
                keyboardType="numeric"
                placeholder="Peso (t)"
                style={{ flex: 1, borderWidth: 1, borderColor: '#D1D5DB', padding: 8, borderRadius: 4 }}
              />
              <TouchableOpacity
                onPress={handleAddEntrada}
                style={{ backgroundColor: '#10B981', padding: 10, borderRadius: 4, justifyContent: 'center', paddingHorizontal: 20 }}
              >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Agregar</Text>
              </TouchableOpacity>
            </View>
          </View>

          {entradas.map((item, index) => {
            const lote = lotesCampo.find(l => l.lote_campo_id === item.lote_campo_id);
            return (
              <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 8, backgroundColor: '#F3F4F6', marginBottom: 4, borderRadius: 4 }}>
                <Text>Lote: {lote ? lote.codigo_lote_campo : item.lote_campo_id} - {item.peso_entrada_t} t</Text>
                <TouchableOpacity onPress={() => handleRemoveEntrada(index)}>
                  <Text style={{ color: '#EF4444' }}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            );
          })}

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
              {isSaving ? 'Guardando...' : 'Registrar Lote'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// -----------------------------------------
// Pantalla 2: Registrar Lote Salida
// -----------------------------------------
export const RegistrarLoteSalidaScreen: React.FC = () => {
  const [codigoLoteSalida, setCodigoLoteSalida] = useState('');
  const [lotePlantaId, setLotePlantaId] = useState('');
  const [sku, setSku] = useState('');
  const [peso, setPeso] = useState('');
  const [fechaEmpaque, setFechaEmpaque] = useState(new Date().toISOString().split('T')[0]);

  // Envío opcional
  const [crearEnvio, setCrearEnvio] = useState(false);
  const [codigoEnvio, setCodigoEnvio] = useState('');
  const [rutaId, setRutaId] = useState('');
  const [transportistaId, setTransportistaId] = useState('');
  const [fechaSalida, setFechaSalida] = useState(new Date().toISOString().split('T')[0]);

  // Auxiliares
  const [transportistas, setTransportistas] = useState<Transportista[]>([]);

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTransportistas();
        setTransportistas(data);
      } catch (error) {
        console.error('Error cargando transportistas:', error);
      }
    };
    void fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!codigoLoteSalida || !lotePlantaId || !sku || !peso) {
      setMessage('Completa los datos del lote de salida.');
      return;
    }

    if (crearEnvio && (!codigoEnvio || !transportistaId)) {
      setMessage('Completa los datos del envío.');
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      await registrarLoteSalidaEnvio({
        codigo_lote_salida: codigoLoteSalida,
        lote_planta_id: Number(lotePlantaId),
        sku,
        peso_t: Number(peso),
        fecha_empaque: fechaEmpaque,
        crear_envio: crearEnvio,
        codigo_envio: crearEnvio ? codigoEnvio : undefined,
        ruta_id: crearEnvio && rutaId ? Number(rutaId) : undefined,
        transportista_id: crearEnvio ? Number(transportistaId) : undefined,
        fecha_salida: crearEnvio ? fechaSalida : undefined,
      });

      setMessage('Lote de salida registrado correctamente.');
      setCodigoLoteSalida('');
      setLotePlantaId('');
      setSku('');
      setPeso('');
      setCrearEnvio(false);
      setCodigoEnvio('');
      setRutaId('');
      setTransportistaId('');
    } catch (error) {
      console.error(error);
      setMessage('Error al registrar lote de salida.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F4F6F9' }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#111827' }}>
            Registrar Lote Salida
          </Text>
          <Text style={{ fontSize: 13, color: '#6B7280' }}>
            Producto terminado y despacho opcional
          </Text>
        </View>

        {message && (
          <View style={{ padding: 12, backgroundColor: '#FEF2F2', marginBottom: 16, borderRadius: 6 }}>
            <Text style={{ color: '#991B1B' }}>{message}</Text>
          </View>
        )}

        <View style={{ backgroundColor: 'white', padding: 16, borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB' }}>
          <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 8, color: '#374151' }}>Datos del Lote</Text>
          
          <TextInput
            value={codigoLoteSalida}
            onChangeText={setCodigoLoteSalida}
            placeholder="Código Lote Salida"
            style={{ borderWidth: 1, borderColor: '#D1D5DB', padding: 8, borderRadius: 4, marginBottom: 12 }}
          />
          <TextInput
            value={lotePlantaId}
            onChangeText={setLotePlantaId}
            keyboardType="numeric"
            placeholder="ID Lote Planta (Origen)"
            style={{ borderWidth: 1, borderColor: '#D1D5DB', padding: 8, borderRadius: 4, marginBottom: 12 }}
          />
          <TextInput
            value={sku}
            onChangeText={setSku}
            placeholder="SKU / Producto"
            style={{ borderWidth: 1, borderColor: '#D1D5DB', padding: 8, borderRadius: 4, marginBottom: 12 }}
          />
          <TextInput
            value={peso}
            onChangeText={setPeso}
            keyboardType="numeric"
            placeholder="Peso Neto (t)"
            style={{ borderWidth: 1, borderColor: '#D1D5DB', padding: 8, borderRadius: 4, marginBottom: 12 }}
          />
          <TextInput
            value={fechaEmpaque}
            onChangeText={setFechaEmpaque}
            placeholder="Fecha Empaque (YYYY-MM-DD)"
            style={{ borderWidth: 1, borderColor: '#D1D5DB', padding: 8, borderRadius: 4, marginBottom: 12 }}
          />

          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 12 }}>
            <Switch value={crearEnvio} onValueChange={setCrearEnvio} />
            <Text style={{ marginLeft: 8, fontWeight: '500' }}>Crear envío inmediatamente</Text>
          </View>

          {crearEnvio && (
            <View style={{ padding: 12, backgroundColor: '#F9FAFB', borderRadius: 6, borderWidth: 1, borderColor: '#E5E7EB' }}>
              <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 8, color: '#374151' }}>Datos del Envío</Text>
              <TextInput
                value={codigoEnvio}
                onChangeText={setCodigoEnvio}
                placeholder="Código de Envío"
                style={{ borderWidth: 1, borderColor: '#D1D5DB', padding: 8, borderRadius: 4, marginBottom: 12, backgroundColor: 'white' }}
              />
              
              <Text style={{ fontSize: 12, fontWeight: '500', marginBottom: 4 }}>Transportista</Text>
              <View style={{ borderWidth: 1, borderColor: '#D1D5DB', marginBottom: 12, borderRadius: 4, backgroundColor: 'white' }}>
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

              <TextInput
                value={rutaId}
                onChangeText={setRutaId}
                keyboardType="numeric"
                placeholder="ID Ruta (Opcional)"
                style={{ borderWidth: 1, borderColor: '#D1D5DB', padding: 8, borderRadius: 4, marginBottom: 12, backgroundColor: 'white' }}
              />
              <TextInput
                value={fechaSalida}
                onChangeText={setFechaSalida}
                placeholder="Fecha Salida (YYYY-MM-DD)"
                style={{ borderWidth: 1, borderColor: '#D1D5DB', padding: 8, borderRadius: 4, marginBottom: 12, backgroundColor: 'white' }}
              />
            </View>
          )}

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
              {isSaving ? 'Guardando...' : 'Registrar'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
