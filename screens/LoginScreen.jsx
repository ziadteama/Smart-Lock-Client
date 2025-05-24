import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import CONFIG from '../utilities/Info';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    setSuccess(false);
    setLoading(true);
    try {
      const response = await fetch(`${CONFIG.BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();

      if (response.ok && result.success) {
        setSuccess(true);
        setError('');
        await AsyncStorage.setItem('userId', result.user.id);
        await AsyncStorage.setItem('userName', result.user.name || '');
        await AsyncStorage.setItem('userRole', result.user.role || '');
        await AsyncStorage.setItem('jwtToken', result.token);

        setTimeout(() => {
          navigation.navigate('Main');
        }, 50);
      } else {
        setSuccess(false);
        setError(result.message || 'Invalid email or password');
      }
    } catch (err) {
      setSuccess(false);
      setError('Server error');
    }
    setLoading(false);
  };

  return (
    <View style={styles.bg}>
      <View style={styles.card}>
        {/* Tabs */}
        <View style={styles.tabRow}>
          <TouchableOpacity>
            <Text style={[styles.tabText, styles.tabActive]}>
              <Icon name="log-in-outline" size={18} color="#55aaff" /> Sign in
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.tabText}>
              <Icon name="person-add-outline" size={18} color="#bbb" /> Register
            </Text>
          </TouchableOpacity>
        </View>
        {/* Avatar */}
        <View style={styles.avatarCircle}>
          <Icon name="person-circle-outline" size={68} color="#d1d5db" />
        </View>
        {/* Inputs */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#bbb"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#bbb"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}
        {success ? <Text style={styles.success}>Login successful</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Signing in...' : 'Sign in'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: '#e6e6e6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    width: '90%',
    borderRadius: 20,
    paddingVertical: 32,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 7,
    alignItems: 'center',
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 16,
    marginTop: -10,
  },
  tabText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#bbb',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    color: '#55aaff',
    borderBottomColor: '#55aaff',
  },
  avatarCircle: {
    marginVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 14,
    fontSize: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e6e6e6',
  },
  button: {
    width: '100%',
    backgroundColor: '#35a7ff',
    borderRadius: 8,
    paddingVertical: 13,
    marginTop: 8,
    alignItems: 'center',
    shadowColor: '#35a7ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.14,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 17,
  },
  error: {
    color: 'red',
    marginTop: 8,
    marginBottom: 2,
    textAlign: 'center',
  },
  success: {
    color: 'green',
    marginTop: 8,
    marginBottom: 2,
    textAlign: 'center',
  },
});
