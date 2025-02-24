import Header from "@/components/Header";
import { RootView } from "@/components/utilities/RootView";
import { ThemedText } from "@/components/utilities/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View, FlatList, StyleSheet } from "react-native";

const GeneratedMealList = () => {
  const { recettes } = useLocalSearchParams();
  const recipeList = typeof recettes === 'string' ? JSON.parse(recettes) : [];
  const colors = useThemeColor();
  console.log('====================================');
  console.log(recettes);
  console.log(typeof recettes);
  console.log(recipeList);
  console.log('====================================');

  return (
    <RootView padding={20}>
      <Header title={"Propositions de recettes"} />

      <FlatList
        data={recipeList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.recipeContainer}>
            <ThemedText style={styles.recipeTitle}>{item.nom_recette}</ThemedText>

            <ThemedText style={styles.sectionTitle}>Ingrédients :</ThemedText>
            <FlatList
              data={item.ingredients}
              keyExtractor={(ingredient, index) => index.toString()}
              renderItem={({ item: ingredient }) => (
                <ThemedText style={styles.ingredientItem}>
                  - {ingredient.ingredient}: {ingredient.quantite}
                </ThemedText>
              )}
            />

            <ThemedText style={styles.sectionTitle}>Instructions :</ThemedText>
            <FlatList
              data={item.instructions}
              keyExtractor={(instruction) => instruction.step.toString()}
              renderItem={({ item: instruction }) => (
                <View style={[styles.instructionItem, { backgroundColor: colors.elementBackground }]}>
                  <ThemedText style={styles.stepTitle}>Étape {instruction.step}</ThemedText>
                  <ThemedText>{instruction.description}</ThemedText>
                </View>
              )}
            />
          </View>
        )}
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

export default GeneratedMealList;