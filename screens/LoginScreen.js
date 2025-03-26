import React, { useState } from "react";
import { styles } from "./SignupScreen"; //pages look the same right now!
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import supabase from "../src/supabase";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  async function handleAuth(action) {
    setError(null);
    let result;
    if (action === "login") {
      result = await supabase.auth.signInWithPassword({ email, password });
    } else {
      result = await supabase.auth.signUp({ email, password });
    }

    if (result.error) setError(result.error.message);
  }

  /*
    return (
        <View style = {{ padding: 50 }}>
            <Text>Email:</Text>
            <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" />

            <Text>Password:</Text>
            <TextInput value={password} onChangeText={setPassword} autoCapitalize="none" secureTextEntry />

            {error && <Text style = {{ color: 'red' }}>{error}</Text>}

            <Button title="Sign Up" onPress={() => navigation.navigate('Signup')} />
            <Button title="Log In" onPress={() => handleAuth('login')} />
        </View>
    );
    */

  return (
    <ScrollView contentContainerStyle={styles.pageContainer}>
      <Text style={styles.letsStart}>Let’s Start!</Text>

      <View style={styles.createAccountBox}>
        <Text style={styles.createAccountHeaderText}>Log In:</Text>

        <View style={styles.inputContainer}>
          <TextInput
            keyboardType="email-address"
            style={styles.input}
            placeholder="Email"
            onChangeText={setEmail}
            value={email}
          />

          <TextInput
            value={password}
            style={styles.input}
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            style={styles.createButton}
            onPress={() => handleAuth("login")}
          >
            <Text style={styles.createButtonText}>Log In</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.navigate("Signup")}
      >
        <Text style={styles.loginButtonText}>or Sign Up</Text>
      </TouchableOpacity>

      <View style={styles.logoView}>
        <Image
          source={require("../assets/pantrypallogo.png")}
          style={styles.logo}
        />
      </View>
    </ScrollView>
  );
}
