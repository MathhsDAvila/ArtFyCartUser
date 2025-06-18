import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Animated,
  Dimensions,
  Easing,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Header() {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const [loginVisible, setLoginVisible] = useState(false);
  const [registerVisible, setRegisterVisible] = useState(false);
  const [editProfileVisible, setEditProfileVisible] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const slideAnim = useRef(new Animated.Value(Dimensions.get('window').width)).current;

  // Estados do login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Estados do cadastro
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');

  // Estados da edição de perfil
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    cpf: '',
    birthDate: '',
    phone: '',
    address: ''
  });
  const [editErrors, setEditErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Remove tudo que não for número
  const onlyNumbers = (text) => text.replace(/\D/g, '');

  // Formatação CPF: 000.000.000-00
  const formatCPF = (text) => {
    let digits = text.replace(/\D/g, '').slice(0, 11); // Remove tudo que não é número
    if (digits.length > 3) digits = digits.slice(0, 3) + '.' + digits.slice(3);
    if (digits.length > 7) digits = digits.slice(0, 7) + '.' + digits.slice(7);
    if (digits.length > 11) digits = digits.slice(0, 11) + '-' + digits.slice(11, 13);
    return digits;
  };

  // Formatação Data: dd/mm/aaaa
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Desformatar data para envio ao backend
  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  // Formatação Telefone: (00) 00000-0000
  const formatTelefone = (text) => {
    let digits = onlyNumbers(text).slice(0, 11);
    if (digits.length <= 2) return '(' + digits;
    if (digits.length <= 7) return '(' + digits.slice(0, 2) + ') ' + digits.slice(2);
    return '(' + digits.slice(0, 2) + ') ' + digits.slice(2, 7) + '-' + digits.slice(7);
  };

  // Validação do formulário de edição
const validateForm = () => {
  const newErrors = {};

  if (!editFormData.name.trim()) newErrors.name = 'O nome é obrigatório.';
  if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(editFormData.cpf)) {
    newErrors.cpf = 'CPF deve estar no formato 000.000.000-00.';
  }
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(editFormData.birthDate)) {
    newErrors.birthDate = 'Data deve estar no formato DD/MM/AAAA.';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editFormData.email)) {
    newErrors.email = 'Por favor, insira um e-mail válido.';
  }
  if (!/^\(\d{2}\) \d{5}-\d{4}$/.test(editFormData.phone)) {
    newErrors.phone = 'Telefone deve estar no formato (00) 00000-0000.';
  }
  if (!editFormData.address.trim()) newErrors.address = 'O endereço é obrigatório.';

  setEditErrors(newErrors);

  return Object.keys(newErrors).length === 0;
};
  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsLoading(true);
  
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userId = userInfo.id;
  
      const updatedData = {
        name: formData.name,
        email: formData.email,
        cpf: formatCPF(formData.cpf), // Garantimos o formato correto
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
  // Carrega dados do usuário
  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userData = await AsyncStorage.getItem('userInfo');
      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        setIsLoggedIn(true);
        setUserInfo(parsedUser);
        setEditFormData({
          name: parsedUser.name || '',
          email: parsedUser.email || '',
          cpf: formatCPF(parsedUser.cpf || ''),
          birthDate: formatDate(parsedUser.birthDate),
          phone: formatTelefone(parsedUser.phone || ''),
          address: parsedUser.address || ''
        });
      }
    } catch (error) {
      console.error('Erro ao verificar status de login:', error);
    }
  };

  // Função para editar perfil
