import { StatusBar } from "react-native"

export enum StatusBarStyle {
	Light = "light-content",
	Dark = "dark-content"
}

type StatusBarProps = {
	style: StatusBarStyle
}

export default function ThemedStatusBar({
	style
}: StatusBarProps) {
	return (
		<StatusBar
			barStyle={style}
		/>
	)
}