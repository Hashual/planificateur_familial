import FamilyItem from "@/components/families/FamilyItem";
import Header from "@/components/Header";
import AddFamilyModal from "@/components/modals/AddFamilyModal";
import JoinFamilyModal from "@/components/modals/JoinFamilyModal";
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

  const [isAddFamilyModalVisible, setFamilyModalVisible] = useState(false);
  const [isJoinFamilyModalVisible, setJoinFamilyModalVisible] = useState(false);
  const [familyName, setFamilyName] = useState("");
  const [joinFamilyCode, setJoinFamilyCode] = useState("");
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
        setFamilyModalVisible(false);
      } catch (error) {
        Error("Erreur", "Une erreur est survenue lors de la création de la famille", error);
      }
    } else {
      Error("Erreur", "Le nom de la famille ne peut pas être vide");
    }
  }

  const handleJoinFamily = async () => {
    if (joinFamilyCode) {
      try {
        await useFetchQuery("/families/join", {
          method: "POST",
          body: {
            code: joinFamilyCode,
          }
        })

        await loadFamiliesData();

        setJoinFamilyCode("");
        setJoinFamilyModalVisible(false);
      } catch (error) {
        Error("Erreur", "Une erreur est survenue lors de la création de la famille", error);
      }
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
    useCallback(() => {
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
        onPress={() => setFamilyModalVisible(!isAddFamilyModalVisible)}
        type="primary"
      />
      <ThemedButton
        title="Rejoindre une famille"
        icon="plus"
        onPress={() => setJoinFamilyModalVisible(!isJoinFamilyModalVisible)}
      />
      <AddFamilyModal
        visible={isAddFamilyModalVisible}
        setFamilyName={setFamilyName}
        onCreated={handleCreateFamily}
      />
      <JoinFamilyModal
        visible={isJoinFamilyModalVisible}
        setFamilyJoinCode={setJoinFamilyCode}
        onSubmit={handleJoinFamily}
      />
    </RootView>
  );
}

export default FamilyPage;