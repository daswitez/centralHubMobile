// -----------------------------------------
// src/screens/CatalogScreens.tsx
// -----------------------------------------
// Colección de pantallas de solo lectura / búsqueda
// para los catálogos extendidos y campo, usando el
// componente genérico CatalogListScreen.
// -----------------------------------------

import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import type {
  Planta,
  Cliente,
  Transportista,
  Almacen,
} from '../api/catalogTypes';
import type {
  Productor,
  LoteCampo,
  SensorLectura,
} from '../api/campoTypes';

import {
  getPlantas,
  createPlanta,
  updatePlanta,
  deletePlanta,
} from '../api/plantasApi';
import {
  getClientes,
  createCliente,
  updateCliente,
  deleteCliente,
} from '../api/clientesApi';
import {
  getTransportistas,
  createTransportista,
  updateTransportista,
  deleteTransportista,
} from '../api/transportistasApi';
import {
  getAlmacenes,
  createAlmacen,
  updateAlmacen,
  deleteAlmacen,
} from '../api/almacenesApi';
import {
  getProductores,
  createProductor,
  updateProductor,
  deleteProductor,
} from '../api/productoresApi';
import {
  getLotesCampo,
  createLoteCampo,
  updateLoteCampo,
  deleteLoteCampo,
} from '../api/lotesCampoApi';
import { getLecturas } from '../api/lecturasApi';
import { CatalogListScreen } from './CatalogListScreen';

// -----------------------------------------
// Plantas
// -----------------------------------------
export const PlantasScreen: React.FC = () => {
  const [items, setItems] = useState<Planta[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formCodigoPlanta, setFormCodigoPlanta] = useState<string>('');
  const [formNombre, setFormNombre] = useState<string>('');
  const [formMunicipioId, setFormMunicipioId] = useState<string>('');
  const [formDireccion, setFormDireccion] = useState<string>('');

  const handleLoad = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await getPlantas(searchText.trim() || undefined);
      setItems(data);
    } catch (error) {
      setErrorMessage('No se pudieron cargar las plantas.');
      // eslint-disable-next-line no-console
      console.error('Error cargando plantas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitPlanta = async () => {
    const codigo = formCodigoPlanta.trim();
    const nombre = formNombre.trim();
    const municipio = formMunicipioId.trim();

    if (!codigo || !nombre || !municipio) {
      setLocalError(
        'Código, nombre y municipio_id son obligatorios para la planta.'
      );
      return;
    }

    const municipioId = Number(municipio);
    if (Number.isNaN(municipioId)) {
      setLocalError('El municipio_id debe ser un número válido.');
      return;
    }

    setIsSaving(true);
    setLocalError(null);

    try {
      const payload = {
        codigo_planta: codigo,
        nombre,
        municipio_id: municipioId,
        direccion: formDireccion.trim() || null,
      };

      if (editingId === null) {
        await createPlanta(payload);
      } else {
        await updatePlanta(editingId, payload);
      }

      setFormCodigoPlanta('');
      setFormNombre('');
      setFormMunicipioId('');
      setFormDireccion('');
      setEditingId(null);
      await handleLoad();
    } catch (error) {
      setLocalError(
        'No se pudo guardar la planta. Verifica la conexión o los datos.'
      );
      // eslint-disable-next-line no-console
      console.error('Error guardando planta:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditPlanta = (item: Planta) => {
    setEditingId(item.planta_id);
    setFormCodigoPlanta(item.codigo_planta);
    setFormNombre(item.nombre);
    setFormMunicipioId(String(item.municipio_id));
    setFormDireccion(item.direccion ?? '');
    setLocalError(null);
  };

  const handleCancelEditPlanta = () => {
    setEditingId(null);
    setFormCodigoPlanta('');
    setFormNombre('');
    setFormMunicipioId('');
    setFormDireccion('');
    setLocalError(null);
  };

  const handleDeletePlanta = async (plantaId: number) => {
    setIsSaving(true);
    setLocalError(null);

    try {
      await deletePlanta(plantaId);
      await handleLoad();
    } catch (error) {
      setLocalError('No se pudo eliminar la planta. Intenta nuevamente.');
      // eslint-disable-next-line no-console
      console.error('Error eliminando planta:', error);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    void handleLoad();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F4F6F9' }}>
      <CatalogListScreen<Planta>
        title="Plantas de proceso"
        subtitle="Catálogo de plantas (fuente: /api/cat/plantas)"
        searchPlaceholder="Buscar por código o nombre…"
        searchText={searchText}
        onSearchTextChange={setSearchText}
        onSearchPress={handleLoad}
        isLoading={isLoading}
        errorMessage={errorMessage ?? localError}
        items={items}
        renderRow={(item) => (
          <View>
            <SafeItemRow
              title={`${item.codigo_planta} — ${item.nombre}`}
              subtitle={`Municipio ID: ${item.municipio_id}`}
              extra={item.direccion ? `Dirección: ${item.direccion}` : null}
            />
            <View
              style={{
                marginTop: 6,
                flexDirection: 'row',
                justifyContent: 'flex-start',
                gap: 12,
              }}
            >
              <TouchableOpacity
                onPress={() => handleEditPlanta(item)}
                disabled={isSaving}
                style={{ paddingVertical: 2, paddingHorizontal: 4 }}
              >
                <Text style={{ color: '#2563EB', fontSize: 12 }}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDeletePlanta(item.planta_id)}
                disabled={isSaving}
                style={{ paddingVertical: 2, paddingHorizontal: 4 }}
              >
                <Text style={{ color: '#DC2626', fontSize: 12 }}>
                  Eliminar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Formulario de alta/edición de planta */}
      <View
        style={{
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: 16,
          borderWidth: 1,
          borderColor: '#E5E7EB',
          backgroundColor: '#F9FAFB',
          padding: 12,
        }}
      >
        <Text
          style={{
            marginBottom: 8,
            color: '#111827',
            fontSize: 14,
            fontWeight: '600',
          }}
        >
          {editingId === null ? 'Nueva planta' : 'Editar planta'}
        </Text>

        <TextInput
          value={formCodigoPlanta}
          onChangeText={setFormCodigoPlanta}
          placeholder="Código de planta"
          placeholderTextColor="#9CA3AF"
          style={{
            marginBottom: 8,
            paddingVertical: 6,
            paddingHorizontal: 8,
            borderWidth: 1,
            borderColor: '#D1D5DB',
            backgroundColor: '#FFFFFF',
            color: '#111827',
            fontSize: 13,
          }}
        />

        <TextInput
          value={formNombre}
          onChangeText={setFormNombre}
          placeholder="Nombre de la planta"
          placeholderTextColor="#9CA3AF"
          style={{
            marginBottom: 8,
            paddingVertical: 6,
            paddingHorizontal: 8,
            borderWidth: 1,
            borderColor: '#D1D5DB',
            backgroundColor: '#FFFFFF',
            color: '#111827',
            fontSize: 13,
          }}
        />

        <TextInput
          value={formMunicipioId}
          onChangeText={setFormMunicipioId}
          placeholder="Municipio ID (número)"
          placeholderTextColor="#9CA3AF"
          keyboardType="numeric"
          style={{
            marginBottom: 8,
            paddingVertical: 6,
            paddingHorizontal: 8,
            borderWidth: 1,
            borderColor: '#D1D5DB',
            backgroundColor: '#FFFFFF',
            color: '#111827',
            fontSize: 13,
          }}
        />

        <TextInput
          value={formDireccion}
          onChangeText={setFormDireccion}
          placeholder="Dirección (opcional)"
          placeholderTextColor="#9CA3AF"
          style={{
            marginBottom: 8,
            paddingVertical: 6,
            paddingHorizontal: 8,
            borderWidth: 1,
            borderColor: '#D1D5DB',
            backgroundColor: '#FFFFFF',
            color: '#111827',
            fontSize: 13,
          }}
        />

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: 8,
            marginTop: 4,
          }}
        >
          <TouchableOpacity
            onPress={handleSubmitPlanta}
            disabled={isSaving}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 12,
              backgroundColor: '#111827',
              opacity: isSaving ? 0.7 : 1,
            }}
          >
            <Text
              style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '500' }}
            >
              {editingId === null ? 'Crear' : 'Guardar cambios'}
            </Text>
          </TouchableOpacity>

          {editingId !== null && (
            <TouchableOpacity
              onPress={handleCancelEditPlanta}
              disabled={isSaving}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderWidth: 1,
                borderColor: '#D1D5DB',
                backgroundColor: '#FFFFFF',
              }}
            >
              <Text style={{ color: '#374151', fontSize: 13 }}>Cancelar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

