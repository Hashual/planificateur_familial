import { FamilyMember } from "@/types/Family";
import { ThemedButton } from "../utilities/ThemedButton";

type FamilyMemberItemProps = {
	member: FamilyMember;
	onPress: () => void;
}

export default function FamilyMemberItem({ member, onPress }: FamilyMemberItemProps) {
	console.log(member);
	return (
		<ThemedButton
			title={`${member.user.firstName} ${member.user.lastName.substring(0, 1).toUpperCase()}. - ${member.role}`}
			onPress={onPress}
			type="secondary"
		/>
	)
}