import Header from "@/components/Header";
import { RootView } from "@/components/utilities/RootView";
import { ThemedText } from "@/components/utilities/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View, FlatList, StyleSheet } from "react-native";

const GeneratedMealList = () => {
  const { meals } = useLocalSearchParams();
  const recipeList = typeof meals === 'string' ? JSON.parse(meals) : [];
  const recipes = recipeList.recipes || recipeList;
  const colors = useThemeColor();
  console.log('====================================');
  console.log(meals);
  console.log(typeof meals);
  console.log(recipeList);
  console.log('====================================');

  return (
    <RootView padding={20}>
      <Header title="Propositions de recettes (en cours de développement)" />

      {/* <FlatList
        data={recipeList.recipes}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.recipeContainer}>
            <ThemedText style={styles.recipeTitle}>{item.title || item.name || "titre indiponble"}</ThemedText>

            <ThemedText style={styles.sectionTitle}>Ingrédients :</ThemedText>
            <FlatList
              data={item.ingredients}
              keyExtractor={(ingredient, index) => index.toString()}
              renderItem={({ item: ingredient }) => (
                <ThemedText style={styles.ingredientItem}>
                  - {ingredient.name}
                  {ingredient.quantity ? `: ${ingredient.quantity}` : ""}
                  {ingredient.unit ? ` ${ingredient.unit}` : ""}
                </ThemedText>
              )}
            />

            <ThemedText style={styles.sectionTitle}>Instructions :</ThemedText>
            <FlatList
              data={item.instructions}
              keyExtractor={(instruction, index) => index.toString()}
              renderItem={({ item: instruction, index }) => (
                <View style={[styles.instructionItem, { backgroundColor: colors.elementBackground }]}>
                  <ThemedText style={styles.stepTitle}>Étape {index + 1}</ThemedText>
                  <ThemedText>{instruction}</ThemedText>
                </View>
              )}
            />
          </View>
        )}
      /> */}
      <ThemedText>{meals}</ThemedText>
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

export default GeneratedMealList;