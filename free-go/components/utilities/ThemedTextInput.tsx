import React from "react";
import { TextInput, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";

type ThemedTextInputProps = {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  icon?: string;
  onIconPress?: () => void;
  error?: boolean;
  errorText?: string;
};

export function ThemedTextInput({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  icon,
  onIconPress,
  error = false,
  errorText = "",
}: ThemedTextInputProps) {
  const colors = useThemeColor();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.inputContainer,
          { borderColor: error ? colors.error : colors.inputBorder },
        ]}
      >
        <TextInput
          style={[styles.input, { color: colors.primaryText }]}
          placeholder={placeholder}
          placeholderTextColor={colors.placeHolderText}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
        />
        {icon && (
          <TouchableOpacity onPress={onIconPress} style={styles.iconContainer}>
            <MaterialCommunityIcons
              name={icon as keyof typeof MaterialCommunityIcons.glyphMap}
              size={20}
              color={colors.icon || colors.primaryText}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && errorText ? (
        <Text style={[styles.errorText, { color: colors.error }]}>
          {errorText}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
  },
  iconContainer: {
    marginLeft: 10,
  },
  errorText: {
    marginTop: 5,
    fontSize: 12,
  },
});