// -----------------------------------------
// Clientes
// -----------------------------------------
export const ClientesScreen: React.FC = () => {
  const [items, setItems] = useState<Cliente[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formCodigo, setFormCodigo] = useState<string>('');
  const [formNombre, setFormNombre] = useState<string>('');
  const [formTipo, setFormTipo] = useState<string>('');
  const [formMunicipioId, setFormMunicipioId] = useState<string>('');
  const [formDireccion, setFormDireccion] = useState<string>('');

  const handleLoad = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await getClientes(searchText.trim() || undefined);
      setItems(data);
    } catch (error) {
      setErrorMessage('No se pudieron cargar los clientes.');
      // eslint-disable-next-line no-console
      console.error('Error cargando clientes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void handleLoad();
  }, []);

  const handleSubmitCliente = async () => {
    const codigo = formCodigo.trim();
    const nombre = formNombre.trim();
    const tipo = formTipo.trim();
    const municipio = formMunicipioId.trim();

    if (!codigo || !nombre || !tipo) {
      setLocalError(
        'Código, nombre y tipo son obligatorios para el cliente.'
      );
      return;
    }

    const municipioId =
      municipio.trim() === '' ? null : Number(municipio.trim());
    if (municipioId !== null && Number.isNaN(municipioId)) {
      setLocalError('El municipio_id debe ser un número válido o quedar vacío.');
      return;
    }

    setIsSaving(true);
    setLocalError(null);

    try {
      const payload = {
        codigo_cliente: codigo,
        nombre,
        tipo,
        municipio_id: municipioId,
        direccion: formDireccion.trim() || null,
      };

      if (editingId === null) {
        await createCliente(payload);
      } else {
        await updateCliente(editingId, payload);
      }

      setFormCodigo('');
      setFormNombre('');
      setFormTipo('');
      setFormMunicipioId('');
      setFormDireccion('');
      setEditingId(null);
      await handleLoad();
    } catch (error) {
      setLocalError(
        'No se pudo guardar el cliente. Verifica la conexión o los datos.'
      );
      // eslint-disable-next-line no-console
      console.error('Error guardando cliente:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditCliente = (item: Cliente) => {
    setEditingId(item.cliente_id);
    setFormCodigo(item.codigo_cliente);
    setFormNombre(item.nombre);
    setFormTipo(item.tipo);
    setFormMunicipioId(
      item.municipio_id !== undefined && item.municipio_id !== null
        ? String(item.municipio_id)
        : ''
    );
    setFormDireccion(item.direccion ?? '');
    setLocalError(null);
  };

  const handleCancelEditCliente = () => {
    setEditingId(null);
    setFormCodigo('');
    setFormNombre('');
    setFormTipo('');
    setFormMunicipioId('');
    setFormDireccion('');
    setLocalError(null);
  };

  const handleDeleteCliente = async (clienteId: number) => {
    setIsSaving(true);
    setLocalError(null);

    try {
      await deleteCliente(clienteId);
      await handleLoad();
    } catch (error) {
      setLocalError('No se pudo eliminar el cliente. Intenta nuevamente.');
      // eslint-disable-next-line no-console
      console.error('Error eliminando cliente:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F4F6F9' }}>
      <CatalogListScreen<Cliente>
        title="Clientes"
        subtitle="Catálogo de clientes (fuente: /api/cat/clientes)"
        searchPlaceholder="Buscar por código, nombre o tipo…"
        searchText={searchText}
        onSearchTextChange={setSearchText}
        onSearchPress={handleLoad}
        isLoading={isLoading}
        errorMessage={errorMessage ?? localError}
        items={items}
        renderRow={(item) => (
          <View>
            <SafeItemRow
              title={`${item.codigo_cliente} — ${item.nombre}`}
              subtitle={`Tipo: ${item.tipo}`}
              extra={
                item.direccion ? `Dirección: ${item.direccion}` : undefined
              }
            />
            <View
              style={{
                marginTop: 6,
                flexDirection: 'row',
                justifyContent: 'flex-start',
                gap: 12,
              }}
            >
              <TouchableOpacity
                onPress={() => handleEditCliente(item)}
                disabled={isSaving}
                style={{ paddingVertical: 2, paddingHorizontal: 4 }}
              >
                <Text style={{ color: '#2563EB', fontSize: 12 }}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDeleteCliente(item.cliente_id)}
                disabled={isSaving}
                style={{ paddingVertical: 2, paddingHorizontal: 4 }}
              >
                <Text style={{ color: '#DC2626', fontSize: 12 }}>
                  Eliminar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Formulario de alta/edición de cliente */}
      <View
        style={{
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: 16,
          borderWidth: 1,
          borderColor: '#E5E7EB',
          backgroundColor: '#F9FAFB',
          padding: 12,
        }}
      >
        <Text
          style={{
            marginBottom: 8,
            color: '#111827',
            fontSize: 14,
            fontWeight: '600',
          }}
        >
          {editingId === null ? 'Nuevo cliente' : 'Editar cliente'}
        </Text>

        <TextInput
          value={formCodigo}
          onChangeText={setFormCodigo}
          placeholder="Código de cliente"
          placeholderTextColor="#9CA3AF"
          style={{
            marginBottom: 8,
            paddingVertical: 6,
            paddingHorizontal: 8,
            borderWidth: 1,
            borderColor: '#D1D5DB',
            backgroundColor: '#FFFFFF',
            color: '#111827',
            fontSize: 13,
          }}
        />

        <TextInput
          value={formNombre}
          onChangeText={setFormNombre}
          placeholder="Nombre del cliente"
          placeholderTextColor="#9CA3AF"
          style={{
            marginBottom: 8,
            paddingVertical: 6,
            paddingHorizontal: 8,
            borderWidth: 1,
            borderColor: '#D1D5DB',
            backgroundColor: '#FFFFFF',
            color: '#111827',
            fontSize: 13,
          }}
        />

        <TextInput
          value={formTipo}
          onChangeText={setFormTipo}
          placeholder="Tipo (MAYORISTA, RETAIL, etc.)"
          placeholderTextColor="#9CA3AF"
          style={{
            marginBottom: 8,
            paddingVertical: 6,
            paddingHorizontal: 8,
            borderWidth: 1,
            borderColor: '#D1D5DB',
            backgroundColor: '#FFFFFF',
            color: '#111827',
            fontSize: 13,
          }}
        />

        <TextInput
          value={formMunicipioId}
          onChangeText={setFormMunicipioId}
          placeholder="Municipio ID (opcional)"
          placeholderTextColor="#9CA3AF"
          keyboardType="numeric"
          style={{
            marginBottom: 8,
            paddingVertical: 6,
            paddingHorizontal: 8,
            borderWidth: 1,
            borderColor: '#D1D5DB',
            backgroundColor: '#FFFFFF',
            color: '#111827',
            fontSize: 13,
          }}
        />

        <TextInput
          value={formDireccion}
          onChangeText={setFormDireccion}
          placeholder="Dirección (opcional)"
          placeholderTextColor="#9CA3AF"
          style={{
            marginBottom: 8,
            paddingVertical: 6,
            paddingHorizontal: 8,
            borderWidth: 1,
            borderColor: '#D1D5DB',
            backgroundColor: '#FFFFFF',
            color: '#111827',
            fontSize: 13,
          }}
        />

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: 8,
            marginTop: 4,
          }}
        >
          <TouchableOpacity
            onPress={handleSubmitCliente}
            disabled={isSaving}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 12,
              backgroundColor: '#111827',
              opacity: isSaving ? 0.7 : 1,
            }}
          >
            <Text
              style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '500' }}
            >
              {editingId === null ? 'Crear' : 'Guardar cambios'}
            </Text>
          </TouchableOpacity>

          {editingId !== null && (
            <TouchableOpacity
              onPress={handleCancelEditCliente}
              disabled={isSaving}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderWidth: 1,
                borderColor: '#D1D5DB',
                backgroundColor: '#FFFFFF',
              }}
            >
              <Text style={{ color: '#374151', fontSize: 13 }}>Cancelar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

