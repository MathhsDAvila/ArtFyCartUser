import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ContatoScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errorName, setErrorName] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const [messageSent, setMessageSent] = useState(false);
  const [checkedItems, setCheckedItems] = useState({
    address: true,
    email: true,
    phone: true,
  });

  const toggleCheckbox = (item) => {
    setCheckedItems(prev => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  const handleSubmit = () => {
    let isValid = true;
    setErrorName('');
    setErrorEmail('');

    if (!name) {
      setErrorName('Nome é obrigatório.');
      isValid = false;
    }

    if (!email || !email.includes('@')) {
      setErrorEmail('Email inválido. Por favor, inclua um "@" no endereço.');
      isValid = false;
    }

    if (!isValid) return;

    setMessageSent(true);
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <SafeAreaView style={styles.container}>
    <Header safeNavigation />
      <View style={styles.headerWrapper}>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {messageSent && (
          <View style={styles.successCard}>
            <Text style={styles.successCardText}>Mensagem enviada com sucesso!</Text>
          </View>
        )}

        <View style={styles.contactCard}>
          <Text style={styles.cardTitle}>Fale Conosco</Text>

          <TextInput
            style={[styles.input, styles.nameInput]}
            placeholder="Nome"
            value={name}
            onChangeText={setName}
          />
          {errorName ? <Text style={styles.errorText}>{errorName}</Text> : null}

          <TextInput
            style={[styles.input, styles.emailInput]}
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          {errorEmail ? <Text style={styles.errorText}>{errorEmail}</Text> : null}

          <TextInput
            style={[styles.input, styles.messageInput]}
            placeholder="Escreva sua mensagem..."
            multiline
            numberOfLines={4}
            value={message}
            onChangeText={setMessage}
          />

          <TouchableOpacity style={styles.sendButton} onPress={handleSubmit}>
            <Text style={styles.sendButtonText}>Enviar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Informações de Contato</Text>

          <TouchableOpacity
            style={styles.infoItem}
            onPress={() => toggleCheckbox('address')}
          >
            <Ionicons name="location-outline" size={24} color="#232637" />
            <Text style={styles.infoText}>Rua Exemplo, 123 - Caraguatatuba, SP</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.infoItem}
            onPress={() => toggleCheckbox('email')}
          >
            <Ionicons name="mail-outline" size={24} color="#232637" />
            <Text style={styles.infoText}>contato@exemplo.com</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.infoItem}
            onPress={() => toggleCheckbox('phone')}
          >
            <Ionicons name="call-outline" size={24} color="#232637" />
            <Text style={styles.infoText}>(12) 3456-7890</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footerWrapper}>
          <Footer />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  headerWrapper: {
    zIndex: 0,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  scrollContent: {
    paddingTop: 30,
  },
  contactCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#232637',
    marginTop: -20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 20,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  nameInput: {
    height: 50,
  },
  emailInput: {
    height: 60,
  },
  messageInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: '#232637',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#232637',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#232637',
  },
  successCard: {
    backgroundColor: '#d4edda',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
    marginTop: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  successCardText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#155724',
  },
  footerWrapper: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
});
