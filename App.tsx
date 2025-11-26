// -----------------------------------------
// App.tsx
// -----------------------------------------
// Componente raíz de la aplicación móvil centralHub.
// Por ahora solo muestra un "Hello world" en blanco,
// sobre fondo negro, siguiendo un estilo minimalista
// tipo Grazia (blanco/negro, sin bordes redondeados).
// -----------------------------------------

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

// -----------------------------------------
// Componente principal de la app
// -----------------------------------------
const App: React.FC = () => {
  // Render de una pantalla mínima:
  // solo un mensaje "Hello world" centrado.
  return (
    <SafeAreaView style={styles.root}>
      {/* Contenedor central vertical para los textos */}
      <View style={styles.centerContent}>
        {/* Título principal en blanco, tamaño grande */}
        <Text style={styles.mainTitle}>Hello world</Text>
      </View>

      {/* Barra de estado en claro sobre fondo oscuro */}
      <StatusBar style="light" />
    </SafeAreaView>
  );
};

// -----------------------------------------
// Estilos base de la pantalla
// -----------------------------------------
const styles = StyleSheet.create({
  // Contenedor raíz a pantalla completa con fondo negro
  root: {
    flex: 1,
    backgroundColor: '#000000',
  },

  // Contenedor central que alinea los textos al centro
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },

  // Título principal en blanco, sin bordes ni adornos
  mainTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 1,
  },

  // Subtítulo en gris claro, más discreto
  subtitle: {
    marginTop: 12,
    color: '#9CA3AF', // gris suave (similar Tailwind gray-400)
    fontSize: 14,
    textAlign: 'center',
  },
});

// -----------------------------------------
// Exportación por defecto del componente App
// -----------------------------------------
export default App;
