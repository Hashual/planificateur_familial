import WaitingScreen from "@/components/utilities/WaitingScreen";
import { API, useFetchQuery } from "@/hooks/useAPI";
import { Family } from "@/types/Family";
import Error from "@/utils/alerts/Error";
import { SetBackPage } from "@/utils/SetBackPage";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function FamilyIndexPage() {
	SetBackPage("/families");
	const [familyInfos, setFamilyInfos] = useState<Family | undefined>(undefined);

	const params = useLocalSearchParams();
	const familyId = Number(params.id);
	
	useEffect(() => {
		useFetchQuery<API['/families/[id]']>(`/families/${familyId}`, { method: "GET" }).then( (res) => {
			if (res.code == 200) {
				setFamilyInfos(res.data);
			} else {
				router.push("/families");
			}
		}).catch( (error) => { 
			Error("Erreur", "Erreur de chargement des données", error);
		})
	}, []);

	return (
		<View>
			{!familyInfos ? <WaitingScreen /> : <View>
				<Text>{familyInfos.name}</Text>
				<Text>Code pour rejoindre: {familyInfos.joinCode}</Text>
				<Text>Liste des membres :</Text>
			</View>}
		</View>
	)
}