import { View, TouchableOpacity, StyleSheet, ActionSheetIOS } from 'react-native';

import { Task } from "@/mockapi/types";

import { TimeDurations } from "@/constants/TimeDuration";
import { CheckBox } from "../utilities/CheckBox";
import { ThemedText } from "../utilities/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useState } from 'react';
import { router } from 'expo-router';

type TaskItemProps = {
    listId: number,
    task: Task;
    handleDeleteTask: () => void;
    handleCompleteTask: () => void;
};

export default function TaskItem({ listId, task, handleDeleteTask, handleCompleteTask }: TaskItemProps) {
    const colors = useThemeColor();

    const getTaskStyle = ({ completedDate, dueDate }: Task): keyof typeof colors => {
      if (completedDate) return "inactive";
      if (dueDate && new Date(dueDate) < new Date()) return "danger";
      return "primaryText";
    };

    const timesLeft = (dueDate: Date): number => {
      const date = new Date(dueDate);
      const now = new Date();
      return date.getTime() - now.getTime();
    };

    const getTimeStatus = (remainingTime: number): string => {
      const formatTime = (value: number, unit: string, isOverdue: boolean): string => {
        const plural = value > 1 ? 's' : '';
        return isOverdue
          ? `Retard de ${value} ${unit}${plural}`
          : `${value} ${unit}${plural} restant${plural}`;
      };
    
      const isOverdue = remainingTime < 0;
      const time = Math.abs(remainingTime);
    
      const days = Math.floor(time / TimeDurations.day);
      const hours = Math.floor((time % TimeDurations.day) / TimeDurations.hour);
      const minutes = Math.floor((time % TimeDurations.hour) / TimeDurations.minute);
    
      if (days >= 1) return formatTime(days, 'jour', isOverdue);
      if (hours >= 1) return formatTime(hours, 'heure', isOverdue);
      if (minutes >= 1) return formatTime(minutes, 'minute', isOverdue);
      return isOverdue ? "Retard de moins d'une minute" : "Moins d'une minute restante";
    };

    const showActionSheet = () =>
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Annuler', 'Détails', 'Supprimer'],
          destructiveButtonIndex: 2,
          cancelButtonIndex: 0,
          userInterfaceStyle: 'dark',
        },
        buttonIndex => {
          if (buttonIndex === 0) {
            // cancel action
          } else if (buttonIndex === 1) {
            router.push(`/todolist/task/${task.id}?listId=${listId}`);
          } else if (buttonIndex === 2) {
            handleDeleteTask();
          }
        },
      );
    

    return (
        <View style={[styles.taskItem, {backgroundColor: colors.elementBackground}]}>
            <TouchableOpacity
            onPress={handleCompleteTask}
            style={styles.taskInfoContainer}
            >
                <CheckBox isChecked={task.completedDate ? true : false}/>
                <View style={{flex: 1}}>
                  <ThemedText 
                    color={getTaskStyle(task)} 
                    style={task.completedDate ? { textDecorationLine: "line-through" } : undefined}>
                    {task.title}
                  </ThemedText>
                    {task.completedDate ? (
                      <ThemedText variant="fs10" color="secondaryText">
                        Complété le {new Date(task.completedDate).toLocaleDateString()} à{' '}
                        {new Date(task.completedDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false})}
                      </ThemedText>
                    ) : task.dueDate != null ? (
                      <ThemedText variant="fs10" color="secondaryText">
                          {getTimeStatus(timesLeft(task.dueDate))}
                      </ThemedText>
                    ) : null}
                </View>
            </TouchableOpacity>
            <TouchableOpacity
            onPress={showActionSheet}
            style={styles.actionContainer}
            
            >
            <ThemedText variant="fs20" color="primary">⸱⸱⸱</ThemedText>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    taskItem: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 5,
      borderRadius: 10,
      overflow: "hidden",
    },
    taskInfoContainer: {
      flex: 10, 
      padding: 10,
      flexDirection: "row", 
      gap: 10, 
      alignItems: "center",
    },
    actionContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 10,
    }
  });