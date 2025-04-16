import React from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Stat,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";

export default function PageHeader({
  largetext = "Welcome, User!",
  subtext = "What will it be today?",
  hasIcons = true, // Choose this or the back button.
  hasSearch = true,
  hasBackButton = false, // Choose this or the icons preferably.
}) {
  const navigation = useNavigation();
  const iconSize = 24;
  const CartIcon = () => {
    if (hasIcons) {
      return (
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate("Cart")}
        >
          <Icon name="cart-outline" size={iconSize} color="white" />
        </TouchableOpacity>
      );
    } else return <></>;
  };

  const SettingsIcon = () => {
    if (hasIcons) {
      return (
        <TouchableOpacity
          style={styles.settingsIconButton}
          onPress={() => navigation.navigate("Settings")}
        >
          <Icon name="settings-outline" size={iconSize} color="white" />
        </TouchableOpacity>
      );
    } else return <></>;
  };

  const SearchBar = () => {
    if (hasSearch) {
      return (
        <View style={styles.searchBar}>
          <TextInput placeholder="Search.." style={styles.searchInput} />
          <Icon
            name="search-outline"
            size={20}
            color="gray"
            style={styles.searchIcon}
          />
        </View>
      );
    } else return <></>;
  };

  const BackButton = () => {
    if (hasBackButton) {
      return (
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back-outline" size={iconSize} color="white" />
        </TouchableOpacity>
      );
    } else return <></>;
  };

  return (
    <LinearGradient colors={["#FFA500", "#FFB733"]} style={styles.header}>
      <CartIcon />
      <BackButton />
      <SettingsIcon />
      <View style={styles.logoView}>
        <Image
          source={require("../../assets/pantrypallogo.png")}
          style={styles.logo}
        />
      </View>
      <Text style={styles.headerText}>{largetext}</Text>
      <Text style={styles.subText}>{subtext}</Text>
      <SearchBar />
    </LinearGradient>
  );
}

const smallFontSize = 16;
const mediumFontSize = 23;
const LargeFontSize = 30;

const styles = StyleSheet.create({
  header: {
    paddingTop: 10,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    justifyContent: "center",
  },
  headerText: {
    fontSize: LargeFontSize,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  subText: {
    fontSize: 20,
    color: "white",
    alignSelf: "center",
    marginTop: -1,
    marginBottom: 10,
  },
  iconButton: {
    zIndex: 1,
    position: "absolute",
    top: 70,
    marginLeft: 20,
  },
  settingsIconButton: {
    zIndex: 1,
    position: "absolute",
    top: 70,
    right: 20,
  },
  logo: {
    resizeMode: "cover",
    aspectRatio: "1",
    width: 40,
    height: 40,
  },
  logoView: {
    marginTop: 20,
    alignItems: "center",
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
    fontSize: smallFontSize,
    flex: 1,
    paddingVertical: 5,
  },
  searchIcon: {
    padding: 10,
  },
  backButton: {
    position: "absolute",
    top: 35,
    left: 35,
  },
});
