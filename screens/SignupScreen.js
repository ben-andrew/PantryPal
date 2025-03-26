import React, { useState } from "react";
import { KeyboardAvoidingView, Image, TouchableOpacity, View, Text, TextInput, Button, Alert, StyleSheet, ScrollView } from "react-native";
import supabase from "../src/supabase";
import { SafeAreaView } from "react-native-safe-area-context";

const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      Alert.alert(
        "Success",
        "Account created! Please check your email for verification."
      );
      navigation.navigate("Login");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.pageContainer}>
      <Text style={styles.letsStart}>Let’s Start!</Text>

      <View style={styles.createAccountBox}>
        <Text style={styles.createAccountHeaderText}>Create an Account:</Text>

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
            onPress={() => handleSignup()}
          >
            <Text style={styles.createButtonText}>Create</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.loginButtonText}>or Login</Text>
      </TouchableOpacity>

      <View style={styles.logoView}>
        <Image
          source={require("../assets/pantrypallogo.png")}
          style={styles.logo}
        />
      </View>
    </ScrollView>
  );
};

export const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  letsStart: {
    textAlign: "center",
    color: "#FDAD33",
    fontSize: 50,
    fontWeight: "600",
    fontStyle: "italic",
    marginBottom: "3.5%",
  },

  createAccountBox: {
    justifyContent: "space-between",
    width: "90%",
    backgroundColor: "#F1F1F1",
    borderRadius: 35,
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 25,
  },

  createAccountHeaderText: {
    fontSize: 24,
    fontWeight: "500",
    color: "black",
    marginBottom: 10,
  },

  createButton: {
    width: "50%",
    backgroundColor: "#FDAD33",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginBottom: 10,
    marginTop: 20,
  },

  createButtonText: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
    textAlign: "center",
  },

  // Positioning the text inputs on top of the gray box
  inputContainer: {
    width: "100%",
    alignItems: "center",
  },

  input: {
    width: "100%", // This is kept
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderWidth: 1,
    fontSize: 18,
    marginVertical: 10,
    borderRadius: 35,
    backgroundColor: "#fff",
    color: "black",
  },

  loginButton: {
    backgroundColor: "#FDAD33",
    paddingVertical: 13,
    paddingHorizontal: 23,
    borderRadius: 25,
    marginTop: 20,
  },

  loginButtonText: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
    textAlign: "center",
  },

  logo: {
    resizeMode: "cover",
    aspectRatio: "1",
    width: 80,
    height: 80,
  },

  logoView: {
    marginTop: 20,
    alignItems: "center",
  },
});

export default SignupScreen;
