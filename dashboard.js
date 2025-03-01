import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import Icon from "react-native-vector-icons/Ionicons";

const Dashboard = () => {
  useEffect(() => {
    console.log("Dashboard component loaded and rendered");
  }, []);

  return (
    <View style={styles.container}>
    
      <LinearGradient colors={["#FFA500", "#FFB733"]} style={styles.header}>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="cart-outline" size={24} color="white" />
        </TouchableOpacity>

        <Image 
          source={ require('../assets/pantrypallogo.png') } style={styles.logo} 
        />

        <Text style={styles.headerText}>Welcome, User!</Text>

        <TouchableOpacity style={styles.settingsIconButton}>
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
        {["home-outline", "list-outline", "scan-outline", "search-outline", "add-outline"].map((icon, index) => (
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
    backgroundColor: "#f1f1f1",
  },
  
  header: {
    height: 265,
    paddingTop: 50,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
  },

  logo: {
    position: "absolute",
    top: 70,
    height: 35,
    width: 35,
    marginLeft: 186,
  },
  iconButton: {
    position: "absolute",
    top: 70,
    marginLeft: 30,
  },

  settingsIconButton: {
    position: "absolute",
    top: 60,
    marginLeft: 350,
    marginTop: 10,
  },

  headerText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
    alignSelf: "left",
    marginTop: 80,
    marginBottom: 0,
  },

  subText: {
    fontSize: 20,
    color: "white",
    alignSelf: "left",
    marginTop: -1,
  },

  searchBar: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 30,
    marginTop: 15,
    marginLeft: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    height: 55,
    width: 350,
    top: 17,
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
    backgroundColor: "#ffffff",
    paddingVertical: 1,
    height: 40,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
    top: 23,
  },

  categoryText: {
    fontSize: 14,
    fontWeight: "bold",
    top: 6,
  },
  recipeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    paddingTop: 20,
  },

  recipeCard: {
    width: "40%",
    height: 190,
    backgroundColor: "white",
    borderRadius: 20,
    marginBottom: 42,
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
    marginBottom: -95,
    marginRight: 65,
  },

  addButton: {
    position: "absolute",
    bottom: 35,
    right: 10,
  },

  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    top: -20,
    width: 340,
    marginLeft: 38,
    borderRadius: 30,
  },
  navButton: {
    padding: 10,
  },
});

export default Dashboard;
