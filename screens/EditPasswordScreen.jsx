import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import CONFIG from '../utilities/Info';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EditPasswordScreen() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldError, setFieldError] = useState({
    old: '', new: '', confirm: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setFieldError({ old: '', new: '', confirm: '' });
    setError('');

    // Field validations
    let valid = true;
    if (!oldPassword) {
      setFieldError(prev => ({ ...prev, old: 'Enter old password' }));
      valid = false;
    }
    if (!newPassword) {
      setFieldError(prev => ({ ...prev, new: 'Enter new password' }));
      valid = false;
    }
    if (newPassword !== confirmPassword) {
      setFieldError(prev => ({ ...prev, confirm: 'Passwords do not match' }));
      valid = false;
    }
    if (!valid) return;

    // Get userId for authenticated change
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) {
      setError('User not authenticated. Please log in again.');
      return;
    }

    setLoading(true);
    try {
      // First, verify the old password
      const verifyRes = await fetch(`${CONFIG.BASE_URL}/api/auth/verify-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, password: oldPassword }),
      });
      const verifyResult = await verifyRes.json();
      if (!verifyRes.ok || !verifyResult.success) {
        setFieldError(prev => ({ ...prev, old: 'Old password is incorrect' }));
        setLoading(false);
        return;
      }

      // Now, update the password
      const updateRes = await fetch(`${CONFIG.BASE_URL}/api/auth/update-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, newPassword }),
      });
      const updateResult = await updateRes.json();
      if (updateRes.ok && updateResult.success) {
        Alert.alert('Success', 'Password updated successfully!');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError(updateResult.message || 'Failed to update password');
      }
    } catch (err) {
      setError('Server error');
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Door Password</Text>
      <Text style={styles.label}>Old Password</Text>
      <TextInput
        style={styles.input}
        value={oldPassword}
        onChangeText={setOldPassword}
        secureTextEntry
        placeholder="Enter old password"
        keyboardType="numeric"
      />
      {fieldError.old ? <Text style={styles.error}>{fieldError.old}</Text> : null}

      <Text style={styles.label}>New Password</Text>
      <TextInput
        style={styles.input}
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
        placeholder="Enter new password"
        keyboardType="numeric"
      />
      {fieldError.new ? <Text style={styles.error}>{fieldError.new}</Text> : null}

      <Text style={styles.label}>Confirm New Password</Text>
      <TextInput
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        placeholder="Re-enter new password"
        keyboardType="numeric"
      />
      {fieldError.confirm ? <Text style={styles.error}>{fieldError.confirm}</Text> : null}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button title={loading ? 'Saving...' : 'Save'} onPress={handleSave} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 6,
    padding: 12,
    marginBottom: 10,
  },
  error: { color: 'red', marginBottom: 8, textAlign: 'center' },
});
