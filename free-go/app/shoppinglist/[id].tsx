import { router, useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
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
import { Meals } from "@/types/Meal";
import ChooseIngredientsModal from "@/components/modals/ChooseIngredientsModal";


const ShoppingList = ({ showActionSheetWithOptions } : any) => {
  SetBackPage("/shoppinglists");

  const mockMeals: Meals = [
    {
      recipeName: "Spaghetti Carbonara",
      ingredients: [
        { ingredient: "Spaghetti", quantity: "200g" },
        { ingredient: "Bacon", quantity: "100g" },
        { ingredient: "Eggs", quantity: "2" },
        { ingredient: "Cream", quantity: "50ml" },
        { ingredient: "Parmesan", quantity: "30g" },
      ],
      instructions: [
        { step: 1, description: "Cook the spaghetti according to the package instructions." },
        { step: 2, description: "Fry the bacon in a pan until golden." },
        { step: 3, description: "Mix the eggs and cream in a bowl." },
        { step: 4, description: "Drain the pasta and mix it with the bacon and sauce." },
        { step: 5, description: "Serve hot with grated parmesan." },
      ],
    },
    {
      recipeName: "Caesar Salad",
      ingredients: [
        { ingredient: "Romaine lettuce", quantity: "1" },
        { ingredient: "Grilled chicken", quantity: "150g" },
        { ingredient: "Croutons", quantity: "50g" },
        { ingredient: "Parmesan", quantity: "30g" },
        { ingredient: "Caesar dressing", quantity: "50ml" },
      ],
      instructions: [
        { step: 1, description: "Wash and chop the romaine lettuce." },
        { step: 2, description: "Slice the chicken." },
        { step: 3, description: "Mix the lettuce, chicken, croutons, and parmesan." },
        { step: 4, description: "Add the Caesar dressing and mix well." },
        { step: 5, description: "Serve immediately." },
      ],
    },
    {
      recipeName: "Mushroom Omelette",
      ingredients: [
        { ingredient: "Eggs", quantity: "3" },
        { ingredient: "Mushrooms", quantity: "100g" },
        { ingredient: "Butter", quantity: "20g" },
        { ingredient: "Salt and pepper", quantity: "To taste" },
      ],
      instructions: [
        { step: 1, description: "Beat the eggs in a bowl and season with salt and pepper." },
        { step: 2, description: "Melt the butter in a pan and sauté the mushrooms." },
        { step: 3, description: "Pour the beaten eggs over the mushrooms and cook on low heat." },
        { step: 4, description: "Fold the omelette in half and serve hot." },
      ],
    },
  ];

  const params = useLocalSearchParams();
  const router = useRouter();

  const listId = Number(params.id);
  const [list, setList] = useState<any | undefined>(undefined);

  const [isNewArticle, setIsNewArticle] = useState(false);
  const [isArticleModalVisible, setArticleModalVisible] = useState(false);
  const [isRecipesModalVisible, setRecipesModalVisible] = useState(false);
  const [articleNameInput, setArticleNameInput] = useState("");
  const [numberOfArticle, setNumberOfArticle] = useState(1);
  const [currentArticleId, setCurrentArticleId] = useState(-1);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState('completedAt');
  const [sortOrder, setSortOrder] = useState('desc');
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
      closeArticleModal();
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
      closeArticleModal();
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


  const openArticleModal = (isNewArticle: boolean, articleName?: string, numberOfArticle?: number) => {
    setIsNewArticle(isNewArticle);
    if (!isNewArticle && articleName && numberOfArticle) {
      setArticleNameInput(articleName);
      setNumberOfArticle(numberOfArticle);
    }
    setArticleModalVisible(true);
  };

  const closeArticleModal = () => {
    setArticleModalVisible(false);
    setArticleNameInput("");
    setNumberOfArticle(1);
  };

  const closeRecipesModal = () => {
    setRecipesModalVisible(false);
    setSelectedIngredients([]);
  };

  const showRecipes = () => {
    setRecipesModalVisible(false);
    router.push({
      pathname: "/shoppinglist/generatemeallists",
      params: { meals: JSON.stringify(mockMeals) }
    });
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
          openArticleModal(false, articleTitle, articleQuantity);
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
      <ThemedStatusBar isDark={isArticleModalVisible || isRecipesModalVisible} />
      <Header title={list.title} Component={() => {
        return <DropdownMenu options={sortOptions} onSelectOption={handleOptionSelect} sortOrder={sortOrder as 'asc' | 'desc'} onSortOrderChange={handleSortOrderChange} selectOption={sortOption} />;
      }}/>
      <FlatList
        data={sortArticle(list.articles, sortOption as keyof Article, sortOrder as 'asc' | 'desc')}
        renderItem={({ item: article }) => (
          <ArticleItem
            article={article}
            handleArticleMenu={() => openActionSheet(article.id, article.title, article.quantity)}
            handleCompleteArticle={() => handlePurchaseArticle(article.id)}
          />
        )}
      />

      <ThemedButton
        title={"Propose moi des recettes"}
        icon="lightbulb-on-outline"
        onPress={() => setRecipesModalVisible(true)}
        type="primary"
        style={{marginBottom: 15}} 
      />

      <ThemedButton
        title={"Ajouter un article"}
        icon="plus"
        onPress={() => {openArticleModal(true)}}
        type="primary"
      />

      <ArticleModal
        isNewArticle={isNewArticle}
        isModalVisible={isArticleModalVisible} 
        closeModal={closeArticleModal} 
        articleNameInput={articleNameInput} 
        setArticleNameInput={setArticleNameInput} 
        numberOfArticle={numberOfArticle} 
        setNumberOfArticle={setNumberOfArticle} 
        handleAddArticle={isNewArticle ? handleAddArticle : () => {handleModifyArticle(currentArticleId)}} 
      />

      <ChooseIngredientsModal 
        isModalVisible={isRecipesModalVisible} 
        closeModal={closeRecipesModal} 
        ingredients={list?.articles.map((article: any) => article.title) || []} 
        setSelectedIngredients={setSelectedIngredients} 
        showRecipes={showRecipes} 
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
