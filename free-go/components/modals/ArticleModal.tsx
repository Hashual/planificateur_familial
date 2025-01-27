import { Modal, View, TextInput, StyleSheet, Pressable, Image, Button } from "react-native";
import { ThemedButton } from "@/components/utilities/ThemedButton";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "../utilities/ThemedText";
import NumberInput from "../utilities/NumberInput";
import * as ImagePicker from 'expo-image-picker';

type ArticleModalProps = {
  isNewArticle?: boolean;
  isModalVisible: boolean;
  closeModal: () => void;
  articleNameInput: string;
  setArticleNameInput: (value: string) => void;
  numberOfArticle: number;
  setNumberOfArticle: (value: number | ((prevNumber: number) => number)) => void;
  handleAddArticle: () => void;
  articlePicture: string | null;
  setArticlePicture: (value: string | null) => void;
};

export default function ArticleModal({
  isNewArticle,
  isModalVisible,
  closeModal,
  articleNameInput,
  setArticleNameInput,
  numberOfArticle,
  setNumberOfArticle,
  handleAddArticle,
  articlePicture,
  setArticlePicture,
}: ArticleModalProps) {
  const colors = useThemeColor();

  const inputStyle = {
    ...styles.input,
    backgroundColor: colors.elementBackground,
    borderColor: colors.primary,
  };

  const textColor = {
    color: colors.primaryText,
  };

  const pickPicture = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setArticlePicture(result.assets[0].uri);
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
        <View
          style={[styles.modalContent, { backgroundColor: colors.elementBackground }]}
        >
          <ThemedText variant="title">
            {isNewArticle ? "Ajouter un " : "Modifier l'"}article
          </ThemedText>
          <TextInput
            style={[inputStyle, textColor]}
            placeholder="Nom de l'article"
            placeholderTextColor={colors.placeHolderText}
            value={articleNameInput}
            onChangeText={setArticleNameInput}
          />

          <NumberInput
            number={numberOfArticle}
            setNumber={setNumberOfArticle}
            minValue={1}
            maxValue={999999}
            maxLenght={6}
            style={inputStyle}
          />

          <View style={styles.imagePickerContainer}>
            <Button title="Choisir une image" onPress={pickPicture} />
            {articlePicture && (
              <Image
                source={{ uri: articlePicture }}
                style={styles.imagePreview}
              />
            )}
          </View>

          <View style={styles.modalButtons}>
            <ThemedButton title="Annuler" onPress={closeModal} type="secondary" />
            <ThemedButton
              title={isNewArticle ? "Ajouter" : "Modifier"}
              onPress={handleAddArticle}
              type="primary"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
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
  imagePickerContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 5,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 15,
  },
});
