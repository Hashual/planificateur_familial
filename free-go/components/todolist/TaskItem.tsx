import { View, TouchableOpacity, StyleSheet } from 'react-native';

import { Task } from "@/mockapi/types";

import { CheckBox } from "../utilities/CheckBox";
import { ThemedText } from "../utilities/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { connectActionSheet } from '@expo/react-native-action-sheet';
import { getTimeStatus, timeRemaining } from '@/utils/dateFunctions';

type TaskItemProps = {
    task: Task;
    handleCompleteTask: () => void,
    handleTaskMenu: () => void,
};

const TaskItem= ({ task, handleCompleteTask, handleTaskMenu }: TaskItemProps) => {
    const colors = useThemeColor();

    const getTaskStyle = ({ completedDate, dueDate }: Task): keyof typeof colors => {
      if (completedDate) return "inactive";
      if (dueDate && new Date(dueDate) < new Date()) return "danger";
      return "primaryText";
    };

    return (
        <View style={[styles.taskItem, {backgroundColor: colors.elementBackground}]}>
            <TouchableOpacity
            onPress={handleCompleteTask}
            style={styles.taskInfoContainer}
            >
                <CheckBox isChecked={task.completedDate ? true : false}/>
                <View style={{flex: 1}}>
                  <ThemedText 
                    numberOfLines={1}
                    ellipsizeMode="tail"
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
                          {getTimeStatus(timeRemaining(task.dueDate))}
                      </ThemedText>
                    ) : null}
                </View>
            </TouchableOpacity>
            <TouchableOpacity
            onPress={handleTaskMenu}
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

export default connectActionSheet(TaskItem);