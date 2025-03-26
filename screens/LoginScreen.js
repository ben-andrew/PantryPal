import React, { useState } from "react";
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
            style={styles.input}
            placeholder="Email"
            onChangeText={setEmail}
          />

          <TextInput
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

const styles = StyleSheet.create({
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
    width: "40%",
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
    marginBottom: 20,
		marginTop: 30,
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
    flex: 1,
    height: "50%",
    width: "100%",
    padding: 22,
    borderWidth: 1,
    paddingVertical: 15,
		fontSize: 20,
		marginVertical: 10,
    borderRadius: 35,
    backgroundColor: "#fff",
  },

  loginButton: {
    backgroundColor: "#FDAD33",
    paddingVertical: 13,
    paddingHorizontal: 23,
    borderRadius: 25,
    marginTop: 40,
  },

  loginButtonText: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
    textAlign: "center",
  },

  logo: {
		flex: 1,
		resizeMode: "contain",
		width: null,
		height: null,
  },

	logoView: {
		marginTop: 20,
		alignItems: "center",
		width: "10%",
		height: "10%",
	}
});
