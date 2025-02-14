import { createClient } from '@supabase/supabase-js'
import React, { Component, useEffect, useState } from "react";
import { FlatList, View, Text, Button, ActivityIndicator, StyleSheet } from "react-native";

const supabaseUrl = 'https://ggmvutgkilclpyifbxfx.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY

if (supabaseKey == undefined) {
    throw console.error("no supabase API key! cannot do this!");
    
}

const supabase = createClient(supabaseUrl, supabaseKey)

export default function DbTestScreen() {
    
    useEffect(() => {
        //dostuff
      }, []);


    const DrawScreen = ( <View style={styles.container}>
            <Text style={styles.title}>Today's Recipe Recommendation</Text>
            <Text style={styles.ingredient}>{supabase.from('food_inventory').select('created_at')}</Text>
        </View>
    )

    return DrawScreen;
    
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
    title: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
    recipeTitle: { fontSize: 18, fontWeight: "600", marginVertical: 10 },
    ingredientsTitle: { fontSize: 16, fontWeight: "bold", marginTop: 10 },
    ingredient: { fontSize: 14, marginBottom: 5 },
  });