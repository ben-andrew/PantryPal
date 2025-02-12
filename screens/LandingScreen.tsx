import React, { Component, useEffect, useState } from "react";
import { FlatList, View, Text, Button, ActivityIndicator, StyleSheet } from "react-native";

type Recipe = {
  title: string;
  ingredients: string[];
};

export default function LandingScreen() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [recipeList, setRecipeList] = useState<Recipe[]>([]);
  const [meal, setMeal] = useState<any>(null); 

  useEffect(() => {
    fetchRecipe();
  }, []);

  const fetchRecipe = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
      const data = await res.json();
      setMeal(data.meals[0]);

      setRecipe({
        title: meal["strMeal"],
        ingredients: Object.keys(meal)
          .filter((key) => key.startsWith("strIngredient") && meal[key])
          .map((key) => meal[key]),
      });
    } catch (error) {
      console.error("Error fetching recipe:", error);
    }
    setLoading(false);
  };

  const displayList = recipeList?.map((value, index) => (
    <Text key={index} style={styles.ingredient}>
      • {value.title}
    </Text>
  ))

  //function isn't repainting the page
  const addRecipe = async () => {
    //adding a null check lets us just use it as a recipe type
    const thisRec = recipe;
    if (thisRec != null && !recipeList.includes(thisRec)) {
        setRecipeList([...recipeList, thisRec]);
    }
  };

  const clearList = async () => {
    if (recipe != null) {
        setRecipeList([]);
    }
  }

  const DrawScreen = ( <View style={styles.container}>
    <Text style={styles.title}>Today's Recipe Recommendation</Text>
    {loading ? (
        <ActivityIndicator size="large" color="#00009ff" />
    ) : (
        <>
        <Text style={styles.recipeTitle}>{recipe?.title}</Text>
        <Text style={styles.ingredientsTitle}>Ingredients:</Text>
        {recipe?.ingredients.map((ing, index) => (
            <Text key={index} style={styles.ingredient}>
            • {ing}
            </Text>
        ))}
        <Button title="Get Another Recipe" onPress={fetchRecipe} />
        <Button title="Add recipe to List" onPress={addRecipe} />
        <Button title="clear list" onPress={clearList}/>
        {displayList}
        </>
    )}
    </View>
  )

  return DrawScreen;
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
  recipeTitle: { fontSize: 18, fontWeight: "600", marginVertical: 10 },
  ingredientsTitle: { fontSize: 16, fontWeight: "bold", marginTop: 10 },
  ingredient: { fontSize: 14, marginBottom: 5 },
});
