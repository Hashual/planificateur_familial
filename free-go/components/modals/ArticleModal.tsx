import { Modal, View, TextInput, StyleSheet, Pressable } from "react-native";
import { ThemedButton } from "@/components/utilities/ThemedButton";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "../utilities/ThemedText";
import { useRef } from "react";

type ArticleModalProps = {
  isNewArticle?: boolean;
	isModalVisible: boolean;
	closeModal: () => void;
	articleNameInput: string;
	setArticleNameInput: (value: string) => void;
  numberOfArticle: number;
  setNumberOfArticle: (value: number | ((prevNumber: number) => number)) => void;
	handleAddArticle: () => void;
};

export default function ArticleModal({
    isNewArticle,
    isModalVisible, 
    closeModal, 
    articleNameInput, 
    setArticleNameInput, 
    numberOfArticle, 
    setNumberOfArticle, 
    handleAddArticle
} : ArticleModalProps) {
    const MAX_NUMBER_OF_ARTICLE = 999999;
    const colors = useThemeColor();
    const inputRef = useRef<TextInput>(null);

    const handleIncrement = () => {
        if (numberOfArticle<MAX_NUMBER_OF_ARTICLE) {
            setNumberOfArticle((prevNumber: number) => prevNumber + 1);
        }
    }
    
    const handleDecrement = () => {
        if (numberOfArticle>1) {
            setNumberOfArticle((prevNumber: number) => prevNumber - 1);
        }
    }

    const handleInputChange = (text: string) => {
        const numericValue = parseInt(text, 10);
        if (isNaN(numericValue)) {
          setNumberOfArticle(0);
        } else {
          setNumberOfArticle(numericValue);
        }
    };

    const inputStyle = {
      ...styles.input,
      backgroundColor: colors.elementBackground,
      borderColor: colors.primary,
    }

    const textColor = {
      color: colors.primaryText
    }

    const handleFocus = () => {
      if (inputRef.current) {
          inputRef.current.focus();
      }
    };

    return (
        <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, {backgroundColor: colors.elementBackground}]}>
            <ThemedText variant="title">{isNewArticle ? "Ajouter un " : "Modifer l'"}article</ThemedText>
            <TextInput
              style={[inputStyle, textColor]}
              placeholder="Nom de l'article"
              placeholderTextColor={colors.placeHolderText}
              value={articleNameInput}
              onChangeText={setArticleNameInput}
            />

            <View style={inputStyle}> 
                
                <Pressable style={styles.quantity} onPress={handleFocus}>
                    <ThemedText variant="fs14">Quantité : </ThemedText>
                    <TextInput
                      ref={inputRef}
                      value={numberOfArticle.toString()}
                      onChangeText={(text) => handleInputChange(text)}
                      keyboardType="numeric"
                      maxLength={6}
                      style={[styles.textInput, textColor]}
                    />
                </Pressable>
                <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                    <ThemedButton
                        title="-"
                        onPress={handleDecrement}
                        type="primary"
                        style={{paddingHorizontal: 18}}
                    />
                    <ThemedButton
                        title="+"
                        onPress={handleIncrement}
                        type="primary"
                        style={{marginLeft:10,paddingHorizontal: 17}}
                    />
                </View>
            </View>
            
            <View style={styles.modalButtons}>
              <ThemedButton
                title="Annuler"
                onPress={closeModal}
                type="secondary"
              />
              <ThemedButton
                title={isNewArticle ? "Ajouter" : "Modifier"}
                onPress={handleAddArticle}
                type="primary"
              />
            </View>
          </View>
        </View>
      </Modal>
    )
}

const styles = StyleSheet.create({
    input: {
      width: "85%",
      borderWidth: 1,
      padding: 10,
      marginTop: 10,
      borderRadius: 5,
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