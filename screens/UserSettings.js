import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, StyleSheet, Alert } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import Icon from "react-native-vector-icons/Ionicons";
import { Dimensions } from 'react-native';

const {width, height} = Dimensions.get("window");

const UserSettings = ({ navigation }) => {
    const [email, setEmail] = useState("user@example.com"); // Placeholder email
    const [language, setLanguage] = useState("English");

    useEffect(() => {
        console.log("UserSettings component loaded and rendered");
    }, []);

    const handleResetPassword = () => {
        Alert.alert("Password reset", "Password reset link sent to your email.");
    };

    const handleLanguageChange = () => {
        setLanguage(language === "English" ? "Spanish" : "English");
        Alert.alert("Language changed", `Language set to ${language}.`);
    };

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={["#FFA500", "#FFB733"]} style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back-outline" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerText}>User Settings</Text>
            </LinearGradient>

            <View style={styles.contentContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput style={styles.input} value={email} editable={false} />

                <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
                    <Text style={styles.buttonText}>Reset Password</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={handleLanguageChange}>
                    <Text style={styles.buttonText}>Change Language ({language})</Text>
                </TouchableOpacity>
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
        marginBottom: 20,
    },
    backButton: {
        position: "absolute",
        top: 90,
        left: 35,
    },
    headerText: {
        fontSize: 30,
        fontWeight: "bold",
        color: "white",
        textAlign: "center",
    },
    contentContainer: {
        padding: 20,
    },
    label: {
        fontSize: 18,
        marginBottom: 5,
    },
    input: {
        backgroundColor: "white",
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
    },
    button: {
        backgroundColor: "#FFA500",
        borderRadius: 10,
        padding: 15,
        alignItems: "center",
        marginBottom: 15,
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default UserSettings;
