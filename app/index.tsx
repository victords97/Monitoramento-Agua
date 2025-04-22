import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from 'expo-router';

export default function Index() {
  const [municipio, setMunicipio] = useState('manaus');
  const [dados, setDados] = useState<any>(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [corIndicador, setCorIndicador] = useState('gray');
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ title: 'Monitoramento' });
  }, []);

  const buscarDados = async () => {
    try {
      const response = await fetch(`http://192.168.90.43:5000/dados?municipio=${municipio}`);
      const json = await response.json();
      setDados(json);
      animarIndicador(json);
      fadeIn();
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  };

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const animarIndicador = (data: any) => {
    if (data.temperatura > 30) {
      setCorIndicador('red');
    } else if (data.ph < 6.5 || data.ph > 8.5) {
      setCorIndicador('yellow');
    } else if (data.turbidez > 5) {
      setCorIndicador('orange');
    } else {
      setCorIndicador('green');
    }
  };

  return (
    <LinearGradient colors={['#2980b9', '#6dd5fa']} style={styles.container}>
      <Image
        source={require('../assets/images/logo.png')} 
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.titulo}>Monitoramento da Qualidade da Água</Text>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={municipio}
          onValueChange={(itemValue) => setMunicipio(itemValue)}
          style={styles.picker}
          dropdownIconColor="#3498db"
        >
          <Picker.Item label="Manaus" value="manaus" />
          <Picker.Item label="Itacoatiara" value="itacoatiara" />
          <Picker.Item label="Parintins" value="parintins" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.botao} onPress={buscarDados}>
        <Text style={styles.botaoTexto}>Atualizar Dados</Text>
      </TouchableOpacity>

      {dados && (
        <Animated.View style={[styles.dadosContainer, { opacity: fadeAnim }]}>
          <Text style={styles.dado}>🌡️ Temperatura: {dados.temperatura}°C</Text>
          <Text style={styles.dado}>⚗️ pH: {dados.ph}</Text>
          <Text style={styles.dado}>💧 Turbidez: {dados.turbidez} NTU</Text>
          <View style={[styles.indicador, { backgroundColor: corIndicador }]} />
        </Animated.View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 360,
    height: 360,
    marginBottom: 10,
  },
  titulo: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  pickerContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  picker: {
    width: '100%',
    height: 70,
    fontSize: 16,
    textAlign: 'center',
  },
  botao: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginBottom: 20,
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  dadosContainer: {
    backgroundColor: '#ffffffcc',
    padding: 16,
    borderRadius: 12,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  dado: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  indicador: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginTop: 10,
  },
});
