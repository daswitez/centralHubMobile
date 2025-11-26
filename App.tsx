// -----------------------------------------
// App.tsx
// -----------------------------------------
// Componente raíz de la aplicación móvil centralHub.
// Muestra un dashboard principal con un layout inspirado
// en AdminLTE adaptado a móvil:
//  - Fondo gris claro tipo panel de administración.
//  - Menú vertical oscuro a la izquierda para navegar
//    entre secciones (Dashboard, Departamentos, Municipios,
//    Variedades).
//  - Zona de contenido a la derecha con tarjetas claras
//    y pequeñas secciones tipo "card" al estilo AdminLTE.
// Se conecta a los módulos de API (departamentos, municipios,
// variedades) para mostrar datos reales del backend Laravel.
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
} from 'react-native';

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

// -----------------------------------------
// Tipo de sección para el menú lateral
// -----------------------------------------
// Define las llaves disponibles en el dashboard
// para poder cambiar entre vistas usando un
// simple estado local.
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
  | 'lecturas';

// -----------------------------------------
// Componente principal de la app
// -----------------------------------------
const App: React.FC = () => {
  // Estado que indica qué sección del dashboard
  // está activa en este momento.
  const [activeSection, setActiveSection] = useState<SectionKey>('dashboard');

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
  };

  // Handler que carga todos los catálogos en paralelo
  // utilizando los módulos de API.
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
      // Log técnico para depuración en consola de Metro.
      // eslint-disable-next-line no-console
      console.error('Error cargando catálogos:', error);
    } finally {
      setIsLoadingCatalogs(false);
    }
  };

  // Cargamos los catálogos al iniciar la app.
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

  // Render principal: layout en dos columnas
  // (menú vertical + área de contenido).
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.layoutRow}>
        {/* Menú lateral vertical (similar a sidebar web) */}
        <View style={styles.sideMenu}>
          {/* Branding minimalista centralHub */}
          <Text style={styles.appTitle}>centralHub</Text>
          <Text style={styles.appSubtitle}>Control panel</Text>

          {/* Separador visual */}
          <View style={styles.menuDivider} />

          {/* Opciones de navegación - catálogos base */}
          {renderMenuItem('dashboard', 'Dashboard')}
          {renderMenuItem('departamentos', 'Departamentos')}
          {renderMenuItem('municipios', 'Municipios')}
          {renderMenuItem('variedades', 'Variedades')}

          {/* Separador de grupo */}
          <View style={styles.menuDivider} />

          {/* Catálogos extendidos */}
          {renderMenuItem('plantas', 'Plantas')}
          {renderMenuItem('clientes', 'Clientes')}
          {renderMenuItem('transportistas', 'Transportistas')}
          {renderMenuItem('almacenes', 'Almacenes')}

          {/* Separador de grupo */}
          <View style={styles.menuDivider} />

          {/* Campo */}
          {renderMenuItem('productores', 'Productores')}
          {renderMenuItem('lotesCampo', 'Lotes campo')}
          {renderMenuItem('lecturas', 'Lecturas sensor')}
        </View>

        {/* Área principal de contenido */}
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
          </ScrollView>
        </View>
      </View>

      {/* Barra de estado en claro sobre fondo oscuro */}
      <StatusBar style="light" />
    </SafeAreaView>
  );
};

