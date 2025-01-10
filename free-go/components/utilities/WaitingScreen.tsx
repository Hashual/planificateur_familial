import React from "react";
import { ActivityIndicator, Text } from "react-native";
import { RootView } from "./RootView";
import { ThemedText } from "./ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function WaitingScreen() {
	const colors = useThemeColor();
	return (
		<RootView color="background" padding={20} style={{flex:1, justifyContent: "center", alignItems:"center"}}>
			<ActivityIndicator size="large" color={colors.primary} />
			<ThemedText style={{marginTop: 20}}>Chargement en cours...</ThemedText>
		</RootView>
	)
}