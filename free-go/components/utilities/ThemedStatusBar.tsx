import XOR from "@/utils/xor";
import { StatusBar, useColorScheme } from "react-native"

type StatusBarProps = {
	isDark: boolean
}

export default function ThemedStatusBar({isDark}: StatusBarProps) {
	const scheme = useColorScheme()
	
	const barStyle = XOR(isDark, (scheme === "dark")) ? "light-content" : "dark-content";

	return <StatusBar barStyle={barStyle} />;
}