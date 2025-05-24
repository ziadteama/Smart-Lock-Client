import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CustomDrawer({ navigation, isAdmin }) {
  const [userName, setUserName] = useState('Loading...');
  const [role, setRole] = useState('resident');

  useEffect(() => {
    const getUserInfo = async () => {
      const storedName = await AsyncStorage.getItem('userName');
      const storedRole = await AsyncStorage.getItem('userRole');
      setUserName(storedName || 'Unknown User');
      setRole(storedRole || 'resident');
    };
    getUserInfo();
  }, []);

  // Allow override via prop, fallback to local state
  const admin = typeof isAdmin === 'boolean' ? isAdmin : role === 'admin';

  return (
    <DrawerContentScrollView
      contentContainerStyle={styles.bg}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.headerBox}>
        <Ionicons name="person-circle-outline" size={70} color="#b7c4d9" />
        <Text style={styles.name}>{userName}</Text>
        <Text style={styles.role}>{(admin ? 'Admin' : role).toUpperCase()}</Text>
      </View>

      {/* Menu */}
      <View style={styles.menu}>
        <DrawerCard label="Home" icon="home-outline" onPress={() => navigation.navigate('Home')} />
        <DrawerCard label="Access Logs" icon="list-outline" onPress={() => navigation.navigate('AccessLogsScreen')} />
        {admin && <DrawerCard label="Edit Password" icon="lock-closed-outline" onPress={() => navigation.navigate('Edit Password')} />}
        {admin && <DrawerCard label="Request Account" icon="person-add-outline" onPress={() => navigation.navigate('Request Account')} />}
        <DrawerCard label="User Data" icon="person-outline" onPress={() => navigation.navigate('User Data')} />
        <DrawerCard label="Add New Face ID" icon="camera-outline" onPress={() => navigation.navigate('Add New Face ID')} />
      </View>

      {/* Spacer to push sign out to the bottom */}
      <View style={{ flex: 1 }} />

      {/* Sign Out Button */}
      <TouchableOpacity style={styles.logout} onPress={() => navigation.navigate('Login')}>
        <Ionicons name="log-out-outline" size={22} color="#fff" style={{ marginRight: 12 }} />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}

function DrawerCard({ label, icon, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Ionicons name={icon} size={24} color="#e1ecfa" style={styles.cardIcon} />
      <Text style={styles.cardText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: '#1b2e4e',
    paddingTop: 0,
    paddingBottom: 0,
  },
  headerBox: {
    backgroundColor: '#203661',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    marginBottom: 22,
    paddingVertical: 26,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
  },
  name: {
    fontSize: 19,
    fontWeight: '600',
    color: '#bfe0ff',
    marginTop: 4,
  },
  role: {
    fontSize: 14,
    color: '#b7c4d9',
    marginTop: 3,
    letterSpacing: 1.2,
  },
  menu: {
    width: '100%',
    paddingHorizontal: 14,
    marginBottom: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#255083',
    borderRadius: 16,
    marginBottom: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.09,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
  },
  cardIcon: {
    marginRight: 18,
  },
  cardText: {
    color: '#e1ecfa',
    fontSize: 17,
    fontWeight: '500',
    letterSpacing: 0.4,
  },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#142237',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 26,
    margin: 16,
    justifyContent: 'center',
    elevation: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.7,
  },
});
