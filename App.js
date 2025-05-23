// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CustomDrawer from './Componenets/CustomDrawer';
import HomeScreen from './screens/HomeScreen';
import LogScreen from './screens/LogScreen';
import EditPasswordScreen from './screens/EditPasswordScreen';
import RequestAccountScreen from './screens/RequestAccountScreen';
import UserDataScreen from './screens/UserDataScreen';
import AddFaceIDScreen from './screens/AddFaceIDScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpPageScreen from './screens/SignUpPageScreen';
import WaitingApprovalScreen from './screens/WaitingApprovalScreen';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function DrawerLayout({ isAdmin }) {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawer {...props} isAdmin={isAdmin} />}
      screenOptions={{ headerShown: true }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Logs" component={LogScreen} />
      {isAdmin && <Drawer.Screen name="Edit Password" component={EditPasswordScreen} />}
      {isAdmin && <Drawer.Screen name="Request Account" component={RequestAccountScreen} />}
      <Drawer.Screen name="User Data" component={UserDataScreen} />
      <Drawer.Screen name="Add New Face ID" component={AddFaceIDScreen} />
    </Drawer.Navigator>
  );
}

export default function App() {
  const isAdmin = true; // TODO: replace with actual logic

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignUpPageScreen} />
        <Stack.Screen name="WaitingApproval" component={WaitingApprovalScreen} />
        <Stack.Screen name="Main" options={{ headerShown: false }}>
          {() => <DrawerLayout isAdmin={isAdmin} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
