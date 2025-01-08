import { router } from "expo-router"
import { TouchableOpacity, View, StyleSheet } from "react-native"
import { ThemedText } from "./utilities/ThemedText"

type HeaderProps = {
    title: string;
    Component?: React.ComponentType<any>;
}

export default function Header({title, Component}:HeaderProps) {
    return (
        <View style={[styles.titleContainer, !Component && styles.centered]}>
            <TouchableOpacity
                style={[styles.arrowContainer, !Component && styles.arrowWhitoutComponent]}
                onPress={() => router.back()}
            >
                <ThemedText variant="title" color="primaryText">
                    {"<"}
                </ThemedText>
            </TouchableOpacity>
            <ThemedText variant="title" color="primaryText">
                {title}
            </ThemedText>
            {Component && <Component />}
        </View>
    )
}

const styles = StyleSheet.create({
    titleContainer: {
        justifyContent: "space-around",
        alignContent: "center",
        flexDirection: "row",
    },
    centered: {
        justifyContent: 'center', // Si pas de Component, centre les éléments
    },
    arrowContainer: {
        paddingRight: 10,
    },
    arrowWhitoutComponent: {
        position: 'absolute',
        left: 5,
    },
});