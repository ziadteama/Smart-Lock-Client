import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Button, ActivityIndicator, Alert } from 'react-native';
import CONFIG from '../utilities/Info';

export default function RequestAccountScreen() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState('');

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${CONFIG.BASE_URL}/api/users/pending`);
      const data = await res.json();
      setPendingUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setPendingUsers([]);
      Alert.alert('Error', 'Could not fetch pending users');
    }
    setLoading(false);
  };

  const acceptUser = async (userId) => {
    setAccepting(userId);
    try {
      const res = await fetch(`${CONFIG.BASE_URL}/api/users/${userId}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await res.json();
      if (res.ok && result.success) {
        Alert.alert('Success', 'User approved');
        setPendingUsers(pendingUsers.filter(user => user.id !== userId));
      } else {
        Alert.alert('Error', result.message || 'Could not accept user');
      }
    } catch (err) {
      Alert.alert('Error', 'Could not accept user');
    }
    setAccepting('');
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name || 'No Name'}</Text>
      <Button
        title={accepting === item.id ? 'Accepting...' : 'Accept'}
        onPress={() => acceptUser(item.id)}
        disabled={accepting === item.id}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pending Accounts</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#ff9900" style={{ marginTop: 40 }} />
      ) : pendingUsers.length === 0 ? (
        <Text style={{ marginTop: 40, color: '#999' }}>No pending accounts.</Text>
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
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 30 },
  title: { fontSize: 24, fontWeight: 'bold', marginLeft: 24, marginBottom: 16 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginVertical: 8,
    borderRadius: 18,
    padding: 16,
    elevation: 3,
    shadowColor: '#aaa',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
});
