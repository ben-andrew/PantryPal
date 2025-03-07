import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "./screens/splashscreen.js";
import LoginScreen from "./screens/loginscreen.js";
import Dashboard from './screens/dashboard.js';
import Settings from './screens/settings.js';
import 'react-native-gesture-handler';
import { View, StyleSheet } from 'react-native';


const Stack = createStackNavigator();

export default function App() {
  console.log("Current screen: Splash");

  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="Settings" component={Settings} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});