// screens/WaitingApprovalScreen.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function WaitingApprovalScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Waiting for admin to approve your account...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    color: '#555',
  },
});
