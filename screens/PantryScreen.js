import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  SafeAreaView,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import alert from "../src/scripts/alert";
import supabase from "../src/scripts/supabase";
import { Dropdown } from "react-native-element-dropdown";
import Navbar from "../src/components/Navbar";
import Icon from "react-native-vector-icons/Ionicons";
import PageHeader from "../src/components/PageHeader";
import AddEditItem from "../src/components/AddEditItem";

const { height } = Dimensions.get("window").height;

const PantryScreen = ({ navigation }) => {
  const [ingredients, setIngredients] = useState(["nothing"]);
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null); // Track the item being edited

  // Add buttons to header.
  async function handleLogout() {
    await supabase.auth.signOut();
  }

  async function toShoppingList() {
    navigation.navigate("Cart");
  }

  const fetchDBIngredients = async () => {
    let newIngr;
    try {
      const res = await fetch(
        "https://www.themealdb.com/api/json/v1/1/list.php?i=list"
      );
      const data = (await res.json()).meals;
      newIngr = data.map((meal) => ({
        label: meal.strIngredient,
        value: meal.strIngredient,
      }));
    } catch (e) {
      console.log("fetch caught error: ", e);
      newIngr = [{ label: "nothing", value: "nothing" }];
    }
    setIngredients(newIngr);
  };

  // Fetch pantry items from Supabase
  const fetchPantryItems = async () => {
    const { data, error } = await supabase
      .from("food_inventory_RLS")
      .select("*");
    if (error) {
      console.error("Error fetching data:", error);
    } else {
      setItems(data);
    }
  };

  useEffect(() => {
    fetchPantryItems();
    fetchDBIngredients();
  }, []);

  // Function to handle the item selection for editing
  const handleEditPress = (item) => {
    setEditingItem(item); // Set the current item being edited
  };

  // Function to delete an item from database
  const handleDeletePress = (food_id) => {
    alert(
      "Confirm Deletion",
      "Are you sure you want to delete this item?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Delete cancelled"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            const { data, error } = await supabase
              .from("food_inventory_RLS")
              .delete()
              .eq("food_id", food_id); // Delete item with matching food_id

            if (error) {
              console.error("Error deleting item:", error);
              alert("Error", "Failed to delete item");
            } else {
              // Remove the deleted item from local state
              fetchPantryItems();
              alert("Success", "Item deleted successfully");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView
      style={{ flex: 1 }}
      contentContainerStyle={{ height: height }}
    >
      <PageHeader
        hasSearch={false}
        hasIcons={false}
        largetext="Pantry"
        subtext="What you currently have"
        hasBackButton={true}
      />
      <ScrollView>
        <View style={{ flex: 1 }} contentContainerStyle={{ height: height }}>
          <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              Pantry Items:
            </Text>

            <FlatList
              style={{ padding: 8 }}
              data={items}
              keyExtractor={(item) => item.food_id.toString()}
              renderItem={({ item }) => (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
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
                    <Button
                      title="Edit"
                      onPress={() => handleEditPress(item)}
                    />
                    <Button
                      title="Delete"
                      onPress={() => handleDeletePress(item.food_id)}
                    />
                  </View>
                </View>
              )}
            />

            <Text style={{ marginTop: 20, fontSize: 18 }}>
              {editingItem ? "Edit Item" : "Add a New Item"}
            </Text>
            <AddEditItem dbName="food_inventory_RLS" onComplete={fetchPantryItems} editItem={editingItem} editItemSetter={setEditingItem}/> 
          </View>
        </View>
      </ScrollView>
      <Navbar />
    </SafeAreaView>
  );
};

const smallFontSize = 16;
const mediumFontSize = 23;
const LargeFontSize = 30;

const styles = StyleSheet.create({
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
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  scrollView: {
    backgroundColor: "pink",
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

export default PantryScreen;
