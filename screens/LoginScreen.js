import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import supabase from '../src/supabase'

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    async function handleAuth(action) {
        setError(null);
        let result;
        if (action === 'login') { 
            result = await supabase.auth.signInWithPassword({ email, password });
        }
        else {
            result = await supabase.auth.signUp({email, password});
        }

        if (result.error)
            setError(result.error.message);
    }

    return (
        <View style = {{ padding: 20 }}>
            <Text>Email:</Text>
            <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" />

            <Text>Password:</Text>
            <TextInput value={password} onChangeText={setPassword} autoCapitalize="none" secureTextEntry />

            {error && <Text style = {{ color: 'red' }}>{error}</Text>}

            <Button title="Sign Up" onPress={() => navigation.navigate('Signup')} />
            <Button title="Log In" onPress={() => handleAuth('login')} />
        </View>
    );
}