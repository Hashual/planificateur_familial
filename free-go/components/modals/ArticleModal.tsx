import { Modal, View, TextInput, StyleSheet, Pressable } from "react-native";
import { ThemedButton } from "@/components/utilities/ThemedButton";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "../utilities/ThemedText";
import NumberInput from "../utilities/NumberInput";

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
    const colors = useThemeColor();

    const inputStyle = {
      ...styles.input,
      backgroundColor: colors.elementBackground,
      borderColor: colors.primary,
    }

    const textColor = {
      color: colors.primaryText
    }

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

            <NumberInput number={numberOfArticle} setNumber={setNumberOfArticle} minValue={1} maxValue={999999} maxLenght={6} style={inputStyle}/>
            
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