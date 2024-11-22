import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ShoppingList() {
    const params = useLocalSearchParams();
    const listId = Number(params.id);
    <SafeAreaView>

    </SafeAreaView>
}