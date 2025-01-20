import { Family } from "@/types/Family";
import { ThemedButton } from "../utilities/ThemedButton";

type Props = {
	family: Family;
	onPress: () => void;
}

export default function FamilyItem({ family, onPress }: Props) {
	return (
		<ThemedButton
			title={family.name}
			onPress={onPress}
			type="secondary"
		/>
	)
}