// -----------------------------------------
// Transportistas
// -----------------------------------------
export const TransportistasScreen: React.FC = () => {
  const [items, setItems] = useState<Transportista[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formCodigo, setFormCodigo] = useState<string>('');
  const [formNombre, setFormNombre] = useState<string>('');
  const [formLicencia, setFormLicencia] = useState<string>('');

  const handleLoad = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await getTransportistas(searchText.trim() || undefined);
      setItems(data);
    } catch (error) {
      setErrorMessage('No se pudieron cargar los transportistas.');
      // eslint-disable-next-line no-console
      console.error('Error cargando transportistas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void handleLoad();
  }, []);

  const handleSubmitTransportista = async () => {
    const codigo = formCodigo.trim();
    const nombre = formNombre.trim();

    if (!codigo || !nombre) {
      setLocalError('Código y nombre son obligatorios para el transportista.');
      return;
    }

    setIsSaving(true);
    setLocalError(null);

    try {
      const payload = {
        codigo_transp: codigo,
        nombre,
        nro_licencia: formLicencia.trim() || null,
      };

      if (editingId === null) {
        await createTransportista(payload);
      } else {
        await updateTransportista(editingId, payload);
      }

      setFormCodigo('');
      setFormNombre('');
      setFormLicencia('');
      setEditingId(null);
      await handleLoad();
    } catch (error) {
      setLocalError(
        'No se pudo guardar el transportista. Verifica la conexión o los datos.'
      );
      // eslint-disable-next-line no-console
      console.error('Error guardando transportista:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditTransportista = (item: Transportista) => {
    setEditingId(item.transportista_id);
    setFormCodigo(item.codigo_transp);
    setFormNombre(item.nombre);
    setFormLicencia(item.nro_licencia ?? '');
    setLocalError(null);
  };

  const handleCancelEditTransportista = () => {
    setEditingId(null);
    setFormCodigo('');
    setFormNombre('');
    setFormLicencia('');
    setLocalError(null);
  };

  const handleDeleteTransportista = async (id: number) => {
    setIsSaving(true);
    setLocalError(null);

    try {
      await deleteTransportista(id);
      await handleLoad();
    } catch (error) {
      setLocalError(
        'No se pudo eliminar el transportista. Intenta nuevamente.'
      );
      // eslint-disable-next-line no-console
      console.error('Error eliminando transportista:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F4F6F9' }}>
      <CatalogListScreen<Transportista>
        title="Transportistas"
        subtitle="Catálogo de transportistas (fuente: /api/cat/transportistas)"
        searchPlaceholder="Buscar por código o nombre…"
        searchText={searchText}
        onSearchTextChange={setSearchText}
        onSearchPress={handleLoad}
        isLoading={isLoading}
        errorMessage={errorMessage ?? localError}
        items={items}
        renderRow={(item) => (
          <View>
            <SafeItemRow
              title={`${item.codigo_transp} — ${item.nombre}`}
              subtitle={
                item.nro_licencia
                  ? `Licencia: ${item.nro_licencia}`
                  : 'Sin licencia registrada'
              }
            />
            <View
              style={{
                marginTop: 6,
                flexDirection: 'row',
                justifyContent: 'flex-start',
                gap: 12,
              }}
            >
              <TouchableOpacity
                onPress={() => handleEditTransportista(item)}
                disabled={isSaving}
                style={{ paddingVertical: 2, paddingHorizontal: 4 }}
              >
                <Text style={{ color: '#2563EB', fontSize: 12 }}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDeleteTransportista(item.transportista_id)}
                disabled={isSaving}
                style={{ paddingVertical: 2, paddingHorizontal: 4 }}
              >
                <Text style={{ color: '#DC2626', fontSize: 12 }}>
                  Eliminar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Formulario alta/edición transportista */}
      <View
        style={{
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: 16,
          borderWidth: 1,
          borderColor: '#E5E7EB',
          backgroundColor: '#F9FAFB',
          padding: 12,
        }}
      >
        <Text
          style={{
            marginBottom: 8,
            color: '#111827',
            fontSize: 14,
            fontWeight: '600',
          }}
        >
          {editingId === null ? 'Nuevo transportista' : 'Editar transportista'}
        </Text>

        <TextInput
          value={formCodigo}
          onChangeText={setFormCodigo}
          placeholder="Código de transportista"
          placeholderTextColor="#9CA3AF"
          style={{
            marginBottom: 8,
            paddingVertical: 6,
            paddingHorizontal: 8,
            borderWidth: 1,
            borderColor: '#D1D5DB',
            backgroundColor: '#FFFFFF',
            color: '#111827',
            fontSize: 13,
          }}
        />

        <TextInput
          value={formNombre}
          onChangeText={setFormNombre}
          placeholder="Nombre o razón social"
          placeholderTextColor="#9CA3AF"
          style={{
            marginBottom: 8,
            paddingVertical: 6,
            paddingHorizontal: 8,
            borderWidth: 1,
            borderColor: '#D1D5DB',
            backgroundColor: '#FFFFFF',
            color: '#111827',
            fontSize: 13,
          }}
        />

        <TextInput
          value={formLicencia}
          onChangeText={setFormLicencia}
          placeholder="Nº de licencia (opcional)"
          placeholderTextColor="#9CA3AF"
          style={{
            marginBottom: 8,
            paddingVertical: 6,
            paddingHorizontal: 8,
            borderWidth: 1,
            borderColor: '#D1D5DB',
            backgroundColor: '#FFFFFF',
            color: '#111827',
            fontSize: 13,
          }}
        />

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: 8,
            marginTop: 4,
          }}
        >
          <TouchableOpacity
            onPress={handleSubmitTransportista}
            disabled={isSaving}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 12,
              backgroundColor: '#111827',
              opacity: isSaving ? 0.7 : 1,
            }}
          >
            <Text
              style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '500' }}
            >
              {editingId === null ? 'Crear' : 'Guardar cambios'}
            </Text>
          </TouchableOpacity>

          {editingId !== null && (
            <TouchableOpacity
              onPress={handleCancelEditTransportista}
              disabled={isSaving}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderWidth: 1,
                borderColor: '#D1D5DB',
                backgroundColor: '#FFFFFF',
              }}
            >
              <Text style={{ color: '#374151', fontSize: 13 }}>Cancelar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

