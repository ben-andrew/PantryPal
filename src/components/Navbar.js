import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from '@react-navigation/native';

/**
 * Navbar - The navigation bar at the bottom of the screen
 * Uses `useNavigation` for simplicity so you don't need to pass it in yourself
 * 
 * @returns {JSX.Element} The Navbar with navigation buttons.
 */
export default function Navbar() {

	const navigation = useNavigation();

	// Navigation Functions
  async function navigateFromIcon(icon) {
    if (icon === "home-outline") navigation.navigate("Pantry");
  }
	
  return (
    <View style={styles.navBar}>
      {[
        "home-outline",
        "list-outline",
        "scan-outline",
        "search-outline",
        "add-outline",
      ].map((icon, index) => (
        <TouchableOpacity
          key={index}
          style={styles.navButton}
          onPress={() => navigateFromIcon(icon)}
        >
          <Icon name={icon} size={24} color="#FFA500" />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  navBar: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#ffffff",
    position: "absolute",
    bottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: "80%",
    alignSelf: "center",
    borderRadius: 30,
  },
  navBarAbs: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#ffffff",
    position: "absolute",
    bottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: "80%",
    alignSelf: "center",
    borderRadius: 30,
  },
  navButton: {
    padding: 10,
  },
});
