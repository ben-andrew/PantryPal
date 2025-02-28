import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const LoginScreen = ({ navigation }) => {

  console.log("LoginScreen component rendered!");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login to PantryPal!</Text>
      <TextInput style={styles.input} placeholder="Username"
        onChangeText={(text) => console.log("Username input:", text)}
      />
      <TextInput style={styles.input} placeholder="Password"
        onChangeText={(text) => console.log("Password input:", text)} />
      <Button
        title="Login"
        onPress={() => {
          console.log("Login button pressed!");
          navigation.navigate("Dashboard", { username: "test"});
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    backgroundColor: '#fff',
  },

  title: {
    fontSize: 23,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  input: {
    width: '50%',
    padding: 15,
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 5,
  },
}); 

export default LoginScreen;