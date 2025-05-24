import React, { useState } from 'react';
import CONFIG from '../utilities/Info';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function SignUpPageScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!name || !email || !password || !confirm) return "Please fill all fields.";
    // simple email regex for quick check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Invalid email address.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    if (password !== confirm) return "Passwords do not match.";
    return "";
  };

  const handleSignUpPage = async () => {
    setError('');
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${CONFIG.BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        Alert.alert('Signup successful');
        navigation.navigate('WaitingApproval');
        setName(''); setEmail(''); setPassword(''); setConfirm('');
      } else {
        setError(result.message || 'Signup failed');
      }
    } catch (err) {
      console.error(err);
      setError('Server error');
    }
    setLoading(false);
  };

  return (
    <View style={styles.bg}>
      <View style={styles.card}>
        {/* Tabs */}
        <View style={styles.tabRow}>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.tabText}>
              <Icon name="log-in-outline" size={18} color="#bbb" /> Sign in
            </Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={[styles.tabText, styles.tabActive]}>
              <Icon name="person-add-outline" size={18} color="#55aaff" /> Register
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
          placeholder="Name"
          placeholderTextColor="#bbb"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#bbb"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#bbb"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm password"
          placeholderTextColor="#bbb"
          secureTextEntry
          value={confirm}
          onChangeText={setConfirm}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {/* Button */}
        <TouchableOpacity style={styles.button} onPress={handleSignUpPage} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? "Registering..." : "Register"}</Text>
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
});
