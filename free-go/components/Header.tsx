import { router } from "expo-router";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { ThemedText } from "./utilities/ThemedText";
import BackArrow from "./BackArrow";

type HeaderProps = {
    title: string;
    Component?: React.ComponentType<any>;
};

export default function Header({ title, Component }: HeaderProps) {
    return (
        <View style={styles.container}>
            <BackArrow />
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
    centerItem: {
        flex: 1,
        alignItems: "center",
    },
    component: {
        paddingLeft: 20,
    }
});
