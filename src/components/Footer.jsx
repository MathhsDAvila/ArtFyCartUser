// Footer.jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Footer() {
  return (
    <View style={styles.footer}>
      <Text style={styles.text}>© 2025 Artify. Todos os direitos reservados.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    height: 60,
    backgroundColor: '#232637', // azul mais forte (Tailwind blue-800)
    borderTopWidth: 1,
    borderColor: '#232637', // azul escuro para a borda
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 1,
  },
  text: {
    color: 'white',
    fontSize: 14,
  },
});
