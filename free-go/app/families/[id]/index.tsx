import WaitingScreen from "@/components/utilities/WaitingScreen";
import { Family } from "@/types/Family";
import { SetBackPage } from "@/utils/SetBackPage";
import { useEffect, useState } from "react";
import { View } from "react-native";

export default function FamilyIndexPage() {
	SetBackPage("/families");
	const [familyInfos, setFamilyInfos] = useState<Family | undefined>(undefined);

	useEffect(() => {
				
	}, []);

	return (
		<View>
			{!familyInfos ? <WaitingScreen /> : <View></View>}
		</View>
	)
}