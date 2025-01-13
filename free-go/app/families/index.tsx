import Header from "@/components/Header";
import AddFamilyModal from "@/components/modals/AddFamilyModal";
import { RootView } from "@/components/utilities/RootView";
import { ThemedButton } from "@/components/utilities/ThemedButton";
import ThemedStatusBar from "@/components/utilities/ThemedStatusBar";
import { useFetchQuery } from "@/hooks/useAPI";
import Error from "@/utils/alerts/Error";
import { useState } from "react";

const FamilyPage = () => {
	const [isModalVisible, setModalVisible] = useState(false);
	const [familyName, setFamilyName] = useState("");

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

	return (
		<RootView color="background" padding={20}>
		  <ThemedStatusBar />
		  <Header title="Familles" />
		  {/* <FlatList
			data={list.tasks}
			keyExtractor={(task) => task.id.toString()}
			renderItem={({ item: task }) => (
			  <TaskItem
				task={task}
				handleCompleteTask={() => handleCompleteTask(task.id)}
				handleTaskMenu={() => onPress(task.id)}
			  />
			)}
		  /> */}
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