import { Modal, View, TextInput, StyleSheet, Platform, Pressable } from "react-native";
import { ThemedButton } from "@/components/utilities/ThemedButton";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import Error from "@/utils/alerts/Error";
import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { ThemedText } from "../utilities/ThemedText";

type AddArticleModalProps = {
    isModalVisible: boolean;
    closeModal: () => void;
    taskNameInput: string;
    setTaskNameInput: (value: string) => void;
    selectedDate: Date | null;
    setSelectedDate: (value: Date) => void;
    selectedTime: Date | null;
    setSelectedTime: (value: Date) => void;
	handleAddTask: () => void;
};

export default function AddArticleModal({
    isModalVisible, 
    closeModal, 
    taskNameInput, 
    setTaskNameInput, 
    selectedDate, 
    setSelectedDate, 
    selectedTime, 
    setSelectedTime, 
    handleAddTask
} : AddArticleModalProps) { 
    const colors = useThemeColor();
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const [isTimePickerVisible, setTimePickerVisible] = useState(false);
    const showDatePicker = () => setDatePickerVisible(true);
    const hideDatePicker = () => setDatePickerVisible(false);
    const showTimePicker = () => {
        if (!selectedDate) {
        Error("Attention", "Veuillez d'abord sélectionner une date.");
        return;
        }
        setTimePickerVisible(true);
    };
    const hideTimePicker = () => setTimePickerVisible(false);

    const handleDateConfirm = (date: Date) => {
        setSelectedDate(date);
        hideDatePicker();
      };
    
      const handleTimeConfirm = (time: Date) => {
        setSelectedTime(time);
        hideTimePicker();
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
            <ThemedText variant="title">Ajouter une tâche</ThemedText>
            <TextInput
              style={[inputStyle, textColor]}
              placeholder="Nom de la tâche"
              placeholderTextColor={colors.placeHolderText}
              value={taskNameInput}
              onChangeText={setTaskNameInput}
            />
            {Platform.OS === "web" ? (
              <>
                <input
                  type="date"
                  style={inputStyle}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                />
                <input
                    type="time"
                    style={inputStyle}
                    onChange={(e) => {
                      const [hours, minutes] = e.target.value.split(":");
                      const time = new Date();
                      time.setHours(Number(hours), Number(minutes));
                      setSelectedTime(time);
                    }}
                  />
                </>
            ) : (
              <>
              <Pressable onPress={showDatePicker}>
                <View style={[inputStyle, {flexDirection: "row", justifyContent: "space-between"}]}>
                    {selectedDate ? <ThemedText variant="fs14">{selectedDate.toLocaleDateString()}</ThemedText> : <ThemedText variant="fs14" color="placeHolderText">Date (optionnel)</ThemedText>}
                    <MaterialCommunityIcons name="calendar-edit" size={20} color={colors.primaryText} />
                </View>
              </Pressable>
              <Pressable onPress={showTimePicker}>
                <View style={[inputStyle, {flexDirection: "row", justifyContent: "space-between"}]}>
                    {selectedTime ? <ThemedText variant="fs14">{selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false})}</ThemedText> : <ThemedText variant="fs14" color="placeHolderText">Heure (optionnel)</ThemedText>}
                        <MaterialCommunityIcons name="clock-edit-outline" size={20} color={colors.primaryText} />
                </View>
              </Pressable>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleDateConfirm}
                onCancel={hideDatePicker}
                cancelTextIOS={"Annuler"}
                confirmTextIOS={"Confirmer"}
                locale="fr"
              />
              <DateTimePickerModal
                isVisible={isTimePickerVisible}
                mode="time"
                onConfirm={handleTimeConfirm}
                onCancel={hideTimePicker}
                cancelTextIOS={"Annuler"}
                confirmTextIOS={"Confirmer"}
                locale="fr"
              />
              </>
            )}
            
            <View style={styles.modalButtons}>
              <ThemedButton
                title="Annuler"
                onPress={closeModal}
                type="secondary"
              />
              <ThemedButton
                title="Ajouter"
                onPress={handleAddTask}
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
  });