// -----------------------------------------
// Almacenes
// -----------------------------------------
export const AlmacenesScreen: React.FC = () => {
  const [items, setItems] = useState<Almacen[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formCodigo, setFormCodigo] = useState<string>('');
  const [formNombre, setFormNombre] = useState<string>('');
  const [formMunicipioId, setFormMunicipioId] = useState<string>('');
  const [formDireccion, setFormDireccion] = useState<string>('');

  const handleLoad = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await getAlmacenes(searchText.trim() || undefined);
      setItems(data);
    } catch (error) {
      setErrorMessage('No se pudieron cargar los almacenes.');
      // eslint-disable-next-line no-console
      console.error('Error cargando almacenes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void handleLoad();
  }, []);

  const handleSubmitAlmacen = async () => {
    const codigo = formCodigo.trim();
    const nombre = formNombre.trim();
    const municipio = formMunicipioId.trim();

    if (!codigo || !nombre || !municipio) {
      setLocalError(
        'Código, nombre y municipio_id son obligatorios para el almacén.'
      );
      return;
    }

    const municipioId = Number(municipio);
    if (Number.isNaN(municipioId)) {
      setLocalError('El municipio_id debe ser un número válido.');
      return;
    }

    setIsSaving(true);
    setLocalError(null);

    try {
      const payload = {
        codigo_almacen: codigo,
        nombre,
        municipio_id: municipioId,
        direccion: formDireccion.trim() || null,
      };

      if (editingId === null) {
        await createAlmacen(payload);
      } else {
        await updateAlmacen(editingId, payload);
      }

      setFormCodigo('');
      setFormNombre('');
      setFormMunicipioId('');
      setFormDireccion('');
      setEditingId(null);
      await handleLoad();
    } catch (error) {
      setLocalError(
        'No se pudo guardar el almacén. Verifica la conexión o los datos.'
      );
      // eslint-disable-next-line no-console
      console.error('Error guardando almacén:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditAlmacen = (item: Almacen) => {
    setEditingId(item.almacen_id);
    setFormCodigo(item.codigo_almacen);
    setFormNombre(item.nombre);
    setFormMunicipioId(String(item.municipio_id));
    setFormDireccion(item.direccion ?? '');
    setLocalError(null);
  };

  const handleCancelEditAlmacen = () => {
    setEditingId(null);
    setFormCodigo('');
    setFormNombre('');
    setFormMunicipioId('');
    setFormDireccion('');
    setLocalError(null);
  };

  const handleDeleteAlmacen = async (id: number) => {
    setIsSaving(true);
    setLocalError(null);

    try {
      await deleteAlmacen(id);
      await handleLoad();
    } catch (error) {
      setLocalError('No se pudo eliminar el almacén. Intenta nuevamente.');
      // eslint-disable-next-line no-console
      console.error('Error eliminando almacén:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F4F6F9' }}>
      <CatalogListScreen<Almacen>
        title="Almacenes"
        subtitle="Catálogo de almacenes (fuente: /api/cat/almacenes)"
        searchPlaceholder="Buscar por código o nombre…"
        searchText={searchText}
        onSearchTextChange={setSearchText}
        onSearchPress={handleLoad}
        isLoading={isLoading}
        errorMessage={errorMessage ?? localError}
        items={items}
        renderRow={(item) => (
          <View>
            <SafeItemRow
              title={`${item.codigo_almacen} — ${item.nombre}`}
              subtitle={`Municipio ID: ${item.municipio_id}`}
              extra={
                item.direccion ? `Dirección: ${item.direccion}` : undefined
              }
            />
            <View
              style={{
                marginTop: 6,
                flexDirection: 'row',
                justifyContent: 'flex-start',
                gap: 12,
              }}
            >
              <TouchableOpacity
                onPress={() => handleEditAlmacen(item)}
                disabled={isSaving}
                style={{ paddingVertical: 2, paddingHorizontal: 4 }}
              >
                <Text style={{ color: '#2563EB', fontSize: 12 }}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDeleteAlmacen(item.almacen_id)}
                disabled={isSaving}
                style={{ paddingVertical: 2, paddingHorizontal: 4 }}
              >
                <Text style={{ color: '#DC2626', fontSize: 12 }}>
                  Eliminar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Formulario alta/edición almacén */}
      <View
        style={{
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: 16,
          borderWidth: 1,
          borderColor: '#E5E7EB',
          backgroundColor: '#F9FAFB',
          padding: 12,
        }}
      >
        <Text
          style={{
            marginBottom: 8,
            color: '#111827',
            fontSize: 14,
            fontWeight: '600',
          }}
        >
          {editingId === null ? 'Nuevo almacén' : 'Editar almacén'}
        </Text>

        <TextInput
          value={formCodigo}
          onChangeText={setFormCodigo}
          placeholder="Código de almacén"
          placeholderTextColor="#9CA3AF"
          style={{
            marginBottom: 8,
            paddingVertical: 6,
            paddingHorizontal: 8,
            borderWidth: 1,
            borderColor: '#D1D5DB',
            backgroundColor: '#FFFFFF',
            color: '#111827',
            fontSize: 13,
          }}
        />

        <TextInput
          value={formNombre}
          onChangeText={setFormNombre}
          placeholder="Nombre del almacén"
          placeholderTextColor="#9CA3AF"
          style={{
            marginBottom: 8,
            paddingVertical: 6,
            paddingHorizontal: 8,
            borderWidth: 1,
            borderColor: '#D1D5DB',
            backgroundColor: '#FFFFFF',
            color: '#111827',
            fontSize: 13,
          }}
        />

        <TextInput
          value={formMunicipioId}
          onChangeText={setFormMunicipioId}
          placeholder="Municipio ID (número)"
          placeholderTextColor="#9CA3AF"
          keyboardType="numeric"
          style={{
            marginBottom: 8,
            paddingVertical: 6,
            paddingHorizontal: 8,
            borderWidth: 1,
            borderColor: '#D1D5DB',
            backgroundColor: '#FFFFFF',
            color: '#111827',
            fontSize: 13,
          }}
        />

        <TextInput
          value={formDireccion}
          onChangeText={setFormDireccion}
          placeholder="Dirección (opcional)"
          placeholderTextColor="#9CA3AF"
          style={{
            marginBottom: 8,
            paddingVertical: 6,
            paddingHorizontal: 8,
            borderWidth: 1,
            borderColor: '#D1D5DB',
            backgroundColor: '#FFFFFF',
            color: '#111827',
            fontSize: 13,
          }}
        />

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: 8,
            marginTop: 4,
          }}
        >
          <TouchableOpacity
            onPress={handleSubmitAlmacen}
            disabled={isSaving}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 12,
              backgroundColor: '#111827',
              opacity: isSaving ? 0.7 : 1,
            }}
          >
            <Text
              style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '500' }}
            >
              {editingId === null ? 'Crear' : 'Guardar cambios'}
            </Text>
          </TouchableOpacity>

          {editingId !== null && (
            <TouchableOpacity
              onPress={handleCancelEditAlmacen}
              disabled={isSaving}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderWidth: 1,
                borderColor: '#D1D5DB',
                backgroundColor: '#FFFFFF',
              }}
            >
              <Text style={{ color: '#374151', fontSize: 13 }}>Cancelar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

