import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Alert,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import supabase from "../src/scripts/supabase";
import alert from "../src/scripts/alert";
import { Switch } from 'react-native';

const { width, height } = Dimensions.get("window");

const UserSettings = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [language, setLanguage] = useState("English");
  const [userId, setUserId] = useState(null);
  const [dark, setIsDarkMode] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error("Error getting user:", error.message);
        return;
      }

      const user = data.user;

      if (user) {
        setEmail(user.email);
        setUserId(user.id);

        // Fetch language and dark mode preference from user_RLS table
        const { data: userData, error: userError } = await supabase
          .from("user_RLS")
          .select("language, dark")
          .eq("user_id", user.id)
          .single();

        if (userError) {
          console.log("Error fetching user_RLS:", userError.message);
        } else {
          setLanguage(userData.language || "English");
          setIsDarkMode(userData.dark); // Set dark mode based on stored settings
        }
      }
    };

    loadUserData();
  }, []);

  const handleResetPassword = () => {
    Alert.alert("Password reset", "Password reset link sent to your email.");
  };

  const handleUpdateSettings = async () => {
    if (!userId) return;

    console.log("User ID:", userId); // Log the userId for debugging

    // Check if user settings exist
    const { data: existingUserSettings, error: fetchError } = await supabase
      .from("user_RLS")
      .select("*")
      .eq("user_id", userId)
      .single();

    console.log("Existing User Settings:", existingUserSettings); // Log the existing data

    if (fetchError) {
      console.error("Error fetching user settings:", fetchError.message);
      alert("Error fetching user settings");
      return;
    }

    if (existingUserSettings) {
      // Update existing settings
      const { error: updateError } = await supabase
        .from("user_RLS")
        .update({ language, dark })
        .eq("user_id", userId);

      if (updateError) {
        alert("Error updating user settings");
      } else {
        alert(`Language and Dark Mode updated: Language set to ${language}, Dark Mode set to ${dark ? 'On' : 'Off'}.`);
      }
    } else {
      // Insert new settings if no existing row
      const { error: insertError } = await supabase
        .from("user_RLS")
        .insert([{ user_id: userId, language, dark }]);

      if (insertError) {
        alert("Error inserting user settings: " + insertError.message);
      } else {
        alert(`User settings saved: Language set to ${language}, Dark Mode set to ${dark ? 'On' : 'Off'}.`);
      }
    }
  };

  // Define dynamic styles
  const backgroundColor = dark ? "#333" : "#f1f1f1"; // Dark background for dark mode, light for light mode
  const textColor = dark ? "white" : "black"; // Text color based on dark mode

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <LinearGradient
        colors={dark ? ["#333", "#444"] : ["#FFA500", "#FFB733"]}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back-outline" size={24} color="white" />
        </TouchableOpacity>
        <Text style={[styles.headerText, { color: textColor }]}>User Settings</Text>
      </LinearGradient>

      <View style={styles.contentContainer}>
        <Text style={[styles.label, { color: textColor }]}>Email</Text>
        <TextInput style={[styles.input, { backgroundColor: dark ? "#555" : "white", color: textColor }]} value={email} editable={false} />

        <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
          <Text style={styles.buttonText}>Reset Password</Text>
        </TouchableOpacity>

        <TextInput
          placeholder="Language"
          value={language}
          onChangeText={setLanguage}
          style={[styles.input, { backgroundColor: dark ? "#555" : "white", color: textColor }]}
        />
        
        <Text style={[styles.label, { color: textColor }]}>Dark Mode</Text>
        
        <Switch
          value={dark}
          onValueChange={(value) => setIsDarkMode(value)}
        />
        <TouchableOpacity style={styles.button} onPress={handleUpdateSettings}>
          <Text style={styles.buttonText}>Save Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 150,
    paddingTop: 50,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    justifyContent: "center",
    marginBottom: 20,
  },
  backButton: {
    position: "absolute",
    top: 90,
    left: 35,
    zIndex: 10,
  },
  headerText: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
  },
  contentContainer: {
    padding: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
    fontWeight: "bold",
  },
  input: {
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#FFA500",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default UserSettings;
