import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Pressable, View, StyleSheet } from "react-native";
import ProgressBar from "./todolist/ProgressBar";
import { Shadows } from "@/constants/Shadows";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "./utilities/ThemedText";

type Props = {
    id: number,
    name: string,
    itemName: string,
    totalItems: number | 0,
    completedItems?: number,
    listIcon: keyof typeof MaterialCommunityIcons.glyphMap,
    pathName: "/todolist/[id]" | "/shoppinglist/[id]",
    handleDeleteList: (id : number) => {},
}

export default function ListItem({ id, name, itemName, totalItems, completedItems, listIcon, pathName, handleDeleteList }: Props) {
    const colors = useThemeColor();

    const dynamicPressableStyle = [styles.category, {
      backgroundColor: colors.elementBackground,
      ...Shadows.dp2
    }]

    return (
      <Link
        href={{ pathname: pathName, params: { id: id } }}
        asChild
      >
        <Pressable onLongPress={async () => handleDeleteList(id)}>
          <View style={dynamicPressableStyle}>
            <View style={[styles.logoContainer, {backgroundColor: colors.logoBackground}]}>
              <MaterialCommunityIcons name={listIcon} size={24} color={colors.logo} />
            </View>

            <View style={styles.textContainer}>
              <ThemedText variant="subtitle">{name}</ThemedText>
              <ThemedText variant="smallText" color="secondaryText" style={{marginTop: 4}}>
                {totalItems} {totalItems <= 1 ? `${itemName}` : `${itemName}s`}
                </ThemedText>
              <ProgressBar nbItems={totalItems} nbItemsCompleted={completedItems ?? 0}/>
            </View>

            <MaterialCommunityIcons name="chevron-right" size={30} color={colors.logo}/>
            </View>
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
        borderRadius: 8,
      },
      logoContainer: {
        width: 40,
        height: 40,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 16,
      },
      textContainer: {
        flex: 1,
        flexDirection: "column",
      },
});