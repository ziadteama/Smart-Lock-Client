import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import CONFIG from '../utilities/Info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function AddFaceIDScreen() {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Camera access is required to register your face.');
      }

      try {
        const storedId = await AsyncStorage.getItem('userId');
        if (storedId) {
          setUserId(storedId);
        } else {
          Alert.alert('Missing ID', 'No userId found in storage. Please log in again.');
        }
      } catch (error) {
        console.error('Failed to retrieve userId:', error);
      }
    };
    fetchData();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0]);
    }
  };

  const registerFace = async () => {
    if (!image || !userId) {
      Alert.alert('Error', 'Missing userId or image');
      return;
    }

    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('image', {
      uri: image.uri,
      type: 'image/jpeg',
      name: `${userId}.jpg`,
    });

    setUploading(true);
    try {
      const response = await fetch(`${CONFIG.BASE_URL}/api/face/register`, {
        method: 'POST',
        body: formData,
      });

      const text = await response.text();
      let result;
      try {
        result = JSON.parse(text);
      } catch (e) {
        result = { error: text };
      }

      if (response.ok) {
        Alert.alert('Success', 'Face registered successfully!');
        setImage(null); // reset image
      } else {
        Alert.alert('Error', result.error || 'Registration failed');
      }
    } catch (err) {
      Alert.alert('Error', 'Server error');
    }
    setUploading(false);
  };

  return (
    <View style={styles.bg}>
      <View style={styles.card}>
        <Ionicons name="camera-outline" size={38} color="#7cc6fe" style={{ alignSelf: 'center', marginBottom: 6 }} />
        <Text style={styles.title}>Register Face</Text>
        {image && <Image source={{ uri: image.uri }} style={styles.preview} />}
        {uploading && <ActivityIndicator size="large" color="#7cc6fe" style={{ marginVertical: 8 }} />}
        
        <TouchableOpacity style={styles.button} onPress={pickImage} disabled={uploading}>
          <Text style={styles.buttonText}>Take Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, !image || uploading ? styles.buttonDisabled : null]}
          onPress={registerFace}
          disabled={!image || uploading}
        >
          <Text style={styles.buttonText}>Submit Face</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: '#1b2e4e',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#255083',
    width: '96%',
    borderRadius: 22,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.10,
    shadowRadius: 18,
    elevation: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#e1ecfa',
    marginBottom: 18,
    letterSpacing: 0.8,
  },
  preview: {
    width: 180,
    height: 180,
    borderRadius: 16,
    marginBottom: 18,
    marginTop: -6,
    borderWidth: 2,
    borderColor: '#7cc6fe',
  },
  button: {
    width: '100%',
    backgroundColor: '#7cc6fe',
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#7cc6fe',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonDisabled: {
    backgroundColor: '#b8d8f6',
  },
  buttonText: {
    color: '#123866',
    fontWeight: '700',
    fontSize: 17,
    letterSpacing: 0.2,
  },
});
