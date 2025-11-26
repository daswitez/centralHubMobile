// -----------------------------------------
// App.tsx
// -----------------------------------------
// Componente raíz de la aplicación móvil centralHub.
// Refactorizado para usar un Menú Hamburguesa (Drawer)
// y maximizar el espacio de contenido.
// -----------------------------------------

import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

// Tipos y módulos de API para catálogos base.
import type {
  Departamento,
  Municipio,
  VariedadPapa,
} from './src/api/catalogTypes';
import {
  getDepartamentos,
  createDepartamento,
  updateDepartamento,
  deleteDepartamento,
} from './src/api/departamentosApi';
import {
  getMunicipios,
  createMunicipio,
  updateMunicipio,
  deleteMunicipio,
} from './src/api/municipiosApi';
import {
  getVariedades,
  createVariedad,
  updateVariedad,
  deleteVariedad,
} from './src/api/variedadesApi';

// Pantallas adicionales para catálogos extendidos y campo.
import {
  PlantasScreen,
  ClientesScreen,
  TransportistasScreen,
  AlmacenesScreen,
  ProductoresScreen,
  LotesCampoScreen,
  LecturasScreen,
} from './src/screens/CatalogScreens';

import {
  RegistrarLotePlantaScreen,
  RegistrarLoteSalidaScreen,
} from './src/screens/TxPlantaScreens';

import {
  DespacharAlmacenScreen,
  RecepcionarEnvioScreen,
  DespacharClienteScreen,
} from './src/screens/TxAlmacenScreens';

// -----------------------------------------
// Tipo de sección para el menú lateral
// -----------------------------------------
type SectionKey =
  | 'dashboard'
  | 'departamentos'
  | 'municipios'
  | 'variedades'
  | 'plantas'
  | 'clientes'
  | 'transportistas'
  | 'almacenes'
  | 'productores'
  | 'lotesCampo'
  | 'lecturas'
  | 'txRegistrarLotePlanta'
  | 'txRegistrarLoteSalida'
  | 'txDespacharAlmacen'
  | 'txRecepcionarEnvio'
  | 'txDespacharCliente';

