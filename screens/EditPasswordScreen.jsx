import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator
} from 'react-native';
import CONFIG from '../utilities/Info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function EditPinScreen() {
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setError('');

    // Validation
    if (!oldPin) {
      setError('Enter your old PIN');
      return;
    }
    if (!newPin) {
      setError('Enter new PIN');
      return;
    }
    if (newPin.length < 4) {
      setError('PIN must be at least 4 digits');
      return;
    }
    if (newPin !== confirmPin) {
      setError('New PINs do not match');
      return;
    }
    if (oldPin === newPin) {
      setError('New PIN must be different from old PIN');
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('jwtToken');
      if (!token) {
        setError('Not authenticated. Please login again.');
        setLoading(false);
        return;
      }

      const response = await fetch(`${CONFIG.BASE_URL}/api/pin/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ oldPin, newPin }),
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        setError('Invalid server response. Response: ' + text.slice(0, 100));
        setLoading(false);
        return;
      }

      if (response.ok && data.success) {
        Alert.alert('Success', 'Global PIN updated successfully!');
        setOldPin('');
        setNewPin('');
        setConfirmPin('');
        setError('');
      } else {
        setError(data.message || 'Failed to update PIN');
      }
    } catch (err) {
      setError('Server error');
    }
    setLoading(false);
  };

  return (
    <View style={styles.bg}>
      <View style={styles.card}>
        <Ionicons name="keypad-outline" size={38} color="#7cc6fe" style={{ alignSelf: 'center', marginBottom: 6 }} />
        <Text style={styles.title}>Edit Global PIN</Text>
        <TextInput
          style={styles.input}
          value={oldPin}
          onChangeText={setOldPin}
          secureTextEntry
          placeholder="Old PIN"
          placeholderTextColor="#bbb"
          keyboardType="numeric"
          maxLength={10}
        />
        <TextInput
          style={styles.input}
          value={newPin}
          onChangeText={setNewPin}
          secureTextEntry
          placeholder="New PIN"
          placeholderTextColor="#bbb"
          keyboardType="numeric"
          maxLength={10}
        />
        <TextInput
          style={styles.input}
          value={confirmPin}
          onChangeText={setConfirmPin}
          secureTextEntry
          placeholder="Confirm New PIN"
          placeholderTextColor="#bbb"
          keyboardType="numeric"
          maxLength={10}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TouchableOpacity
          style={[styles.button, loading ? styles.buttonDisabled : null]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#123866" />
          ) : (
            <Text style={styles.buttonText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: '#1b2e4e',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#255083',
    width: '96%',
    borderRadius: 22,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.10,
    shadowRadius: 18,
    elevation: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#e1ecfa',
    marginBottom: 18,
    letterSpacing: 0.8,
  },
  input: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#d7e3f3',
  },
  button: {
    width: '100%',
    backgroundColor: '#7cc6fe',
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#7cc6fe',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonDisabled: {
    backgroundColor: '#b8d8f6',
  },
  buttonText: {
    color: '#123866',
    fontWeight: '700',
    fontSize: 17,
    letterSpacing: 0.2,
  },
  error: {
    color: 'orange',
    marginBottom: 6,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
