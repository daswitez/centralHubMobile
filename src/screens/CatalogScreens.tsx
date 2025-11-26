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
import { getClientes } from '../api/clientesApi';
import { getTransportistas } from '../api/transportistasApi';
import { getAlmacenes } from '../api/almacenesApi';
import { getProductores } from '../api/productoresApi';
import { getLotesCampo } from '../api/lotesCampoApi';
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
        errorMessage={errorMessage}
        items={items}
        renderRow={(item) => (
          <SafeItemRow
            title={`${item.codigo_cliente} — ${item.nombre}`}
            subtitle={`Tipo: ${item.tipo}`}
            extra={
              item.direccion ? `Dirección: ${item.direccion}` : undefined
            }
          />
        )}
      />
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
        errorMessage={errorMessage}
        items={items}
        renderRow={(item) => (
          <SafeItemRow
            title={`${item.codigo_transp} — ${item.nombre}`}
            subtitle={
              item.nro_licencia
                ? `Licencia: ${item.nro_licencia}`
                : 'Sin licencia registrada'
            }
          />
        )}
      />
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
        errorMessage={errorMessage}
        items={items}
        renderRow={(item) => (
          <SafeItemRow
            title={`${item.codigo_almacen} — ${item.nombre}`}
            subtitle={`Municipio ID: ${item.municipio_id}`}
            extra={
              item.direccion ? `Dirección: ${item.direccion}` : undefined
            }
          />
        )}
      />
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
        errorMessage={errorMessage}
        items={items}
        renderRow={(item) => (
          <SafeItemRow
            title={`${item.codigo_productor} — ${item.nombre}`}
            subtitle={`Municipio ID: ${item.municipio_id}`}
            extra={item.telefono ? `Teléfono: ${item.telefono}` : undefined}
          />
        )}
      />
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
        errorMessage={errorMessage}
        items={items}
        renderRow={(item) => (
          <SafeItemRow
            title={`${item.codigo_lote_campo}`}
            subtitle={`Productor ID: ${item.productor_id} · Variedad ID: ${item.variedad_id}`}
            extra={`Superficie: ${item.superficie_ha} ha`}
          />
        )}
      />
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


