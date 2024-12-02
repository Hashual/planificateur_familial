import { FontSource, useFonts } from "expo-font";
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoadFont(fonts: Record<string, FontSource>) {
	const [fontsLoaded] = useFonts(fonts);

	if (!fontsLoaded) {
		return (
			<SafeAreaView style={{
				flex: 1,
				justifyContent: "center"
			}}>
			  <ActivityIndicator size="large" />
			</SafeAreaView>
		); 
	}
}