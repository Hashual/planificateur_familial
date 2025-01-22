import { Family } from "@/types/Family";
import { ThemedButton } from "../utilities/ThemedButton";

type FamilyItemProps = {
	family: Family;
	onPress: () => void;
}

export default function FamilyItem({ family, onPress }: FamilyItemProps) {
	return (
		<ThemedButton
			title={family.name}
			onPress={onPress}
			type="secondary"
		/>
	)
}