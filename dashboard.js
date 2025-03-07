import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, ScrollView, SafeAreaView} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import Icon from "react-native-vector-icons/Ionicons";
import { Dimensions } from 'react-native';


const {width, height} = Dimensions.get("window");

const Dashboard = ({ navigation}) => {
  useEffect(() => {
    console.log("Dashboard component loaded and rendered");
  }, []);

  const recipes = [
    { name: "Salmon", image: require('../assets/salmon.png') },
    { name: "Chicken", image: require('../assets/chicken.png') },
    { name: "Vegan", image: require('../assets/vegan.png') },
    { name: "Pasta", image: require('../assets/pasta.png') },
  ];

  return (
    <SafeAreaView style={styles.container}>
    
      <LinearGradient colors = {["#FFA500", "#FFB733"]} style = {styles.header}>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="cart-outline" size={24} color="white" />
        </TouchableOpacity>

        <Image 
          source={ require('../assets/pantrypallogo.png') } style={styles.logo} 
        />

        <Text style={styles.headerText}>Welcome, User!</Text>

        <TouchableOpacity style={styles.settingsIconButton} onPress={() => navigation.navigate("Settings")}>
          <Icon name="settings-outline" size={24} color="white" />
        </TouchableOpacity>

        <Text style={styles.subText}>What will it be today?</Text>


        <View style={styles.searchBar}>
          <TextInput placeholder="Search.." style={styles.searchInput} />
          <Icon name="search-outline" size={20} color="gray" style={styles.searchIcon} />
        </View>
      </LinearGradient>
     
      <ScrollView contentContainerStyle = {{ flexGrow: 1, paddingBottom: 80}}>
        <ScrollView horizontal showsHorizontalScrollIndicator = {false} style = {styles.categoryContainer}>
          {["All", "Lunch", "Dinner", "Vegan", "..."].map((item, index) => (
            <TouchableOpacity key={index} style={styles.categoryButton}>
              <Text style={styles.categoryText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.recipeContainer}>{recipes.map((recipe, index) => (
          <View key={index} style={styles.recipeCard}>
            <Image source={recipe.image} style={styles.recipeImage} />
              <Text style={styles.recipeText}>{recipe.name}</Text>
            <TouchableOpacity style={styles.addButton}>
              <Icon name="add-circle-outline" size={24} color="#FFA500" />
            </TouchableOpacity>
          </View>
          ))}
        </View>
      </ScrollView>
     
      <View style={styles.navBar}>
        {["home-outline", "list-outline", "scan-outline", "search-outline", "add-outline"].map((icon, index) => (
          <TouchableOpacity key={index} style={styles.navButton}>
            <Icon name={icon} size={24} color="#FFA500" />
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
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
    top: 65,
    height: 35,
    width: 35,
    left: "55%",
    marginLeft: -17.5,
    
  },
  iconButton: {
    position: "absolute",
    top: 70,
    marginLeft: 30,
  },

  settingsIconButton: {
    position: "absolute",
    top: 70,
    right: 20,
    marginLeft: -20,
    
  },

  headerText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
    alignSelf: "left",
    marginTop: 70,
    marginBottom: 0,
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
  recipeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    paddingTop: 20,
  },

  recipeCard: {
    width: "45%",
    aspectRatio: 3/4,
    height: 190,
    backgroundColor: "white",
    borderRadius: 20,
    marginBottom: 22,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    elevation:5,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginTop: 10,
  },

  recipeImage: {
    width: 120,
    height: 120,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginBottom: 20,
    top: -30,
  },

  recipeText: {
    top: -20,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: -45,
    marginRight: 65,
    color: "#FFA500"
  },

  addButton: {
    position: "absolute",
    bottom: 33,
    right: 15,
    color: "#00ff00",
  },

  navBar: {
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
    elevation:5,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: "80%",
    alignSelf: "center",
    borderRadius: 30,
  },
  navButton: {
    padding: 10,
    color: "#ffffff"
  },
});

export default Dashboard;