// -----------------------------------------
// Componente principal de la app
// -----------------------------------------
const App: React.FC = () => {
  // Estado de navegación
  const [activeSection, setActiveSection] = useState<SectionKey>('dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Estado con los catálogos cargados desde el backend.
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [variedades, setVariedades] = useState<VariedadPapa[]>([]);

  // Estado de carga y error global para los catálogos.
  const [isLoadingCatalogs, setIsLoadingCatalogs] = useState<boolean>(false);
  const [catalogsErrorMessage, setCatalogsErrorMessage] = useState<
    string | null
  >(null);

  // Handler para cambiar de sección desde el menú lateral.
  const handleChangeSection = (section: SectionKey) => {
    setActiveSection(section);
    setIsMenuOpen(false); // Cerrar menú al navegar
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handler que carga todos los catálogos en paralelo
  const handleLoadCatalogs = async () => {
    setIsLoadingCatalogs(true);
    setCatalogsErrorMessage(null);

    try {
      const [
        departamentosData,
        municipiosData,
        variedadesData,
      ] = await Promise.all([
        getDepartamentos(),
        getMunicipios(),
        getVariedades(),
      ]);

      setDepartamentos(departamentosData);
      setMunicipios(municipiosData);
      setVariedades(variedadesData);
    } catch (error) {
      setCatalogsErrorMessage(
        'No se pudieron cargar los catálogos desde el backend.'
      );
      console.error('Error cargando catálogos:', error);
    } finally {
      setIsLoadingCatalogs(false);
    }
  };

  useEffect(() => {
    void handleLoadCatalogs();
  }, []);

  // Helper que dibuja cada opción del menú vertical.
  const renderMenuItem = (section: SectionKey, label: string) => {
    const isActive = activeSection === section;

    return (
      <TouchableOpacity
        key={section}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ selected: isActive }}
        onPress={() => handleChangeSection(section)}
        style={[styles.menuItem, isActive && styles.menuItemActive]}
      >
        <Text
          style={[
            styles.menuItemLabel,
            isActive && styles.menuItemLabelActive,
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.root}>
      {/* Barra Superior (Top Bar) */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={toggleMenu} style={styles.hamburgerButton}>
          <Text style={styles.hamburgerIcon}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.appTitleHeader}>centralHub</Text>
      </View>

      {/* Área principal de contenido (Full Width) */}
      <View style={styles.contentArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {activeSection === 'dashboard' && (
            <DashboardSection
              departamentos={departamentos}
              municipios={municipios}
              variedades={variedades}
              isLoading={isLoadingCatalogs}
              errorMessage={catalogsErrorMessage}
              onReloadCatalogs={handleLoadCatalogs}
            />
          )}

          {activeSection === 'departamentos' && (
            <DepartamentosSection
              departamentos={departamentos}
              isLoading={isLoadingCatalogs}
              errorMessage={catalogsErrorMessage}
              onReloadCatalogs={handleLoadCatalogs}
            />
          )}

          {activeSection === 'municipios' && (
            <MunicipiosSection
              municipios={municipios}
              departamentos={departamentos}
              isLoading={isLoadingCatalogs}
              errorMessage={catalogsErrorMessage}
              onReloadCatalogs={handleLoadCatalogs}
            />
          )}

          {activeSection === 'variedades' && (
            <VariedadesSection
              variedades={variedades}
              isLoading={isLoadingCatalogs}
              errorMessage={catalogsErrorMessage}
              onReloadCatalogs={handleLoadCatalogs}
            />
          )}

          {activeSection === 'plantas' && <PlantasScreen />}
          {activeSection === 'clientes' && <ClientesScreen />}
          {activeSection === 'transportistas' && <TransportistasScreen />}
          {activeSection === 'almacenes' && <AlmacenesScreen />}
          {activeSection === 'productores' && <ProductoresScreen />}
          {activeSection === 'lotesCampo' && <LotesCampoScreen />}
          {activeSection === 'lecturas' && <LecturasScreen />}

          {activeSection === 'txRegistrarLotePlanta' && <RegistrarLotePlantaScreen />}
          {activeSection === 'txRegistrarLoteSalida' && <RegistrarLoteSalidaScreen />}
          {activeSection === 'txDespacharAlmacen' && <DespacharAlmacenScreen />}
          {activeSection === 'txRecepcionarEnvio' && <RecepcionarEnvioScreen />}
          {activeSection === 'txDespacharCliente' && <DespacharClienteScreen />}
        </ScrollView>
      </View>

      {/* Backdrop (Fondo oscuro al abrir menú) */}
      {isMenuOpen && (
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={() => setIsMenuOpen(false)}
        />
      )}

      {/* Menú Lateral (Drawer) */}
      {isMenuOpen && (
        <View style={styles.sideMenu}>
          <View style={styles.menuHeader}>
            <Text style={styles.appTitle}>centralHub</Text>
            <Text style={styles.appSubtitle}>Control panel</Text>
          </View>

          <ScrollView style={{ flex: 1 }}>
            {/* Opciones de navegación - catálogos base */}
            {renderMenuItem('dashboard', 'Dashboard')}
            {renderMenuItem('departamentos', 'Departamentos')}
            {renderMenuItem('municipios', 'Municipios')}
            {renderMenuItem('variedades', 'Variedades')}

            <View style={styles.menuDivider} />

            {/* Catálogos extendidos */}
            {renderMenuItem('plantas', 'Plantas')}
            {renderMenuItem('clientes', 'Clientes')}
            {renderMenuItem('transportistas', 'Transportistas')}
            {renderMenuItem('almacenes', 'Almacenes')}

            <View style={styles.menuDivider} />

            {/* Campo */}
            {renderMenuItem('productores', 'Productores')}
            {renderMenuItem('lotesCampo', 'Lotes campo')}
            {renderMenuItem('lecturas', 'Lecturas sensor')}

            <View style={styles.menuDivider} />

            {/* Transacciones Planta */}
            {renderMenuItem('txRegistrarLotePlanta', 'TX: Lote Planta')}
            {renderMenuItem('txRegistrarLoteSalida', 'TX: Lote Salida')}

            <View style={styles.menuDivider} />

            {/* Transacciones Almacén */}
            {renderMenuItem('txDespacharAlmacen', 'TX: Desp. Almacén')}
            {renderMenuItem('txRecepcionarEnvio', 'TX: Recep. Envío')}
            {renderMenuItem('txDespacharCliente', 'TX: Desp. Cliente')}
            
            <View style={{ height: 40 }} /> 
          </ScrollView>
        </View>
      )}

      <StatusBar style="dark" />
    </SafeAreaView>
  );
};

// -----------------------------------------
// Sección: Dashboard principal centralHub
// -----------------------------------------
type DashboardSectionProps = {
  departamentos: Departamento[];
  municipios: Municipio[];
  variedades: VariedadPapa[];
  isLoading: boolean;
  errorMessage: string | null;
  onReloadCatalogs: () => Promise<void>;
};

const DashboardSection: React.FC<DashboardSectionProps> = ({
  departamentos,
  municipios,
  variedades,
  isLoading,
  errorMessage,
}) => {
  const totalDepartamentos = departamentos.length;
  const totalMunicipios = municipios.length;
  const totalVariedades = variedades.length;

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Panel general centralHub</Text>
        <Text style={styles.sectionSubtitle}>
          Producción · Catálogos · Logística
        </Text>
      </View>

      {isLoading && (
        <View style={styles.statusRow}>
          <ActivityIndicator size="small" color="#111827" />
          <Text style={styles.statusText}>Cargando catálogos…</Text>
        </View>
      )}

      {errorMessage && !isLoading && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{errorMessage}</Text>
        </View>
      )}

      <View style={styles.kpiColumn}>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Departamentos</Text>
          <Text style={styles.kpiValue}>
            {totalDepartamentos > 0 ? totalDepartamentos : '—'}
          </Text>
          <Text style={styles.kpiHint}>Catálogo base</Text>
        </View>

        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Municipios</Text>
          <Text style={styles.kpiValue}>
            {totalMunicipios > 0 ? totalMunicipios : '—'}
          </Text>
          <Text style={styles.kpiHint}>Cobertura</Text>
        </View>

        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Variedades</Text>
          <Text style={styles.kpiValue}>
            {totalVariedades > 0 ? totalVariedades : '—'}
          </Text>
          <Text style={styles.kpiHint}>Material genético</Text>
        </View>
      </View>

      <View style={styles.textBlock}>
        <Text style={styles.textBlockTitle}>Bienvenido</Text>
        <Text style={styles.textBlockBody}>
          Selecciona una opción del menú para comenzar a gestionar los registros.
        </Text>
      </View>
    </View>
  );
};

// -----------------------------------------
// Sección: Departamentos
// -----------------------------------------
type DepartamentosSectionProps = {
  departamentos: Departamento[];
  isLoading: boolean;
  errorMessage: string | null;
  onReloadCatalogs: () => Promise<void>;
};

const DepartamentosSection: React.FC<DepartamentosSectionProps> = ({
  departamentos,
  isLoading,
  errorMessage,
  onReloadCatalogs,
}) => {
  const hasData = departamentos.length > 0;
  const [searchText, setSearchText] = useState<string>('');
  const [formNombre, setFormNombre] = useState<string>('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [localErrorMessage, setLocalErrorMessage] = useState<string | null>(
    null
  );

  const handleSubmitDepartamento = async () => {
    const trimmedName = formNombre.trim();

    if (!trimmedName) {
      setLocalErrorMessage('El nombre del departamento no puede estar vacío.');
      return;
    }

    setIsSaving(true);
    setLocalErrorMessage(null);

    try {
      if (!editingId || editingId <= 0) {
        await createDepartamento(trimmedName);
      } else {
        await updateDepartamento(editingId, trimmedName);
      }

      setFormNombre('');
      setEditingId(null);
      await onReloadCatalogs();
    } catch (error) {
      setLocalErrorMessage(
        'No se pudo guardar el departamento. Revisa la conexión o los datos.'
      );
      console.error('Error guardando departamento:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditDepartamento = (item: Departamento) => {
    setEditingId(item.departamento_id);
    setFormNombre(item.nombre);
    setLocalErrorMessage(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormNombre('');
    setLocalErrorMessage(null);
  };

  const handleDeleteDepartamento = async (id: number) => {
    setIsSaving(true);
    setLocalErrorMessage(null);

    try {
      await deleteDepartamento(id);
      await onReloadCatalogs();
    } catch (error) {
      setLocalErrorMessage(
        'No se pudo eliminar el departamento. Intenta nuevamente.'
      );
      console.error('Error eliminando departamento:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSearchDepartamentos = async () => {
    setIsSaving(true);
    setLocalErrorMessage(null);

    try {
      const filtered = await getDepartamentos(searchText.trim() || undefined);
      console.info('Departamentos filtrados localmente:', filtered.length);
    } catch (error) {
      setLocalErrorMessage(
        'No se pudieron filtrar los departamentos. Revisa tu conexión.'
      );
      console.error('Error filtrando departamentos:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Catálogo de Departamentos</Text>
        <Text style={styles.sectionSubtitle}>
          /cat/departamentos
        </Text>
      </View>

      {isLoading && (
        <View style={styles.statusRow}>
          <ActivityIndicator size="small" color="#111827" />
          <Text style={styles.statusText}>Cargando departamentos…</Text>
        </View>
      )}

      {errorMessage && !isLoading && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{errorMessage}</Text>
        </View>
      )}

      {localErrorMessage && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{localErrorMessage}</Text>
        </View>
      )}

      <View style={styles.formCard}>
        <Text style={styles.formTitle}>
          {editingId === null ? 'Nuevo departamento' : 'Editar departamento'}
        </Text>

        <TextInput
          value={formNombre}
          onChangeText={setFormNombre}
          placeholder="Nombre del departamento"
          placeholderTextColor="#9CA3AF"
          style={styles.textInput}
        />

        <View style={styles.formRow}>
          <TouchableOpacity
            onPress={handleSubmitDepartamento}
            disabled={isSaving}
            style={[
              styles.primaryButton,
              isSaving && styles.primaryButtonDisabled,
            ]}
          >
            <Text style={styles.primaryButtonText}>
              {editingId === null ? 'Crear' : 'Guardar cambios'}
            </Text>
          </TouchableOpacity>

          {editingId !== null && (
            <TouchableOpacity
              onPress={handleCancelEdit}
              disabled={isSaving}
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryButtonText}>Cancelar</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.formRow}>
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Buscar por nombre…"
            placeholderTextColor="#9CA3AF"
            style={styles.textInput}
          />
          <TouchableOpacity
            onPress={handleSearchDepartamentos}
            disabled={isSaving}
            style={styles.secondaryButton}
          >
            <Text style={styles.secondaryButtonText}>Filtrar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {!isLoading && !hasData && !errorMessage && (
        <Text style={styles.emptyText}>
          No se encontraron departamentos.
        </Text>
      )}

      {hasData && (
      <View style={styles.listCard}>
        {departamentos.map((item, index) => (
          <View key={`${item.departamento_id}-${index}`} style={styles.listRow}>
            <Text style={styles.listRowPrimary}>{item.nombre}</Text>
            <Text style={styles.listRowSecondary}>
              ID: {item.departamento_id}
            </Text>
            <View style={styles.actionsRow}>
              <TouchableOpacity
                onPress={() => handleEditDepartamento(item)}
                disabled={isSaving}
                style={styles.linkButton}
              >
                <Text style={styles.linkButtonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDeleteDepartamento(item.departamento_id)}
                disabled={isSaving}
                style={styles.linkButtonDanger}
              >
                <Text style={styles.linkButtonDangerText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
      )}
    </View>
  );
};

// -----------------------------------------
// Sección: Municipios
// -----------------------------------------
type MunicipiosSectionProps = {
  municipios: Municipio[];
  departamentos: Departamento[];
  isLoading: boolean;
  errorMessage: string | null;
  onReloadCatalogs: () => Promise<void>;
};

const MunicipiosSection: React.FC<MunicipiosSectionProps> = ({
  municipios,
  departamentos,
  isLoading,
  errorMessage,
  onReloadCatalogs,
}) => {
  const hasData = municipios.length > 0;
  const [formNombre, setFormNombre] = useState<string>('');
  const [formDepartamentoId, setFormDepartamentoId] = useState<string>('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [localErrorMessage, setLocalErrorMessage] = useState<string | null>(
    null
  );

  const handleSubmitMunicipio = async () => {
    const trimmedName = formNombre.trim();
    const trimmedDepto = formDepartamentoId.trim();

    if (!trimmedName || !trimmedDepto) {
      setLocalErrorMessage(
        'Debes indicar nombre y departamento_id para el municipio.'
      );
      return;
    }

    const departamentoIdNumber = Number(trimmedDepto);
    if (Number.isNaN(departamentoIdNumber)) {
      setLocalErrorMessage('El departamento_id debe ser un número válido.');
      return;
    }

    setIsSaving(true);
    setLocalErrorMessage(null);

    try {
      const payload = {
        departamento_id: departamentoIdNumber,
        nombre: trimmedName,
      };

      if (!editingId) {
        await createMunicipio(payload);
      } else {
        await updateMunicipio(editingId, payload);
      }

      setFormNombre('');
      setFormDepartamentoId('');
      setEditingId(null);
      await onReloadCatalogs();
    } catch (error) {
      setLocalErrorMessage(
        'No se pudo guardar el municipio. Verifica la conexión o los datos.'
      );
      console.error('Error guardando municipio:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditMunicipio = (item: Municipio) => {
    setEditingId(item.municipio_id);
    setFormNombre(item.nombre);
    setFormDepartamentoId(String(item.departamento_id));
    setLocalErrorMessage(null);
  };

  const handleCancelEditMunicipio = () => {
    setEditingId(null);
    setFormNombre('');
    setFormDepartamentoId('');
    setLocalErrorMessage(null);
  };

  const handleDeleteMunicipio = async (id: number) => {
    setIsSaving(true);
    setLocalErrorMessage(null);

    try {
      await deleteMunicipio(id);
      await onReloadCatalogs();
    } catch (error) {
      setLocalErrorMessage(
        'No se pudo eliminar el municipio. Intenta nuevamente.'
      );
      console.error('Error eliminando municipio:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Catálogo de Municipios</Text>
        <Text style={styles.sectionSubtitle}>
          /cat/municipios
        </Text>
      </View>

      {isLoading && (
        <View style={styles.statusRow}>
          <ActivityIndicator size="small" color="#111827" />
          <Text style={styles.statusText}>Cargando municipios…</Text>
        </View>
      )}

      {errorMessage && !isLoading && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{errorMessage}</Text>
        </View>
      )}

      {localErrorMessage && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{localErrorMessage}</Text>
        </View>
      )}

      <View style={styles.formCard}>
        <Text style={styles.formTitle}>
          {editingId === null ? 'Nuevo municipio' : 'Editar municipio'}
        </Text>

        <TextInput
          value={formNombre}
          onChangeText={setFormNombre}
          placeholder="Nombre del municipio"
          placeholderTextColor="#9CA3AF"
          style={styles.textInput}
        />

        <View style={{ borderWidth: 1, borderColor: '#D1D5DB', marginBottom: 12, backgroundColor: 'white' }}>
          <Picker
            selectedValue={formDepartamentoId}
            onValueChange={(itemValue) => setFormDepartamentoId(itemValue)}
          >
            <Picker.Item label="Selecciona un departamento..." value="" />
            {departamentos.map((d) => (
              <Picker.Item
                key={d.departamento_id}
                label={d.nombre}
                value={String(d.departamento_id)}
              />
            ))}
          </Picker>
        </View>

        <View style={styles.formRow}>
          <TouchableOpacity
            onPress={handleSubmitMunicipio}
            disabled={isSaving}
            style={[
              styles.primaryButton,
              isSaving && styles.primaryButtonDisabled,
            ]}
          >
            <Text style={styles.primaryButtonText}>
              {editingId === null ? 'Crear' : 'Guardar cambios'}
            </Text>
          </TouchableOpacity>

          {editingId !== null && (
            <TouchableOpacity
              onPress={handleCancelEditMunicipio}
              disabled={isSaving}
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryButtonText}>Cancelar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {!isLoading && !hasData && !errorMessage && (
        <Text style={styles.emptyText}>
          No se encontraron municipios.
        </Text>
      )}

      {hasData && (
      <View style={styles.listCard}>
        {municipios.map((item, index) => (
          <View key={`${item.municipio_id}-${index}`} style={styles.listRow}>
            <Text style={styles.listRowPrimary}>{item.nombre}</Text>
            <Text style={styles.listRowSecondary}>
              ID: {item.municipio_id} · Depto ID: {item.departamento_id}
            </Text>
            <View style={styles.actionsRow}>
              <TouchableOpacity
                onPress={() => handleEditMunicipio(item)}
                disabled={isSaving}
                style={styles.linkButton}
              >
                <Text style={styles.linkButtonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDeleteMunicipio(item.municipio_id)}
                disabled={isSaving}
                style={styles.linkButtonDanger}
              >
                <Text style={styles.linkButtonDangerText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
      )}
    </View>
  );
};

// -----------------------------------------
// Sección: Variedades
// -----------------------------------------
type VariedadesSectionProps = {
  variedades: VariedadPapa[];
  isLoading: boolean;
  errorMessage: string | null;
  onReloadCatalogs: () => Promise<void>;
};

const VariedadesSection: React.FC<VariedadesSectionProps> = ({
  variedades,
  isLoading,
  errorMessage,
  onReloadCatalogs,
}) => {
  const hasData = variedades.length > 0;
  const [formNombre, setFormNombre] = useState<string>('');
  const [formCodigo, setFormCodigo] = useState<string>('');
  const [formCientifico, setFormCientifico] = useState<string>('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [localErrorMessage, setLocalErrorMessage] = useState<string | null>(
    null
  );

  const handleSubmitVariedad = async () => {
    const trimmedName = formNombre.trim();
    const trimmedCodigo = formCodigo.trim();
    const trimmedCientifico = formCientifico.trim();

    if (!trimmedName || !trimmedCodigo) {
      setLocalErrorMessage(
        'El nombre comercial y el código de la variedad son obligatorios.'
      );
      return;
    }

    setIsSaving(true);
    setLocalErrorMessage(null);

    try {
      const payload = {
        codigo_variedad: trimmedCodigo,
        nombre_comercial: trimmedName,
        nombre_cientifico: trimmedCientifico || undefined,
      };

      if (!editingId) {
        await createVariedad(payload);
      } else {
        await updateVariedad(editingId, payload);
      }

      setFormNombre('');
      setFormCodigo('');
      setFormCientifico('');
      setEditingId(null);
      await onReloadCatalogs();
    } catch (error) {
      setLocalErrorMessage(
        'No se pudo guardar la variedad. Verifica la conexión o los datos.'
      );
      console.error('Error guardando variedad:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditVariedad = (item: VariedadPapa) => {
    setEditingId(item.variedad_id);
    setFormNombre(item.nombre_comercial);
    setFormCodigo(item.codigo_variedad);
    setFormCientifico(item.nombre_cientifico ?? '');
    setLocalErrorMessage(null);
  };

  const handleCancelEditVariedad = () => {
    setEditingId(null);
    setFormNombre('');
    setFormCodigo('');
    setFormCientifico('');
    setLocalErrorMessage(null);
  };

  const handleDeleteVariedad = async (id: number) => {
    setIsSaving(true);
    setLocalErrorMessage(null);

    try {
      await deleteVariedad(id);
      await onReloadCatalogs();
    } catch (error) {
      setLocalErrorMessage(
        'No se pudo eliminar la variedad. Intenta nuevamente.'
      );
      console.error('Error eliminando variedad:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Catálogo de Variedades</Text>
        <Text style={styles.sectionSubtitle}>
          /cat/variedades
        </Text>
      </View>

      {isLoading && (
        <View style={styles.statusRow}>
          <ActivityIndicator size="small" color="#111827" />
          <Text style={styles.statusText}>Cargando variedades…</Text>
        </View>
      )}

      {errorMessage && !isLoading && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{errorMessage}</Text>
        </View>
      )}

      {localErrorMessage && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{localErrorMessage}</Text>
        </View>
      )}

      <View style={styles.formCard}>
        <Text style={styles.formTitle}>
          {editingId === null ? 'Nueva variedad' : 'Editar variedad'}
        </Text>

        <TextInput
          value={formCodigo}
          onChangeText={setFormCodigo}
          placeholder="Código (ej. WAYCHA)"
          placeholderTextColor="#9CA3AF"
          style={styles.textInput}
        />

        <TextInput
          value={formNombre}
          onChangeText={setFormNombre}
          placeholder="Nombre comercial"
          placeholderTextColor="#9CA3AF"
          style={styles.textInput}
        />

        <TextInput
          value={formCientifico}
          onChangeText={setFormCientifico}
          placeholder="Nombre científico (opcional)"
          placeholderTextColor="#9CA3AF"
          style={styles.textInput}
        />

        <View style={styles.formRow}>
          <TouchableOpacity
            onPress={handleSubmitVariedad}
            disabled={isSaving}
            style={[
              styles.primaryButton,
              isSaving && styles.primaryButtonDisabled,
            ]}
          >
            <Text style={styles.primaryButtonText}>
              {editingId === null ? 'Crear' : 'Guardar cambios'}
            </Text>
          </TouchableOpacity>

          {editingId !== null && (
            <TouchableOpacity
              onPress={handleCancelEditVariedad}
              disabled={isSaving}
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryButtonText}>Cancelar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {!isLoading && !hasData && !errorMessage && (
        <Text style={styles.emptyText}>
          No se encontraron variedades.
        </Text>
      )}

      {hasData && (
      <View style={styles.listCard}>
        {variedades.map((item, index) => (
          <View key={`${item.variedad_id}-${index}`} style={styles.listRow}>
            <Text style={styles.listRowPrimary}>{item.nombre_comercial}</Text>
            <Text style={styles.listRowSecondary}>
              ID: {item.variedad_id}
              {item.nombre_cientifico ? ` · ${item.nombre_cientifico}` : ''}
            </Text>
            <View style={styles.actionsRow}>
              <TouchableOpacity
                onPress={() => handleEditVariedad(item)}
                disabled={isSaving}
                style={styles.linkButton}
              >
                <Text style={styles.linkButtonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDeleteVariedad(item.variedad_id)}
                disabled={isSaving}
                style={styles.linkButtonDanger}
              >
                <Text style={styles.linkButtonDangerText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
      )}
    </View>
  );
};

// -----------------------------------------
// Estilos
// -----------------------------------------
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F3F4F6', // Fondo general gris claro
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827', // Dark header
    height: 60,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 24 : 0, // Ajuste para status bar en Android
  },
  hamburgerButton: {
    padding: 8,
    marginRight: 16,
  },
  hamburgerIcon: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  appTitleHeader: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  contentArea: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 999,
  },
  sideMenu: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 280, // Ancho del menú
    backgroundColor: '#1F2937', // Gris oscuro
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  menuHeader: {
    padding: 20,
    backgroundColor: '#111827',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
    paddingTop: Platform.OS === 'android' ? 40 : 20,
  },
  appTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  appSubtitle: {
    color: '#9CA3AF',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#374151',
    marginVertical: 8,
    marginHorizontal: 16,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  menuItemActive: {
    backgroundColor: '#374151',
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6', // Azul acento
  },
  menuItemLabel: {
    color: '#D1D5DB',
    fontSize: 14,
    fontWeight: '500',
  },
  menuItemLabelActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  // --- Estilos de Secciones ---
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusText: {
    marginLeft: 8,
    color: '#374151',
    fontSize: 14,
  },
  errorBanner: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
  },
  errorBannerText: {
    color: '#991B1B',
    fontSize: 14,
  },
  // --- KPIs ---
  kpiColumn: {
    flexDirection: 'column', // En móvil, KPIs uno debajo de otro o grid
    gap: 12,
    marginBottom: 24,
  },
  kpiCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  kpiLabel: {
    fontSize: 12,
    color: '#6B7280',
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: 4,
  },
  kpiValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  kpiHint: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  // --- Bloques de texto ---
  textBlock: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  textBlockTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  textBlockBody: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  // --- Formularios ---
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
    marginBottom: 12,
    backgroundColor: '#F9FAFB',
  },
  formRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  primaryButton: {
    backgroundColor: '#2563EB', // Azul intenso
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#374151',
    fontWeight: '500',
    fontSize: 14,
  },
  // --- Listas ---
  listCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  listRow: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  listRowPrimary: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  listRowSecondary: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 8,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  linkButton: {
    paddingVertical: 4,
  },
  linkButtonText: {
    color: '#2563EB',
    fontSize: 13,
    fontWeight: '500',
  },
  linkButtonDanger: {
    paddingVertical: 4,
  },
  linkButtonDangerText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    color: '#6B7280',
    marginTop: 20,
    fontStyle: 'italic',
  },
});

export default App;
