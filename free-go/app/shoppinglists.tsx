import React, { useState, useCallback } from "react";
import { FlatList } from "react-native";
import { useFocusEffect } from "expo-router";

import { ThemedButton } from "@/components/utilities/ThemedButton";
import ListItem from "@/components/ListItem";
import Confirmation from "@/utils/alerts/Confirmation";
import Error from "@/utils/alerts/Error";
import ThemedStatusBar from "@/components/utilities/ThemedStatusBar";
import { SetBackPage } from "@/utils/SetBackPage";
import { RootView } from "@/components/utilities/RootView";
import { API, useFetchQuery } from "@/hooks/useAPI";
import Header from "@/components/Header";
import { ActionSheetProvider, connectActionSheet } from "@expo/react-native-action-sheet";
import ListModal from "@/components/modals/ListModal";

const ShoppingLists = ({ showActionSheetWithOptions } : any) => {
    SetBackPage("./homePage/OpenDoorPage");

    const [data, setData] = useState<API["/shopping-list"]>();
    const [isModalVisible, setModalVisible] = useState(false);
    const [nameInputValue, setNameInputValue] = useState("");
    const [currentListId, setCurrentListId] = useState(-1);
    const [isNewList, setIsNewList] = useState(false);

    const loadData = async () => {
        try {
            const data = await useFetchQuery<API["/shopping-list"]>(
                "/shopping-list", { method: "GET" }
            );
            setData(data.data);
        } catch (error) {
            console.error("Error loading data:", error);
        }
    };

    const openModal = (isNewList: boolean, listTitle?: string) => {
        setIsNewList(isNewList);
        if (!isNewList && listTitle) {
            setNameInputValue(listTitle);
        }
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setNameInputValue("");
    };

    const handleAddShoppingList = async () => {
        const newShoppingListName = nameInputValue.trim();

        if (newShoppingListName) {
            try {
                await useFetchQuery("/shopping-list", {
                    method: "POST",
                    body: {
                        title: newShoppingListName,
                    },
                });
                setNameInputValue("");
                await loadData();
                closeModal();
            } catch (error) {
                Error(
                    "Erreur",
                    "Il y a eu un problème lors de la création de la liste.",
                    error
                );
            }
        } else {
            Error(
                "Entrée invalide",
                "Veuillez d'abord donner un nom à votre liste."
            );
        }
    };

    const handleModifyShoppingList = async (listId: number) => {
        const newShoppingListName = nameInputValue.trim();

        if (newShoppingListName) {
            try {
                await useFetchQuery("/shopping-list/" + listId, {
                    method: "PUT",
                    body: {
                        title: newShoppingListName,
                    },
                });
                setNameInputValue("");
                await loadData();
                closeModal();
            } catch (error) {
                Error(
                    "Erreur",
                    "Il y a eu un problème lors de la modification de la liste.",
                    error
                );
            }
        } else {
            Error(
                "Entrée invalide",
                "Veuillez d'abord donner un nom à votre liste."
            );
        }
    };

    const handleDeleteShoppingList = async (id: number) => {
        Confirmation(
            "Supprimer la liste",
            "Êtes-vous sûr de vouloir supprimer la liste ?",
            async () => {
                try {
                    await useFetchQuery(`/shopping-list/${id}`, {
                        method: "DELETE",
                    });
                    await loadData();
                } catch (error) {
                    Error(
                        "Erreur",
                        "Il y a eu un problème lors de la suppression de la liste.",
                        error
                    );
                }
            }
        );
    };

    const openActionSheet = (listId: number, listTitle: string) => {
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
              setCurrentListId(listId);
              openModal(false, listTitle);
              break;
            case destructiveButtonIndex:
                handleDeleteShoppingList(listId);
              break;
    
            case cancelButtonIndex:
              // Canceled
          }});
      }

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    return (
        <RootView color="background" padding={20}>
            <ThemedStatusBar isDark={isModalVisible} />
            <Header title={"Mes listes de courses"} />

            <FlatList
                data={data}
                renderItem={({ item: list }) => {
                    const completedTasksCount =
                        list.numberOfArticles - list.numberOfInProgressArticles;
                    return (
                        <ListItem
                            id={list.id}
                            name={list.title}
                            totalItems={list.numberOfArticles}
                            completedItems={completedTasksCount}
                            onLongPress={() => openActionSheet(list.id, list.title)}
                            itemName={"article"}
                            listIcon={"basket-outline"}
                            pathName={"/shoppinglist/[id]"}
                        />
                    );
                }}
            />
            <ThemedButton
                title="Ajouter une liste"
                icon="plus"
                onPress={() => openModal(true)}
                type="primary"
            />

            <ListModal
                isNewList={isNewList}
                isModalVisible={isModalVisible}
                closeModal={closeModal}
                listNameInput={nameInputValue}
                setListNameInput={setNameInputValue}
                handleList={isNewList ? handleAddShoppingList : () => handleModifyShoppingList(currentListId)}
            />
        </RootView>
    );
}

const ConnectedShoppingLists = connectActionSheet(ShoppingLists);

export default function WrappedShoppingLists() {
  return (
    <ActionSheetProvider>
      <ConnectedShoppingLists/>
    </ActionSheetProvider>
  )
}

