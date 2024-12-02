import { FontSource, useFonts } from "expo-font";
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoadFont(fonts: { name: string, path: string }[]) {
	const tbl: Record<string, FontSource> = {};
	fonts.forEach(font => {
		tbl[font.name] = require(font.path);
	});
	
	const [fontsLoaded] = useFonts(tbl);

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