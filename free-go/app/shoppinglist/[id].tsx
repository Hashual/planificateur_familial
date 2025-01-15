import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList } from "react-native";

import { Article } from "@/mockapi/types";

import ArticleItem from "@/components/shoppinglist/ArticleItem";
import { ThemedButton } from "@/components/utilities/ThemedButton";
import Error from "@/utils/alerts/Error";
import { SetBackPage } from "@/utils/SetBackPage";
import ThemedStatusBar from "@/components/utilities/ThemedStatusBar";
import { RootView } from "@/components/utilities/RootView";
import {API, useFetchQuery} from "@/hooks/useAPI";
import Header from "@/components/Header";
import WaitingScreen from "@/components/utilities/WaitingScreen";
import { ActionSheetProvider, connectActionSheet } from "@expo/react-native-action-sheet";
import ArticleModal from "@/components/modals/ArticleModal";
import DropdownMenu from "@/components/utilities/DropdownButton";
import { sortArticle } from "@/utils/sortFunctions";


const ShoppingList = ({ showActionSheetWithOptions } : any) => {
  SetBackPage("/shoppinglists");

  const params = useLocalSearchParams();

  const listId = Number(params.id);
  const [list, setList] = useState<any | undefined>(undefined);

  const [isNewArticle, setIsNewArticle] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [articleNameInput, setArticleNameInput] = useState("");
  const [numberOfArticle, setNumberOfArticle] = useState(1);
  const [currentArticleId, setCurrentArticleId] = useState(-1);
  const [sortOption, setSortOption] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('asc');
  const sortOptions = [
    { label: 'Date d\'ajout', value: 'createdAt' },
    { label: 'Nom', value: 'title' },
    { label: 'Acheté', value: 'completedAt' },
  ];
  
  const loadShoppingData = async () => {
    try {
      const data = await useFetchQuery("/shopping-list/" + listId, { method: "GET" });
      setList(data.data);
    } catch (error) {
      Error("Erreur", "Erreur de chargement des données", error);
    }
  };

  const handleDeleteArticle = async (articleId: number) => {
    try {
      const updatedData = await useFetchQuery("/shopping-list/" + listId + "/articles/" + articleId, {
        method: "DELETE",
      });

      setList(updatedData.data);
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
        title: articleNameInput,
        quantity: numberOfArticle,
        isChecked: false,
        completedAt: null,
      };
      const updatedData = await useFetchQuery("/shopping-list/" + listId + "/articles", {method: "POST", body: newArticle});
      closeModal();
      setList((prevList: any) => ({
        ...prevList,
        articles: updatedData.data
      }));
    } catch (error) {
      Error("Erreur", "Erreur lors de l'ajout de l'article", error);
    }
  };

  const handleModifyArticle = async (articleId: number) => {
    try {
      const updatedArticle = {
        title: articleNameInput,
        quantity: numberOfArticle,
      };

      const updatedData = await useFetchQuery("/shopping-list/" + listId + "/articles/" + articleId, {
        method: "PUT",
        body: updatedArticle,
      });

      if (updatedData) {
        setList((prevList: any) => ({
          ...prevList,
          articles: prevList.articles.map((a: any) =>
              a.id === articleId ? { ...a, ...updatedArticle } : a
          ),
        }));
      } else {
        Error("Erreur", "Erreur lors de la mise à jour de la tâche");
      }
      closeModal();
    } catch (error) {
      Error("Erreur", "Erreur lors de la modification de l'article", error);
    }
  }

  const handlePurchaseArticle = async (articleId: number) => {
    try {
      const shoppingList = await useFetchQuery<API['/shoppinglists/[id]']> ("/shopping-list/" + listId, { method: "GET" })
      const article = shoppingList.data.articles.find((article: any) => article.id === articleId);
      if (!article) {
        Error("Erreur", "L'article n'existe pas ou n'est pas trouvé");
        return;
      }
      const updatedArticle = {
        ...article,
        completedAt: article.completedAt ? null : new Date()
      };

      const updatedData = await useFetchQuery("/shopping-list/" + listId + "/articles/" + articleId, {
        method: "PUT",
        body: updatedArticle,
      });

      setList(updatedData.data);

    } catch (error) {
      Error("Erreur","Impossible de valider l'achat de l'article", error);
    }
  };


  const openModal = (isNewArticle: boolean, articleName?: string, numberOfArticle?: number) => {
    setIsNewArticle(isNewArticle);
    if (!isNewArticle && articleName && numberOfArticle) {
      setArticleNameInput(articleName);
      setNumberOfArticle(numberOfArticle);
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setArticleNameInput("");
    setNumberOfArticle(1);
  };

  const openActionSheet = (articleId: number, articleTitle: string, articleQuantity: number) => {
    const options = ['Annuler', 'Modifier', 'Supprimer'];
    const destructiveButtonIndex = 2;
    const cancelButtonIndex = 0;

    showActionSheetWithOptions({
      options,
      cancelButtonIndex,
      destructiveButtonIndex
    }, (selectedIndex: number | void) => {
      switch (selectedIndex) {
        case 1:
          setCurrentArticleId(articleId);
          openModal(false, articleTitle, articleQuantity);
          break;
        case destructiveButtonIndex:
          handleDeleteArticle(articleId);
          break;

        case cancelButtonIndex:
          // Canceled
      }});
  }

  const handleOptionSelect = (value: string) => {
      setSortOption(value);
      setSortOrder('asc');
      setList((prevList: any) => ({
        ...prevList,
        articles: sortArticle(list.articles, value as keyof Article, 'asc')
      }));
    };

  const handleSortOrderChange = (order: 'asc' | 'desc') => {
    setSortOrder(order);
    setList((prevList: any) => ({
      ...prevList,
      articles: sortArticle(list.articles, sortOption as keyof Article, order as 'asc' | 'desc')
    }));
  };
  
  useFocusEffect(
    useCallback(() => {
      loadShoppingData();
    }, [])
  );

  if (!list) {
    return (
      <WaitingScreen />
    );
  }

  return (
    <RootView color="background" padding={20}>
      <ThemedStatusBar isDark={isModalVisible} />
      <Header title={list.title} Component={() => {
        return <DropdownMenu options={sortOptions} onSelectOption={handleOptionSelect} sortOrder={sortOrder as 'asc' | 'desc'} onSortOrderChange={handleSortOrderChange} selectOption={sortOption} />;
      }}/>
      <FlatList
        data={list.articles}
        renderItem={({ item: article }) => (
          <ArticleItem
            article={article}
            handleArticleMenu={() => openActionSheet(article.id, article.title, article.quantity)}
            handleCompleteArticle={() => handlePurchaseArticle(article.id)}
          />
        )}
      />
      <ThemedButton
        title={"Ajouter un article"}
        icon="plus"
        onPress={() => {openModal(true)}}
        type="primary"
      />

      <ArticleModal
        isNewArticle={isNewArticle}
        isModalVisible={isModalVisible} 
        closeModal={closeModal} 
        articleNameInput={articleNameInput} 
        setArticleNameInput={setArticleNameInput} 
        numberOfArticle={numberOfArticle} 
        setNumberOfArticle={setNumberOfArticle} 
        handleAddArticle={isNewArticle ? handleAddArticle : () => {handleModifyArticle(currentArticleId)}} 
      />

    </RootView>
  );
};

const ConnectedShoppingList = connectActionSheet(ShoppingList);

export default function WrappedToDoList() {
  return (
    <ActionSheetProvider>
      <ConnectedShoppingList/>
    </ActionSheetProvider>
  )
}
