// -----------------------------------------
// src/screens/CatalogListScreen.tsx
// -----------------------------------------
// Componente genérico tipo "tarjeta AdminLTE"
// para listar catálogos simples:
//  - Título + subtítulo
//  - Input de búsqueda + botón "Buscar"
//  - Lista de filas
//  - Mensajes de carga, error y vacío
// -----------------------------------------

import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export type CatalogListScreenProps<TItem> = {
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  searchText: string;
  onSearchTextChange: (value: string) => void;
  onSearchPress: () => void;
  isLoading: boolean;
  errorMessage: string | null;
  items: TItem[];
  renderRow: (item: TItem) => React.ReactNode;
};

export const CatalogListScreen = <TItem,>({
  title,
  subtitle,
  searchPlaceholder,
  searchText,
  onSearchTextChange,
  onSearchPress,
  isLoading,
  errorMessage,
  items,
  renderRow,
}: CatalogListScreenProps<TItem>) => {
  const hasItems = items.length > 0;

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 24,
      }}
    >
      <View
        style={{
          borderWidth: 1,
          borderColor: '#E5E7EB',
          backgroundColor: '#FFFFFF',
          padding: 16,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: '600',
            color: '#111827',
            marginBottom: 4,
          }}
        >
          {title}
        </Text>
        <Text style={{ color: '#6B7280', fontSize: 13, marginBottom: 12 }}>
          {subtitle}
        </Text>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
            gap: 8,
          }}
        >
          <TextInput
            value={searchText}
            onChangeText={onSearchTextChange}
            placeholder={searchPlaceholder}
            placeholderTextColor="#9CA3AF"
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: '#D1D5DB',
              backgroundColor: '#FFFFFF',
              paddingVertical: 6,
              paddingHorizontal: 8,
              fontSize: 13,
              color: '#111827',
            }}
          />
          <TouchableOpacity
            onPress={onSearchPress}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 12,
              backgroundColor: '#111827',
            }}
          >
            <Text
              style={{
                color: '#FFFFFF',
                fontSize: 13,
                fontWeight: '500',
              }}
            >
              Buscar
            </Text>
          </TouchableOpacity>
        </View>

        {isLoading && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              marginBottom: 8,
            }}
          >
            <ActivityIndicator size="small" color="#111827" />
            <Text style={{ color: '#4B5563', fontSize: 13 }}>
              Cargando…
            </Text>
          </View>
        )}

        {errorMessage && !isLoading && (
          <View
            style={{
              marginBottom: 8,
              paddingVertical: 8,
              paddingHorizontal: 10,
              borderWidth: 1,
              borderColor: '#FCA5A5',
              backgroundColor: '#FEF2F2',
            }}
          >
            <Text style={{ color: '#B91C1C', fontSize: 13 }}>
              {errorMessage}
            </Text>
          </View>
        )}

        {!isLoading && !hasItems && !errorMessage && (
          <Text
            style={{
              color: '#6B7280',
              fontSize: 13,
            }}
          >
            No se encontraron registros. Verifica que existan datos en el
            backend.
          </Text>
        )}

        {items.map((item, index) => (
          <View key={index}>{renderRow(item)}</View>
        ))}
      </View>
    </ScrollView>
  );
};


