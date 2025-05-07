import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function LockStatusCard() {
  return (
    <View style={styles.card}>
      <Text style={styles.text}>í´’ Locked</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, borderRadius: 8, backgroundColor: '#eee', margin: 10, alignItems: 'center' },
  text: { fontSize: 20, fontWeight: 'bold' }
});
