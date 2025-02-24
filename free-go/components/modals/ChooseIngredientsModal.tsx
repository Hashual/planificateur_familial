import { Modal, View, StyleSheet } from "react-native";
import { ThemedButton } from "@/components/utilities/ThemedButton";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "../utilities/ThemedText";
import { MultipleSelectList } from "react-native-dropdown-select-list";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type ChooseIngredientsModal = {
    isModalVisible: boolean;
    closeModal: () => void;
    ingredients: string[];
    setSelectedIngredients: (value: string[]) => void;
    showRecipes: () => void;
};

export default function ChooseIngredientsModal({
    isModalVisible,
    closeModal,
    ingredients,
    setSelectedIngredients,
    showRecipes,
}: ChooseIngredientsModal) {
    const colors = useThemeColor();

    const inputStyle = {
        ...styles.input,
        backgroundColor: colors.elementBackground,
        borderColor: colors.primary,
    };

    const dropdownStyle = {
        ...styles.dropdown,

        borderColor: colors.primary,
        
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
                    style={[
                        styles.modalContent,
                        { backgroundColor: colors.elementBackground },
                    ]}
                >
                    <ThemedText variant="title">Choisissez vos ingrédients</ThemedText>
                    <MultipleSelectList
                        setSelected={setSelectedIngredients}
                        data={ingredients}
                        placeholder="Ingredients"
                        searchPlaceholder="Rechercher"
                        boxStyles={inputStyle}
                        dropdownStyles={dropdownStyle}
                        dropdownItemStyles={{backgroundColor: colors.elementBackground}}
                        dropdownTextStyles={{color: colors.primaryText}}
                        badgeStyles={{backgroundColor: colors.primary}}
                        badgeTextStyles={{color: colors.fixedPrimaryText}}
                        checkBoxStyles={{borderRadius: 999}}
                        inputStyles={{color: colors.primaryText}}
                        searchicon={
                            <MaterialCommunityIcons name={"magnify"} size={20} color={colors.primaryText} />
                        }
                        arrowicon={
                            <MaterialCommunityIcons name={"arrow-down"} size={20} color={colors.primaryText} />
                        }
                        closeicon={
                            <MaterialCommunityIcons name={"close"} size={20} color={colors.primaryText} />
                        }
                    />

                    <View style={styles.modalButtons}>
                        <ThemedButton
                            title="Annuler"
                            onPress={closeModal}
                            type="secondary"
                        />
                        <ThemedButton
                            title={"Valider"}
                            onPress={showRecipes}
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
    dropdown: {
        maxWidth: "85%",
        overflow: "hidden",
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
        width: "auto",
    },
});
