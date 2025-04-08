import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import alert from "../src/scripts/alert";
import supabase from "../src/scripts/supabase";
import { Dimensions } from "react-native";
import Navbar from "../src/components/Navbar"
import PageHeader from "../src/components/PageHeader";
import AddEditItem from "../src/components/AddEditItem";

const { height } = Dimensions.get("window").height;

const CartScreen = ({ navigation }) => {
  // State
  // This is a mess and I need to clean it up...
  const [mealsFromMealDB, setMealsFromMealDB] = useState([
    { name: "nothing", ingredients: [] },
  ]);
  const [cartItems, setCartItems] = useState([]);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [isAddingOrEditing, setIsAddingOrEditing] = useState(false);
  const [recommendedIngredients, setRecommendedIngredients] = useState([]);
  const [loading, setLoading] = useState(true);

  // React Functions
  useEffect(() => {
    console.log("loaded cart screen")
    cartFetchItems();
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
    setItemToEdit(item); // Set the current item being edited
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
      <PageHeader largetext="Cart" subtext="What would you like to buy?" hasIcons={false} hasSearch={false} hasBackButton={true}/>
      <ScrollView>
        <View style={{ alignItems: "center" }}>
          {isAddingOrEditing ? (
            <>
              <AddEditItem onComplete={cartFetchItems} dbName={"cart_RLS"} style={{ padding: 20 }} editItem={itemToEdit} cancelFunction={() => setIsAddingOrEditing(false)}/>
            </>
          ) : (
            <TouchableOpacity onPress={() => setIsAddingOrEditing(true)}>
              <Text style={[styles.yellowButton, { marginTop: 16 }]}>
                Add New Item
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.cartSectionHeaderText}>Cart Items:</Text>
        <FlatList
          scrollEnabled={false}
          contentContainerStyle={styles.itemListContainer}
          data={cartItems}
          keyExtractor={(item) => item.food_id.toString()}
          renderItem={({ item }) => (
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={styles.cartItemListText}>
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

        <Text style={styles.cartSectionHeaderText}>
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
              <Text style={styles.cartItemListText}>{item}</Text>
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
  cartDeleteButton: { paddingLeft: 8, borderWidth: 1 },
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
  cartSectionHeaderText: {
    color: "#FFA500",
    fontSize: mediumFontSize,
    fontWeight: "bold",
    padding: 8,
    paddingBottom: 0,
    paddingLeft: 16,
  },
  cartItemListText: {
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
