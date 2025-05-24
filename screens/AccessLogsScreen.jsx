import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import CONFIG from '../utilities/Info';

export default function AccessLogsScreen() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${CONFIG.BASE_URL}/api/access-logs`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setLogs(data.logs);
        else setLogs([]);
        setLoading(false);
      })
      .catch(err => {
        setLogs([]);
        setLoading(false);
      });
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.logCard}>
      <Text style={styles.name}>{item.matched_name || 'Unknown User'}</Text>
      <Text style={styles.method}>{item.method}</Text>
      <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleString()}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#18345b" />
      </View>
    );
  }

  if (logs.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No access logs found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.listContainer}>
      <FlatList
        data={logs}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContainer: { flex: 1, backgroundColor: '#dde6f6' },
  logCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#18345b',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  name: { fontWeight: 'bold', fontSize: 18, color: '#18345b' },
  method: { fontSize: 15, color: '#377' },
  timestamp: { fontSize: 13, color: '#888', marginTop: 6 },
});