// -----------------------------------------
// Sección: Dashboard principal centralHub
// -----------------------------------------
// Muestra un resumen general con algunos KPIs
// ficticios, imitando el estilo de AdminLTE
// (tarjetas claras sobre fondo gris, con KPIs).
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
  onReloadCatalogs,
}) => {
  const totalDepartamentos = departamentos.length;
  const totalMunicipios = municipios.length;
  const totalVariedades = variedades.length;

  return (
    <View style={styles.sectionContainer}>
      {/* Cabecera de la sección */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Panel general centralHub</Text>
        <Text style={styles.sectionSubtitle}>
          Producción · Catálogos · Logística — panel de control centralHub
        </Text>
      </View>

      {/* Mensajes de carga o error globales */}
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

      {/* Fila de tarjetas KPI, tipo AdminLTE pero minimalistas */}
      <View style={styles.kpiColumn}>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Departamentos</Text>
          <Text style={styles.kpiValue}>
            {totalDepartamentos > 0 ? totalDepartamentos : '—'}
          </Text>
          <Text style={styles.kpiHint}>Catálogo base de regiones</Text>
        </View>

        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Municipios</Text>
          <Text style={styles.kpiValue}>
            {totalMunicipios > 0 ? totalMunicipios : '—'}
          </Text>
          <Text style={styles.kpiHint}>Cobertura geográfica registrada</Text>
        </View>

        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Variedades de papa</Text>
          <Text style={styles.kpiValue}>
            {totalVariedades > 0 ? totalVariedades : '—'}
          </Text>
          <Text style={styles.kpiHint}>Catálogo de materiales genéticos</Text>
        </View>
      </View>

      {/* Bloque de descripción simple */}
      <View style={styles.textBlock}>
        <Text style={styles.textBlockTitle}>Trazabilidad centralizada</Text>
        <Text style={styles.textBlockBody}>
          CentralHub conecta catálogos, producción y logística en un solo
          panel. Esta vista móvil resume la estructura principal: departamentos,
          municipios y variedades de papa que se sincronizan con tu backend
          Laravel + PostgreSQL.
        </Text>
      </View>
    </View>
  );
};

// -----------------------------------------
// Sección: Departamentos
// -----------------------------------------
// Presenta la lista de departamentos que llega
// desde el backend Laravel a través del módulo
// departamentosApi.
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
      // Log de depuración para verificar qué ID se está usando al guardar
      // y confirmar si estamos en modo creación o edición.
      // Esto se verá en la consola de Metro / Expo.
      // eslint-disable-next-line no-console
      console.log('[handleSubmitDepartamento]', {
        editingId,
        editingIdType: typeof editingId,
        nombre: trimmedName,
      });

      // Si no hay id válido (> 0), asumimos que es un alta (create)
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
      // eslint-disable-next-line no-console
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
      // eslint-disable-next-line no-console
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
      // No recargamos catálogos globales, solo mostramos el resultado filtrado.
      // Esto mantiene el dashboard usando el total general.
      // Para simplificar, podríamos también refrescar globalmente si lo deseas.
      // Aquí preferimos no tocar el estado global.
      // eslint-disable-next-line no-console
      console.info('Departamentos filtrados localmente:', filtered.length);
    } catch (error) {
      setLocalErrorMessage(
        'No se pudieron filtrar los departamentos. Revisa tu conexión.'
      );
      // eslint-disable-next-line no-console
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
          Datos en vivo desde /cat/departamentos (Laravel)
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

      {/* Formulario de búsqueda y alta/edición de departamento */}
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
          No se encontraron departamentos. Verifica que el backend esté
          respondiendo.
        </Text>
      )}

      {hasData && (
      <View style={styles.listCard}>
        {departamentos.map((item, index) => (
          <View key={`${item.departamento_id}-${index}`} style={styles.listRow}>
            <Text style={styles.listRowPrimary}>{item.nombre}</Text>
            <Text style={styles.listRowSecondary}>
              ID: {item.departamento_id} · Registro de departamento
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
// Muestra los municipios cargados desde /cat/municipios.
type MunicipiosSectionProps = {
  municipios: Municipio[];
  isLoading: boolean;
  errorMessage: string | null;
  onReloadCatalogs: () => Promise<void>;
};

const MunicipiosSection: React.FC<MunicipiosSectionProps> = ({
  municipios,
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
      // eslint-disable-next-line no-console
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
      // eslint-disable-next-line no-console
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
          Datos en vivo desde /cat/municipios
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

      {/* Formulario de alta/edición de municipio */}
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

        <TextInput
          value={formDepartamentoId}
          onChangeText={setFormDepartamentoId}
          placeholder="Departamento ID (número)"
          placeholderTextColor="#9CA3AF"
          keyboardType="numeric"
          style={styles.textInput}
        />

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
          No se encontraron municipios. Revisa que existan registros en el
          backend.
        </Text>
      )}

      {hasData && (
      <View style={styles.listCard}>
        {municipios.map((item, index) => (
          <View key={`${item.municipio_id}-${index}`} style={styles.listRow}>
            <Text style={styles.listRowPrimary}>{item.nombre}</Text>
            <Text style={styles.listRowSecondary}>
              Departamento ID: {item.departamento_id}
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
// Sección: Variedades de papa
// -----------------------------------------
// Replica la idea de la VariedadesScreen de la guía,
// pero consumiendo datos de /cat/variedades.
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
  const [formCodigo, setFormCodigo] = useState<string>('');
  const [formNombreComercial, setFormNombreComercial] = useState<string>('');
  const [formAptitud, setFormAptitud] = useState<string>('');
  const [formCicloMin, setFormCicloMin] = useState<string>('');
  const [formCicloMax, setFormCicloMax] = useState<string>('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [localErrorMessage, setLocalErrorMessage] = useState<string | null>(
    null
  );

  const handleSubmitVariedad = async () => {
    const codigo = formCodigo.trim();
    const nombreComercial = formNombreComercial.trim();

    if (!codigo || !nombreComercial) {
      setLocalErrorMessage(
        'Código y nombre comercial son obligatorios para la variedad.'
      );
      return;
    }

    const cicloMin =
      formCicloMin.trim() === '' ? null : Number(formCicloMin.trim());
    const cicloMax =
      formCicloMax.trim() === '' ? null : Number(formCicloMax.trim());

    if (
      (formCicloMin.trim() !== '' && Number.isNaN(cicloMin)) ||
      (formCicloMax.trim() !== '' && Number.isNaN(cicloMax))
    ) {
      setLocalErrorMessage(
        'Los campos de ciclo deben ser números o quedar vacíos.'
      );
      return;
    }

    setIsSaving(true);
    setLocalErrorMessage(null);

    try {
      const payload = {
        codigo_variedad: codigo,
        nombre_comercial: nombreComercial,
        aptitud: formAptitud.trim() || null,
        ciclo_dias_min: cicloMin,
        ciclo_dias_max: cicloMax,
      };

      if (!editingId) {
        await createVariedad(payload);
      } else {
        await updateVariedad(editingId, payload);
      }

      setFormCodigo('');
      setFormNombreComercial('');
      setFormAptitud('');
      setFormCicloMin('');
      setFormCicloMax('');
      setEditingId(null);
      await onReloadCatalogs();
    } catch (error) {
      setLocalErrorMessage(
        'No se pudo guardar la variedad. Verifica la conexión o los datos.'
      );
      // eslint-disable-next-line no-console
      console.error('Error guardando variedad:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditVariedad = (item: VariedadPapa) => {
    setEditingId(item.variedad_id);
    setFormCodigo(item.codigo_variedad);
    setFormNombreComercial(item.nombre_comercial);
    setFormAptitud(item.aptitud ?? '');
    setFormCicloMin(
      item.ciclo_dias_min !== undefined && item.ciclo_dias_min !== null
        ? String(item.ciclo_dias_min)
        : ''
    );
    setFormCicloMax(
      item.ciclo_dias_max !== undefined && item.ciclo_dias_max !== null
        ? String(item.ciclo_dias_max)
        : ''
    );
    setLocalErrorMessage(null);
  };

  const handleCancelEditVariedad = () => {
    setEditingId(null);
    setFormCodigo('');
    setFormNombreComercial('');
    setFormAptitud('');
    setFormCicloMin('');
    setFormCicloMax('');
    setLocalErrorMessage(null);
  };

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Variedades de papa</Text>
        <Text style={styles.sectionSubtitle}>
          Datos en vivo desde /cat/variedades
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

      {!isLoading && !hasData && !errorMessage && (
        <Text style={styles.emptyText}>
          No se encontraron variedades. Revisa que existan registros en el
          backend.
        </Text>
      )}

      {hasData && (
      <View style={styles.listCard}>
        {variedades.map((item, index) => (
          <View key={`${item.variedad_id}-${index}`} style={styles.listRow}>
            <Text style={styles.listRowPrimary}>
              {item.codigo_variedad} — {item.nombre_comercial}
            </Text>
            {item.aptitud ? (
              <Text style={styles.listRowSecondary}>
                Aptitud: {item.aptitud}
              </Text>
            ) : null}
            <Text style={styles.listRowTertiary}>
              Ciclo (días): {item.ciclo_dias_min ?? '-'} –{' '}
              {item.ciclo_dias_max ?? '-'}
            </Text>
          </View>
        ))}
      </View>
      )}
    </View>
  );
};

// -----------------------------------------
// Estilos base de la pantalla
// -----------------------------------------
const styles = StyleSheet.create({
  // Contenedor raíz a pantalla completa con fondo gris claro
  // similar al fondo de contenido de AdminLTE.
  root: {
    flex: 1,
    backgroundColor: '#F4F6F9',
  },

  // Fila principal: menú lateral + contenido
  layoutRow: {
    flex: 1,
    flexDirection: 'row',
  },

  // Menú lateral (sidebar) estilo AdminLTE
  sideMenu: {
    width: 140,
    paddingTop: 24,
    paddingHorizontal: 12,
    backgroundColor: '#111827',
    borderRightWidth: 1,
    borderColor: '#111827', // gris muy oscuro
  },

  // Área de contenido principal
  contentArea: {
    flex: 1,
    paddingVertical: 24,
    paddingHorizontal: 20,
    // Fondo gris muy suave, como el cuerpo principal de AdminLTE.
    backgroundColor: '#F4F6F9',
  },

  // Contenido de scroll: separa un poco de los bordes
  scrollContent: {
    paddingBottom: 40,
  },

  // Título de la app en el menú lateral
  appTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 1,
  },

  // Subtítulo de la app (texto gris)
  appSubtitle: {
    marginTop: 4,
    color: '#9CA3AF',
    fontSize: 12,
  },

  // Separador de secciones en el menú lateral
  menuDivider: {
    marginTop: 16,
    marginBottom: 8,
    height: 1,
    backgroundColor: '#1F2937',
  },

  // Estilo base de cada ítem del menú
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 4,
  },

  // Variante activa del ítem de menú
  menuItemActive: {
    borderLeftWidth: 2,
    borderColor: '#FFFFFF',
  },

  // Texto del ítem de menú
  menuItemLabel: {
    color: '#9CA3AF',
    fontSize: 13,
  },

  // Texto del ítem de menú activo
  menuItemLabelActive: {
    color: '#FFFFFF',
    fontWeight: '500',
  },

  // Subtítulo en gris claro, más discreto
  subtitle: {
    marginTop: 12,
    color: '#9CA3AF', // gris suave (similar Tailwind gray-400)
    fontSize: 14,
    textAlign: 'center',
  },

  // Contenedor general de cada sección de contenido
  sectionContainer: {
    gap: 16,
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  // Cabecera de cada sección
  sectionHeader: {
    marginBottom: 8,
  },

  sectionTitle: {
    color: '#111827',
    fontSize: 20,
    fontWeight: '600',
  },

  sectionSubtitle: {
    marginTop: 4,
    color: '#6B7280',
    fontSize: 13,
  },

  // Columna de KPIs (cada tarjeta en bloque)
  kpiColumn: {
    marginTop: 16,
    gap: 12,
  },

  // Tarjeta KPI sin bordes redondeados
  kpiCard: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },

  kpiLabel: {
    color: '#6B7280',
    fontSize: 12,
  },

  kpiValue: {
    marginTop: 4,
    color: '#111827',
    fontSize: 22,
    fontWeight: '600',
  },

  kpiHint: {
    marginTop: 2,
    color: '#9CA3AF',
    fontSize: 11,
  },

  // Bloque de texto explicativo
  textBlock: {
    marginTop: 20,
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
    paddingTop: 12,
  },

  textBlockTitle: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },

  textBlockBody: {
    color: '#6B7280',
    fontSize: 13,
    lineHeight: 18,
  },

  // Tarjeta de lista (contenedor de filas)
  listCard: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },

  // Fila de lista tipo tabla simple
  listRow: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: '#1F2937',
  },

  listRowPrimary: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '500',
  },

  listRowSecondary: {
    marginTop: 2,
    color: '#9CA3AF',
    fontSize: 12,
  },

  listRowTertiary: {
    marginTop: 2,
    color: '#6B7280',
    fontSize: 11,
  },

  // Fila de acciones (Editar / Eliminar) en cada registro
  actionsRow: {
    marginTop: 6,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 12,
  },

  // Botón tipo enlace para acciones primarias
  linkButton: {
    paddingVertical: 2,
    paddingHorizontal: 4,
  },

  linkButtonText: {
    color: '#2563EB',
    fontSize: 12,
  },

  // Botón tipo enlace para acciones de peligro (eliminar)
  linkButtonDanger: {
    paddingVertical: 2,
    paddingHorizontal: 4,
  },

  linkButtonDangerText: {
    color: '#DC2626',
    fontSize: 12,
  },

  // Fila de estado (spinner + texto)
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },

  statusText: {
    color: '#4B5563',
    fontSize: 13,
  },

  // Banner de error al estilo alerta AdminLTE
  errorBanner: {
    marginBottom: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    backgroundColor: '#FEF2F2',
  },

  errorBannerText: {
    color: '#B91C1C',
    fontSize: 13,
  },

  // Texto para estados vacíos
  emptyText: {
    marginTop: 4,
    marginBottom: 8,
    color: '#6B7280',
    fontSize: 13,
  },

  // Tarjeta contenedora de formularios (crear/editar, filtros)
  formCard: {
    marginBottom: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },

  formTitle: {
    marginBottom: 8,
    color: '#111827',
    fontSize: 14,
    fontWeight: '600',
  },

  // Campo de texto estándar tipo AdminLTE
  textInput: {
    marginBottom: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    color: '#111827',
    fontSize: 13,
  },

  // Fila de botones en formularios
  formRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 8,
    marginTop: 4,
  },

  // Botón principal (similar a btn-primary)
  primaryButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#111827',
  },

  primaryButtonDisabled: {
    opacity: 0.7,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
  },

  // Botón secundario (similar a btn-secondary)
  secondaryButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },

  secondaryButtonText: {
    color: '#374151',
    fontSize: 13,
  },
});

// -----------------------------------------
// Exportación por defecto del componente App
// -----------------------------------------
export default App;
