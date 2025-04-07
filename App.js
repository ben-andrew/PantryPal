import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import PantryScreen from './screens/PantryScreen';
import LoginScreen from './screens/LoginScreen';
import SettingScreen from './screens/SettingsScreen';
import Signup from './screens/SignupScreen';
import User from './screens/UserSettings';
import supabase from './src/supabase';

const Stack = createStackNavigator();

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth state changes
    const authListener = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Cleanup function
    return () => {
      if (authListener?.unsubscribe) authListener.unsubscribe();
    };

  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!session ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
          </>
        ) : (
          <>
            <Stack.Screen name="Pantry" component={PantryScreen} />
            <Stack.Screen name="Settings" component={SettingScreen} />
            <Stack.Screen name="User" component={User} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
