// src/app/carrinho.js

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CarrinhoScreen() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Verifica login
  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('userToken');
      setIsLoggedIn(!!token);
    };
    checkLoginStatus();
  }, []);

  // Busca carrinho do usuário logado
  const fetchCart = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Erro', 'Faça login para acessar o carrinho.');
        router.push('/login');
        return;
      }

      const response = await fetch('http://localhost:3000/cart', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Não foi possível carregar o carrinho.');
      }

      const data = await response.json();
      setCartItems(data.items || []);
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error);
      Alert.alert('Erro', 'Não foi possível carregar seu carrinho.');
    }
  };

  // Remove item do carrinho
  const removeItem = async (productId) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;

      const response = await fetch(`http://localhost:3000/cart/remove/${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Não foi possível remover o item.');
      }

      fetchCart(); // Atualiza o carrinho
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  };

  // Finaliza compra
  const handleCheckout = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Login necessário', 'Faça login para continuar.');
        router.push('/login');
        return;
      }

      const response = await fetch('http://localhost:3000/cart/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Falha ao finalizar a compra.');
      }

      Alert.alert('Sucesso!', 'Compra realizada com sucesso.');
      setCartItems([]); // Limpa localmente
      router.push('/meus-pedidos'); // Redireciona para pedidos
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  };

  // Calcula total
  useEffect(() => {
    const totalValue = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotal(totalValue);
  }, [cartItems]);

  // Carrega carrinho ao entrar na tela
  useEffect(() => {
    if (isLoggedIn) {
      fetchCart();
    }
  }, [isLoggedIn]);

  // Renderiza cada item
  const renderItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.product?.imageUrl }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.product?.name}</Text>
        <Text style={styles.itemPrice}>R$ {(item.price * item.quantity).toFixed(2)}</Text>
        <View style={styles.itemActions}>
          <Text style={styles.quantity}>Qtd: {item.quantity}</Text>
          <TouchableOpacity onPress={() => removeItem(item.productId)}>
            <Text style={styles.removeButton}>Remover</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <Text style={styles.headerTitle}>Seu Carrinho</Text>

      {cartItems.length === 0 ? (
        <View style={styles.emptyCart}>
          <Text style={styles.emptyText}>Seu carrinho está vazio.</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.productId.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
          />

          <View style={styles.summary}>
            <Text style={styles.total}>Total: R$ {total.toFixed(2)}</Text>
            <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
              <Text style={styles.checkoutButtonText}>Finalizar Compra</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      <TouchableOpacity style={styles.backButton} onPress={() => router.push('/loja')}>
        <Text style={styles.backButtonText}>Voltar às Compras</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#232637',
    marginBottom: 16,
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#555',
    fontStyle: 'italic',
  },
  list: {
    paddingBottom: 80,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    elevation: 1,
  },
  itemImage: {
    width: 80,
    height: 80,
    resizeMode: 'cover',
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 16,
    color: '#232637',
    fontWeight: 'bold',
  },
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantity: {
    fontSize: 14,
    color: '#555',
  },
  removeButton: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 14,
  },
  summary: {
    borderTopWidth: 1,
    borderColor: '#ddd',
    paddingTop: 16,
    marginTop: 16,
    alignItems: 'flex-end',
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#232637',
    marginBottom: 12,
  },
  checkoutButton: {
    backgroundColor: '#232637',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  backButton: {
    marginTop: 16,
    alignSelf: 'center',
  },
  backButtonText: {
    color: '#0066cc',
    fontSize: 16,
  },
});