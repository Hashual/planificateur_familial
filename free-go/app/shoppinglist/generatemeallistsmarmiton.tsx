import Header from "@/components/Header";
import RecipeItem from "@/components/shoppinglist/RecipeItem";
import { RootView } from "@/components/utilities/RootView";
import { ThemedText } from "@/components/utilities/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View, FlatList, StyleSheet, ScrollView } from "react-native";

const GeneratedMealListMarmiton = () => {
  const { meals } = useLocalSearchParams();
  const recipeList = typeof meals === 'string' ? JSON.parse(meals) : [];
  const recipes = recipeList.recipes || recipeList;
  const colors = useThemeColor();
  console.log('====================================');
  console.log(meals);
  console.log(typeof meals);
  console.log(recipeList);
  console.log('====================================');

  if (!recipes) {
    return (
      <RootView padding={20}>
        <Header title="Propositions de recettes (Marmiton)" />
        <ThemedText>Aucune recette trouvée</ThemedText>
      </RootView>
    );
  }

  return (
    <RootView padding={20}>
      <Header title="Propositions de recettes (Marmiton)" />
        <FlatList 
                nestedScrollEnabled={true}
                data={recipes} 
                renderItem={({ item }) => <RecipeItem recipe={item} />} 
                keyExtractor={(item, index) => index.toString()} 
            />
    </RootView>
  );
};

const styles = StyleSheet.create({
  recipeContainer: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 15,
  },
  recipeTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 15,
  },
  ingredientItem: {
    fontSize: 16,
    marginVertical: 3,
  },
  instructionItem: {
    padding: 15,
    marginVertical: 10,
    borderRadius: 20,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
});

export default GeneratedMealListMarmiton;