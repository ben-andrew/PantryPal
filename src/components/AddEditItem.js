import React, { useState, useEffect } from "react";
import { Text, View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import supabase from "../scripts/supabase";

/**
 * Add or edit an item in the pantry.
 * 
 * This component allows users to add a new item or edit an existing one. It includes fields for ingredient name, quantity, and unit, and provides a dropdown to select ingredients from an external API (MealDB). If `editItem` is provided, it switches to edit mode and updates an existing item.
 * 
 * @param {Object} props - The component props.
 * @param {string} props.dbName - The name of the database table to insert or update the item in.
 * @param {Object} [props.style] - The custom style for the component.
 * @param {Function} props.onComplete - Callback function that is called when an operation (add or edit) is completed.
 * @param {Function} props.cancelFunction - Callback function that is called when operation is canceled.
 * @param {Object} [props.editItem=null] - The item to be edited (if any). Defaults to `null` for adding a new item.
 * 
 * @returns {JSX.Element} The rendered component.
 */
export default function AddEditItem({ dbName, style, onComplete, cancelFunction, editItem: itemToEdit=null }) {
  const [ingredientsFromMealDB, setingredientsFromMealDB] = useState([]);
  const [nameEntered, setNameEntered] = useState("");
  const [quantityEntered, setQuantityEntered] = useState("");
  const [unitEntered, setUnitEntered] = useState("");
 

  useEffect(() => {
    mealDBFetchIngredients();
  }, [])

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

  const addItem = async () => {
    if (!nameEntered || !quantityEntered || !unitEntered) {
      alert("Error", "Please fill in all fields");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    console.log(user);
    const { data, error } = await supabase.from(dbName).insert([
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
      setNameEntered("");
      setQuantityEntered("");
      setUnitEntered("");
      onComplete();
    }
  };

  const editItem = async () => {
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
      .eq("food_id", itemToEdit.food_id); // Update using the correct primary key

    if (error) {
      console.error("Error updating data:", error);
      alert("Error", "Failed to update item");
    } else {
      setNameEntered("");
      setQuantityEntered("");
      setUnitEntered("");
      onComplete();
    }
  };

  return (
    <View style={style}>
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

      <View style={styles.saveOrAddButton}>
        {itemToEdit ? (
          <TouchableOpacity onPress={editItem}>
            <Text style={styles.yellowButton}>Save Changes</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={addItem}>
            <Text style={styles.yellowButton}>Add Item</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={{ paddingTop: 0, alignItems: "center" }}
          text="Cancel"
          onPress={cancelFunction}
        >
          <Text style={styles.redButton}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const smallFontSize = 16;
const mediumFontSize = 23;
const LargeFontSize = 30;

const styles = StyleSheet.create({
  saveOrAddButton: {
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
  dropdownPlaceholder: { fontSize: smallFontSize },
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
