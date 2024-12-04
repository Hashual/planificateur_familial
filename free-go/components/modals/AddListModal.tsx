import { ThemedButton } from "@/components/utilities/ThemedButton";
import { Modal, Text, View, StyleSheet, TextInput } from "react-native";

type AddListModalProps = {
	isModalVisible: boolean;
	closeModal: () => void;
	listNameInput: string;
	setListNameInput: (value: string) => void;
	handleAddList: () => void;
};

export default function AddListModal(
	{
		isModalVisible,
		closeModal,
		listNameInput,
		setListNameInput,
		handleAddList
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
					title="Ajouter"
					onPress={handleAddList}
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