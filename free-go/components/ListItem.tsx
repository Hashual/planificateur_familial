import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Pressable, Text, View, StyleSheet, Platform, Alert } from "react-native";

type Props = {
    id: number,
    name: string,
    taskNumber: number | 0,
    handleDeleteTaskList: (id : number) => {},
}

export default function ListItem({ id, name, taskNumber, handleDeleteTaskList }: Props) {
      
    return (
      <Link
        href={{ pathname: "/todolist/[id]", params: { id: id } }}
        asChild
      >
        <Pressable 
            onLongPress={async () => handleDeleteTaskList(id)}
            style={styles.category}
        >
            <View style={styles.logoContainer}>
            <MaterialCommunityIcons name="format-list-bulleted" size={24} color="#141C24" />
            </View>

            <View style={styles.textContainer}>
            <Text style={styles.categoryTitle}>{name}</Text>
            <Text style={styles.taskNumber}>
                {taskNumber} {taskNumber <= 1 ? "tâche" : "tâches"}
            </Text>
            </View>

            <MaterialCommunityIcons name="chevron-right" size={30} color="#141C24" />
        </Pressable>
      </Link>
    );
  }

const styles = StyleSheet.create({
    category: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 1,
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
      },
      logoContainer: {
        width: 40,
        height: 40,
        backgroundColor: "#e4eaf1",
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 16,
      },
      textContainer: {
        flex: 1,
        flexDirection: "column",
      },
      categoryTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#141C24",
      },
      taskNumber: {
        fontSize: 14,
        color: "gray",
        marginTop: 4,
      },
});