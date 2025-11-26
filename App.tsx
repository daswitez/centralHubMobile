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
// -----------------------------------------

import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// -----------------------------------------
// Tipo de sección para el menú lateral
// -----------------------------------------
// Define las llaves disponibles en el dashboard
// para poder cambiar entre vistas usando un
// simple estado local.
type SectionKey = 'dashboard' | 'departamentos' | 'municipios' | 'variedades';

// -----------------------------------------
// Componente principal de la app
// -----------------------------------------
const App: React.FC = () => {
  // Estado que indica qué sección del dashboard
  // está activa en este momento.
  const [activeSection, setActiveSection] = useState<SectionKey>('dashboard');

  // Handler para cambiar de sección desde el menú lateral.
  const handleChangeSection = (section: SectionKey) => {
    setActiveSection(section);
  };

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

          {/* Opciones de navegación */}
          {renderMenuItem('dashboard', 'Dashboard')}
          {renderMenuItem('departamentos', 'Departamentos')}
          {renderMenuItem('municipios', 'Municipios')}
          {renderMenuItem('variedades', 'Variedades')}
        </View>

        {/* Área principal de contenido */}
        <View style={styles.contentArea}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {activeSection === 'dashboard' && <DashboardSection />}
            {activeSection === 'departamentos' && <DepartamentosSection />}
            {activeSection === 'municipios' && <MunicipiosSection />}
            {activeSection === 'variedades' && <VariedadesSection />}
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
const DashboardSection: React.FC = () => {
  return (
    <View style={styles.sectionContainer}>
      {/* Cabecera de la sección */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Panel general centralHub</Text>
        <Text style={styles.sectionSubtitle}>
          Producción · Catálogos · Logística — panel de control centralHub
        </Text>
      </View>

      {/* Fila de tarjetas KPI, tipo AdminLTE pero minimalistas */}
      <View style={styles.kpiColumn}>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Departamentos</Text>
          <Text style={styles.kpiValue}>8</Text>
          <Text style={styles.kpiHint}>Catálogo base de regiones</Text>
        </View>

        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Municipios</Text>
          <Text style={styles.kpiValue}>120+</Text>
          <Text style={styles.kpiHint}>Cobertura geográfica registrada</Text>
        </View>

        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Variedades de papa</Text>
          <Text style={styles.kpiValue}>20</Text>
          <Text style={styles.kpiHint}>Waych&apos;a, Desirée y más</Text>
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
// Presenta una lista estática de ejemplo con algunos
// departamentos, en una tabla muy simple tipo AdminLTE.
const DepartamentosSection: React.FC = () => {
  const exampleDepartamentos = [
    'La Paz',
    'Cochabamba',
    'Santa Cruz',
    'Oruro',
    'Chuquisaca',
  ];

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Catálogo de Departamentos</Text>
        <Text style={styles.sectionSubtitle}>
          Vista simplificada — luego se conectará al backend /cat/departamentos
        </Text>
      </View>

      <View style={styles.listCard}>
        {exampleDepartamentos.map((nombre) => (
          <View key={nombre} style={styles.listRow}>
            <Text style={styles.listRowPrimary}>{nombre}</Text>
            <Text style={styles.listRowSecondary}>Departamento registrado</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

// -----------------------------------------
// Sección: Municipios
// -----------------------------------------
// Muestra algunos municipios de ejemplo, agrupados
// en filas con texto principal y secundario.
const MunicipiosSection: React.FC = () => {
  const exampleMunicipios = [
    { nombre: 'Sacaba', depto: 'Cochabamba' },
    { nombre: 'Quillacollo', depto: 'Cochabamba' },
    { nombre: 'El Alto', depto: 'La Paz' },
    { nombre: 'Montero', depto: 'Santa Cruz' },
  ];

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Catálogo de Municipios</Text>
        <Text style={styles.sectionSubtitle}>
          Ejemplos de municipios vinculados a departamentos
        </Text>
      </View>

      <View style={styles.listCard}>
        {exampleMunicipios.map((item) => (
          <View key={item.nombre} style={styles.listRow}>
            <Text style={styles.listRowPrimary}>{item.nombre}</Text>
            <Text style={styles.listRowSecondary}>
              Departamento: {item.depto}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

// -----------------------------------------
// Sección: Variedades de papa
// -----------------------------------------
// Replica la idea de la VariedadesScreen de la guía,
// pero con datos de ejemplo y estilo blanco/negro.
const VariedadesSection: React.FC = () => {
  const exampleVariedades = [
    {
      codigo: 'WAYCHA',
      nombre: "Waych'a",
      aptitud: 'Mesa',
      ciclo: '110–140 días',
    },
    {
      codigo: 'DESIREE',
      nombre: 'Desirée',
      aptitud: 'Mesa / industria',
      ciclo: '120–150 días',
    },
    {
      codigo: 'SANTINA',
      nombre: 'Santina',
      aptitud: 'Industria',
      ciclo: '100–120 días',
    },
  ];

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Variedades de papa</Text>
        <Text style={styles.sectionSubtitle}>
          Datos de ejemplo en el mismo formato que /cat/variedades
        </Text>
      </View>

      <View style={styles.listCard}>
        {exampleVariedades.map((item) => (
          <View key={item.codigo} style={styles.listRow}>
            <Text style={styles.listRowPrimary}>
              {item.codigo} — {item.nombre}
            </Text>
            <Text style={styles.listRowSecondary}>Aptitud: {item.aptitud}</Text>
            <Text style={styles.listRowTertiary}>Ciclo: {item.ciclo}</Text>
          </View>
        ))}
      </View>
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
});

// -----------------------------------------
// Exportación por defecto del componente App
// -----------------------------------------
export default App;
