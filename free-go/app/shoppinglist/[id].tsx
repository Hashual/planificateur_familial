import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, StyleSheet, FlatList, Modal, View, TextInput, Button } from "react-native";
import { addArticle, deleteArticle, getMockData, updateArticle } from "@/mockapi/mockData";
import { Article } from "@/mockapi/types";
import ArticleItem from "@/components/shoppinglist/ArticleItem";
import { ThemedButton } from "@/components/ThemedButton";

export default function ShoppingList() {
const params = useLocalSearchParams();
  const listId = Number(params.id);
  const [shoppingData, setShoppingData] = useState<{ shoppingLists: any[] }>({
    shoppingLists: [],
  });
  const [list, setList] = useState<any | undefined>(undefined);
  const [isModalVisible, setModalVisible] = useState(false);
  const [articleNameInput, setArticleNameInput] = useState("");
  const [numberOfArticle, setNumberOfArticle] = useState(1);

  const handleIncrement = () => {
    setNumberOfArticle((prevNumber) => prevNumber + 1);
  }

  const handleDecrement = () => {
    if (numberOfArticle>1) {
        setNumberOfArticle((prevNumber) => prevNumber - 1);
    }
  }
  
  const loadShoppingData = async () => {
    try {
      const data = await getMockData();
      setShoppingData(data);
      setList(data.shoppingLists.find((list) => list.id === listId));
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleDeleteArticle = async (listId: number, articleId: number) => {
    try {
      const updatedData = await deleteArticle(listId, articleId);
      setShoppingData(updatedData);
      setList(updatedData.shoppingLists.find((list) => list.id === listId));
    } catch (error) {
      console.error("Error deleting article:", error);
    }
  };

  const handleAddArticle = async (listId: number, newArticleName: string, numberOfArticle: number) => {
    if (newArticleName.trim()) {
      try {
        const newArticle: Article = {
          id: Date.now(),
          name: newArticleName,
          quantity: numberOfArticle,
          isChecked: false,
        };
        const updatedData = await addArticle(listId, newArticle);
        closeModal();
        setShoppingData(updatedData);
        setList(updatedData.shoppingLists.find((list) => list.id === listId));
      } catch (error) {
        console.error("Error adding article:", error);
      }
    }
  };

  const handlePurchaseArticle = async (listId: number, articleId: number) => {
    try {
      const shoppingList = shoppingData.shoppingLists.find((list) => list.id === listId);
      const article = shoppingList?.articles.find(
        (article: { id: number }) => article.id === articleId
      );
      if (!article) throw new Error("Article not found");

      const updatedArticle = {
        ...article,
        isChecked: article.isChecked ? false : true,
      };
      const updatedData = await updateArticle(listId, updatedArticle);
      setShoppingData(updatedData);
      setList(updatedData.shoppingLists.find((list) => list.id === listId));
    } catch (error) {
      console.error("Error completing article:", error);
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

  useEffect(() => {
    loadShoppingData();
  }, []);

  if (!list) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Chargement ou liste introuvable... {listId}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.categoryTitle}>{list.name}</Text>
      <FlatList
        data={list.articles}
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
        addButton
        onPress={openModal}
        type="primary"
        lightColor="#F5C754"
        darkColor="#F5C754"
      />

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ajouter un nouvel article</Text>
            <TextInput
              style={styles.input}
              placeholder="Nom de l'article *"
              placeholderTextColor="#666"
              value={articleNameInput}
              onChangeText={setArticleNameInput}
            />

            <View style={[styles.input]}> 
                
                <Text style={{flex: 1, textAlignVertical:"center"}}>Quantité : {numberOfArticle}</Text>
                <View style={{flexDirection: "row"}}>
                    <ThemedButton
                        title="-"
                        onPress={handleDecrement}
                        type="primary"
                        lightColor="#F5C754"
                        darkColor="#F5C754"
                    />
                        <ThemedButton
                        title="+"
                        onPress={handleIncrement}
                        type="primary"
                        lightColor="#F5C754"
                        darkColor="#F5C754"
                        style={{marginLeft:10}}
                    />
                </View>
            </View>
            
            <View style={styles.modalButtons}>
              <ThemedButton
                title="Annuler"
                onPress={closeModal}
                type="secondary"
                lightColor="#F5C754"
                darkColor="#F5C754"
              />
              <ThemedButton
                title="Ajouter"
                onPress={() => handleAddArticle(listId, articleNameInput, numberOfArticle)}
                type="primary"
                lightColor="#F5C754"
                darkColor="#F5C754"
              />
            </View>
          </View>
        </View>
      </Modal>
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
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 10,
      color: "#141C24",
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
  });