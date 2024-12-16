import { StatusBar, useColorScheme } from "react-native"

type StatusBarProps = {
	isDark?: boolean
}

export default function ThemedStatusBar({isDark}: StatusBarProps) {
	const scheme = useColorScheme();
	
	const barStyle = (scheme === "light" && !isDark) ? "dark-content" : "light-content";

	return <StatusBar barStyle={barStyle} />;
}