import { Dispatch, SetStateAction } from "react";
import { Modal, View } from "react-native";
import { TextInput } from "react-native";
import { ThemedButton } from "../utilities/ThemedButton";

type JoinFamilyModalProps = {
	visible: boolean;
	setFamilyJoinCode: Dispatch<SetStateAction<string>>;
	onSubmit: () => void;
}

export default function JoinFamilyModal({ visible, setFamilyJoinCode, onSubmit }: JoinFamilyModalProps) {
	return (
		<Modal
			animationType="slide"
			transparent={true}
			visible={visible}
		>
			<View>
				<TextInput
					placeholder="Code de la famille"
					onChangeText={setFamilyJoinCode}
				/>
				<ThemedButton
					title="Rejoindre"
					type="primary"
					onPress={onSubmit}
				/>
			</View>
		</Modal>
	)
}