import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, ActivityIndicator, Image, Alert
} from 'react-native';
import CONFIG from '../utilities/Info';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RequestAccountScreen() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState('');

  useEffect(() => { fetchPendingUsers(); }, []);

  const fetchPendingUsers = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      if (!token) {
        Alert.alert('Session error', 'You must log in again.');
        setLoading(false);
        return;
      }
      console.log('[fetchPendingUsers] Using token:', token);

      const res = await fetch(`${CONFIG.BASE_URL}/api/users/pending`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const text = await res.text();
      console.log('[fetchPendingUsers] Raw response:', text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('[fetchPendingUsers] JSON parse error:', e, text);
        setPendingUsers([]);
        Alert.alert('Error', 'Failed to parse server response');
        setLoading(false);
        return;
      }

      if (res.ok && data.success) {
        setPendingUsers(Array.isArray(data.users) ? data.users : []);
      } else {
        setPendingUsers([]);
        Alert.alert('Error', data.message || 'Could not fetch pending users');
      }
    } catch (err) {
      setPendingUsers([]);
      console.error('[fetchPendingUsers] Fetch error:', err);
      Alert.alert('Error', 'Could not fetch pending users');
    }
    setLoading(false);
  };

  const acceptUser = async (userId) => {
    setProcessing(userId);
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      if (!token) {
        Alert.alert('Session error', 'You must log in again.');
        setProcessing('');
        return;
      }
      console.log('[acceptUser] Using token:', token, 'userId:', userId);

      const res = await fetch(`${CONFIG.BASE_URL}/api/admin/users/${userId}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
      });
      const text = await res.text();
      console.log('[acceptUser] Raw response:', text);

      let result;
      try {
        result = JSON.parse(text);
      } catch (e) {
        console.error('[acceptUser] JSON parse error:', e, text);
        Alert.alert('Error', 'Failed to parse server response');
        setProcessing('');
        return;
      }

      if (res.ok && result.success) {
        Alert.alert('Success', 'User approved');
        setPendingUsers(pendingUsers.filter(user => user.id !== userId));
      } else {
        Alert.alert('Error', result.message || 'Could not accept user');
      }
    } catch (err) {
      console.error('[acceptUser] Fetch error:', err);
      Alert.alert('Error', 'Could not accept user');
    }
    setProcessing('');
  };

  const rejectUser = async (userId) => {
    setProcessing(userId);
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      if (!token) {
        Alert.alert('Session error', 'You must log in again.');
        setProcessing('');
        return;
      }
      console.log('[rejectUser] Using token:', token, 'userId:', userId);

      const res = await fetch(`${CONFIG.BASE_URL}/api/admin/users/${userId}/reject`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const text = await res.text();
      console.log('[rejectUser] Raw response:', text);

      let result;
      try {
        result = JSON.parse(text);
      } catch (e) {
        console.error('[rejectUser] JSON parse error:', e, text);
        Alert.alert('Error', 'Failed to parse server response');
        setProcessing('');
        return;
      }

      if (res.ok && result.success) {
        Alert.alert('Rejected', 'User has been rejected and removed.');
        setPendingUsers(pendingUsers.filter(user => user.id !== userId));
      } else {
        Alert.alert('Error', result.message || 'Could not reject user');
      }
    } catch (err) {
      console.error('[rejectUser] Fetch error:', err);
      Alert.alert('Error', 'Could not reject user');
    }
    setProcessing('');
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        {item.photo_url && (
          <Image source={{ uri: item.photo_url }} style={styles.avatar} />
        )}
        <View style={{ flex: 1, marginLeft: item.photo_url ? 12 : 0 }}>
          <Text style={styles.name}>{item.name || 'No Name'}</Text>
          <Text style={styles.email}>{item.email}</Text>
        </View>
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.acceptBtn, processing === item.id && styles.disabledBtn]}
          onPress={() => acceptUser(item.id)}
          disabled={processing === item.id}
        >
          <Text style={styles.actionText}>{processing === item.id ? '...' : 'Accept'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, styles.rejectBtn, processing === item.id && styles.disabledBtn]}
          onPress={() => rejectUser(item.id)}
          disabled={processing === item.id}
        >
          <Text style={styles.actionText}>{processing === item.id ? '...' : 'Reject'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.bg}>
      <Text style={styles.title}>Pending Accounts</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#65b5fc" style={{ marginTop: 40 }} />
      ) : pendingUsers.length === 0 ? (
        <Text style={{ marginTop: 40, color: '#bbb', textAlign: 'center' }}>No pending accounts.</Text>
      ) : (
        <FlatList
          data={pendingUsers}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: '#1b2e4e',
    paddingTop: 32,
    paddingHorizontal: 0,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#e1ecfa',
    marginLeft: 28,
    marginBottom: 18,
  },
  card: {
    backgroundColor: '#255083',
    borderRadius: 18,
    padding: 18,
    marginHorizontal: 16,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.09,
    shadowRadius: 12,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatar: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#dbefff',
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: '#cce6ff',
    marginBottom: 2,
  },
  email: {
    fontSize: 14,
    color: '#a9bedf',
  },
  buttonRow: {
    flexDirection: 'row',
    marginLeft: 16,
  },
  actionBtn: {
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginLeft: 7,
    minWidth: 74,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptBtn: {
    backgroundColor: '#65b5fc',
  },
  rejectBtn: {
    backgroundColor: '#f76b6b',
  },
  actionText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.1,
  },
  disabledBtn: {
    opacity: 0.6,
  }
});
