import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons'
import CONFIG from '../utilities/Info'; 

export default function HomeScreen() {
  // Send lock request to backend API
  const handleLock = async () => {
    try {
      const response = await fetch(`${CONFIG.BASE_URL}/api/esp/lock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        Alert.alert('Success', 'The door has been locked.');
      } else {
        const data = await response.json().catch(() => ({}));
        Alert.alert('Error', data.message || 'Failed to lock the door.');
      }
    } catch (err) {
      Alert.alert('Error', 'Could not connect to server.');
    }
  };

  // Send unlock request to backend API
  const handleUnlock = async () => {
    try {
      const response = await fetch(`${CONFIG.BASE_URL}/api/esp/unlock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        Alert.alert('Success', 'The door has been unlocked.');
      } else {
        const data = await response.json().catch(() => ({}));
        Alert.alert('Error', data.message || 'Failed to unlock the door.');
      }
    } catch (err) {
      Alert.alert('Error', 'Could not connect to server.');
    }
  };

  return (
    <View style={styles.bg}>
      <TouchableOpacity style={styles.button} onPress={handleLock}>
        <Text style={styles.buttonText}>Lock</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#33a863' }]}
        onPress={handleUnlock}
      >
        <Text style={styles.buttonText}>Unlock</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#dde6f6',
  },
  button: {
    backgroundColor: '#18345b',
    borderRadius: 18,
    paddingVertical: 20,
    paddingHorizontal: 40,
    marginVertical: 12,
    width: 220,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.13,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
