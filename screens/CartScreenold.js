import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import { Dropdown } from 'react-native-element-dropdown';
import alert from "../src/alert";
import supabase from '../src/supabase';

export default function CartScreen({ navigation }) {
  // React functions
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchCartItems();
  }, []);

  // Navigation functions
  async function navigateFromIcon(icon) {
    if (icon === "home-outline") navigation.navigate("Pantry");
  }

  // Fetch Cart items from Supabase
  const fetchCartItems = async () => {
    const { data, error } = await supabase.from("cart_RLS").select("*");
    if (error) {
      console.error("Error fetching data:", error);
    } else {
      console.log("Fetched Items:", data); // Log the data to inspect it
      setItems(data);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#FFA500", "#FFB733"]} style={styles.header}>
        <Text style={styles.headerText}>Shopping List</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back-outline" size={24} color="white" />
        </TouchableOpacity>
      </LinearGradient>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }}>
        <FlatList
          style={{ padding: 8 }}
          data={items}
          keyExtractor={(item) => item.food_id.toString()}
          renderItem={({ item }) => (
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text>
                {item.name} - {item.quantity} {item.unit}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  gap: 8,
                }}
              >
                <Button title="Edit" onPress={() => handleEditPress(item)} />
                <Button
                  title="Delete"
                  onPress={() => handleDeletePress(item.food_id)}
                />
              </View>
            </View>
          )}
        />
      </ScrollView>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1",
  },
  header: {
    height: 150,
    paddingTop: 50,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    justifyContent: "center",
    marginBottom: 50,
  },

  backButton: {
    position: "absolute",
    top: 90,
    left: 35,
  },

  headerText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
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
    fontSize: 13,
    top: 14,
    left: -130,
  },

  setting2SubText: {
    fontSize: 13,
    top: 14,
    left: -185,
  },

  setting3SubText: {
    fontSize: 13,
    top: 14,
    left: -153,
  },

  setting4SubText: {
    fontSize: 13,
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

  settingsText: {
    fontSize: 20,
    top: -13,
  },
  navBar: {
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
