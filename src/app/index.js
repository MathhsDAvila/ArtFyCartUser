import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
} from 'react-native';
import { useRouter } from 'expo-router';

import Header from '../components/Header';
import Footer from '../components/Footer';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.backgroundColumns}>
        <View style={[styles.column, styles.columnLeft]} />
        <View style={[styles.column, styles.columnRight]} />
      </View>

      <Header />

      <View style={styles.content}>
        <Image
          source={require('../../assets/image-29.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
        <TouchableOpacity
          style={styles.exploreButton}
          onPress={() => router.push('/loja')}
        >
          <Text style={styles.exploreButtonText}>EXPLORAR</Text>
        </TouchableOpacity>
      </View>

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, position: 'relative', backgroundColor: '#fff' },
  backgroundColumns: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
  },
  column: { flex: 1 },
  columnLeft: { backgroundColor: '#dbdce0' },
  columnRight: { backgroundColor: '#232637' },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoImage: {
    width: 200,
    height: 200,
    marginBottom: 40,
  },
  exploreButton: {
    backgroundColor: 'white',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#232637',
  },
  exploreButtonText: {
    color: '#232637',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
