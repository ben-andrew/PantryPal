import React from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";

const Dashboard = () => {
  return (
    <View style={styles.container}>
    
      <LinearGradient colors={["#FFA500", "#FFB733"]} style={styles.header}>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="cart-outline" size={24} color="white" />
        </TouchableOpacity>

        <Text style={styles.headerText}>Welcome, Name!</Text>

        <TouchableOpacity style={styles.iconButton}>
          <Icon name="settings-outline" size={24} color="white" />
        </TouchableOpacity>

        <Text style={styles.subText}>What will it be today?</Text>


        <View style={styles.searchBar}>
          <TextInput placeholder="Search.." style={styles.searchInput} />
          <Icon name="search-outline" size={20} color="gray" style={styles.searchIcon} />
        </View>
      </LinearGradient>

      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
        {["All", "Lunch", "Dinner", "Vegan", "..."].map((item, index) => (
          <TouchableOpacity key={index} style={styles.categoryButton}>
            <Text style={styles.categoryText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      
      <View style={styles.recipeContainer}>
        {["Recipe 1", "Recipe 2", "Recipe 3", "Recipe 4"].map((recipe, index) => (
          <View key={index} style={styles.recipeCard}>
            <Text style={styles.recipeText}>{recipe}</Text>
            <TouchableOpacity style={styles.addButton}>
              <Icon name="add-circle-outline" size={24} color="#FFA500" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

     
      <View style={styles.navBar}>
        {["home-outline", "scan-outline", "search-outline"].map((icon, index) => (
          <TouchableOpacity key={index} style={styles.navButton}>
            <Icon name={icon} size={24} color="gray" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightblue",
  },
  
  header: {
    height: 180,
    paddingTop: 50,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  iconButton: {
    position: "absolute",
    top: 50,
  },

  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    alignSelf: "center",
  },

  subText: {
    fontSize: 14,
    color: "white",
    alignSelf: "center",
    marginTop: 5,
  },

  searchBar: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 20,
    marginTop: 15,
    paddingHorizontal: 10,
    alignItems: "center",
  },

  searchInput: {
    flex: 1,
    paddingVertical: 5,
  },

  searchIcon: {
    padding: 10,
  },

  categoryContainer: {
    flexDirection: "row",
    marginTop: 10,
    paddingHorizontal: 20,
  },

  categoryButton: {
    backgroundColor: "#E0E0E0",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
  },

  categoryText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  recipeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    paddingTop: 20,
  },

  recipeCard: {
    width: "40%",
    height: 120,
    backgroundColor: "white",
    borderRadius: 20,
    marginBottom: 15,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  recipeText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },

  addButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },

  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  navButton: {
    padding: 10,
  },
});

export default Dashboard;
