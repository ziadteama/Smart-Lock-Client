// screens/HomeScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function HomeScreen() {
  const handleLock = () => console.log('Locking...');
  const handleUnlock = () => console.log('Unlocking...');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Smart Lock Control</Text>
      <Button title="Lock" onPress={handleLock} />
      <View style={{ height: 20 }} />
      <Button title="Unlock" onPress={handleUnlock} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 40, textAlign: 'center' },
});
