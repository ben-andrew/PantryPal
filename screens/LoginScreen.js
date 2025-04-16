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
import supabase from "../src/scripts/supabase";

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
    <ScrollView contentContainerStyle={styles.signupPageContainer}>
      <Text style={styles.signupLetsStartText}>Let’s Start!</Text>

      <View style={styles.createAccountBox}>
        <Text style={styles.createAccountHeaderText}>Log In:</Text>

        <View style={styles.signupInputContainer}>
          <TextInput
            keyboardType="email-address"
            style={styles.signupInput}
            placeholder="Email"
            onChangeText={setEmail}
            value={email}
          />

          <TextInput
            value={password}
            style={styles.signupInput}
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            style={styles.createAccountButton}
            onPress={() => handleAuth("login")}
          >
            <Text style={styles.createAccountButtonText}>Log In</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.navigate("Signup")}
      >
        <Text style={styles.loginButtonText}>or Sign Up</Text>
      </TouchableOpacity>

      <View style={styles.signupLogoContainer}>
        <Image
          source={require("../assets/pantrypallogo.png")}
          style={styles.signupLogo}
        />
      </View>
    </ScrollView>
  );
}
