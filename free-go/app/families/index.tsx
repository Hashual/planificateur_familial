import FamilyItem from "@/components/families/FamilyItem";
import Header from "@/components/Header";
import AddFamilyModal from "@/components/modals/AddFamilyModal";
import { RootView } from "@/components/utilities/RootView";
import { ThemedButton } from "@/components/utilities/ThemedButton";
import ThemedStatusBar from "@/components/utilities/ThemedStatusBar";
import { API, useFetchQuery } from "@/hooks/useAPI";
import { Family } from "@/types/Family";
import Error from "@/utils/alerts/Error";
import { SetBackPage } from "@/utils/SetBackPage";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList } from "react-native-gesture-handler";

const FamilyPage = () => {
	SetBackPage("/homePage/OpenDoorPage");

	const [isModalVisible, setModalVisible] = useState(false);
	const [familyName, setFamilyName] = useState("");
	const [familiesList, setFamiliesList] = useState<Family[]>([]);

	const handleCreateFamily = async () => {
		if (familyName) {
			try {
				await useFetchQuery("/families", {
					method: "POST",
					body: {
						name: familyName,
					}
				})

				setFamilyName("");
				setModalVisible(false);
			} catch(error) {
				Error("Erreur", "Une erreur est survenue lors de la création de la famille", error);
			}
		} else {
			Error("Erreur", "Le nom de la famille ne peut pas être vide");
		}
	}

	const loadFamiliesData = async () => {
		try {
			const data = await useFetchQuery<API['/families']>("/families", { method: "GET" });
			setFamiliesList(data.data);
		} catch (error) {
			Error("Erreur", "Erreur de chargement des données", error);
		}
	}

	const onPress = (family: Family) => {
		router.push("/families/" + family.id);
	}

	useFocusEffect(
		useCallback( () => {
			loadFamiliesData();
		}, [])
	);

	return (
		<RootView color="background" padding={20}>
		  <ThemedStatusBar />
		  <Header title="Familles" />
		  <FlatList
			data={familiesList}
			keyExtractor={(family) => family.id.toString()}
			renderItem={({ item: family }) => (
			  <FamilyItem
				family={family}
				onPress={() => { onPress(family) }}
			  />
			)}
		  />
		  <ThemedButton
			title={"Créer ma famille"}
			icon="plus"
			onPress={() => setModalVisible(!isModalVisible)}
			type="primary"
		  />
		  <AddFamilyModal
		  	visible={isModalVisible}
			setFamilyName={setFamilyName}
			onCreated={handleCreateFamily}
		  />
		</RootView>
	  );
}

export default FamilyPage;