// -----------------------------------------
// Productores
// -----------------------------------------
export const ProductoresScreen: React.FC = () => {
  const [items, setItems] = useState<Productor[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formCodigo, setFormCodigo] = useState<string>('');
  const [formNombre, setFormNombre] = useState<string>('');
  const [formMunicipioId, setFormMunicipioId] = useState<string>('');
  const [formTelefono, setFormTelefono] = useState<string>('');

  const handleLoad = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await getProductores(searchText.trim() || undefined);
      setItems(data);
    } catch (error) {
      setErrorMessage('No se pudieron cargar los productores.');
      // eslint-disable-next-line no-console
      console.error('Error cargando productores:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void handleLoad();
  }, []);

  const handleSubmitProductor = async () => {
    const codigo = formCodigo.trim();
    const nombre = formNombre.trim();
    const municipio = formMunicipioId.trim();

    if (!codigo || !nombre || !municipio) {
      setLocalError(
        'Código, nombre y municipio_id son obligatorios para el productor.'
      );
      return;
    }

    const municipioId = Number(municipio);
    if (Number.isNaN(municipioId)) {
      setLocalError('El municipio_id debe ser un número válido.');
      return;
    }

    setIsSaving(true);
    setLocalError(null);

    try {
      const payload = {
        codigo_productor: codigo,
        nombre,
        municipio_id: municipioId,
        telefono: formTelefono.trim() || null,
      };

      if (editingId === null) {
        await createProductor(payload);
      } else {
        await updateProductor(editingId, payload);
      }

      setFormCodigo('');
      setFormNombre('');
      setFormMunicipioId('');
      setFormTelefono('');
      setEditingId(null);
      await handleLoad();
    } catch (error) {
      setLocalError(
        'No se pudo guardar el productor. Verifica la conexión o los datos.'
      );
      // eslint-disable-next-line no-console
      console.error('Error guardando productor:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditProductor = (item: Productor) => {
    setEditingId(item.productor_id);
    setFormCodigo(item.codigo_productor);
    setFormNombre(item.nombre);
    setFormMunicipioId(String(item.municipio_id));
    setFormTelefono(item.telefono ?? '');
    setLocalError(null);
  };

  const handleCancelEditProductor = () => {
    setEditingId(null);
    setFormCodigo('');
    setFormNombre('');
    setFormMunicipioId('');
    setFormTelefono('');
    setLocalError(null);
  };

  const handleDeleteProductor = async (id: number) => {
    setIsSaving(true);
    setLocalError(null);

    try {
      await deleteProductor(id);
      await handleLoad();
    } catch (error) {
      setLocalError('No se pudo eliminar el productor. Intenta nuevamente.');
      // eslint-disable-next-line no-console
      console.error('Error eliminando productor:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F4F6F9' }}>
      <CatalogListScreen<Productor>
        title="Productores"
        subtitle="Catálogo de productores (fuente: /api/campo/productores)"
        searchPlaceholder="Buscar por código o nombre…"
        searchText={searchText}
        onSearchTextChange={setSearchText}
        onSearchPress={handleLoad}
        isLoading={isLoading}
        errorMessage={errorMessage ?? localError}
        items={items}
        renderRow={(item) => (
          <View>
            <SafeItemRow
              title={`${item.codigo_productor} — ${item.nombre}`}
              subtitle={`Municipio ID: ${item.municipio_id}`}
              extra={item.telefono ? `Teléfono: ${item.telefono}` : undefined}
            />
            <View
              style={{
                marginTop: 6,
                flexDirection: 'row',
                justifyContent: 'flex-start',
                gap: 12,
              }}
            >
              <TouchableOpacity
                onPress={() => handleEditProductor(item)}
                disabled={isSaving}
                style={{ paddingVertical: 2, paddingHorizontal: 4 }}
              >
                <Text style={{ color: '#2563EB', fontSize: 12 }}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDeleteProductor(item.productor_id)}
                disabled={isSaving}
                style={{ paddingVertical: 2, paddingHorizontal: 4 }}
              >
                <Text style={{ color: '#DC2626', fontSize: 12 }}>
                  Eliminar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Formulario alta/edición productor */}
      <View
        style={{
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: 16,
          borderWidth: 1,
          borderColor: '#E5E7EB',
          backgroundColor: '#F9FAFB',
          padding: 12,
        }}
      >
        <Text
          style={{
            marginBottom: 8,
            color: '#111827',
            fontSize: 14,
            fontWeight: '600',
          }}
        >
          {editingId === null ? 'Nuevo productor' : 'Editar productor'}
        </Text>

        <TextInput
          value={formCodigo}
          onChangeText={setFormCodigo}
          placeholder="Código de productor"
          placeholderTextColor="#9CA3AF"
          style={{
            marginBottom: 8,
            paddingVertical: 6,
            paddingHorizontal: 8,
            borderWidth: 1,
            borderColor: '#D1D5DB',
            backgroundColor: '#FFFFFF',
            color: '#111827',
            fontSize: 13,
          }}
        />

        <TextInput
          value={formNombre}
          onChangeText={setFormNombre}
          placeholder="Nombre del productor"
          placeholderTextColor="#9CA3AF"
          style={{
            marginBottom: 8,
            paddingVertical: 6,
            paddingHorizontal: 8,
            borderWidth: 1,
            borderColor: '#D1D5DB',
            backgroundColor: '#FFFFFF',
            color: '#111827',
            fontSize: 13,
          }}
        />

        <TextInput
          value={formMunicipioId}
          onChangeText={setFormMunicipioId}
          placeholder="Municipio ID (número)"
          placeholderTextColor="#9CA3AF"
          keyboardType="numeric"
          style={{
            marginBottom: 8,
            paddingVertical: 6,
            paddingHorizontal: 8,
            borderWidth: 1,
            borderColor: '#D1D5DB',
            backgroundColor: '#FFFFFF',
            color: '#111827',
            fontSize: 13,
          }}
        />

        <TextInput
          value={formTelefono}
          onChangeText={setFormTelefono}
          placeholder="Teléfono (opcional)"
          placeholderTextColor="#9CA3AF"
          style={{
            marginBottom: 8,
            paddingVertical: 6,
            paddingHorizontal: 8,
            borderWidth: 1,
            borderColor: '#D1D5DB',
            backgroundColor: '#FFFFFF',
            color: '#111827',
            fontSize: 13,
          }}
        />

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: 8,
            marginTop: 4,
          }}
        >
          <TouchableOpacity
            onPress={handleSubmitProductor}
            disabled={isSaving}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 12,
              backgroundColor: '#111827',
              opacity: isSaving ? 0.7 : 1,
            }}
          >
            <Text
              style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '500' }}
            >
              {editingId === null ? 'Crear' : 'Guardar cambios'}
            </Text>
          </TouchableOpacity>

          {editingId !== null && (
            <TouchableOpacity
              onPress={handleCancelEditProductor}
              disabled={isSaving}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderWidth: 1,
                borderColor: '#D1D5DB',
                backgroundColor: '#FFFFFF',
              }}
            >
              <Text style={{ color: '#374151', fontSize: 13 }}>Cancelar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

