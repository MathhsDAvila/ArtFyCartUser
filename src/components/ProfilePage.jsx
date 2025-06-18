// ProfileEditScreen.jsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileEditScreen() {
  const router = useRouter();

  // Estados do usuário
  const [userInfo, setUserInfo] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: '',
    birthDate: '',
    phone: '',
    address: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Carregar dados do usuário ao montar a tela
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userInfo');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUserInfo(parsedUser);
          setFormData({
            name: parsedUser.name || '',
            email: parsedUser.email || '',
            cpf: formatCPF(parsedUser.cpf || ''),
            birthDate: formatDate(parsedUser.birthDate),
            phone: formatPhone(parsedUser.phone || ''),
            address: parsedUser.address || '',
          });
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        Alert.alert('Erro', 'Não foi possível carregar os dados do perfil.');
      }
    };

    loadUserData();
  }, []);

  // Função para formatar a data (backend -> frontend)
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Função para desformatar a data (frontend -> backend)
  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  // Função para formatar o CPF
  const formatCPF = (text) => {
    let digits = text.replace(/\D/g, '').slice(0, 11); // Remove tudo que não é número
    if (digits.length > 3) digits = digits.slice(0, 3) + '.' + digits.slice(3);
    if (digits.length > 7) digits = digits.slice(0, 7) + '.' + digits.slice(7);
    if (digits.length > 11) digits = digits.slice(0, 11) + '-' + digits.slice(11, 13);
    return digits;
  };

  // Função para formatar o telefone
  const formatPhone = (phone) => {
    const digits = phone.replace(/\D/g, '');
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  };

  // Manipulação de mudanças nos campos
  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validação do formulário
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'O nome é obrigatório.';
    if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(formData.cpf))
      newErrors.cpf = 'CPF deve estar no formato 000.000.000-00.';
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(formData.birthDate))
      newErrors.birthDate = 'Data deve estar no formato DD/MM/AAAA.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Por favor, insira um e-mail válido.';
    if (!/^\(\d{2}\) \d{5}-\d{4}$/.test(formData.phone))
      newErrors.phone = 'Telefone deve estar no formato (00) 00000-0000.';
    if (!formData.address.trim()) newErrors.address = 'O endereço é obrigatório.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Envio dos dados atualizados
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userId = userInfo.id;

      const updatedData = {
        name: formData.name,
        email: formData.email,
        cpf: formData.cpf,
        birthDate: parseDate(formData.birthDate),
        phone: formData.phone,
        address: formData.address,
      };

      const response = await fetch(`http://localhost:3000/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao atualizar os dados.');
      }

      const updatedUser = await response.json();

      // Atualiza no AsyncStorage
      await AsyncStorage.setItem('userInfo', JSON.stringify(updatedUser.user));
      setUserInfo(updatedUser.user);

      Alert.alert('Sucesso!', 'Seus dados foram atualizados.');
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao atualizar:', error);
      Alert.alert('Erro', error.message || 'Não foi possível atualizar seus dados.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Meu Perfil</Text>

      {isEditing ? (
        <>
          {/* Campo Nome */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Nome Completo*</Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              value={formData.name}
              onChangeText={(text) => handleChange('name', text)}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          {/* Campo Email */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>E-mail*</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              value={formData.email}
              editable={false}
              placeholder="Email não editável"
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          {/* Campo CPF */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>CPF*</Text>
            <TextInput
              style={[styles.input, errors.cpf && styles.inputError]}
              value={formData.cpf}
              onChangeText={(text) =>
                handleChange(
                  'cpf',
                  text
                    .replace(/\D/g, '')
                    .replace(/^(\d{3})(\d)/, '$1.$2')
                    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
                    .replace(/\.(\d{3})(\d)/, '.$1-$2')
                    .substring(0, 14)
                )
              }
              maxLength={14}
              keyboardType="numeric"
            />
            {errors.cpf && <Text style={styles.errorText}>{errors.cpf}</Text>}
          </View>

          {/* Campo Data de Nascimento */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Data de Nascimento*</Text>
            <TextInput
              style={[styles.input, errors.birthDate && styles.inputError]}
              value={formData.birthDate}
              onChangeText={(text) => {
                let value = text.replace(/\D/g, '');
                if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2);
                if (value.length > 5) value = value.slice(0, 5) + '/' + value.slice(5);
                handleChange('birthDate', value.substring(0, 10));
              }}
              maxLength={10}
              keyboardType="numeric"
            />
            {errors.birthDate && <Text style={styles.errorText}>{errors.birthDate}</Text>}
          </View>

          {/* Campo Telefone */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Telefone Celular*</Text>
            <TextInput
              style={[styles.input, errors.phone && styles.inputError]}
              value={formData.phone}
              onChangeText={(text) => {
                let value = text.replace(/\D/g, '');
                if (value.length > 0) value = '(' + value;
                if (value.length > 3) value = value.slice(0, 3) + ') ' + value.slice(3);
                if (value.length > 10) value = value.slice(0, 10) + '-' + value.slice(10);
                handleChange('phone', value.substring(0, 15));
              }}
              maxLength={15}
              keyboardType="phone-pad"
            />
            {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
          </View>

          {/* Campo Endereço */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Endereço*</Text>
            <TextInput
              style={[styles.input, errors.address && styles.inputError]}
              value={formData.address}
              onChangeText={(text) => handleChange('address', text)}
            />
            {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
          </View>

          {/* Botão Salvar */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={isLoading}>
            <Text style={styles.submitButtonText}>
              {isLoading ? 'Atualizando...' : 'Salvar Alterações'}
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          {/* Exibição das informações */}
          <View style={styles.infoItem}>
            <Ionicons name="person" size={20} color="#666" />
            <Text style={styles.infoLabel}>Nome:</Text>
            <Text style={styles.infoValue}>{formData.name}</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="mail" size={20} color="#666" />
            <Text style={styles.infoLabel}>E-mail:</Text>
            <Text style={styles.infoValue}>{formData.email}</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="card" size={20} color="#666" />
            <Text style={styles.infoLabel}>CPF:</Text>
            <Text style={styles.infoValue}>{formData.cpf}</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="calendar" size={20} color="#666" />
            <Text style={styles.infoLabel}>Data de Nascimento:</Text>
            <Text style={styles.infoValue}>{formData.birthDate}</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="call" size={20} color="#666" />
            <Text style={styles.infoLabel}>Telefone:</Text>
            <Text style={styles.infoValue}>{formData.phone}</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="location" size={20} color="#666" />
            <Text style={styles.infoLabel}>Endereço:</Text>
            <Text style={styles.infoValue}>{formData.address}</Text>
          </View>

          {/* Botão Editar */}
          <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
            <Text style={styles.editButtonText}>Editar Perfil</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Botão Voltar */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#232637',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 10,
  },
  infoLabel: {
    marginLeft: 10,
    fontWeight: 'bold',
    width: 120,
  },
  infoValue: {
    flex: 1,
  },
  editButton: {
    backgroundColor: '#0066cc',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#999',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 15,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});