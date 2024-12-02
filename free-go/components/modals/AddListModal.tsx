import { ThemedButton } from "@/components/ThemedButton";
import { Modal, Text, View, StyleSheet } from "react-native";
import { TextInput } from "react-native-gesture-handler";

type AddListModalProps = {
	isModalVisible: boolean;
	closeModal: () => void;
	shoppingListNameInputValue: string;
	setShoppingListNameInputValue: (value: string) => void;
	handleAddShoppingList: () => void;
};

export default function AddListModal(
	{
		isModalVisible,
		closeModal,
		shoppingListNameInputValue,
		setShoppingListNameInputValue,
		handleAddShoppingList
	}: AddListModalProps
) {
	return (
		<Modal
			visible={isModalVisible}
			animationType="slide"
			transparent={true}
			onRequestClose={closeModal}
		>
			<View style={styles.modalOverlay}>
			<View style={styles.modalContent}>
				<Text style={styles.modalTitle}>Ajouter une nouvelle liste</Text>
				<TextInput
				style={styles.input}
				placeholder="Nom de la liste"
				placeholderTextColor="#666"
				value={shoppingListNameInputValue}
				onChangeText={setShoppingListNameInputValue}
				/>
				<View style={styles.modalButtons}>
				<ThemedButton
					title="Annuler"
					onPress={closeModal}
					type="secondary"
					lightColor="#F5C754"
					darkColor="#F5C754"
				/>
				<ThemedButton
					title="Ajouter"
					onPress={handleAddShoppingList}
					type="primary"
					lightColor="#F5C754"
					darkColor="#F5C754"
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
		backgroundColor: "#fff",
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
		borderColor: "#F5C754",
		borderWidth: 1,
		width: "90%",
		padding: 10,
		marginTop: 10,
		borderRadius: 5,
		backgroundColor: "#fff",
	  },
})