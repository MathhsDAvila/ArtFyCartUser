// src/app/detalhes-produto.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DetalhesProdutoScreen() {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const router = useLocalSearchParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:3000/products/${id}`);
        const data = await response.json();
        if (!response.ok) {
          throw new Error('Produto não encontrado.');
        }
        setProduct(data.product);
      } catch (error) {
        Alert.alert('Erro', error.message);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) {
    return (
      <View style={styles.loading}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <Image source={{ uri: product.imageUrl }} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.title}>{product.name}</Text>
          <Text style={styles.description}>{product.description}</Text>
          <Text style={styles.price}>R$ {product.price.toFixed(2).replace('.', ',')}</Text>

          <View style={styles.quantityContainer}>
            <TouchableOpacity style={styles.qtyBtn} onPress={() => setQuantity(prev => Math.max(1, prev - 1))}>
              <Text style={styles.qtyText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantity}>{quantity}</Text>
            <TouchableOpacity style={styles.qtyBtn} onPress={() => setQuantity(prev => prev + 1)}>
              <Text style={styles.qtyText}>+</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.addToCartButton} onPress={() => Alert.alert("Adicionado", "Produto adicionado ao carrinho")}>
            <Text style={styles.addToCartText}>Adicionar ao Carrinho</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.addToCartButton, styles.buyNowButton]} onPress={() => Alert.alert("Compra", "Prosseguindo para pagamento")}>
            <Text style={styles.addToCartText}>Comprar Agora</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  info: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: -20,
    zIndex: -1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 15,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#232637',
    marginBottom: 20,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  qtyBtn: {
    width: 40,
    height: 40,
    backgroundColor: '#ddd',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  quantity: {
    fontSize: 18,
    marginHorizontal: 15,
  },
  addToCartButton: {
    backgroundColor: '#0066cc',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buyNowButton: {
    backgroundColor: '#232637',
  },
  addToCartText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});