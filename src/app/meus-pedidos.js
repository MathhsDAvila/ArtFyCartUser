// src/app/meus-pedidos.js

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Componente Header já existe
import Header from '../components/Header';

export default function MeusPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  const statusColors = {
    COMPLETED: '#28A745',
    ACTIVE: '#FFA500',
    ABANDONED: '#666'
  };

  const fetchPedidos = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');

      if (!token) {
        Alert.alert('Erro', 'Você precisa estar logado.');
        return;
      }

      const response = await fetch('http://localhost:3000/cart/user/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao carregar pedidos.');
      }

      // Filtra apenas os carrinhos COMPLETED
      const completedCarts = data.carts.filter(cart => cart.status === 'COMPLETED');

      // Formata os dados para exibição
      const formattedOrders = completedCarts.flatMap(cart =>
        cart.items.map(item => ({
          id: item.id.toString(),
          produto: item.product.name,
          preco: item.price * item.quantity,
          quantidade: item.quantity,
          data: new Date(cart.updatedAt).toLocaleDateString('pt-BR'),
          status: cart.status
        }))
      );

      setPedidos(formattedOrders);
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.titulo}>📦 Meus Pedidos</Text>

        {loading ? (
          <Text>Carregando seus pedidos...</Text>
        ) : pedidos.length === 0 ? (
          <Text style={styles.emptyText}>Você ainda não tem nenhum pedido.</Text>
        ) : (
          pedidos.map((pedido) => (
            <View key={pedido.id} style={styles.card}>
              <Text style={styles.produto}>{pedido.produto}</Text>
              <Text style={styles.quantidade}>Quantidade: {pedido.quantidade}</Text>
              <Text style={styles.preco}>Total: R$ {pedido.preco.toFixed(2)}</Text>
              <Text style={[styles.status, { color: statusColors[pedido.status] }]}>
                Status: {pedido.status}
              </Text>
              <Text style={styles.data}>Data: {pedido.data}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginTop: 90,
    marginBottom: 20,
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#999',
    marginVertical: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    elevation: 2,
    borderLeftWidth: 6,
    borderLeftColor: '#eee',
  },
  produto: {
    fontSize: 20,
    fontWeight: '600',
    color: '#222',
  },
  quantidade: {
    fontSize: 16,
    color: '#555',
    marginTop: 4,
  },
  preco: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#232637',
    marginTop: 4,
  },
  status: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
  data: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
});