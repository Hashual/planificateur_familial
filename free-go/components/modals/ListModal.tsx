import { ThemedButton } from "@/components/utilities/ThemedButton";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Modal, View, StyleSheet, TextInput } from "react-native";
import { ThemedText } from "../utilities/ThemedText";

type ListModalProps = {
	isNewList?: boolean;
	isModalVisible: boolean;
	closeModal: () => void;
	listNameInput: string;
	setListNameInput: (value: string) => void;
	handleList: () => void;
};

export default function ListModal(
	{
		isNewList,
		isModalVisible,
		closeModal,
		listNameInput,
		setListNameInput,
		handleList
	}: ListModalProps
) {
	const colors = useThemeColor();
	const inputStyle = {
		...styles.input,
		backgroundColor: colors.elementBackground,
		borderColor: colors.primary
	}
	return (
		<Modal
			visible={isModalVisible}
			animationType="slide"
			transparent={true}
			onRequestClose={closeModal}
		>
			<View style={styles.modalOverlay}>
				<View style={[styles.modalContent, {backgroundColor: colors.elementBackground}]}>
					<ThemedText variant="title">{isNewList ? "Ajouter une" : "Modifier la"} liste</ThemedText>
					<TextInput
						style={[inputStyle, {color: colors.primaryText}]}
						placeholder="Nom de la liste"
						placeholderTextColor={colors.placeHolderText}
						value={listNameInput}
						onChangeText={setListNameInput}
					/>
					<View style={styles.modalButtons}>
					<ThemedButton
						title="Annuler"
						onPress={closeModal}
						type="secondary"
					/>
					<ThemedButton
						title={isNewList ? "Ajouter" : "Modifier"}
						onPress={handleList}
						type="primary"
					/>
					</View>
				</View>
			</View>
		</Modal>
	)
}

const styles = StyleSheet.create({
	modalOverlay: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	modalContent: {
		width: "80%",
		padding: 20,
		borderRadius: 10,
		alignItems: "center",
	},
	modalTitle: {
		fontSize: 20,
		marginBottom: 15,
		fontWeight: "bold",
	},
	modalButtons: {
		flexDirection: "row",
		justifyContent: "space-around",
		width: "100%",
		marginTop: 15,
	},
	input: {
		borderWidth: 1,
		width: "90%",
		padding: 10,
		marginTop: 10,
		borderRadius: 5,
	  },
})