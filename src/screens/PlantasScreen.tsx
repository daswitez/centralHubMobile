// -----------------------------------------
// src/screens/PlantasScreen.tsx
// -----------------------------------------
// Pantalla tipo AdminLTE simplificada para listar
// y buscar Plantas de proceso usando /api/cat/plantas.
// -----------------------------------------

import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type { Planta } from '../api/catalogTypes';
import { getPlantas } from '../api/plantasApi';

export const PlantasScreen: React.FC = () => {
  const [plantas, setPlantas] = useState<Planta[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLoadPlantas = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await getPlantas(searchText.trim() || undefined);
      setPlantas(data);
    } catch (error) {
      setErrorMessage('No se pudieron cargar las plantas.');
      // eslint-disable-next-line no-console
      console.error('Error cargando plantas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void handleLoadPlantas();
  }, []);

  const renderPlantaRow = (item: Planta) => {
    return (
      <View
        key={item.planta_id}
        style={{
          paddingVertical: 10,
          borderBottomWidth: 1,
          borderColor: '#E5E7EB',
        }}
      >
        <Text style={{ fontWeight: '600', color: '#111827' }}>
          {item.codigo_planta} — {item.nombre}
        </Text>
        <Text style={{ color: '#6B7280', fontSize: 12 }}>
          Municipio ID: {item.municipio_id}
        </Text>
        {item.direccion ? (
          <Text style={{ color: '#9CA3AF', fontSize: 12 }}>
            Dirección: {item.direccion}
          </Text>
        ) : null}
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F4F6F9' }}>
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
            Plantas de proceso
          </Text>
          <Text style={{ color: '#6B7280', fontSize: 13, marginBottom: 12 }}>
            Catálogo de plantas (fuente: /api/cat/plantas)
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
              onChangeText={setSearchText}
              placeholder="Buscar por código o nombre…"
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
              onPress={handleLoadPlantas}
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
                Cargando plantas…
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

          {!isLoading && plantas.length === 0 && !errorMessage && (
            <Text
              style={{
                color: '#6B7280',
                fontSize: 13,
              }}
            >
              No se encontraron plantas. Verifica que existan registros en el
              backend.
            </Text>
          )}

          {plantas.map(renderPlantaRow)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};


