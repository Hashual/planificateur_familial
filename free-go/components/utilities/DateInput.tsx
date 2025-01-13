import { useThemeColor } from "@/hooks/useThemeColor";
import { Pressable, View, ViewStyle } from "react-native";
import { ThemedText } from "./ThemedText";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export type DateInputProps = {
    isHour: boolean;
    onPress: () => void;
    onCrossPress: () => void;
    selectedDateTime: Date | null;
    style?: ViewStyle
};

export function DateInput({
    isHour,
    onPress,
    onCrossPress,
    selectedDateTime,
    style,
}: DateInputProps) {
    const colors = useThemeColor();

    return (
        <Pressable onPress={onPress}>
            <View
                style={[
                    style,
                    { flexDirection: "row", justifyContent: "space-between" },
                ]}
            >
                <View>
                    {isHour ? (
                        selectedDateTime ? (
                            <ThemedText variant="fs14">
                                {selectedDateTime.toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false,
                                })}
                            </ThemedText>
                        ) : (
                            <ThemedText variant="fs14" color="placeHolderText">
                                Heure (optionnel)
                            </ThemedText>
                        )
                    ) : selectedDateTime ? (
                        <ThemedText variant="fs14">
                            {selectedDateTime.toLocaleDateString()}
                        </ThemedText>
                    ) : (
                        <ThemedText variant="fs14" color="placeHolderText">
                            Date (optionnel)
                        </ThemedText>
                    )}
                </View>
                <View style={{ flexDirection: "row", gap: 5 }}>
                    {selectedDateTime ? (
                        <Pressable
                            style={{ paddingHorizontal: 10 }}
                            onPress={onCrossPress}
                        >
                            <MaterialCommunityIcons
                                name="close"
                                size={20}
                                color={colors.primaryText}
                            />
                        </Pressable>
                    ) : null}
                    <MaterialCommunityIcons
                        name={isHour ? "clock-edit-outline" : "calendar-edit"}
                        size={20}
                        color={colors.primaryText}
                    />
                </View>
            </View>
        </Pressable>
    );
}
