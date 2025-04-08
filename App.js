import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import supabase from './src/scripts/supabase';
import PantryScreen from './screens/PantryScreen';
import LoginScreen from './screens/LoginScreen';
import Signup from './screens/SignupScreen';
import CartScreen from './screens/CartScreen';
import Dashboard from './screens/Dashboard';

const Stack = createNativeStackNavigator();

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
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => authListener.subscription.unsubscribe();

  }, []);

  //return <CartScreen/>

  return (
    <NavigationContainer>
      <Stack.Navigator>
      {!session ? (
        <>
          <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        </>
      ) : ( 
        <>
          <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }}/>
          <Stack.Screen name="Pantry" component={PantryScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="Cart" component={CartScreen} options={{ headerShown: false }} />
        </>
      )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
