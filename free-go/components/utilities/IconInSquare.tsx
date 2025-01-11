import { useThemeColor } from "@/hooks/useThemeColor";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View, StyleSheet } from "react-native";

type IconInSquareProps = {
    listIcon: keyof typeof MaterialCommunityIcons.glyphMap;
    size: number;
}

export default function IconInSquare({listIcon, size} : IconInSquareProps) {
    const colors = useThemeColor();
    const containerStyle = {
        ...styles.logoContainer,
        backgroundColor: colors.logoBackground,
        width: size,
        height: size,
    }
    
    return (
    <View style={containerStyle}>
        <MaterialCommunityIcons name={listIcon} size={24} color={colors.logo} />
    </View>
    )
    
}

const styles = StyleSheet.create({
      logoContainer: {
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 16,
      },
});