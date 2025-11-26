// -----------------------------------------
// src/screens/CatalogScreens.tsx
// -----------------------------------------
// Colección de pantallas de solo lectura / búsqueda
// para los catálogos extendidos y campo, usando el
// componente genérico CatalogListScreen.
// -----------------------------------------

import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text } from 'react-native';

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

import { getPlantas } from '../api/plantasApi';
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
        errorMessage={errorMessage}
        items={items}
        renderRow={(item) => (
          <React.Fragment>
            <SafeItemRow
              title={`${item.codigo_planta} — ${item.nombre}`}
              subtitle={`Municipio ID: ${item.municipio_id}`}
              extra={item.direccion ? `Dirección: ${item.direccion}` : null}
            />
          </React.Fragment>
        )}
      />
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


