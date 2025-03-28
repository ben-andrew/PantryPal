import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import { Dropdown } from "react-native-element-dropdown";
import alert from "../src/scripts/alert";
import supabase from "../src/scripts/supabase";
import { Dimensions } from "react-native";
import Navbar from "../src/components/Navbar"

const { height } = Dimensions.get("window").height;

const CartScreen = ({ navigation }) => {
  // State
  // This is a mess and I need to clean it up...
  const [ingredientsFromMealDB, setingredientsFromMealDB] = useState([]);
  const [mealsFromMealDB, setMealsFromMealDB] = useState([
    { name: "nothing", ingredients: [] },
  ]);
  const [cartItems, setCartItems] = useState([]);
  const [nameEntered, setNameEntered] = useState("");
  const [quantityEntered, setQuantityEntered] = useState("");
  const [unitEntered, setUnitEntered] = useState("");
  const [editItemEntered, setEditItemEntered] = useState(null);
  const [isAddingOrEditing, setIsAddingOrEditing] = useState(false);
  const [recommendedIngredients, setRecommendedIngredients] = useState([]);
  const [loading, setLoading] = useState(true);

  // React Functions
  useEffect(() => {
    cartFetchItems();
    mealDBFetchIngredients();
    mealDBFetchRandomMeal();
  }, []);

  useEffect(() => {
    setRecommendedIngredients(getRecommendedIngredients());
    console.log(recommendedIngredients);
    setLoading(false);
  }, [mealsFromMealDB]);

  // Database Functions

  // Fetch data
  async function cartFetchItems() {
    const { data, error } = await supabase.from("cart_RLS").select("*");
    if (error) {
      console.error("Error fetching data:", error);
    } else {
      console.log("Fetched Items:", data); // Log the data to inspect it
      setCartItems(data);
    }
  }

  const mealDBFetchIngredients = async () => {
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
    setingredientsFromMealDB(newIngr);
  };

  const getRecommendedIngredients = () => {
    const ingredientList = new Set();
    const ingredientLabels = new Set(cartItems.map((item) => item.name));
    for (let meal of mealsFromMealDB) {
      for (let ingr of meal.ingredients) {
        if (!ingredientLabels.has(ingr)) {
          ingredientList.add(ingr);
        }
      }
    }
    return Array.from(ingredientList);
  };

  const extractIngredients = (meal) => {
    const list = [];
    for (let i = 1; i <= 20; i++) {
      const key = "strIngredient" + i;
      if (meal[key] && meal[key] !== "") {
        list.push(meal[key]);
      }
    }
    return list;
  };

  // Only fetches one meal right now, for testing!
  const mealDBFetchRandomMeal = async () => {
    try {
      const res = await fetch(
        "https://www.themealdb.com/api/json/v1/1/random.php"
      );
      const data = (await res.json()).meals[0];
      const meal = {
        name: data.strMeal,
        ingredients: extractIngredients(data),
      };
      console.log("meal:", meal);
      setMealsFromMealDB([meal]);
    } catch (e) {
      console.log("fetch caught error: ", e);
    }
  };

  // Add/Edit/Delete
  const removeIngredientFromRecommendedIngredients = (ingr) => {
    console.log(ingr);
    const newList = recommendedIngredients.filter((item) => item != ingr)
    setRecommendedIngredients(newList);
  }

  const addCartItemCustom = async () => {
    if (!nameEntered || !quantityEntered || !unitEntered) {
      alert("Error", "Please fill in all fields");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    console.log(user);
    const { data, error } = await supabase.from("cart_RLS").insert([
      {
        name: nameEntered,
        quantity: parseInt(quantityEntered),
        unit: unitEntered,
        user_id: user.id,
      },
    ]);

    if (error) {
      console.error("Error inserting data:", error);
      alert("Error", "Failed to add item");
    } else {
      cartFetchItems();
    }
  };

  const addCartItemFromRecommended = async (ingr, quant) => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { data, error } = await supabase.from("cart_RLS").insert([
      {
        name: ingr,
        quantity: quant,
        unit: "servings",
        user_id: user.id,
      },
    ]);

    if (error) {
      console.error("Error inserting data:", error);
      alert("Error", "Failed to add item");
    } else {
      cartFetchItems();
      removeIngredientFromRecommendedIngredients(ingr);
    }
    setLoading(false);
  };

  const editCartItem = async () => {
    if (!nameEntered || !quantityEntered || !unitEntered) {
      alert("Error", "Please fill in all fields");
      return;
    }

    const parsedQuantity = parseInt(quantityEntered);

    if (isNaN(parsedQuantity)) {
      alert("Error", "Please enter a valid quantity");
      return;
    }

    const { data, error } = await supabase
      .from("cart_RLS")
      .update([
        { name: nameEntered, quantity: parsedQuantity, unit: unitEntered },
      ])
      .eq("food_id", editItemEntered.food_id); // Update using the correct primary key

    if (error) {
      console.error("Error updating data:", error);
      alert("Error", "Failed to update item");
    } else {
      cartFetchItems(); // Update list with modified item
      setNameEntered("");
      setQuantityEntered("");
      setUnitEntered("");
      setEditItemEntered(null); // Reset editing mode
    }
  };

  // Function to delete an item from database
  const handleDeletePress = async (food_id) => {
    const { data, error } = await supabase
      .from("cart_RLS")
      .delete()
      .eq("food_id", food_id); // Delete item with matching food_id

    if (error) {
      console.error("Error deleting item:", error);
      alert("Error", "Failed to delete item");
    } else {
      // Remove the deleted item from local state
      cartFetchItems();
      //alert("Success", "Item deleted successfully");
    }
  };

  // Function to handle the item selection for editing
  const handleEditPress = (item) => {
    setNameEntered(item.name);
    setQuantityEntered(
      item.quantity !== undefined && item.quantity !== null ? item.quantity : ""
    );
    setUnitEntered(item.unit);
    setEditItemEntered(item); // Set the current item being edited
    setIsAddingOrEditing(true);
  };

  // Handle ingredient conversions.
  // For now these are just wrappers!
  // First we convert to globs(global units), then convert to the unit.
  function unitToGlobs(quantity, currentUnit) {
    // Haven't figured out the solution to this yet, just going to do servings for now.
    return quantity;
  }

  function globsToUnit(quantity, targetUnit) {
    // TODO
    return quantity;
  }

  return (
    <SafeAreaView
      style={{ flex: 1 }}
      contentContainerStyle={{ height: height }}
    >
      <LinearGradient colors={["#FFA500", "#FFB733"]} style={styles.header}>
        <Text style={styles.headerText}>Shopping List</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back-outline" size={30} color="white" />
        </TouchableOpacity>
      </LinearGradient>
      <ScrollView>
        <View style={{ alignItems: "center" }}>
          {isAddingOrEditing ? (
            <>
              <View style={{ padding: 8 }}>
                <Dropdown
                  mode="auto"
                  value={nameEntered}
                  style={styles.textInput}
                  placeholderStyle={styles.dropdownPlaceholder}
                  data={ingredientsFromMealDB}
                  labelField="label"
                  valueField="value"
                  search
                  placeholder="Select an Ingredient"
                  searchPlaceholder="search an ingredient"
                  onChange={(item) => setNameEntered(item.value)}
                />
                <TextInput
                  placeholder="Quantity"
                  placeholderStyle={styles.textInput}
                  value={quantityEntered || ""} // Set to empty string if quantity is undefined
                  onChangeText={setQuantityEntered}
                  keyboardType="numeric"
                  style={styles.textInput}
                />
                <TextInput
                  placeholder="Unit (e.g., pieces, lbs, cups)"
                  value={unitEntered}
                  onChangeText={setUnitEntered}
                  style={styles.textInput}
                />

                <View style={styles.middleButton}>
                  {editItemEntered ? (
                    <TouchableOpacity onPress={editCartItem}>
                      <Text style={styles.yellowButton}>Save Changes</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity onPress={addCartItemCustom}>
                      <Text style={styles.yellowButton}>Add Item</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={{ paddingTop: 0, alignItems: "center" }}
                    text="Cancel"
                    onPress={() => setIsAddingOrEditing(false)}
                  >
                    <Text style={styles.redButton}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          ) : (
            <TouchableOpacity onPress={() => setIsAddingOrEditing(true)}>
              <Text style={[styles.yellowButton, { marginTop: 16 }]}>
                Add New Item
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.midSectionHeaderText}>Cart Items:</Text>
        <FlatList
          scrollEnabled={false}
          contentContainerStyle={styles.itemListContainer}
          data={cartItems}
          keyExtractor={(item) => item.food_id.toString()}
          renderItem={({ item }) => (
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={styles.itemListText}>
                {item.name} - {item.quantity} {item.unit}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  gap: 16,
                }}
              >
                <TouchableOpacity onPress={() => handleEditPress(item)}>
                <Icon style={styles.yellowButton} name="hammer-outline" size ={24}/>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDeletePress(item.food_id)}
                >
                  <Icon style={styles.redButton} name="remove-circle-outline" size ={24}/>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />

        <Text style={styles.midSectionHeaderText}>
          Recommended Items: {mealsFromMealDB[0].name}
        </Text>
        <FlatList
          scrollEnabled={false}
          contentContainerStyle={[
            styles.itemListContainer,
            { paddingBottom: 75 },
          ]}
          data={recommendedIngredients}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={styles.itemListText}>{item}</Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  gap: 16,
                }}
              >
                 {!loading ? (
                  <TouchableOpacity
                    onPress={() => addCartItemFromRecommended(item, 1)}
                  >
                    <Icon style={styles.yellowButton} name="add-circle-outline" size ={24}/>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={() => {return}/** Handle loading */}>
                    <Icon style={styles.yellowButton} name="add-circle-outline" size ={24}/>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        />
      </ScrollView>

      <Navbar/>
    </SafeAreaView>
  );
};

const smallFontSize = 16;
const mediumFontSize = 23;
const LargeFontSize = 30;

const styles = StyleSheet.create({
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
  header: {
    height: 90,
    paddingTop: 10,
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

export default CartScreen;
