import { Modal, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { ThemedButton } from "../utilities/ThemedButton";
import { Dispatch, SetStateAction } from "react";

type props = {
	visible: boolean;
	setFamilyName: Dispatch<SetStateAction<string>>;
	onCreated: () => void;
}

export default function AddFamilyModal({ visible, setFamilyName, onCreated }: props) {
	return (
		<Modal
			animationType="slide"
			transparent={true}
			visible={visible}
		>
			<View>
				<TextInput
					placeholder="Nom de la famille"
					onChangeText={setFamilyName}
				/>
				<ThemedButton
					title="Ajouter"
					type="primary"
					onPress={onCreated}
				/>
			</View>
		</Modal>
	)
}