import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const LoginScreen = ({ navigation }) => {
  console.log("LoginScreen component rendered!");

  return (
    <View style={styles.container}>
      <Text style={styles.startText}>Let’s Start!</Text>

      
      <View style={styles.createAccountBox}>
        <Text style={styles.createAccountText}>Create an Account:</Text>
      </View>

    
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          onChangeText={(text) => console.log("Username input:", text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={(text) => console.log("Password input:", text)} 
        />
      </View>

  
      <TouchableOpacity style={styles.createButton} onPress = {() => navigation.navigate("Dashboard")}>  
        <Text style={styles.createButtonText}>Create</Text>
      </TouchableOpacity>

      <Image 
        source={ require('../assets/pantrypallogo.png') } 
        style={styles.logo} 
      />
      
      <TouchableOpacity style={styles.loginButton} onPress = {() => navigation.navigate("Dashboard")}>
        <Text style = {styles.loginButtonText}>or Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  startText: {
    textAlign: 'center',
    color: '#FDAD33',
    fontSize: 50,
    fontWeight: '600',
    fontStyle: 'italic',
    marginTop: 80,
  },

  createAccountBox: {
    width: 375,
    height: 355,
    backgroundColor: '#F1F1F1',
    borderRadius: 35,
    alignItems: 'center',
    marginTop: 70,
  },

  createAccountText: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: '500',
    color: 'black',
  },

  createButton: {
    backgroundColor: '#FDAD33',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 10,
    top: -100,
  },

  createButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
  },

  loginButton: {
    backgroundColor: '#FDAD33',
    paddingVertical: 13,
    paddingHorizontal: 23,
    borderRadius: 25,
    marginTop: 10,
    top: -140,
  },

  loginButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
  },
  
  logo: {
    width: 78,
    height: 78,
    marginTop: 10,
    top: 50,
  },

  // Positioning the text inputs on top of the gray box
  inputContainer: {
    position: 'absolute', // Positioning absolute inside the container
    top: 340, // Adjust the position based on your design
  },

  input: {
    height: '35%',
    width: '98%',
    marginRight: 230,
    padding: 22,
    borderWidth: 1,
    marginBottom: 10,
    marginTop: 10,
    borderRadius: 35,
    backgroundColor: '#fff',
  },
});

export default LoginScreen;
