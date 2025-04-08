import React, { useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import { Dimensions } from "react-native";
import Navbar from "../src/components/Navbar";
import PageHeader from "../src/components/PageHeader";

const { width, height } = Dimensions.get("window");

const Dashboard = ({ navigation }) => {
  useEffect(() => {
    console.log("Dashboard component loaded and rendered");
  }, []);

  const recipes = [
    { name: "Salmon", image: require("../assets/salmon.png") },
    { name: "Chicken", image: require("../assets/chicken.png") },
    { name: "Vegan", image: require("../assets/vegan.png") },
    { name: "Pasta", image: require("../assets/pasta.png") },
  ];

  return (
    <SafeAreaView style={styles.dashboardPageContainer}>
      <PageHeader />

      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryContainer}
        >
          {["All", "Lunch", "Dinner", "Vegan", "..."].map((item, index) => (
            <TouchableOpacity key={index} style={styles.categoryButton}>
              <Text style={styles.categoryText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.recipeCardContainer}>
          {recipes.map((recipe, index) => (
            <TouchableOpacity key={index} style={styles.recipeCard}>
                <Image source={recipe.image} style={styles.recipeCardImage} />
                <Text style={styles.recipeCardText}>{recipe.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Navbar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Page container
  dashboardPageContainer: {
    flex: 1,
    backgroundColor: "#f1f1f1",
  },

  // Categories list
  categoryContainer: {
    flexDirection: "row",
    marginTop: 8,
    paddingHorizontal: 20,
  },
  categoryButton: {
    backgroundColor: "#ffffff",
    paddingVertical: 1,
    height: 40,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
    marginTop: 10,
    top: 0,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "bold",
    top: 8,
    color: "#FFA550",
  },

  // Recipe Cards
  recipeCardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    paddingTop: 20,
  },
  recipeCard: {
    width: "45%",
    aspectRatio: 3 / 4,
    height: 190,
    backgroundColor: "white",
    borderRadius: 20,
    marginBottom: 22,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginTop: 10,
  },
  recipeCardImage: {
    maxWidth: 240,
    maxHeight: 80,
    resizeMode: "contain",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginBottom: 20,
    top: -30,
  },
  recipeCardText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: -45,
    alignSelf: "center",
    color: "#FFA500",
  },
  recipeCardAddButton: {
    position: "absolute",
    bottom: 33,
    right: 15,
    color: "#00ff00",
  },
});

export default Dashboard;
