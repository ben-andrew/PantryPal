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

const { height } = Dimensions.get("window").height;

const PantryScreen = ({ navigation }) => {
  const [ingredients, setIngredients] = useState(["nothing"]);
  const [items, setItems] = useState([]);
  const [ingredientName, setIngredientName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [editingItem, setEditingItem] = useState(null); // Track the item being edited

  // Add buttons to header.
  async function handleLogout() {
    await supabase.auth.signOut();
  }

  async function toShoppingList() {
    navigation.navigate("Cart");
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View
          style={{
            padding: 20,
            flex: 1,
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        >
          <Button title="Logout" onPress={handleLogout} color="red" />
          <Button title="Cart" onPress={toShoppingList} color="yellow" />
        </View>
      ),
    });
  });

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
      console.log("Fetched Items:", data); // Log the data to inspect it
      setItems(data);
    }
  };

  useEffect(() => {
    fetchPantryItems();
    fetchDBIngredients();
  }, []);

  // Function to add a new pantry item
  const addPantryItem = async () => {
    if (!ingredientName || !quantity || !unit) {
      alert("Error", "Please fill in all fields");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    console.log(user);
    const { data, error } = await supabase.from("food_inventory_RLS").insert([
      {
        name: ingredientName,
        quantity: parseInt(quantity),
        unit,
        user_id: user.id,
      },
    ]);

    if (error) {
      console.error("Error inserting data:", error);
      alert("Error", "Failed to add item");
    } else {
      fetchPantryItems();
    }
  };

  // Function to edit an existing pantry item
  const editPantryItem = async () => {
    if (!ingredientName || !quantity || !unit) {
      alert("Error", "Please fill in all fields");
      return;
    }

    const parsedQuantity = parseInt(quantity);

    if (isNaN(parsedQuantity)) {
      alert("Error", "Please enter a valid quantity");
      return;
    }

    const { data, error } = await supabase
      .from("food_inventory_RLS")
      .update([{ name: ingredientName, quantity: parsedQuantity, unit }])
      .eq("food_id", editingItem.food_id); // Update using the correct primary key

    if (error) {
      console.error("Error updating data:", error);
      alert("Error", "Failed to update item");
    } else {
      fetchPantryItems(); // Update list with modified item
      setIngredientName("");
      setQuantity("");
      setUnit("");
      setEditingItem(null); // Reset editing mode
    }
  };

  // Function to handle the item selection for editing
  const handleEditPress = (item) => {
    setIngredientName(item.name);
    setQuantity(
      item.quantity !== undefined && item.quantity !== null ? item.quantity : ""
    );
    setUnit(item.unit);
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
    <SafeAreaView style={{ flex: 1 }}
    contentContainerStyle={{ height: height }}>
      <LinearGradient colors={["#FFA500", "#FFB733"]} style={styles.header}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate("Cart")}
        >
          <Icon name="cart-outline" size={24} color="white" />
        </TouchableOpacity>

        <View style={styles.logoView}>
          <Image
            source={require("../assets/pantrypallogo.png")}
            style={styles.logo}
          />
        </View>

        <Text style={styles.headerText}>Welcome, User!</Text>

        <TouchableOpacity
          style={styles.settingsIconButton}
          onPress={() => navigation.navigate("Settings")}
        >
          <Icon name="settings-outline" size={24} color="white" />
        </TouchableOpacity>

        <Text style={styles.subText}>What will it be today?</Text>

        <View style={styles.searchBar}>
          <TextInput placeholder="Search.." style={styles.searchInput} />
          <Icon
            name="search-outline"
            size={20}
            color="gray"
            style={styles.searchIcon}
          />
        </View>
      </LinearGradient>
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

            <View style={{ padding: 8 }}>
              <Dropdown
                mode="auto"
                value={ingredientName}
                style={styles.textInput}
                placeholderStyle={styles.dropdownPlaceholder}
                data={ingredients}
                labelField="label"
                valueField="value"
                search
                placeholder="Select an Ingredient"
                searchPlaceholder="search an ingredient"
                onChange={(item) => setIngredientName(item.value)}
              />
              <TextInput
                placeholder="Quantity"
                value={quantity || ""} // Set to empty string if quantity is undefined
                onChangeText={setQuantity}
                keyboardType="numeric"
                style={styles.textInput}
              />
              <TextInput
                placeholder="Unit (e.g., pieces, lbs, cups)"
                value={unit}
                onChangeText={setUnit}
                style={styles.textInput}
              />

              <View style={styles.bigButton}>
                {editingItem ? (
                  <Button
                    title="Save Changes"
                    onPress={editPantryItem}
                    style={styles.bigButton}
                  />
                ) : (
                  <Button
                    title="Add Item"
                    onPress={addPantryItem}
                    style={styles.bigButton}
                  />
                )}
              </View>
            </View>
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
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
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

export default PantryScreen;
