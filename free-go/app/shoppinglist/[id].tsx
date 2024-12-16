import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, StyleSheet, FlatList } from "react-native";

import { addArticle, deleteArticle, getMockData, updateArticle } from "@/mockapi/mockData";
import { Article } from "@/mockapi/types";

import ArticleItem from "@/components/shoppinglist/ArticleItem";
import { ThemedButton } from "@/components/ThemedButton";
import AddArticleModal from "@/components/modals/AddArticleModal";
import LoadFont from "@/utils/LoadFont";
import Error from "@/utils/alerts/Error";
import ThemedStatusBar, { StatusBarStyle } from "@/components/utilities/ThemedStatusBar";
import { SetBackPage } from "@/utils/SetBackPage";

export default function ShoppingList() {
  SetBackPage("/homePage/OpenDoorPage");
  const loadedError = LoadFont({
    "Pacifico": require("@/assets/fonts/Pacifico.ttf"),
  })
  if (loadedError) { return loadedError; }

  const params = useLocalSearchParams();

  const listId = Number(params.id);
  const [shoppingData, setShoppingData] = useState<{ shoppingLists: any[] }>({
    shoppingLists: [],
  });
  const [list, setList] = useState<any | undefined>(undefined);

  const [isModalVisible, setModalVisible] = useState(false);
  const [articleNameInput, setArticleNameInput] = useState("");
  const [numberOfArticle, setNumberOfArticle] = useState(1);
  
  const loadShoppingData = async () => {
    try {
      const data = await getMockData();
      setShoppingData(data);
      setList(data.shoppingLists.find((list) => list.id === listId));
    } catch (error) {
      Error("Erreur", "Erreur de chargement des données", error);
    }
  };

  const handleDeleteArticle = async (listId: number, articleId: number) => {
    try {
      const updatedData = await deleteArticle(listId, articleId);
      setShoppingData(updatedData);
      setList(updatedData.shoppingLists.find((list) => list.id === listId));
    } catch (error) {
      Error("Erreur","Erreur lors de la suppression de l'article", error);
    }
  };

  const handleAddArticle = async () => {
    if (!articleNameInput.trim()) {
      Error("Entrée invalide", "Veuillez d'abord donner un nom à votre article.");
      return;
    }
    if (numberOfArticle < 1 || numberOfArticle > 999999) {
      Error("Entrée invalide", "Veuillez sélectionner un nombre d'articles entre 1 et 999999.");
      return;
    }
    try {
      const newArticle: Article = {
        id: Date.now(), // Génération d'id à simplifier (à modif avec l'api)
        name: articleNameInput,
        quantity: numberOfArticle,
        isChecked: false,
      };
      const updatedData = await addArticle(listId, newArticle);
      closeModal();
      setShoppingData(updatedData);
      setList(updatedData.shoppingLists.find((list) => list.id === listId));
    } catch (error) {
      Error("Erreur", "Erreur lors de l'ajout de l'article", error);
    }
  };

  const handlePurchaseArticle = async (articleId: number) => {
    try {
      const shoppingList = shoppingData.shoppingLists.find((list) => list.id === listId);
      const article = shoppingList?.articles.find(
        (article: { id: number }) => article.id === articleId
      );
      if (!article) {
        Error("Erreur", "L'article n'existe pas ou n'est pas trouvé");
        return;
      }
      const updatedArticle = {
        ...article,
        isChecked: article.isChecked ? false : true,
      };
      const updatedData = await updateArticle(listId, updatedArticle);
      setShoppingData(updatedData);
      setList(updatedData.shoppingLists.find((list) => list.id === listId));
    } catch (error) {
      Error("Erreur","Impossible de valider l'achat de l'article", error);
    }
  };


  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setArticleNameInput("");
    setNumberOfArticle(1);
  };

  const sortArticlesByIsChecked = (articles: Article[]): Article[] =>  {
    return [...articles].sort((a, b) => {
      if (a.isChecked === b.isChecked) {
        return 0;
      }
      return a.isChecked ? 1 : -1; 
    });
  }
  
  useFocusEffect(
    useCallback(() => {
      loadShoppingData();
    }, [])
  );

  if (!list) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Chargement ou liste introuvable... {listId}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ThemedStatusBar
        style={isModalVisible ? StatusBarStyle.Light : StatusBarStyle.Dark}
      />
      <Text style={styles.categoryTitle}>{list.name}</Text>
      <FlatList
        data={sortArticlesByIsChecked(list.articles)}
        keyExtractor={(article) => article.id.toString()}
        renderItem={({ item: article }) => (
          <ArticleItem
            article={article}
            listId={listId}
            handleDeleteArticle={handleDeleteArticle}
            handleCompleteArticle={() => handlePurchaseArticle(article.id)}
          />
        )}
      />
      <ThemedButton
        title={"Ajouter un article"}
        icon="plus"
        onPress={openModal}
        type="primary"
      />

      <AddArticleModal 
        isModalVisible={isModalVisible} 
        closeModal={closeModal} 
        articleNameInput={articleNameInput} 
        setArticleNameInput={setArticleNameInput} 
        numberOfArticle={numberOfArticle} 
        setNumberOfArticle={setNumberOfArticle} 
        handleAddArticle={handleAddArticle} 
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: "#F7FAFA",
    },
    categoryTitle: {
      fontSize: 30,
      marginBottom: 10,
      color: "#141C24",
      fontFamily: "Pacifico",
    }
  });