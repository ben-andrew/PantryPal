import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import supabase from '../src/supabase';
import { SafeAreaView } from 'react-native-safe-area-context';

const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  // Function to handle sign-up
  const handleSignup = async () => {
    setError(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    if (data.user) {
      Alert.alert('Success', 'Account created! Please check your email for verification.');
      navigation.navigate('Login');
    }
  };

  return (
    <SafeAreaView style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Sign Up</Text>

      <Text>Email:</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{ borderWidth: 1, padding: 10, marginVertical: 5 }}
      />

      <Text>Password:</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
        secureTextEntry
        style={{ borderWidth: 1, padding: 10, marginVertical: 5 }}
      />

      {error && <Text style={{ color: 'red' }}>{error}</Text>}

      <Button title="Sign Up" onPress={handleSignup} />
      <Button title="Go to Login" onPress={() => navigation.navigate('Login')} />
    </SafeAreaView>
  );
};

export default SignupScreen;
