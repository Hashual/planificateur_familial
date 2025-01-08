import { router } from "expo-router";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { ThemedText } from "./utilities/ThemedText";

type HeaderProps = {
    title: string;
    Component?: React.ComponentType<any>;
};

export default function Header({ title, Component }: HeaderProps) {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.arrowContainer}
                onPress={() => router.back()}
            >
                <ThemedText variant="title" color="primaryText">
                    {"<"}
                </ThemedText>
            </TouchableOpacity>
            <ThemedText
                style={styles.centerItem}
                variant="title"
                color="primaryText"
            >
                {title}
            </ThemedText>
            {Component && <Component style={styles.component} />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignContent: "flex-start",
        flexDirection: "row",
    },
    arrowContainer: {
        paddingRight: 20,
    },
    centerItem: {
        flex: 1,
        alignItems: "center",
    },
    component: {
        paddingLeft: 20,
    }
});
