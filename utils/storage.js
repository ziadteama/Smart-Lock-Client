import * as SecureStore from 'expo-secure-store';

export async function saveToken(token) {
  await SecureStore.setItemAsync('authToken', token);
}

export async function getToken() {
  return await SecureStore.getItemAsync('authToken');
}

export async function deleteToken() {
  await SecureStore.deleteItemAsync('authToken');
}
