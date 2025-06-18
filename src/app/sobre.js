import React from 'react';
import { View, StyleSheet, Text, ScrollView, Image, Dimensions, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

import Header from '../components/Header';
import Footer from '../components/Footer';

export default function SobreNosScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Header
        style={styles.headerWrapper}
        onMenuPress={() => router.push('/menu')}
        onLoginPress={() => router.push('/login')}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Seção de introdução */}
        <View style={styles.introSection}>
          <Text style={styles.headline}>SOBRE NÓS</Text>
          <Text style={styles.subheadline}>
          Bem-vindo ao Diesel, o seu destino online para encontrar peças únicas e exclusivas que transformam qualquer espaço em um ambiente especial.

Nossa missão é conectar você a obras que contam histórias, peças que inspiram e designs que encantam.



          </Text>
        </View>

        {/* Imagem 1 */}
        <Image
  source={require('../../assets/image-29.png')}
  style={styles.bannerImage}
  resizeMode="cover"
/>

        {/* Missão */}
        <View style={styles.introSection}>
          <Text style={styles.headline}>Nossa Coleção:</Text>
          <Text style={styles.subheadline}>
          Cerâmicas: Peças artesanais funcionais e artísticas
Artes: Quadros e esculturas expressivas
Móveis: Design moderno com conforto
Acreditamos no poder transformador da arte e do design em ambientes e vidas.
          </Text>
        </View>

        {/* Imagem 2 */}
      

      

        {/* Carrossel de Cards */}
        <View style={styles.cardsSection}>
          <Text style={styles.headline}>Conheça Nossas Categorias</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carousel}>
          <TouchableOpacity style={styles.card} onPress={() => router.push('/loja')}>
  <Image
    source={require('../../assets/pintura.jpg')} // ajuste o caminho conforme a localização do seu arquivo
    style={styles.cardImage}
  />
  <Text style={styles.cardTitle}>Pintura</Text>
  <Text style={styles.cardText}>
    Obras artísticas criadas com técnicas tradicionais ou contemporâneas, utilizando tinta sobre diferentes superfícies.
  </Text>
</TouchableOpacity>


            <TouchableOpacity style={styles.card} onPress={() => router.push('/loja')}>
  <Image
    source={require('../../assets/Fotografia.png')} // ajuste o caminho conforme a localização do seu arquivo
    style={styles.cardImage}
  />
  <Text style={styles.cardTitle}>Fotografia</Text>
  <Text style={styles.cardText}>
    Imagens que capturam momentos únicos e transformam paredes em galerias de arte
  </Text>
</TouchableOpacity>


            <TouchableOpacity style={styles.card} onPress={() => router.push('/loja')}>
  <Image
    source={require('../../assets/escultura1.jpg')} // ajuste o caminho conforme sua estrutura de pastas
    style={styles.cardImage}
  />
  <Text style={styles.cardTitle}>Escultura</Text>
  <Text style={styles.cardText}>
    Peças tridimensionais que trazem vida e movimento para qualquer ambiente.
  </Text>
</TouchableOpacity>


            
          </ScrollView>
        </View>
        
        {/* Footer fora do ScrollView */}
      <Footer />
      </ScrollView>

      
    </View>
  );
}

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: '#fff',
    zIndex: 1000,
    borderBottomWidth: 1,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  scrollContent: {
    paddingTop: 60, // espaço para o header fixo
    paddingBottom: 0,
    backgroundColor: 'white',
  },
  introSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },
  headline: {
    fontSize: 26,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#232637',
    textAlign: 'center',
    marginBottom: 15,
    letterSpacing: 1,
  },
  subheadline: {
    fontSize: 16,
    color: '#555',
    textAlign: 'left', // <- removemos o justify
    lineHeight: 24,
    paddingHorizontal: 14,
    fontWeight: '400',
   
    borderRadius: 8,
    paddingVertical: 10,
    marginTop: -5,
    marginBottom: 10,
  },
  
  
  bannerImage: {
    width: screenWidth,
    height: 200,
  },
  cardsSection: {
    paddingVertical: 30,
  },
  carousel: {
    paddingLeft: 20,
  },
  card: {
    width: screenWidth * 0.6,
    marginRight: 15,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 120,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#232637',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  cardText: {
    fontSize: 13,
    color: '#555',
    paddingHorizontal: 10,
    paddingBottom: 15,
  },
});
