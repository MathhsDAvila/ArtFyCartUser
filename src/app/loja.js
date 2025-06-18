// src/app/loja.js

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import Header from '../components/Header';

export default function LojaScreen() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [filterVisible, setFilterVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Categorias disponíveis
  const categories = ['Todos', 'Arte Digital', 'Pinturas', 'Esculturas'];

  // Verifica login
  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('userToken');
      setIsLoggedIn(!!token);
    };
    checkLoginStatus();
  }, []);

  // Busca produtos do backend
  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:3000/products');
      const data = await response.json();

      if (!response.ok) {
        throw new Error('Erro ao carregar produtos.');
      }

      setProducts(data.products || []);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível carregar os produtos.');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filtra os produtos
  const displayedProducts = products.filter(
    (p) => selectedCategory === 'Todos' || p.category === selectedCategory
  );

  // Adiciona ao carrinho
  const addToCart = async (product) => {
    try {
      const token = await AsyncStorage.getItem('userToken');

      if (!token) {
        Alert.alert(
          'Login necessário',
          'Faça login para adicionar ao carrinho.',
          [
            { text: 'Entrar', onPress: () => router.push('/login') },
            { text: 'Cancelar', style: 'cancel' },
          ]
        );
        return;
      }

      // Mostra feedback visual
      console.log("TOKEN ENVIADO:", token); // ✅ Para depurar

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

      // ✅ Tratamento mais detalhado do erro
      if (response.status === 403) {
        Alert.alert(
          'Sessão expirada',
          'Seu acesso expirou. Faça login novamente.',
          [{ text: 'Ok', onPress: () => router.push('/login') }]
        );
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao adicionar ao carrinho.');
      }

      const result = await response.json();
      Alert.alert('Sucesso!', `${product.name} adicionado ao carrinho.`);
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      Alert.alert('Erro', error.message || 'Não foi possível adicionar ao carrinho.');
    }
  };

  // Comprar agora → vai direto pro carrinho
  const handleBuyNow = async (product) => {
    await addToCart(product);
    router.push('/carrinho');
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <Header />

      {/* FILTRO */}
      <View style={styles.filterBar}>
        <TouchableOpacity style={styles.filterButton} onPress={() => setFilterVisible(true)}>
          <Text style={styles.filterButtonText}>Filtrar</Text>
        </TouchableOpacity>
        <Text style={styles.selectedCategory}>{selectedCategory}</Text>
      </View>

      {/* LISTA DE PRODUTOS */}
      <ScrollView contentContainerStyle={styles.content}>
        {displayedProducts.length === 0 && (
          <Text style={styles.noResults}>Nenhum produto encontrado.</Text>
        )}

       {displayedProducts.map((item) => (
  <View key={item.id} style={styles.card}>
    <Image source={{ uri: item.imageUrl }} style={styles.image} />
    <View style={styles.info}>
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>R$ {item.price.toFixed(2).replace('.', ',')}</Text>
      
      {/* AQUI VAMOS COLOCAR O BOTÃO */}
      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.smallButton} onPress={() => addToCart(item)}>
          <Text style={styles.smallButtonText}>Carrinho</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.smallButton, styles.buyButton]} onPress={() => handleBuyNow(item)}>
          <Text style={styles.smallButtonText}>Comprar</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
))}
      </ScrollView>

      {/* MODAL DE FILTRO */}
      <Modal visible={filterVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Escolha uma Categoria</Text>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryOption,
                  selectedCategory === cat && styles.categoryOptionActive,
                ]}
                onPress={() => {
                  setSelectedCategory(cat);
                  setFilterVisible(false);
                }}
              >
                <Text style={styles.categoryOptionText}>{cat}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setFilterVisible(false)}>
              <Text style={styles.cancelText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  filterBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#483d8d',
  },
  filterButton: {
    backgroundColor: '#3c327d',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  filterButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  selectedCategory: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    paddingTop: 20,
    paddingBottom: 80,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 120,
    resizeMode: 'cover',
    borderRadius: 10,
    marginRight: 16,
    alignSelf: 'center',
  },
  info: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  productPrice: {
    fontSize: 15,
    color: '#555',
    marginBottom: 12,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  smallButton: {
    flex: 1,
    backgroundColor: '#0066cc',
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  buyButton: {
    backgroundColor: '#232637',
  },
  smallButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  noResults: {
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    maxHeight: '60%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  categoryOption: {
    borderWidth: 1,
    borderColor: '#232637',
    borderRadius: 6,
    padding: 12,
    marginVertical: 6,
    width: '100%',
    alignItems: 'center',
  },
  categoryOptionActive: {
    backgroundColor: '#232637',
  },
  categoryOptionText: {
    fontSize: 16,
    color: '#232637',
  },
  cancelText: {
    textAlign: 'center',
    color: '#0066cc',
    marginTop: 10,
  },buttonGroup: {
  flexDirection: 'row',
  gap: 8,
  marginTop: 12,
},
smallButton: {
  flex: 1,
  backgroundColor: '#0066cc',
  paddingVertical: 6,
  borderRadius: 6,
  alignItems: 'center',
},
buyButton: {
  backgroundColor: '#232637',
},
smallButtonText: {
  color: '#fff',
  fontSize: 12,
  fontWeight: 'bold',
},
};