import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, Alert } from 'react-native';
import supabase from '../src/supabase';

const PantryScreen = () => {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [editingItem, setEditingItem] = useState(null); // Track the item being edited

  // Fetch pantry items from Supabase
  const fetchPantryItems = async () => {
    const { data, error } = await supabase.from('food_inventory').select('*');
    if (error) {
      console.error('Error fetching data:', error);
    } else {
      console.log('Fetched Items:', data);  // Log the data to inspect it
      setItems(data);
    }
  };

  useEffect(() => {
    fetchPantryItems();
  }, []);

  // Function to add a new pantry item
  const addPantryItem = async () => {
    if (!name || !quantity || !unit) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const { data, error } = await supabase
      .from('food_inventory')
      .insert([{ name, quantity: parseInt(quantity), unit }]);

    if (error) {
      console.error('Error inserting data:', error);
      Alert.alert('Error', 'Failed to add item');
    } else {
      fetchPantryItems();
    }
  };

  // Function to edit an existing pantry item
  const editPantryItem = async () => {
    if (!name || !quantity || !unit) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
  
    const parsedQuantity = parseInt(quantity);
  
    if (isNaN(parsedQuantity)) {
      Alert.alert('Error', 'Please enter a valid quantity');
      return;
    }
  
    const { data, error } = await supabase
      .from('food_inventory')
      .update([{ name, quantity: parsedQuantity, unit }])
      .eq('food_id', editingItem.food_id); // Update using the correct primary key
  
    if (error) {
      console.error('Error updating data:', error);
      Alert.alert('Error', 'Failed to update item');
    } else {
      fetchPantryItems(); // Update list with modified item
      setName('');
      setQuantity('');
      setUnit('');
      setEditingItem(null); // Reset editing mode
    }
  };

  // Function to handle the item selection for editing
  const handleEditPress = (item) => {
    setName(item.name);
    setQuantity(item.quantity !== undefined && item.quantity !== null ? item.quantity : '');
    setUnit(item.unit);
    setEditingItem(item); // Set the current item being edited
  };

  // Function to delete an item from database
  const handleDeletePress = (food_id) => {
    console.log("pressed delete")
    Alert.alert(
      console.log("In Alert"),
      'Confirm Deletion',
      'Are you sure you want to delete this item?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Delete cancelled'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            const { data, error } = await supabase
              .from('food_inventory')
              .delete()
              .eq('food_id', food_id);  // Delete item with matching food_id
  
            if (error) {
              console.error('Error deleting item:', error);
              Alert.alert('Error', 'Failed to delete item');
            } else {
              // Remove the deleted item from local state
              fetchPantryItems();
              Alert.alert('Success', 'Item deleted successfully');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Pantry Items:</Text>
      
      <FlatList
        data={items}
        keyExtractor={(item) => item.food_id.toString()}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text>{item.name} - {item.quantity} {item.unit}</Text>
            <Button title="Edit" onPress={() => handleEditPress(item)} />
          </View>
        )}
      />

      <Text style={{ marginTop: 20, fontSize: 18 }}>{editingItem ? 'Edit Item' : 'Add a New Item'}</Text>

      <TextInput
        placeholder="Item Name"
        value={name}
        onChangeText={setName}
        style={{ borderWidth: 1, padding: 8, marginVertical: 5 }}
      />

      <TextInput
        placeholder="Quantity"
        value={quantity || ''}  // Set to empty string if quantity is undefined
        onChangeText={setQuantity}
        keyboardType="numeric"
        style={{ borderWidth: 1, padding: 8, marginVertical: 5 }}
      />

      <TextInput
        placeholder="Unit (e.g., pieces, lbs, cups)"
        value={unit}
        onChangeText={setUnit}
        style={{ borderWidth: 1, padding: 8, marginVertical: 5 }}
      />

      {editingItem ? (
        <Button title="Save Changes" onPress={editPantryItem} />
      ) : (
        <Button title="Add Item" onPress={addPantryItem} />
      )}

      {items.map((item) => (
        <View key={item.food_id} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text>{item.name} - {item.quantity} {item.unit}</Text>
          <Button title="Delete" onPress={() => handleDeletePress(item.food_id)} />
        </View>
      ))}
    </View>
  );
};

export default PantryScreen;
