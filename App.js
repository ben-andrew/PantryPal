import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import PantryScreen from './screens/PantryScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Pantry">
        <Stack.Screen name="Pantry" component={PantryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
