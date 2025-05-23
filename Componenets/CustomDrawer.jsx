import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CustomDrawer({ navigation }) {
  const [userName, setUserName] = useState('Loading...');
  const [role, setRole] = useState('resident'); // default to resident

  useEffect(() => {
    const getUserInfo = async () => {
      const storedName = await AsyncStorage.getItem('userName');
      const storedRole = await AsyncStorage.getItem('userRole');
      setUserName(storedName || 'Unknown User');
      setRole(storedRole || 'resident');
    };
    getUserInfo();
  }, []);

  const isAdmin = role === 'admin';

  return (
    <DrawerContentScrollView contentContainerStyle={{ flex: 1 }}>
      <View style={styles.header}>
        <Ionicons name="person-circle-outline" size={70} color="#ccc" style={{ marginBottom: 10 }} />
        <Text style={styles.name}>{userName}</Text>
        <Text style={styles.role}>{role.toUpperCase()}</Text>
      </View>

      <View style={styles.menu}>
        <DrawerItem label="Home" icon="home" onPress={() => navigation.navigate('Home')} />
        <DrawerItem label="Logs" icon="list" onPress={() => navigation.navigate('Logs')} />
        {isAdmin && <DrawerItem label="Edit Password" icon="lock-closed" onPress={() => navigation.navigate('Edit Password')} />}
        {isAdmin && <DrawerItem label="Request Account" icon="person-add" onPress={() => navigation.navigate('Request Account')} />}
        <DrawerItem label="User Data" icon="person" onPress={() => navigation.navigate('User Data')} />
        <DrawerItem label="Add New Face ID" icon="camera" onPress={() => navigation.navigate('Add New Face ID')} />
      </View>

      <TouchableOpacity style={styles.logout} onPress={() => navigation.navigate('Login')}>
        <Ionicons name="log-out-outline" size={22} color="#fff" />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}

function DrawerItem({ label, icon, onPress }) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <Ionicons name={icon} size={22} color="#fff" style={{ marginRight: 12 }} />
      <Text style={styles.itemText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#222',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0ff',
  },
  role: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 4,
  },
  menu: {
    flex: 1,
    backgroundColor: '#111',
    paddingTop: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  itemText: {
    color: '#fff',
    fontSize: 16,
  },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#444',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
});
