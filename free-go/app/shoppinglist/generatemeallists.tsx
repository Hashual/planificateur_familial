import Header from "@/components/Header";
import { RootView } from "@/components/utilities/RootView";
import { ThemedText } from "@/components/utilities/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View, FlatList, StyleSheet } from "react-native";



  const GeneratedMealList = () => {
    const { meals } = useLocalSearchParams();
    const mealList = typeof meals === 'string' ? JSON.parse(meals) : [];
    const colors = useThemeColor();
    return (
      <RootView padding={20}>
        <Header title={"Proposition de repas"} />
        <FlatList
          data={mealList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={[styles.mealItem, {backgroundColor: colors.elementBackground}]}>
              <ThemedText style={styles.mealTitle}>{item.title}</ThemedText>
              <ThemedText style={styles.mealText}>{item.description}</ThemedText>
              <ThemedText style={styles.mealIngredients}>Ingrédients: {item.ingredients.join(", ")}</ThemedText>
            </View>
          )}
        />
      </RootView>
    );
  };
  
  const styles = StyleSheet.create({
    mealItem: {
      padding: 15,
      marginVertical: 10,
      borderRadius: 20,
    },
    mealTitle: {
      fontSize: 20,
      fontWeight: "bold",
    },
    mealText: {
      fontSize: 16,
      marginTop: 5,
    },
    mealIngredients: {
      fontSize: 14,
      fontStyle: "italic",
      marginTop: 5,
    },
  });
  
  export default GeneratedMealList;