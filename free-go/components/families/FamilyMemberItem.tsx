import { FamilyMember } from "@/types/Family";
import { ThemedButton } from "../utilities/ThemedButton";
import { ThemedText } from "../utilities/ThemedText";
import { View } from "react-native";

type FamilyMemberItemProps = {
	member: FamilyMember;
	onFireButtonPressed?: () => void;
}

export default function FamilyMemberItem({ member, onFireButtonPressed }: FamilyMemberItemProps) {
	return (
		<View>
			<ThemedText>{member.user.firstName} {member.user.lastName.substring(0, 1).toUpperCase()}.</ThemedText>
			{onFireButtonPressed ? (<ThemedButton
				title = "Virer"
				onPress={onFireButtonPressed}
				type="primary"
			/> ) : null}
		</View>
	)
}