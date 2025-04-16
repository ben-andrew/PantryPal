import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, ScrollView, SafeAreaView} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import Icon from "react-native-vector-icons/Ionicons";
import { Dimensions } from 'react-native';

const {width, height} = Dimensions.get("window");

const Settings = ({navigation}) => {
   

  useEffect(() => {
    console.log("Settings component loaded and rendered");
  }, []);

return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors = {["#FFA500", "#FFB733"]} style = {styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Pantry")}>
            <Icon name="arrow-back-outline" size={24} color="white" />
        </TouchableOpacity>

        <Text style={styles.headerText}>Settings</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle = {{ flexGrow: 1, paddingBottom: 80}}>

        <View style={styles.recipeContainer}>

            <TouchableOpacity style={styles.userSettingsButton} onPress={() => navigation.navigate("User")}>
            {["User Settings"].map((settings, index) => (
                <View key={index} style={styles.userSettingsCard}>
                <Image source = {require('../assets/usersettings.png')} style = {styles.usersettingsImage} />
                <Text style={styles.settingsText}>{settings}</Text>
                <Text style={styles.settingSubText}>Account Settings, Login Information</Text>
                </View>
            ))}
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingsCategories}>
            {["Ingredient Settings", "Recipe Settings", "Setting 4"].map((settings, index) => (
                <View key={index} style={styles.settingsCard}>
                {settings === "Recipe Settings" && (
                    <>
                    <Image source = {require('../assets/usersettings.png')} style={styles.recipesettingsImage} />
                    <Text style={styles.settingsText}>{settings}</Text>
                    <Text style={styles.setting3SubText}>Recipe Settings, Recommendation Settings</Text>
                    </>
                )}
                {settings === "Ingredient Settings" && (
                    <>
                    <Image source = {require('../assets/usersettings.png')} style={styles.ingredientsettingsImage} />
                    <Text style={styles.settingsText}>{settings}</Text>
                    <Text style={styles.setting2SubText}>Your Ingredients, Add/Remove Ingredients </Text>
                    </>
                )}
                {settings === "Setting 4" && (
                    <>
                    <Image source = {require('../assets/usersettings.png')} style={styles.settingsImage} />
                    <Text style={styles.settingsText}>{settings}</Text>
                    <Text style={styles.setting4SubText}>More Potential Settings </Text>
                    </>
                    )}
            
                </View>
            ))}
            </TouchableOpacity>
        </View>
      </ScrollView>
     
      <View style={styles.navBar}>
        {["home-outline", "list-outline", "scan-outline", "search-outline", "add-outline"].map((icon, index) => (
          <TouchableOpacity key={index} style={styles.navButton} onPress = {icon === "home-outline" ? () => navigation.navigate("Dashboard") : undefined}>
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
      height: 150,
      paddingTop: 50,
      paddingHorizontal: 20,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
      justifyContent: "center",
      marginBottom: 50,
    },

    backButton: {
      position: "absolute",
      top: 90,
      left: 35,
      zIndex: 10
    },

    headerText: {
      fontSize: 30,
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
        fontSize: 13,
        top: 14,
        left: -130,
    },

    setting2SubText: {
        fontSize: 13,
        top: 14,
        left: -185,
    },

    setting3SubText: {
        fontSize: 13,
        top: 14,
        left: -153,
    },

    setting4SubText: {
        fontSize: 13,
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

    settingsText: {
      fontSize: 20,
      top: -13,
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
});

export default Settings;