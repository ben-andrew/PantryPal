import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import { Dropdown } from "react-native-element-dropdown";
import alert from "../src/alert";
import supabase from "../src/supabase";
import { Dimensions } from "react-native";

const { height } = Dimensions.get("window").height;

const CartScreen = ({ navigation }) => {
  // State
  const [mealDBIngredients, setIngredients] = useState([]);
  const [meals, setMeals] = useState([{ name: "nothing", ingredients: [] }]);
  const [items, setItems] = useState([]);
  const [ingredientName, setIngredientName] = useState("");
  const [quantityEntered, setQuantityEntered] = useState("");
  const [unitEntered, setUnitEntered] = useState("");
  const [editItemEntered, setEditItemEntered] = useState(null);
  const [isAddingOrEditing, setIsAddingOrEditing] = useState(false);
  const [recommendedIngredients, setRecommendedIngredients] = useState([]);
  const [loading, setLoading] = useState(true);

  // React Functions
  useEffect(() => {
    fetchCartItems();
    fetchDBIngredients();
    fetchDBMeals();
  }, []);

  useEffect(() => {
    setRecommendedIngredients(getRecommendedIngredients());
    console.log(recommendedIngredients);
    setLoading(false);
  }, [meals, items]);

  // Navigation Functions
  async function navigateFromIcon(icon) {
    if (icon === "home-outline") navigation.navigate("Pantry");
  }

  // Database Functions

  // Fetch data
  async function fetchCartItems() {
    const { data, error } = await supabase.from("cart_RLS").select("*");
    if (error) {
      console.error("Error fetching data:", error);
    } else {
      console.log("Fetched Items:", data); // Log the data to inspect it
      setItems(data);
    }
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

  const getRecommendedIngredients = () => {
    const list = [];
    const labels = items.map((item) => item.name);
    console.log("meals:", meals);
    for (let meal of meals) {
      console.log("thisMeal", meal);
      for (let ingr of meal.ingredients) {
        if (!labels.includes(ingr)) {
          list.push(ingr);
        }
      }
    }
    console.log("list", list);
    return list;
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
  const fetchDBMeals = async () => {
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
      setMeals([meal]);
    } catch (e) {
      console.log("fetch caught error: ", e);
    }
  };

  // Add/Edit/Delete
  const addCartItemCustom = async () => {
    if (!ingredientName || !quantityEntered || !unitEntered) {
      alert("Error", "Please fill in all fields");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    console.log(user);
    const { data, error } = await supabase.from("cart_RLS").insert([
      {
        name: ingredientName,
        quantity: parseInt(quantityEntered),
        unit: unitEntered,
        user_id: user.id,
      },
    ]);

    if (error) {
      console.error("Error inserting data:", error);
      alert("Error", "Failed to add item");
    } else {
      fetchCartItems();
    }
  };

  const addCartItemRecommended = async (ingr, quant) => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    console.log(user);
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
      fetchCartItems();
    }
    setLoading(false);
  };

  const editCartItem = async () => {
    if (!ingredientName || !quantityEntered || !unitEntered) {
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
        { name: ingredientName, quantity: parsedQuantity, unit: unitEntered },
      ])
      .eq("food_id", editItemEntered.food_id); // Update using the correct primary key

    if (error) {
      console.error("Error updating data:", error);
      alert("Error", "Failed to update item");
    } else {
      fetchCartItems(); // Update list with modified item
      setIngredientName("");
      setQuantityEntered("");
      setUnitEntered("");
      setEditItemEntered(null); // Reset editing mode
    }
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
              .from("cart_RLS")
              .delete()
              .eq("food_id", food_id); // Delete item with matching food_id

            if (error) {
              console.error("Error deleting item:", error);
              alert("Error", "Failed to delete item");
            } else {
              // Remove the deleted item from local state
              fetchCartItems();
              //alert("Success", "Item deleted successfully");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Function to handle the item selection for editing
  const handleEditPress = (item) => {
    setIngredientName(item.name);
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
    <SafeAreaView style={{flex: 1}} contentContainerStyle={{height: height}}>
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
                  value={ingredientName}
                  style={styles.textInput}
                  placeholderStyle={styles.dropdownPlaceholder}
                  data={mealDBIngredients}
                  labelField="label"
                  valueField="value"
                  search
                  placeholder="Select an Ingredient"
                  searchPlaceholder="search an ingredient"
                  onChange={(item) => setIngredientName(item.value)}
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
              <Text style={[styles.yellowButton, {marginTop: 16}]}>Add New Item</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.midSectionHeaderText}>Cart Items:</Text>
        <FlatList
					scrollEnabled={false}
          contentContainerStyle={styles.itemListContainer}
          data={items}
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
                  <Text style={styles.yellowButton}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDeletePress(item.food_id)}
                >
                  <Text style={styles.redButton}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />

        <Text style={styles.midSectionHeaderText}>
          Recommended Items: {meals[0].name}
        </Text>
        <FlatList
					scrollEnabled={false}
          contentContainerStyle={[styles.itemListContainer, { paddingBottom: 75 }]}
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
                    onPress={() => addCartItemRecommended(item, 1)}
                  >
                    <Text style={styles.yellowButton}>Add</Text>
                  </TouchableOpacity>
                ) : (
                  <></>
                )}
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
