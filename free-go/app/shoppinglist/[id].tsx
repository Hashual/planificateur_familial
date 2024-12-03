import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, StyleSheet, FlatList, ActivityIndicator, StatusBar, Alert } from "react-native";

import { addArticle, deleteArticle, getMockData, updateArticle } from "@/mockapi/mockData";
import { Article } from "@/mockapi/types";

import ArticleItem from "@/components/shoppinglist/ArticleItem";
import { ThemedButton } from "@/components/ThemedButton";
import AddArticleModal from "@/components/modals/AddArticleModal";
import LoadFont from "@/utils/LoadFont";
import Error from "@/utils/alerts/Error";
import ThemedStatusBar, { StatusBarStyle } from "@/components/utilities/ThemedStatusBar";

export default function ShoppingList() {
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
    if (articleNameInput.trim()) {
      try {
        const newArticle: Article = {
          id: Date.now(),
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
    } else {
      Error("Entrée invalide", "Veuillez d'abord donner un nom à votre article.");
    }
  };

  const handlePurchaseArticle = async (listId: number, articleId: number) => {
    try {
      const shoppingList = shoppingData.shoppingLists.find((list) => list.id === listId);
      const article = shoppingList?.articles.find(
        (article: { id: number }) => article.id === articleId
      );
      if (!article) {
        Error("Erreur", "Article not found");
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
            handleCompleteArticle={handlePurchaseArticle}
          />
        )}
      />
      <ThemedButton
        title={"Ajouter un article"}
        icon="plus"
        onPress={openModal}
        type="primary"
        lightColor="#F5C754"
        darkColor="#F5C754"
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
      fontWeight: "bold",
      marginBottom: 10,
      color: "#141C24",
      fontFamily: "Pacifico",
    },
    input: {
      width: "85%",
      borderColor: "#F5C754",
      borderWidth: 1,
      padding: 10,
      marginTop: 10,
      borderRadius: 5,
      backgroundColor: "#fff",
      flexDirection: "row",
      boxSizing: "border-box" as "border-box",
    },
    modalOverlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
      width: "80%",
      padding: 20,
      backgroundColor: "#fff",
      borderRadius: 10,
      alignItems: "center",
    },
    modalTitle: {
      fontSize: 20,
      marginBottom: 15,
      fontWeight: "bold",
    },
    modalButtons: {
      flexDirection: "row",
      justifyContent: "space-around",
      width: "100%",
      marginTop: 15,
    },
    quantity: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center", 
      justifyContent: "flex-start",
      paddingRight: 2,
    },
    textInput: {
      padding: 0,
      margin: 0,
      height: "auto",
      width: "auto"
    },
  });