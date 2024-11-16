import { Task } from "@/mockapi/types";
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type TaskItemProps = {
    task: Task;
    listId: number;
    handleDeleteTask: (listId: number, taskId: number) => void;
};

export default function TaskItem({ task, listId, handleDeleteTask }: TaskItemProps) {
    const getTaskStyle = (task: Task) => {
        const now = new Date();
        if (task.completedDate) {
          return styles.completedTask;
        }
        if (!task.completedDate && task.dueDate && new Date(task.dueDate) < now) {
          return styles.overdueTask;
        }
        return styles.pendingTask;
      };

    const getCheckBoxStyle = (task: Task) => {
        if (task.completedDate) {
          return [styles.checkBox, styles.checkBoxChecked];
        }
        return styles.checkBox;
    }

    const daysLeft = (dueDate: Date): number => {
      const date = new Date(dueDate);
      const now = new Date();
      const timeDifference = date.getTime() - now.getTime();
      return Math.floor(timeDifference / (1000 * 3600 * 24));
    };

    let remainingDays: number | null = null;
    if (task.dueDate) {
      remainingDays = daysLeft(task.dueDate);
    }

    return (
        <View style={styles.taskItem}>
            <View style={{flexDirection: "row", gap: 10, alignItems: "center"}}>
              <Text style={getCheckBoxStyle(task)}>✓</Text>
              <View style={{ flexShrink: 1, maxWidth: "90%" }}>
                <Text style={getTaskStyle(task)}>{task.name}</Text>
                {remainingDays != null ? (
                  <Text style={styles.dueDateStatus}>
                    {remainingDays >= 0
                      ? `${remainingDays} jour${remainingDays !== 1 ? 's' : ''} restants`
                      : `Retard de ${Math.abs(remainingDays)} jour${Math.abs(remainingDays) !== 1 ? 's' : ''}`}
                  </Text>
                ) : null}
              </View>
            </View>
            <TouchableOpacity
            onPress={() => handleDeleteTask(listId, task.id)}
            >
            <Text style={styles.deleteButton}>❌</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
      borderColor: '#00796b',
      borderWidth: 1,
      padding: 10,
      marginTop: 10,
      borderRadius: 5,
      backgroundColor: '#fff',
    },
    taskItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 10,
      marginVertical: 5,
      backgroundColor: '#ffffff',
      borderRadius: 10,
    },
    completedTask: {
      textDecorationLine: "line-through",
      color: "#BDBDBD"
    },
    pendingTask: {
      color: "#141C24",
    },
    overdueTask: {
      color: "#d32f2f",
    },
    deleteButton: {
      color: '#d32f2f',
      flex: 1,
      justifyContent: "center"
    },
    checkBox: {
      width: 20,
      height: 20,
      borderRadius: 9999,
      borderStyle: "solid",
      borderColor: "#F5C754",
      borderWidth: 1,
      textAlign: "center",
      color: "#fff",
    },
    checkBoxChecked: {
      backgroundColor: "#F5C754"
    },
    dueDateStatus: {
      color: "#9C854A",
      fontSize: 10,
    }
  });