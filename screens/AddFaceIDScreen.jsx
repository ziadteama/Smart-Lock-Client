import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import CONFIG from '../utilities/Info';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
          console.log("UserId received from AsyncStorage:", storedId);
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
    console.log("Launching camera...");
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    console.log("Camera result:", result);

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0]);
      console.log("Image picked:", result.assets[0].uri);
    }
  };

  const registerFace = async () => {
    console.log("Submitting face...");
    console.log("userId:", userId);
    console.log("image:", image);

    if (!image || !userId) {
      console.log("Missing userId or image");
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
      console.log("Response text:", text);
      let result;
      try {
        result = JSON.parse(text);
      } catch (e) {
        console.log("Failed to parse JSON", e);
        result = { error: text };
      }

      if (response.ok) {
        Alert.alert('Success', 'Face registered successfully!');
        setImage(null); // reset image
      } else {
        Alert.alert('Error', result.error || 'Registration failed');
      }
    } catch (err) {
      console.error("Error during submission:", err);
      Alert.alert('Error', 'Server error');
    }
    setUploading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register Face</Text>

      {image && <Image source={{ uri: image.uri }} style={styles.preview} />}
      {uploading && <ActivityIndicator size="large" color="#0000ff" />}

      <Button title="Take Photo" onPress={pickImage} />
      <View style={{ height: 20 }} />
      <Button title="Submit Face" onPress={registerFace} disabled={!image || uploading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  preview: { width: 200, height: 200, borderRadius: 10, marginBottom: 20 },
});
