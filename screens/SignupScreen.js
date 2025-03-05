import { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import supabase from '../src/supabase'
import { SafeAreaView } from 'react-native-safe-area-context';

const Signup = ({ navigation }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  // Function to handle sign-up
  const handleSignup = async () => {
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (error) {
      Alert.alert('Error', error.message);
      return;
    }

    if (data.user) {
      // Insert user into 'users' table in Supabase
      const { error: dbError } = await supabase.from('users').insert([
        {
          id: data.user.id, // Use the same UUID from authentication
          name: form.name,
          email: form.email,
        },
      ]);

      if (dbError) {
        Alert.alert('Database Error', dbError.message);
      } else {
        Alert.alert('Success', 'User signed up!');
        navigation.navigate('Login'); // Navigate to login screen
      }
    }
  };

  return (
    <SafeAreaView style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Sign Up</Text>

      <TextInput
        placeholder="Your Name"
        value={form.name}
        onChangeText={(e) => setForm({ ...form, name: e })}
        style={{ borderWidth: 1, padding: 10, marginVertical: 5 }}
      />

      <TextInput
        placeholder="Your Email"
        value={form.email}
        onChangeText={(e) => setForm({ ...form, email: e })}
        keyboardType="email-address"
        style={{ borderWidth: 1, padding: 10, marginVertical: 5 }}
      />

      <TextInput
        placeholder="Your Password"
        value={form.password}
        onChangeText={(e) => setForm({ ...form, password: e })}
        secureTextEntry
        style={{ borderWidth: 1, padding: 10, marginVertical: 5 }}
      />

      <Button title="Sign Up" onPress={() => 
      {
        handleSignup;
        navigation.navigate('Login');
      }} />

      <Button title="Log In" onPress={() => 
      {
        
        navigation.navigate('Login');
      }} />
    </SafeAreaView>
  );
};

export default Signup;