const handleEditProfile = async () => {
  if (!validateForm()) return;
  setIsLoading(true);
  try {
    const token = await AsyncStorage.getItem('userToken');
    const updatedData = {
      name: editFormData.name,
      email: editFormData.email,
      cpf: formatCPF(editFormData.cpf), // Garante que vai com máscara
      birthDate: parseDate(editFormData.birthDate),
      phone: editFormData.phone.replace(/\D/g, ''),
      address: editFormData.address
    };

    const response = await fetch(`http://localhost:3000/user/${userInfo.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao atualizar os dados.');
    }

    const updatedUser = data.user;
    await AsyncStorage.setItem('userInfo', JSON.stringify(updatedUser));
    setUserInfo(updatedUser);

    Alert.alert('Sucesso!', 'Seus dados foram atualizados.');
    setEditProfileVisible(false);

  } catch (error) {
    console.error('Erro ao atualizar:', error);
    Alert.alert('Erro', error.message);
  } finally {
    setIsLoading(false);
  }
};
  // Manipulação de mudanças nos campos
  const handleChange = (name, value) => {
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Abre modal de edição
  const openEditProfileModal = () => {
    if (!isLoggedIn) return;
    setEditProfileVisible(true);
  };

  // Fecha modal de edição
  const closeEditProfileModal = () => {
    setEditProfileVisible(false);
    setIsEditing(false);
  };

  // Função para fazer login
// Header.js - handleLogin()
// Header.js - handleLogin()
const handleLogin = async () => {
  try {
    const response = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: loginEmail, pass: loginPassword }),
    });

    const data = await response.json();

    console.log("Resposta do login:", data); // ✅ Veja o que vem aqui

    if (!response.ok) {
      Alert.alert('Erro', data.message || 'Erro ao fazer login');
      return;
    }

    const accessToken = data.accessToken || data.token;

    if (!accessToken) {
      Alert.alert('Erro', 'Token não encontrado na resposta.');
      return;
    }

    await AsyncStorage.setItem('userToken', accessToken);
    await AsyncStorage.setItem('userInfo', JSON.stringify(data.user));

    setIsLoggedIn(true);
    setUserInfo(data.user);
    setLoginVisible(false);
    Alert.alert('Sucesso', 'Login realizado com sucesso!');

  } catch (error) {
    console.error("Erro no login:", error);
    Alert.alert('Erro', 'Ocorreu um erro ao fazer login');
  }
};

  // Logout
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userInfo');
      setIsLoggedIn(false);
      setUserInfo(null);
      setMenuVisible(false);
      Alert.alert('Sucesso', 'Logout realizado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao fazer logout');
    }
  };

  // Cadastro de usuário
const handleRegister = async () => {
  if (registerPassword !== registerConfirmPassword) {
    Alert.alert('Erro', 'As senhas não coincidem');
    return;
  }

  const cpfNumeros = cpf.replace(/\D/g, '');
  const telefoneNumeros = telefone.replace(/\D/g, '');

  if (!registerName.trim()) {
    Alert.alert('Erro', 'Por favor, preencha o nome.');
    return;
  }

  if (cpfNumeros.length !== 11) {
    Alert.alert('Erro', 'CPF deve ter 11 dígitos.');
    return;
  }

  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dataNascimento)) {
    Alert.alert('Erro', 'Data inválida. Use o formato DD/MM/AAAA.');
    return;
  }

  if (telefoneNumeros.length < 10) {
    Alert.alert('Erro', 'Telefone inválido.');
    return;
  }

  if (!registerEmail.trim() || !/\S+@\S+\.\S+/.test(registerEmail)) {
    Alert.alert('Erro', 'Por favor, insira um e-mail válido.');
    return;
  }

  if (registerPassword.length < 8) {
    Alert.alert('Erro', 'Senha deve ter pelo menos 8 caracteres.');
    return;
  }

  // Formatando CPF com máscara
  const [day, month, year] = dataNascimento.split('/');
  const formattedBirthDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  const formattedCpf = formatCPF(cpf); // Garantir que tenha a máscara

  try {
    const response = await fetch('http://localhost:3000/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: registerName.trim(),
        email: registerEmail.trim(),
        pass: registerPassword,
        cpf: formattedCpf, // Enviar com máscara
        birthDate: formattedBirthDate,
        phone: telefoneNumeros,
        address: 'Endereço padrão' // Preencher endereço
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      Alert.alert('Erro', data.message || 'Erro ao cadastrar usuário');
      return;
    }

    Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!');
    setRegisterVisible(false);
    setRegisterName('');
    setCpf('');
    setDataNascimento('');
    setTelefone('');
    setRegisterEmail('');
    setRegisterPassword('');
    setRegisterConfirmPassword('');

  } catch (error) {
    console.error('Erro ao cadastrar:', error);
    Alert.alert('Erro', 'Ocorreu um erro ao cadastrar o usuário');
  }
};

  // Animação do menu lateral
  const toggleMenu = () => {
    const toValue = menuVisible ? Dimensions.get('window').width : 0;
    Animated.timing(slideAnim, {
      toValue,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(() => setMenuVisible(!menuVisible));
  };

  const handleNavigate = (screen) => {
    toggleMenu();
    router.push(`/${screen}`);
  };

  const menuItems = [
    { id: 1, name: 'Loja', icon: 'cart', screen: 'loja' },
    { id: 2, name: 'Sobre', icon: 'information-circle', screen: 'sobre' },
    { id: 3, name: 'Contato', icon: 'mail', screen: 'contato' },
  ];

  useEffect(() => {
    checkLoginStatus();
  }, []);

  return (
    <>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/')} style={styles.titleWrapper}>
          <Text style={styles.headerTitle}>ARTFY</Text>
        </TouchableOpacity>
        <View style={styles.iconGroup}>
          <TouchableOpacity
            onPress={() => isLoggedIn ? toggleMenu() : setLoginVisible(true)}
            style={styles.iconButton}
          >
            <Ionicons
              name={isLoggedIn ? "person-circle" : "person-circle-outline"}
              size={35}
              color="#232637"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleMenu} style={styles.iconButton}>
            <Ionicons name="menu" size={33} color="#232637" />
          </TouchableOpacity>
        </View>
      </View>

      {/* MENU LATERAL */}
      {menuVisible && (
        <Animated.View style={[styles.menuContainer, { transform: [{ translateX: slideAnim }] }]}>
          <View style={styles.slideMenuWrapper}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>MENU</Text>
              <TouchableOpacity onPress={toggleMenu}>
                <Ionicons name="close" size={30} color="black" />
              </TouchableOpacity>
            </View>
            {isLoggedIn && userInfo && (
              <View style={styles.userInfoContainer}>
                <Ionicons name="person-circle" size={50} color="#232637" />
                <Text style={styles.userName}>{userInfo.name}</Text>
                <Text style={styles.userEmail}>{userInfo.email}</Text>
              </View>
            )}
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={() => handleNavigate(item.screen)}
              >
                <Ionicons name={item.icon} size={24} color="black" />
                <Text style={styles.menuText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
            
            <View style={styles.menuDivider} />
            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigate('meus-pedidos')}>
              <Ionicons name="document-text" size={24} color="black" />
              <Text style={styles.menuText}>Meus Pedidos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigate('carrinho')}>
              <Ionicons name="cart" size={24} color="black" />
              <Text style={styles.menuText}>Carrinho</Text>
            </TouchableOpacity>
            {isLoggedIn ? (
              <TouchableOpacity style={[styles.menuItem, { marginTop: 30 }]} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={24} color="black" />
                <Text style={styles.menuText}>Sair</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.menuItem, { marginTop: 30 }]}
                onPress={() => {
                  toggleMenu();
                  setLoginVisible(true);
                }}
              >
                <Ionicons name="log-in-outline" size={24} color="black" />
                <Text style={styles.menuText}>Entrar</Text>
              </TouchableOpacity>
            )}
            {isLoggedIn && (
              <TouchableOpacity
                style={[styles.menuItem, { marginTop: 10 }]}
                onPress={() => {
                  toggleMenu();
                  openEditProfileModal();
                }}
              >
                <Ionicons name="create" size={24} color="black" />
                <Text style={styles.menuText}>Editar Perfil</Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      )}

      {/* MODAL LOGIN */}
      <Modal visible={loginVisible} animationType="fade" transparent onRequestClose={() => setLoginVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Login</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              value={loginEmail}
              onChangeText={setLoginEmail}
            />
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Senha"
                secureTextEntry={!showLoginPassword}
                value={loginPassword}
                onChangeText={setLoginPassword}
              />
              <TouchableOpacity onPress={() => setShowLoginPassword(!showLoginPassword)}>
                <Ionicons name={showLoginPassword ? 'eye-off' : 'eye'} size={24} color="gray" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Entrar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              setLoginVisible(false);
              setRegisterVisible(true);
            }}>
              <Text style={styles.cancelText}>Cadastrar-se</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setLoginVisible(false)}>
              <Text style={[styles.cancelText, { marginTop: 5 }]}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL CADASTRO */}
      <Modal visible={registerVisible} animationType="slide" transparent onRequestClose={() => setRegisterVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>Cadastro</Text>
              <TextInput
                style={styles.input}
                placeholder="Nome completo"
                value={registerName}
                onChangeText={setRegisterName}
              />
              <TextInput
                style={styles.input}
                placeholder="CPF"
                keyboardType="numeric"
                value={cpf}
                onChangeText={(text) => setCpf(formatCPF(text))}
                maxLength={14}
              />
              <TextInput
                style={styles.input}
                placeholder="Data de nascimento"
                keyboardType="numeric"
                value={dataNascimento}
                onChangeText={(text) => {
                  let value = text.replace(/\D/g, '');
                  if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2);
                  if (value.length > 5) value = value.slice(0, 5) + '/' + value.slice(5);
                  setDataNascimento(value.substring(0, 10));
                }}
                maxLength={10}
              />
              <TextInput
                style={styles.input}
                placeholder="Telefone"
                keyboardType="phone-pad"
                value={telefone}
                onChangeText={(text) => setTelefone(formatTelefone(text))}
                maxLength={15}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                value={registerEmail}
                onChangeText={setRegisterEmail}
              />
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Senha"
                  secureTextEntry={!showRegisterPassword}
                  value={registerPassword}
                  onChangeText={setRegisterPassword}
                />
                <TouchableOpacity onPress={() => setShowRegisterPassword(!showRegisterPassword)}>
                  <Ionicons name={showRegisterPassword ? 'eye-off' : 'eye'} size={24} color="gray" />
                </TouchableOpacity>
              </View>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Confirmar senha"
                  secureTextEntry={!showConfirmPassword}
                  value={registerConfirmPassword}
                  onChangeText={setRegisterConfirmPassword}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Ionicons name={showConfirmPassword ? 'eye-off' : 'eye'} size={24} color="gray" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.loginButton} onPress={handleRegister}>
                <Text style={styles.loginButtonText}>Cadastrar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setRegisterVisible(false)}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* MODAL EDIÇÃO DE PERFIL */}
      <Modal visible={editProfileVisible} animationType="slide" transparent onRequestClose={closeEditProfileModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>Editar Perfil</Text>
              {!isEditing ? (
                <>
                  <View style={styles.infoItem}>
                    <Ionicons name="person" size={20} color="#666" />
                    <Text style={styles.infoLabel}>Nome:</Text>
                    <Text style={styles.infoValue}>{editFormData.name}</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Ionicons name="mail" size={20} color="#666" />
                    <Text style={styles.infoLabel}>E-mail:</Text>
                    <Text style={styles.infoValue}>{editFormData.email}</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Ionicons name="card" size={20} color="#666" />
                    <Text style={styles.infoLabel}>CPF:</Text>
                    <Text style={styles.infoValue}>{editFormData.cpf}</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Ionicons name="calendar" size={20} color="#666" />
                    <Text style={styles.infoLabel}>Data de Nascimento:</Text>
                    <Text style={styles.infoValue}>{editFormData.birthDate}</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Ionicons name="call" size={20} color="#666" />
                    <Text style={styles.infoLabel}>Telefone:</Text>
                    <Text style={styles.infoValue}>{editFormData.phone}</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Ionicons name="location" size={20} color="#666" />
                    <Text style={styles.infoLabel}>Endereço:</Text>
                    <Text style={styles.infoValue}>{editFormData.address}</Text>
                  </View>
                  <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
                    <Text style={styles.editButtonText}>Editar Perfil</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={closeEditProfileModal}>
                    <Text style={styles.cancelText}>Fechar</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  {/* Campo Nome */}
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Nome Completo*</Text>
                    <TextInput
                      style={[styles.input, editErrors.name && styles.inputError]}
                      value={editFormData.name}
                      onChangeText={(text) => handleChange('name', text)}
                    />
                    {editErrors.name && <Text style={styles.errorText}>{editErrors.name}</Text>}
                  </View>
                  {/* Campo Email */}
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>E-mail*</Text>
                    <TextInput
                      style={[styles.input, editErrors.email && styles.inputError]}
                      value={editFormData.email}
                      editable={false}
                      placeholder="Email não editável"
                    />
                    {editErrors.email && <Text style={styles.errorText}>{editErrors.email}</Text>}
                  </View>
                  {/* Campo CPF */}
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>CPF*</Text>
                   <TextInput
                    style={[styles.input, editErrors.cpf && styles.inputError]}
  value={editFormData.cpf}
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
/>
                    {editErrors.cpf && <Text style={styles.errorText}>{editErrors.cpf}</Text>}
                  </View>
                  {/* Campo Data de Nascimento */}
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Data de Nascimento*</Text>
                    <TextInput
                      style={[styles.input, editErrors.birthDate && styles.inputError]}
                      value={editFormData.birthDate}
                      onChangeText={(text) => {
                        let value = text.replace(/\D/g, '');
                        if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2);
                        if (value.length > 5) value = value.slice(0, 5) + '/' + value.slice(5);
                        handleChange('birthDate', value.substring(0, 10));
                      }}
                      maxLength={10}
                      keyboardType="numeric"
                    />
                    {editErrors.birthDate && <Text style={styles.errorText}>{editErrors.birthDate}</Text>}
                  </View>
                  {/* Campo Telefone */}
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Telefone Celular*</Text>
                    <TextInput
                      style={[styles.input, editErrors.phone && styles.inputError]}
                      value={editFormData.phone}
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
                    {editErrors.phone && <Text style={styles.errorText}>{editErrors.phone}</Text>}
                  </View>
                  {/* Campo Endereço */}
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Endereço*</Text>
                    <TextInput
                      style={[styles.input, editErrors.address && styles.inputError]}
                      value={editFormData.address}
                      onChangeText={(text) => handleChange('address', text)}
                    />
                    {editErrors.address && <Text style={styles.errorText}>{editErrors.address}</Text>}
                  </View>
                  {/* Botão Salvar */}
                  <TouchableOpacity style={styles.submitButton} onPress={handleEditProfile} disabled={isLoading}>
                    <Text style={styles.submitButtonText}>
                      {isLoading ? 'Atualizando...' : 'Salvar Alterações'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={closeEditProfileModal}>
                    <Text style={styles.cancelText}>Cancelar</Text>
                  </TouchableOpacity>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 70,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    elevation: 4,
  },
  titleWrapper: {
    flex: 1,
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#232637',
  },
  iconGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 380,
    maxHeight: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#232637',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 15,
    borderRadius: 5,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    height: 45,
  },
  passwordInput: {
    flex: 1,
  },
  forgotPassword: {
    color: '#0066cc',
    fontSize: 14,
    textAlign: 'right',
    marginBottom: 10,
  },
  loginButton: {
    backgroundColor: '#232637',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelText: {
    color: '#555',
    textAlign: 'center',
    marginTop: 10,
  },
  menuContainer: {
    position: 'absolute',
    top: 70,
    right: 0,
    width: '80%',
    height: '100%',
    backgroundColor: 'white',
    zIndex: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  slideMenuWrapper: {
    flex: 1,
    padding: 20,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  menuText: {
    marginLeft: 15,
    fontSize: 18,
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 20,
  },
  userInfoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
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
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: '#333',
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
});