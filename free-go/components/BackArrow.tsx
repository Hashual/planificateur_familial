import { router } from "expo-router";
import { StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "./utilities/ThemedText";

export default function BackArrow() {
	return (
		<TouchableOpacity
			style={styles.arrowContainer}
			onPress={() => router.back()}
		>
			<ThemedText variant="title" color="primaryText">
				{"<"}
			</ThemedText>
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	arrowContainer: {
		paddingRight: 20,
		marginLeft: 10,
	},
});