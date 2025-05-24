import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image } from 'react-native';
import CONFIG from '../utilities/Info';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UserDataScreen() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const jwtToken = await AsyncStorage.getItem('jwtToken');
        const url = `${CONFIG.BASE_URL}/api/users/all`;
        const res = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(jwtToken ? { 'Authorization': `Bearer ${jwtToken}` } : {}),
          },
        });
        const text = await res.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          setUsers([]);
          setLoading(false);
          return;
        }
        if (Array.isArray(data.users)) setUsers(data.users);
        else if (Array.isArray(data)) setUsers(data);
        else setUsers([]);
      } catch {
        setUsers([]);
      }
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {item.photo_url ? (
        <Image
          source={{ uri: item.photo_url }}
          style={styles.avatarImage}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.name ? item.name.charAt(0).toUpperCase() : '?'}
          </Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.name}>{item.name || 'No Name'}</Text>
        <Text style={styles.email}>{item.email || 'No Email'}</Text>
        <Text style={styles.role}>{item.role ? item.role.toUpperCase() : ''}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.bg}>
      <Text style={styles.title}>User Data</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#65b5fc" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={users}
          keyExtractor={item => item.id || item._id || item.email}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
    </View>
  );
}

const AVATAR_SIZE = 54;

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: '#1b2e4e',
    paddingTop: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#e1ecfa',
    marginLeft: 28,
    marginBottom: 18,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#255083',
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 18,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.09,
    shadowRadius: 12,
    elevation: 5,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: '#68b3fa',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 18,
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 23,
  },
  avatarImage: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    marginRight: 18,
    backgroundColor: '#eee',
  },
  info: { flex: 1 },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#cce6ff',
    marginBottom: 1,
  },
  email: {
    fontSize: 14,
    color: '#a9bedf',
    marginTop: 1,
    marginBottom: 2,
  },
  role: {
    fontSize: 14,
    color: '#65b5fc',
    marginTop: 1,
    fontWeight: '500',
    letterSpacing: 1.2,
  },
});
