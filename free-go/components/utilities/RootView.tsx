import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
import { SafeAreaView, SafeAreaViewProps } from "react-native-safe-area-context";

export type RootViewProps = SafeAreaViewProps & {
    color?: keyof typeof Colors["light"],
    padding?: number
};

export function RootView({color, padding, style, ...rest}: RootViewProps) {
    const colors = useThemeColor();

    return <SafeAreaView style={[{backgroundColor: colors[color ?? "background"], padding: padding, flex: 1}, style]} {...rest} />;
}