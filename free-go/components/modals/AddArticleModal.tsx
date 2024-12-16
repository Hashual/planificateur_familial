import { Modal, View, TextInput, Text, StyleSheet } from "react-native";
import { ThemedButton } from "@/components/utilities/ThemedButton";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "../utilities/ThemedText";

type AddArticleModalProps = {
	isModalVisible: boolean;
	closeModal: () => void;
	articleNameInput: string;
	setArticleNameInput: (value: string) => void;
  numberOfArticle: number;
  setNumberOfArticle: (value: number | ((prevNumber: number) => number)) => void;
	handleAddArticle: () => void;
};

export default function AddArticleModal({
    isModalVisible, 
    closeModal, 
    articleNameInput, 
    setArticleNameInput, 
    numberOfArticle, 
    setNumberOfArticle, 
    handleAddArticle
} : AddArticleModalProps) {
    const MAX_NUMBER_OF_ARTICLE = 999999;
    const colors = useThemeColor();
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
        if (!isNaN(numericValue) && numericValue>0) {
          setNumberOfArticle(numericValue);
        } else {
          setNumberOfArticle(1);
        }
    };

    const inputStyle = {
      ...styles.input,
      backgroundColor: colors.elementBackground,
      borderColor: colors.primary
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
            <ThemedText variant="title">Ajouter un article</ThemedText>
            <TextInput
              style={[inputStyle, textColor]}
              placeholder="Nom de l'article"
              placeholderTextColor={colors.placeHolderText}
              value={articleNameInput}
              onChangeText={setArticleNameInput}
            />

            <View style={inputStyle}> 
                
                <View style={styles.quantity}>
                  <ThemedText variant="fs14">Quantité : </ThemedText>
                  <TextInput
                    value={numberOfArticle.toString()}
                    onChangeText={(text) => handleInputChange(text)}
                    keyboardType="numeric"
                    maxLength={6}
                    style={[styles.textInput, textColor]}
                  />
                </View>
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
                title="Ajouter"
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