// -----------------------------------------
// Lotes de campo
// -----------------------------------------
export const LotesCampoScreen: React.FC = () => {
  const [items, setItems] = useState<LoteCampo[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formCodigo, setFormCodigo] = useState<string>('');
  const [formProductorId, setFormProductorId] = useState<string>('');
  const [formVariedadId, setFormVariedadId] = useState<string>('');
  const [formSuperficie, setFormSuperficie] = useState<string>('');
  const [formFechaSiembra, setFormFechaSiembra] = useState<string>('');

  const handleLoad = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await getLotesCampo(searchText.trim() || undefined);
      setItems(data);
    } catch (error) {
      setErrorMessage('No se pudieron cargar los lotes de campo.');
      // eslint-disable-next-line no-console
      console.error('Error cargando lotes de campo:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void handleLoad();
  }, []);

  const handleSubmitLoteCampo = async () => {
    const codigo = formCodigo.trim();
    const productor = formProductorId.trim();
    const variedad = formVariedadId.trim();
    const superficie = formSuperficie.trim();
    const fechaSiembra = formFechaSiembra.trim();

    if (!codigo || !productor || !variedad || !superficie || !fechaSiembra) {
      setLocalError(
        'Código, productor_id, variedad_id, superficie_ha y fecha_siembra son obligatorios.'
      );
      return;
    }

    const productorId = Number(productor);
    const variedadId = Number(variedad);
    const superficieHa = Number(superficie);

    if (
      Number.isNaN(productorId) ||
      Number.isNaN(variedadId) ||
      Number.isNaN(superficieHa)
    ) {
      setLocalError('productor_id, variedad_id y superficie_ha deben ser numéricos.');
      return;
    }

    setIsSaving(true);
    setLocalError(null);

    try {
      const payload = {
        codigo_lote_campo: codigo,
        productor_id: productorId,
        variedad_id: variedadId,
        superficie_ha: superficieHa,
        fecha_siembra: fechaSiembra,
      };

      if (editingId === null) {
        await createLoteCampo(payload);
      } else {
        await updateLoteCampo(editingId, payload);
      }

      setFormCodigo('');
      setFormProductorId('');
      setFormVariedadId('');
      setFormSuperficie('');
      setFormFechaSiembra('');
      setEditingId(null);
      await handleLoad();
    } catch (error) {
      setLocalError(
        'No se pudo guardar el lote de campo. Verifica la conexión o los datos.'
      );
      // eslint-disable-next-line no-console
      console.error('Error guardando lote de campo:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditLoteCampo = (item: LoteCampo) => {
    setEditingId(item.lote_campo_id);
    setFormCodigo(item.codigo_lote_campo);
    setFormProductorId(String(item.productor_id));
    setFormVariedadId(String(item.variedad_id));
    setFormSuperficie(String(item.superficie_ha));
    setFormFechaSiembra(item.fecha_siembra);
    setLocalError(null);
  };

  const handleCancelEditLoteCampo = () => {
    setEditingId(null);
    setFormCodigo('');
    setFormProductorId('');
    setFormVariedadId('');
    setFormSuperficie('');
    setFormFechaSiembra('');
    setLocalError(null);
  };

  const handleDeleteLoteCampo = async (id: number) => {
    setIsSaving(true);
    setLocalError(null);

    try {
      await deleteLoteCampo(id);
      await handleLoad();
    } catch (error) {
      setLocalError('No se pudo eliminar el lote. Intenta nuevamente.');
      // eslint-disable-next-line no-console
      console.error('Error eliminando lote de campo:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F4F6F9' }}>
      <CatalogListScreen<LoteCampo>
        title="Lotes de campo"
        subtitle="Catálogo de lotes (fuente: /api/campo/lotes)"
        searchPlaceholder="Buscar por código de lote…"
        searchText={searchText}
        onSearchTextChange={setSearchText}
        onSearchPress={handleLoad}
        isLoading={isLoading}
        errorMessage={errorMessage ?? localError}
        items={items}
        renderRow={(item) => (
          <View>
            <SafeItemRow
              title={`${item.codigo_lote_campo}`}
              subtitle={`Productor ID: ${item.productor_id} · Variedad ID: ${item.variedad_id}`}
              extra={`Superficie: ${item.superficie_ha} ha`}
            />
            <View
              style={{
                marginTop: 6,
                flexDirection: 'row',
                justifyContent: 'flex-start',
                gap: 12,
              }}
            >
              <TouchableOpacity
                onPress={() => handleEditLoteCampo(item)}
                disabled={isSaving}
                style={{ paddingVertical: 2, paddingHorizontal: 4 }}
              >
                <Text style={{ color: '#2563EB', fontSize: 12 }}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDeleteLoteCampo(item.lote_campo_id)}
                disabled={isSaving}
                style={{ paddingVertical: 2, paddingHorizontal: 4 }}
              >
                <Text style={{ color: '#DC2626', fontSize: 12 }}>
                  Eliminar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Formulario alta/edición lote de campo */}
      <View
        style={{
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: 16,
          borderWidth: 1,
          borderColor: '#E5E7EB',
          backgroundColor: '#F9FAFB',
          padding: 12,
        }}
      >
        <Text
          style={{
            marginBottom: 8,
            color: '#111827',
            fontSize: 14,
            fontWeight: '600',
          }}
        >
          {editingId === null ? 'Nuevo lote de campo' : 'Editar lote de campo'}
        </Text>

        <TextInput
          value={formCodigo}
          onChangeText={setFormCodigo}
          placeholder="Código de lote de campo"
          placeholderTextColor="#9CA3AF"
          style={{
            marginBottom: 8,
            paddingVertical: 6,
            paddingHorizontal: 8,
            borderWidth: 1,
            borderColor: '#D1D5DB',
            backgroundColor: '#FFFFFF',
            color: '#111827',
            fontSize: 13,
          }}
        />

        <TextInput
          value={formProductorId}
          onChangeText={setFormProductorId}
          placeholder="Productor ID (número)"
          placeholderTextColor="#9CA3AF"
          keyboardType="numeric"
          style={{
            marginBottom: 8,
            paddingVertical: 6,
            paddingHorizontal: 8,
            borderWidth: 1,
            borderColor: '#D1D5DB',
            backgroundColor: '#FFFFFF',
            color: '#111827',
            fontSize: 13,
          }}
        />

        <TextInput
          value={formVariedadId}
          onChangeText={setFormVariedadId}
          placeholder="Variedad ID (número)"
          placeholderTextColor="#9CA3AF"
          keyboardType="numeric"
          style={{
            marginBottom: 8,
            paddingVertical: 6,
            paddingHorizontal: 8,
            borderWidth: 1,
            borderColor: '#D1D5DB',
            backgroundColor: '#FFFFFF',
            color: '#111827',
            fontSize: 13,
          }}
        />

        <TextInput
          value={formSuperficie}
          onChangeText={setFormSuperficie}
          placeholder="Superficie (ha)"
          placeholderTextColor="#9CA3AF"
          keyboardType="numeric"
          style={{
            marginBottom: 8,
            paddingVertical: 6,
            paddingHorizontal: 8,
            borderWidth: 1,
            borderColor: '#D1D5DB',
            backgroundColor: '#FFFFFF',
            color: '#111827',
            fontSize: 13,
          }}
        />

        <TextInput
          value={formFechaSiembra}
          onChangeText={setFormFechaSiembra}
          placeholder="Fecha siembra (YYYY-MM-DD)"
          placeholderTextColor="#9CA3AF"
          style={{
            marginBottom: 8,
            paddingVertical: 6,
            paddingHorizontal: 8,
            borderWidth: 1,
            borderColor: '#D1D5DB',
            backgroundColor: '#FFFFFF',
            color: '#111827',
            fontSize: 13,
          }}
        />

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: 8,
            marginTop: 4,
          }}
        >
          <TouchableOpacity
            onPress={handleSubmitLoteCampo}
            disabled={isSaving}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 12,
              backgroundColor: '#111827',
              opacity: isSaving ? 0.7 : 1,
            }}
          >
            <Text
              style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '500' }}
            >
              {editingId === null ? 'Crear' : 'Guardar cambios'}
            </Text>
          </TouchableOpacity>

          {editingId !== null && (
            <TouchableOpacity
              onPress={handleCancelEditLoteCampo}
              disabled={isSaving}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderWidth: 1,
                borderColor: '#D1D5DB',
                backgroundColor: '#FFFFFF',
              }}
            >
              <Text style={{ color: '#374151', fontSize: 13 }}>Cancelar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

