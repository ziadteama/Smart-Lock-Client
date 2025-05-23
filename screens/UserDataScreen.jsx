import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image } from 'react-native';
import CONFIG from '../utilities/Info';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UserDataScreen() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [debug, setDebug] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const jwtToken = await AsyncStorage.getItem('jwtToken');
        const url = `${CONFIG.BASE_URL}/api/users/all`;

        console.log('[UserDataScreen] Fetching:', url);
        console.log('[UserDataScreen] JWT:', jwtToken);

        const res = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Attach JWT for protected route!
            ...(jwtToken ? { 'Authorization': `Bearer ${jwtToken}` } : {}),
          },
        });

        const status = res.status;
        const text = await res.text();

        console.log('[UserDataScreen] Status:', status);
        console.log('[UserDataScreen] Raw:', text);

        let data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          setDebug('JSON Parse error: ' + e.message + '\n' + text);
          setUsers([]);
          setLoading(false);
          return;
        }

        setDebug('Parsed: ' + JSON.stringify(data));

        // If your backend returns { users: [...] }
        if (Array.isArray(data.users)) {
          setUsers(data.users);
        } 
        // If your backend returns just an array
        else if (Array.isArray(data)) {
          setUsers(data);
        } else {
          setUsers([]);
          setDebug('Response format not recognized.');
        }
      } catch (err) {
        setDebug('Error: ' + err.message);
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
    <View style={styles.container}>
      <Text style={styles.title}>User Data</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#ff9900" style={{ marginTop: 40 }} />
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

const CARD_HEIGHT = 80;
const AVATAR_SIZE = 56;

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
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: '#ffb47b',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 18,
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 22,
  },
  avatarImage: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    marginRight: 18,
    backgroundColor: '#eee',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 19,
    fontWeight: '600',
    color: '#333',
  },
  email: {
    fontSize: 15,
    color: '#666',
    marginTop: 2,
    marginBottom: 2,
  },
  role: {
    fontSize: 15,
    color: '#ff9900',
    marginTop: 2,
    fontWeight: '500',
  },
});
