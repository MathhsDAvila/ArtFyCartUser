import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Icon from 'react-native-vector-icons/MaterialIcons';

const pedidos = [
  { id: '1', produto: 'Quadro Abstrato', status: 'Enviado', data: '25/05/2025' },
  { id: '2', produto: 'Pintura a óleo', status: 'Processando', data: '22/05/2025' },
  { id: '3', produto: 'Escultura em argila', status: 'Entregue', data: '18/05/2025' },
];

const statusColors = {
  'Enviado': '#007AFF',
  'Processando': '#FFA500',
  'Entregue': '#28A745',
};

export default function MeusPedidos() {
  return (
    <View style={styles.container}>
      <Header />

     

      <ScrollView contentContainerStyle={styles.scroll}>
      <Text style={styles.titulo}>📦 Meus Pedidos</Text>
        {pedidos.map((pedido) => (
          <View key={pedido.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Icon name="shopping-bag" size={24} color="#555" style={styles.icon} />
              <Text style={styles.produto}>{pedido.produto}</Text>
            </View>
            <Text style={styles.status}>
              Status:{' '}
              <Text style={[styles.statusValor, { color: statusColors[pedido.status] }]}>
                {pedido.status}
              </Text>
            </Text>
            <Text style={styles.data}>📅 {pedido.data}</Text>
          </View>
        ))}
         <Footer />
      </ScrollView>

     
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 90,
    marginBottom: 20,
    alignSelf: 'center',
    color: '#333',
  },
  scroll: {
    // paddingBottom: 100,
    // paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    borderLeftWidth: 6,
    borderLeftColor: '#eee',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginRight: 10,
  },
  produto: {
    fontSize: 20,
    fontWeight: '600',
    color: '#222',
  },
  status: {
    fontSize: 16,
    marginBottom: 4,
    color: '#555',
  },
  statusValor: {
    fontWeight: 'bold',
  },
  data: {
    fontSize: 14,
    color: '#888',
  },
});