// -----------------------------------------
// Lecturas de sensor
// -----------------------------------------
export const LecturasScreen: React.FC = () => {
  const [items, setItems] = useState<SensorLectura[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLoad = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await getLecturas();
      setItems(data);
    } catch (error) {
      setErrorMessage('No se pudieron cargar las lecturas de sensor.');
      // eslint-disable-next-line no-console
      console.error('Error cargando lecturas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void handleLoad();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F4F6F9' }}>
      <CatalogListScreen<SensorLectura>
        title="Lecturas de sensor"
        subtitle="Historial de lecturas (fuente: /api/campo/lecturas)"
        searchPlaceholder="(usa filtros avanzados en la API más adelante)"
        searchText=""
        onSearchTextChange={() => undefined}
        onSearchPress={handleLoad}
        isLoading={isLoading}
        errorMessage={errorMessage}
        items={items}
        renderRow={(item) => (
          <SafeItemRow
            title={`${item.tipo} — ${item.valor_num ?? item.valor_texto ?? '-'}`}
            subtitle={`Lote campo ID: ${item.lote_campo_id}`}
            extra={item.fecha_hora}
          />
        )}
      />
    </SafeAreaView>
  );
};

// -----------------------------------------
// Fila reutilizable para mostrar título / subtítulo / extra
// -----------------------------------------
type SafeItemRowProps = {
  title: string;
  subtitle?: string;
  extra?: string | null | undefined;
};

const SafeItemRow: React.FC<SafeItemRowProps> = ({
  title,
  subtitle,
  extra,
}) => {
  return (
    <View
      style={{
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: '#E5E7EB',
      }}
    >
      <Text style={{ fontWeight: '600', color: '#111827' }}>{title}</Text>
      {subtitle ? (
        <Text style={{ color: '#6B7280', fontSize: 12 }}>{subtitle}</Text>
      ) : null}
      {extra ? (
        <Text style={{ color: '#9CA3AF', fontSize: 12 }}>{extra}</Text>
      ) : null}
    </View>
  );
};


