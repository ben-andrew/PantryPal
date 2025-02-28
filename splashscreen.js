import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

const SplashScreen = ({ navigation }) => {
  console.log("SplashScreen component rendered!");

  useEffect(() => {
    setTimeout(() => {
      console.log("navigating to Login Screen..");
      navigation.replace("Login");
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
       <Image source={require("../assets/pantrypallogo.png")} style={styles.logo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center", // Center vertically
    alignItems: "center", // Center horizontally
    backgroundColor: "#FFA500",
  },

  logo : {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
});

export default SplashScreen;