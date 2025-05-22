// screens/LoginScreen.jsx
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setemail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false); 

  const handleLogin = async () => {
    try {
   const response = await fetch('http://172.16.0.252:3000/api/auth/login', {

        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // ✅ show success message
        setSuccess(true);
        setError('');
        // optionally: navigate to Home after a short delay
        setTimeout(() => {
          navigation.navigate('Home');
        }, 1000);
      } else {
        setSuccess(false);
        setError('Invalid email or password');
      }
    } catch (err) {
      console.error(err);
      setSuccess(false);
      setError('Server error');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      {/* ✅ email Label */}
      <Text style={styles.label}>email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        onChangeText={setemail}
        value={email}
        autoCapitalize="none"
      />

      {/* ✅ Password Label */}
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />

      {/* ✅ Show error if any */}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* ✅ Show success if login worked */}
      {success ? <Text style={styles.success}>Login successful</Text> : null}

      <Button title="Log In" onPress={handleLogin} />
      <View style={{ height: 20 }} />
      <Button title="Signup" onPress={() => navigation.navigate('Signup')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
  },
  error: { color: 'red', marginBottom: 12, textAlign: 'center' },
  success: { color: 'green', marginBottom: 12, textAlign: 'center' },
});
