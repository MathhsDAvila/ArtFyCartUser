// src/app/detalhes-produto.js

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DetalhesProduto({ route, navigation }) {
  const [product, setProduct] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      const storedProduct = JSON.parse(route.params?.product);
      if (storedProduct) {
        setProduct(storedProduct);
      }

      const token = await AsyncStorage.getItem('userToken');
      setIsLoggedIn(!!token);
    };
    fetchProduct();
  }, []);

  const handleBuyNow = async () => {
    if (!isLoggedIn) {
      Alert.alert("Login necessário", "Faça login para continuar.", [
        { text: "Entrar", onPress: () => navigation.push('/login') },
        { text: "Cancelar" }
      ]);
      return;
    }

    try {
      const token = await AsyncStorage.getItem('userToken');

      const response = await fetch('http://localhost:3000/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: 1,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao adicionar ao carrinho.');
      }

      // Navegar para carrinho
      navigation.navigate('carrinho');
    } catch (error) {
      console.error(error);
      alert('Erro ao adicionar ao carrinho.');
    }
  };

  if (!product) {
    return (
      <View style={styles.container}>
        <Text>Carregando detalhes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: product.imageUrl }} style={styles.image} />
      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.price}>R$ {product.price.toFixed(2)}</Text>
      <Text style={styles.description}>{product.description}</Text>

      <TouchableOpacity style={styles.buyButton} onPress={handleBuyNow}>
        <Text style={styles.buyButtonText}>Comprar Agora</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    color: '#232637',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  buyButton: {
    backgroundColor: '#232637',
    paddingVertical: 15,
    borderRadius: 6,
    alignItems: 'center',
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});