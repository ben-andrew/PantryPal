import React, { useState } from "react";
import { Image, TouchableOpacity, View, Text, TextInput, Button, Alert, StyleSheet, ScrollView } from "react-native";
import supabase from "../src/scripts/supabase";
import alert from "../src/scripts/alert"

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
      alert(
        error.message
      );
      return;
    }

    if (data.user) {
      alert(
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
            onPress={handleSignup}
          >
            <Text style={styles.createAccountButtonText}>Create</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.loginButtonText}>or Login</Text>
      </TouchableOpacity>

      <View style={styles.signupLogoContainer}>
        <Image
          source={require("../assets/pantrypallogo.png")}
          style={styles.signupLogo}
        />
      </View>
    </ScrollView>
  );
};

const smallFontSize = 16;
const mediumFontSize = 23;
const LargeFontSize = 30;

export const styles = StyleSheet.create({
  signupPageContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  signupLetsStartText: {
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

  createAccountButton: {
    width: "50%",
    backgroundColor: "#FDAD33",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginBottom: 10,
    marginTop: 20,
  },

  createAccountButtonText: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
    textAlign: "center",
  },

  // Positioning the text inputs on top of the gray box
  signupInputContainer: {
    width: "100%",
    alignItems: "center",
  },

  signupInput: {
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

  signupLogo: {
    resizeMode: "cover",
    aspectRatio: "1",
    width: 80,
    height: 80,
  },

  signupLogoContainer: {
    marginTop: 20,
    alignItems: "center",
  },

  bigButton: { paddingBottom: 8 },
  textInput: { borderWidth: 1, padding: 8, marginVertical: 5, fontSize: 15 },
  dropdownPlaceholder: { fontSize: 15 }, //keep the fontsize for these the same
  delButton: { paddingLeft: 8 },
  iconButton: {
    zIndex: 1,
    position: "absolute",
    top: 70,
    marginLeft: 20,
  },
  settingsIconButton: {
    position: "absolute",
    top: 70,
    right: 20,
    marginLeft: -20,
  },

  subText: {
    fontSize: 20,
    color: "white",
    alignSelf: "left",
    marginTop: -1,
    marginBottom: 10,
  },

  searchBar: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 30,
    marginTop: 4,
    marginLeft: 4,
    paddingHorizontal: 20,
    alignItems: "center",
    height: 50,
    width: "90%",

    alignSelf: "center",
  },

  searchInput: {
    flex: 1,
    paddingVertical: 5,
  },

  searchIcon: {
    padding: 10,
  },
  logo: {
    resizeMode: "cover",
    aspectRatio: "1",
    width: 40,
    height: 40,
  },

  logoView: {
    marginTop: 20,
    alignItems: "center",
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    justifyContent: "center",
  },

  backButton: {
    position: "absolute",
    top: 35,
    left: 35,
  },

  headerText: {
    fontSize: LargeFontSize,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  middleButton: {
    padding: 8,
    fontSize: smallFontSize,
    alignItems: "center",
  },
  textInput: {
    borderWidth: 1,
    padding: 8,
    marginVertical: 5,
    fontSize: smallFontSize,
  },
  dropdownPlaceholder: { fontSize: smallFontSize }, //keep the fontsize for these the same
  delButton: { paddingLeft: 8, borderWidth: 1 },
  scrollView: {
    backgroundColor: "pink",
  },
  settingsContainer: {
    padding: 20,
  },
  settingsCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 15,
    height: 80,
    width: "90%",
    left: 20,
    marginBottom: 10,
  },

  userSettingsCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 15,
    height: 80,
    width: "90%",
    left: 20,
    marginBottom: 40,
  },
  settingSubText: {
    fontSize: smallFontSize,
    top: 14,
    left: -130,
  },

  setting2SubText: {
    fontSize: smallFontSize,
    top: 14,
    left: -185,
  },

  setting3SubText: {
    fontSize: smallFontSize,
    top: 14,
    left: -153,
  },

  setting4SubText: {
    fontSize: smallFontSize,
    top: 14,
    left: -86,
  },

  settingsImage: {
    width: 35,
    height: 35,
    marginRight: 15,
    borderRadius: 20,
  },

  usersettingsImage: {
    width: 40,
    height: 40,
    marginRight: 15,
    borderRadius: 20,
  },

  ingredientsettingsImage: {
    width: 35,
    height: 35,
    marginRight: 15,
    borderRadius: 20,
  },

  recipesettingsImage: {
    width: 40,
    height: 40,
    marginRight: 15,
    borderRadius: 20,
  },
  itemListContainer: {
    padding: 16,
  },
  midSectionHeaderText: {
    color: "#FFA500",
    fontSize: mediumFontSize,
    fontWeight: "bold",
    padding: 8,
    paddingBottom: 0,
    paddingLeft: 16,
  },
  itemListText: {
    padding: 8,
    paddingTop: 0,
    paddingRight: 0,
    fontSize: smallFontSize,
  },
  redButton: {
    color: "red",
    padding: 8,
    marginVertical: 3,
    borderWidth: 1,
    fontSize: smallFontSize,
  },
  yellowButton: {
    color: "#FFA500",
    padding: 8,
    marginVertical: 3,
    borderWidth: 1,
    fontSize: smallFontSize,
  },
});

export default SignupScreen;
