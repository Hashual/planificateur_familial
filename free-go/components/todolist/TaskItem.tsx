import { TimeDurations } from "@/constants/TimeDuration";
import { Task } from "@/mockapi/types";
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type TaskItemProps = {
    task: Task;
    listId: number;
    handleDeleteTask: (listId: number, taskId: number) => void;
    handleCompleteTask: (listId: number, taskId: number) => void;
};

export default function TaskItem({ task, listId, handleDeleteTask, handleCompleteTask }: TaskItemProps) {
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
    

    return (
        <View style={styles.taskItem}>
            <TouchableOpacity
            onPress={() => handleCompleteTask(listId, task.id)}
            >
              <View style={{flexDirection: "row", gap: 10, alignItems: "center"}}>
                <Text style={getCheckBoxStyle(task)}>✓</Text>
                <View style={{ flexShrink: 1, width: "85%" }}>
                  <Text style={getTaskStyle(task)}>{task.title}</Text>
                  {task.completedDate ? (
                    <Text style={styles.dueDateStatus}>
                      Complété le {new Date(task.completedDate).toLocaleDateString()} à{' '}
                      {new Date(task.completedDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false})}
                    </Text>
                  ) : task.dueDate != null ? (
                    <Text style={styles.dueDateStatus}>
                        {getTimeStatus(timesLeft(task.dueDate))}
                    </Text>
                  ) : null}
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
            onPress={() => handleDeleteTask(listId, task.id)}
            style={styles.deleteButtonContainer}
            >
            <Text style={styles.deleteButton}>✕</Text>
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
    deleteButtonContainer: {
      flex: 1,
      width: 30,
      maxWidth: 30,
      justifyContent: "center",
      alignItems: "center",
    },
    deleteButton: {
      color: '#d32f2f',
      fontSize: 20,
      fontWeight: '900',
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