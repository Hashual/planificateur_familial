import { Link } from "expo-router";
import { Pressable, Text, View, StyleSheet } from "react-native";

type Props = {
    id: number,
    name: string;
}

export default function ListItem({ id, name }: Props) {
    return (
      <Link
        href={{ pathname: "/todolist/[id]", params: { id: id } }}
        asChild
      >
        <Pressable style={styles.shadowElement}>
          <View style={[styles.category, styles.shadowElement]}>
            <Text style={styles.categoryTitle}>{name}</Text>
          </View>
        </Pressable>
      </Link>
    );
  }

const styles = StyleSheet.create({
category: {
    marginBottom: 15,
    paddingHorizontal: 10,
    paddingTop: 5,
    borderRadius: 10,
    backgroundColor: "#E3E8F2",
    overflow: "hidden",
},
categoryTitle: {
    fontSize: 16,
    marginBottom: 10,
    color: "#141C24",
},
shadowElement: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3,

    elevation: 3,
},
});