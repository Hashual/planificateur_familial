import { useThemeColor } from "@/hooks/useThemeColor";
import { View, Image, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { ThemedText } from "../utilities/ThemedText";
import { useState } from "react";

const RecipeItem = ({ recipe }: { recipe: any }) => {
    const colors = useThemeColor();
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    return (
        <View style={[styles.card, {backgroundColor: colors.elementBackground}]}>
            {!imageLoaded && <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />}
            <Image source={imageError ? {uri : "https://st4.depositphotos.com/14953852/24787/v/450/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg"}:{ uri: recipe.pictureUrl }} 
            onLoad={() => setImageLoaded(true)}
            onError={() => {
                setImageError(true);
                setImageLoaded(true); // Pour cacher le loader en cas d'erreur
            }}
            style={styles.image} 
            />
            <ThemedText variant="title">{recipe.title}</ThemedText>
            <ThemedText variant="subtitle">Ingrédients :</ThemedText>
            <ThemedText style={{marginBottom: 15}}>{recipe.ingredients.join(', ')}</ThemedText>
            <ThemedText variant="subtitle">Étapes :</ThemedText>
            <FlatList 
                nestedScrollEnabled={true}
                data={recipe.steps} 
                renderItem={({ item, index }) => <ThemedText  style={{marginBottom: 5}}>{index + 1}. {item}</ThemedText>} 
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        padding: 10,
        margin: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3
    },
    loader: { 
        position: 'absolute', 
        top: '20%', 
        left: '50%', 
        transform: [{ translateX: -25 }, { translateY: -25 }] 
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
    },
});

export default RecipeItem;
